"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const variantSchema = new mongoose_1.Schema({
    id: String,
    label: String,
    priceDelta: Number,
    stock: Number,
    deliveryDays: Number,
});
const priceHistorySchema = new mongoose_1.Schema({
    timestamp: { type: Date, default: Date.now },
    price: Number,
});
const productSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    features: { type: [String], default: [] },
    currentPrice: { type: Number, required: true },
    mrp: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 128 },
    seller: { type: String, required: true },
    sellerTrustScore: { type: Number, default: 84 },
    variants: { type: [variantSchema], default: [] },
    priceHistory: { type: [priceHistorySchema], default: [] },
    scoreTags: { type: [String], default: [] },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
});
exports.default = (0, mongoose_1.model)('Product', productSchema);
