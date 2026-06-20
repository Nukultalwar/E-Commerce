"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const csurf_1 = __importDefault(require("csurf"));
const isProd = process.env.NODE_ENV === 'production';
const cspDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
    styleSrc: ["'self'", 'https:'],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'ws:', 'wss:', 'https:', 'http:'],
    fontSrc: ["'self'", 'https:', 'data:'],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
};
// Allow inline styles in development for rapid iteration (unsafe-inline).
if (!isProd) {
    // @ts-ignore - allow mutation for development convenience
    cspDirectives.styleSrc.push("'unsafe-inline'");
}
exports.securityMiddleware = [
    (0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: cspDirectives,
        },
    }),
    (0, cors_1.default)({ origin: process.env.CLIENT_URL ?? 'http://localhost:3000', credentials: true }),
    (0, express_rate_limit_1.default)({
        windowMs: 1000 * 60,
        max: 120,
        message: 'Too many requests from this IP, please slow down.',
    }),
    (0, csurf_1.default)({
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        },
        ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    }),
];
