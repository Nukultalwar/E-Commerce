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
exports.securityMiddleware = [
    (0, helmet_1.default)(),
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
