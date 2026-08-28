"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = exports.csrfProtection = exports.auditLogger = exports.suspiciousPatternDetector = exports.ipFilter = exports.requestSizeLimiter = exports.corsMiddleware = exports.orderRateLimiter = exports.cartRateLimiter = exports.dealAnalyzerRateLimiter = exports.searchRateLimiter = exports.authRateLimiter = exports.globalRateLimiter = exports.transportSecurityHeaders = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const isProd = process.env.NODE_ENV === 'production';
// ─── Layer 1: Transport Security Headers ─────────────────────────────────────────
exports.transportSecurityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
            imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
            connectSrc: ["'self'", 'ws:', 'wss:', 'https:', 'http:'],
            fontSrc: ["'self'", 'https:', 'data:'],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            // upgradeInsecureRequests enabled in production via HSTS header instead
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    frameguard: { action: 'deny' },
    ieNoOpen: true,
    dnsPrefetchControl: { allow: false },
});
// ─── Layer 2: Per-Endpoint Rate Limiters ────────────────────────────────────────
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down.' },
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts. Try again later.' },
});
exports.searchRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Search rate limit exceeded. Please wait.' },
});
exports.dealAnalyzerRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Deal analyzer rate limit exceeded.' },
});
exports.cartRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Cart operation rate limit exceeded.' },
});
exports.orderRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Order rate limit exceeded.' },
});
// ─── Layer 3: CORS Configuration ─────────────────────────────────────────────────
exports.corsMiddleware = (0, cors_1.default)({
    origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Device-Fingerprint'],
    exposedHeaders: ['X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400, // 24 hours
});
// ─── Layer 4: Request Size Validation ────────────────────────────────────────────
const requestSizeLimiter = (maxBytes = 1024 * 100) => {
    return (req, res, next) => {
        const contentLength = parseInt(req.headers['content-length'] ?? '0', 10);
        if (contentLength > maxBytes) {
            return res.status(413).json({ error: 'Request entity too large.' });
        }
        next();
    };
};
exports.requestSizeLimiter = requestSizeLimiter;
// ─── Layer 5: IP Blocking / Allow-listing ────────────────────────────────────────
const BLOCKED_IPS = new Set((process.env.BLOCKED_IPS ?? '').split(',').filter(Boolean));
const ALLOWED_IPS = new Set((process.env.ALLOWED_IPS ?? '').split(',').filter(Boolean));
const ipFilter = (req, res, next) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? '';
    if (ALLOWED_IPS.size > 0 && !ALLOWED_IPS.has(ip)) {
        return res.status(403).json({ error: 'Access denied.' });
    }
    if (BLOCKED_IPS.has(ip)) {
        return res.status(403).json({ error: 'Access denied.' });
    }
    next();
};
exports.ipFilter = ipFilter;
// ─── Layer 6: Suspicious Pattern Detection ───────────────────────────────────────
const SUSPICIOUS_PATTERNS = [
    /(\b)(DROP|DELETE|INSERT|UPDATE)(\b)/i,
    /(\b)(EXEC|EXECUTE|UNION|SELECT)(\b)/i,
    /<script[\s>]/i,
    /%[0-9a-f]{2}/i, // URL-encoded injection attempts
];
const suspiciousPatternDetector = (req, res, next) => {
    const checkValue = (value) => {
        return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(value));
    };
    const queryString = JSON.stringify(req.query);
    const bodyString = req.body ? JSON.stringify(req.body) : '';
    const paramsString = JSON.stringify(req.params);
    if (checkValue(queryString) || checkValue(bodyString) || checkValue(paramsString)) {
        console.warn(`[SECURITY] Suspicious pattern detected from IP: ${req.ip}`);
        return res.status(400).json({ error: 'Invalid request content.' });
    }
    next();
};
exports.suspiciousPatternDetector = suspiciousPatternDetector;
// ─── Layer 7: Audit Logging ──────────────────────────────────────────────────────
const auditLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.headers['user-agent'] ?? 'unknown',
            referer: req.headers.referer ?? 'none',
        };
        if (res.statusCode >= 400) {
            console.warn('[AUDIT]', JSON.stringify(logEntry));
        }
        else {
            console.log('[AUDIT]', JSON.stringify(logEntry));
        }
    });
    next();
};
exports.auditLogger = auditLogger;
// ─── Layer 8: CSRF Double-Submit Cookie Pattern ──────────────────────────────────
const csrfProtection = (req, res, next) => {
    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }
    // In development, allow bypass for easier testing
    if (!isProd) {
        return next();
    }
    const token = req.headers['x-csrf-token'];
    const cookie = req.cookies?.['csrf-token'];
    if (!token || !cookie || token !== cookie) {
        return res.status(403).json({ error: 'Invalid CSRF token.' });
    }
    next();
};
exports.csrfProtection = csrfProtection;
// ─── Security Middleware Aggregator ───────────────────────────────────────────────
exports.securityMiddleware = [
    exports.transportSecurityHeaders,
    exports.corsMiddleware,
    exports.ipFilter,
    exports.auditLogger,
    exports.suspiciousPatternDetector,
    exports.globalRateLimiter,
];
