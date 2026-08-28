"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const security_1 = require("./middleware/security");
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
const cart_1 = __importDefault(require("./routes/cart"));
const orders_1 = __importDefault(require("./routes/orders"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const ai_1 = __importDefault(require("./routes/ai"));
const app = (0, express_1.default)();
// ─── Global Middleware ─────────────────────────────────────────────────────────
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: '1mb' })); // Reduced from 20mb to 1mb for security
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
// ─── Security Layers ───────────────────────────────────────────────────────────
// Layer 1-3, 5-7: Transport security, CORS, IP filter, Audit, Suspicious patterns, Rate limiting
app.use(security_1.securityMiddleware);
// Layer 4: Request size validation for specific routes (applied in routes)
// Layer 8: CSRF protection for state-changing requests (production only)
if (process.env.NODE_ENV === 'production') {
    app.use('/api', security_1.csrfProtection);
}
// ─── Health & Well-Known Endpoints ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'healthy',
        service: 'SmartDeal AI backend',
        version: '2.0.0',
        security: {
            csrf: process.env.NODE_ENV === 'production',
            rateLimiting: true,
            hsts: true,
            csp: true,
        },
    });
});
// Prevent Chrome DevTools from repeatedly requesting a missing well-known config
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
    res.json({});
});
// Avoid noisy 404 for browser default favicon requests
app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
});
// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/cart', cart_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/wishlist', wishlist_1.default);
app.use('/api/ai', ai_1.default);
// ─── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    // Narrow the unknown error to an object with optional fields we need
    const e = err;
    console.error('[ERROR]', e.message || err);
    // consume the next handler param to satisfy linter (not used)
    void _next;
    // Handle specific error types
    if (e.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: e.message });
    }
    if (e.name === 'UnauthorizedError' || e.status === 401) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (e.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    res.status(e.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : e.message || 'Internal server error',
    });
});
exports.default = app;
