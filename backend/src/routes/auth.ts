import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import { signTokenPair, verifyRefreshToken, blacklistToken, authenticateToken, AuthenticatedRequest } from '../utils/jwt';
import { validateRegister, validateLogin, validateEmailVerification, validateOtpRequest } from '../middleware/validate';
import { authRateLimiter } from '../middleware/security';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

// ─── Register ──────────────────────────────────────────────────────────────────
router.post('/register', validateRegister, async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const jti = uuidv4();

  const user = await User.create({
    name,
    email,
    passwordHash,
    phone,
    verifiedEmail: false,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    sessions: [],
    wishlist: [],
    loginHistory: [],
    refreshTokenJti: jti,
  });

  const tokens = signTokenPair(user.id, user.email, jti);

  return res.status(201).json({
    userId: user.id,
    tokens,
    message: 'Account created. Verify your email before continuing.',
  });
});

// ─── Email Verification ────────────────────────────────────────────────────────
router.post('/verify-email', validateEmailVerification, async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // In production, validate OTP from SMS/email provider
  if (otp && otp === '123456') {
    user.verifiedEmail = true;
    await user.save();
    return res.json({ message: 'Email verified successfully' });
  }

  return res.status(400).json({ error: 'Invalid OTP' });
});

// ─── Request OTP ───────────────────────────────────────────────────────────────
router.post('/request-otp', validateOtpRequest, async (req, res) => {
  const { phone } = req.body;

  // Check rate limiting for OTP requests
  // In production: integrate with SMS provider (Twilio, AWS SNS, etc.)
  return res.json({ message: `OTP sent to ${phone || 'provided number'}`, otp: '123456' });
});

// ─── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', validateLogin, async (req, res) => {
  const { email, password, device, deviceFingerprint, ipAddress = '', location = 'Unknown' } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check account lockout
  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000);
    return res.status(429).json({
      error: `Account locked. Try again in ${remainingMinutes} minute(s).`,
    });
  }

  // Verify password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    user.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
      user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lockout
      user.failedLoginAttempts = 0;
    }

    // Log failed attempt
    user.loginHistory.push({
      ip: ipAddress || req.ip || '',
      device: device ?? 'Web browser',
      deviceFingerprint: deviceFingerprint ?? '',
      location,
      createdAt: new Date(),
      success: false,
      failureReason: 'Invalid password',
    });

    await user.save();
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Reset failed attempts on successful login
  user.failedLoginAttempts = 0;
  user.lockoutUntil = undefined;

  // Create new session with device fingerprinting
  const jti = uuidv4();
  const session = {
    device: device ?? 'Web browser',
    deviceFingerprint: deviceFingerprint ?? '',
    ip: ipAddress || req.ip || '',
    location,
    startedAt: new Date(),
    lastSeenAt: new Date(),
    suspicious: false,
    isActive: true,
  };

  // Detect suspicious login
  const recentSessions = user.sessions.filter((s) => s.isActive);
  if (recentSessions.length > 0) {
    const knownDevices = recentSessions.map((s) => s.deviceFingerprint).filter(Boolean);
    if (deviceFingerprint && knownDevices.length > 0 && !knownDevices.includes(deviceFingerprint)) {
      session.suspicious = true;
    }
  }

  user.sessions.unshift(session);
  user.loginHistory.push({
    ip: ipAddress || req.ip || '',
    device: device ?? 'Web browser',
    deviceFingerprint: deviceFingerprint ?? '',
    location,
    createdAt: new Date(),
    success: true,
  });

  // Set new refresh token JTI (invalidate old one)
  user.refreshTokenJti = jti;

  await user.save();

  const tokens = signTokenPair(user.id, user.email, jti);

  return res.json({
    tokens,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      verifiedEmail: user.verifiedEmail,
      twoFactorEnabled: user.twoFactorEnabled,
      sessions: user.sessions.slice(0, 3),
    },
  });
});

// ─── Refresh Token ─────────────────────────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const redis = req.app.locals.redis;

    // Check if token is blacklisted
    if (redis) {
      const blacklisted = await redis.get(`blacklist:${decoded.jti}`);
      if (blacklisted) {
        return res.status(401).json({ error: 'Token has been revoked' });
      }
    }

    // Verify user still exists and token is valid
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshTokenJti !== decoded.jti) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Issue new token pair
    const newJti = uuidv4();
    user.refreshTokenJti = newJti;
    await user.save();

    // Blacklist old token
    if (redis) {
      await blacklistToken(redis, decoded.jti);
    }

    const tokens = signTokenPair(user.id, user.email, newJti);
    return res.json({ tokens });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// ─── Logout ────────────────────────────────────────────────────────────────────
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { refreshToken } = req.body;

  try {
    // Blacklist refresh token
    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      const redis = req.app.locals.redis;
      if (redis) {
        await blacklistToken(redis, decoded.jti);
      }
    }

    // Deactivate current session
    const user = await User.findById(req.user!.userId);
    if (user) {
      user.refreshTokenJti = undefined;
      const activeSession = user.sessions.find((s) => s.isActive);
      if (activeSession) {
        activeSession.isActive = false;
      }
      await user.save();
    }

    return res.json({ message: 'Logged out successfully' });
  } catch {
    return res.json({ message: 'Logged out' });
  }
});

// ─── Get Sessions ──────────────────────────────────────────────────────────────
router.get('/sessions', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user!.userId).lean();
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate security alerts
  const alerts: Array<{
    type: string;
    severity: string;
    message: string;
    relatedSessionDevice?: string;
  }> = [];

  const activeSessions = user.sessions.filter((s) => s.isActive);
  const suspiciousSessions = activeSessions.filter((s) => s.suspicious);

  if (suspiciousSessions.length > 0) {
    alerts.push({
      type: 'new_device',
      severity: 'high',
      message: `Suspicious login from ${suspiciousSessions[0].device} in ${suspiciousSessions[0].location}`,
      relatedSessionDevice: suspiciousSessions[0].device,
    });
  }

  if (!user.twoFactorEnabled) {
    alerts.push({
      type: '2fa_required',
      severity: 'medium',
      message: 'Two-factor authentication is not enabled',
    });
  }

  const failedAttempts = user.loginHistory.filter((h) => !h.success && h.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000));
  if (failedAttempts.length >= 3) {
    alerts.push({
      type: 'velocity',
      severity: 'medium',
      message: `${failedAttempts.length} failed login attempts in the last 24 hours`,
    });
  }

  return res.json({
    email: user.email,
    sessions: activeSessions,
    alerts,
  });
});

// ─── Revoke Session ────────────────────────────────────────────────────────────
router.post('/sessions/revoke', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { sessionIndex } = req.body;

  const user = await User.findById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (typeof sessionIndex !== 'number' || sessionIndex < 0 || sessionIndex >= user.sessions.length) {
    return res.status(400).json({ error: 'Invalid session index' });
  }

  user.sessions[sessionIndex].isActive = false;
  await user.save();

  return res.json({ message: 'Session revoked', sessions: user.sessions.filter((s) => s.isActive) });
});

// ─── Enable 2FA ────────────────────────────────────────────────────────────────
router.post('/enable-2fa', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.twoFactorEnabled = !user.twoFactorEnabled;
  await user.save();

  return res.json({ twoFactorEnabled: user.twoFactorEnabled });
});

export default router;

