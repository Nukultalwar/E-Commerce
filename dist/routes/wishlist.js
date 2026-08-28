"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
router.use(jwt_1.authenticateToken);
// Get wishlist with product details
router.get('/', async (req, res) => {
    const user = await User_1.default.findById(req.user.userId).lean();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    // Fetch full product details for each slug
    const slugs = user.wishlist || [];
    const products = slugs.length > 0
        ? await Product_1.default.find({ slug: { $in: slugs } }).lean()
        : [];
    return res.json({ wishlist: products, slugs });
});
// Add to wishlist
router.post('/add', async (req, res) => {
    const { productSlug } = req.body;
    if (!productSlug || typeof productSlug !== 'string') {
        return res.status(400).json({ error: 'Product slug is required' });
    }
    // Verify product exists
    const product = await Product_1.default.findOne({ slug: productSlug }).lean();
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const user = await User_1.default.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (!user.wishlist.includes(productSlug)) {
        user.wishlist.push(productSlug);
        await user.save();
    }
    return res.json({ wishlist: user.wishlist, message: 'Added to wishlist' });
});
// Remove from wishlist
router.delete('/:slug', async (req, res) => {
    const { slug } = req.params;
    const user = await User_1.default.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    user.wishlist = user.wishlist.filter((s) => s !== slug);
    await user.save();
    return res.json({ wishlist: user.wishlist, message: 'Removed from wishlist' });
});
// Check if product is in wishlist
router.get('/check/:slug', async (req, res) => {
    const user = await User_1.default.findById(req.user.userId).lean();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const isWishlisted = user.wishlist.includes(req.params.slug);
    return res.json({ isWishlisted });
});
exports.default = router;
