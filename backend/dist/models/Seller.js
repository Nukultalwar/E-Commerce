"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sellerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    trustScore: { type: Number, default: 82 },
    deliveryPerformance: { type: Number, default: 88 },
    returnRate: { type: Number, default: 12 },
    satisfaction: { type: Number, default: 89 },
    authenticity: { type: Number, default: 91 },
});
exports.default = (0, mongoose_1.model)('Seller', sellerSchema);
