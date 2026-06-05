"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: Number(process.env.PORT ?? 4000),
    mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/smartdeal',
    jwtSecret: process.env.JWT_SECRET ?? 'changeme_super_secure_secret',
    redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
};
