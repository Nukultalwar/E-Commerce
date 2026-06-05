"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !validator_1.default.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid registration input' });
    }
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const user = await User_1.default.create({
        name,
        email,
        passwordHash,
        phone,
        verifiedEmail: false,
        twoFactorEnabled: false,
        sessions: [],
        loginHistory: [],
    });
    return res.status(201).json({ userId: user.id, message: 'Account created. Verify your email before continuing.' });
});
router.post('/verify-email', async (req, res) => {
    const { email } = req.body;
    if (!email || !validator_1.default.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    user.verifiedEmail = true;
    await user.save();
    return res.json({ message: 'Email verified successfully' });
});
router.post('/request-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone || !validator_1.default.isMobilePhone(phone, 'any')) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }
    // OTP generation should be integrated with a real SMS provider in production.
    return res.json({ message: 'OTP sent to phone number', otp: '123456' });
});
router.post('/login', async (req, res) => {
    const { email, password, device, ipAddress = '', location = 'Unknown' } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing credentials' });
    }
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: 'Invalid login attempt' });
    }
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid login attempt' });
    }
    const session = {
        device: device ?? 'Web browser',
        ip: ipAddress,
        location,
        startedAt: new Date(),
        lastSeenAt: new Date(),
        suspicious: false,
    };
    user.sessions.unshift(session);
    user.loginHistory.unshift({ ip: ipAddress, device: device ?? 'Web browser', location, createdAt: new Date() });
    await user.save();
    const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
    return res.json({ token, user: { name: user.name, email: user.email, verifiedEmail: user.verifiedEmail, sessions: user.sessions.slice(0, 3) } });
});
router.get('/sessions', async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: 'Email query required' });
    }
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ sessions: user.sessions });
});
exports.default = router;
