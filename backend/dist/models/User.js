"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    device: { type: String, default: 'Unknown' },
    ip: { type: String, default: '' },
    location: { type: String, default: '' },
    startedAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
    suspicious: { type: Boolean, default: false },
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    verifiedEmail: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    sessions: { type: [sessionSchema], default: [] },
    wishlist: { type: [String], default: [] },
    preferences: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    loginHistory: { type: [{ ip: String, device: String, location: String, createdAt: Date }], default: [] },
});
exports.default = (0, mongoose_1.model)('User', userSchema);
