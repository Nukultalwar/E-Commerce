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
const ai_1 = __importDefault(require("./routes/ai"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: '20mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
// In local development we allow calls without CSRF token.
// CSRF still applies in production unless explicitly disabled.
if (process.env.NODE_ENV === 'production') {
    app.use(security_1.securityMiddleware);
}
else {
    // keep helmet + cors + rate-limit without csurf
    const [helmetMw, corsMw, rateLimitMw] = security_1.securityMiddleware;
    app.use(helmetMw);
    app.use(corsMw);
    app.use(rateLimitMw);
}
app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'SmartDeal AI backend' });
});
// Prevent Chrome DevTools from repeatedly requesting a missing well-known config.
// This is primarily to avoid CSP console noise during local development.
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
    res.json({});
});
// Avoid noisy 404 for browser default favicon requests.
app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
});
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/ai', ai_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});
exports.default = app;
