import { Router } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { authenticateToken, AuthenticatedRequest } from '../utils/jwt';
import { validateCartAdd, validateCartUpdate } from '../middleware/validate';
import { cartRateLimiter } from '../middleware/security';

const router = Router();

// All cart routes require authentication and rate limiting
router.use(authenticateToken);
router.use(cartRateLimiter);

// Get current user's cart
router.get('/', async (req: AuthenticatedRequest, res) => {
  const cart = await Cart.findOne({ userId: req.user!.userId }).lean();
  if (!cart) {
    return res.json({ items: [], totalAmount: 0, totalItems: 0, discountAmount: 0 });
  }
  return res.json(cart);
});

// Add item to cart
router.post('/add', validateCartAdd, async (req: AuthenticatedRequest, res) => {
  const { productSlug, quantity, variantId } = req.body;

  // Find product
  const product = await Product.findOne({ slug: productSlug }).lean();
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check stock
  let unitPrice = product.currentPrice;
  let variantLabel: string | undefined;

  if (variantId && product.variants) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) {
      return res.status(400).json({ error: 'Variant not found' });
    }
    if (variant.stock < quantity) {
      return res.status(400).json({ error: `Only ${variant.stock} units available for this variant` });
    }
    unitPrice = product.currentPrice + variant.priceDelta;
    variantLabel = variant.label;
  } else if (product.stockCount < quantity) {
    return res.status(400).json({ error: `Only ${product.stockCount} units available` });
  }

  // Find or create cart
  let cart = await Cart.findOne({ userId: req.user!.userId });
  if (!cart) {
    cart = new Cart({
      userId: req.user!.userId,
      items: [],
    });
  }

  // Check if item already exists (same product + variant)
  const existingIndex = cart.items.findIndex(
    (item) => item.productSlug === productSlug && item.variantId === (variantId ?? null)
  );

  if (existingIndex >= 0) {
    // Update quantity
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > 99) {
      return res.status(400).json({ error: 'Maximum 99 units per item' });
    }
    cart.items[existingIndex].quantity = newQty;
  } else {
    // Add new item
    cart.items.push({
      productSlug,
      productTitle: product.title,
      variantId: variantId ?? undefined,
      variantLabel,
      quantity,
      unitPrice,
      imageUrl: product.images?.[0],
    });
  }

  await cart.save();
  return res.json(cart);
});

// Update cart item quantity
router.put('/item/:productSlug', validateCartUpdate, async (req: AuthenticatedRequest, res) => {
  const { productSlug } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId: req.user!.userId });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex((item) => item.productSlug === productSlug);
  if (itemIndex < 0) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity === 0) {
    // Remove item
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  return res.json(cart);
});

// Remove item from cart
router.delete('/item/:productSlug', async (req: AuthenticatedRequest, res) => {
  const cart = await Cart.findOne({ userId: req.user!.userId });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex((item) => item.productSlug === req.params.productSlug);
  if (itemIndex < 0) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();
  return res.json(cart);
});

// Clear cart
router.delete('/', async (req: AuthenticatedRequest, res) => {
  await Cart.findOneAndDelete({ userId: req.user!.userId });
  return res.json({ message: 'Cart cleared' });
});

// Apply coupon
router.post('/coupon', async (req: AuthenticatedRequest, res) => {
  const { couponCode } = req.body;
  if (!couponCode || typeof couponCode !== 'string') {
    return res.status(400).json({ error: 'Coupon code is required' });
  }

  const cart = await Cart.findOne({ userId: req.user!.userId });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  // Simple coupon validation (in production, check against a Coupon collection)
  const validCoupons: Record<string, number> = {
    'WELCOME10': 10,
    'SAVE20': 20,
    'FIRST50': 50,
  };

  const discountPercent = validCoupons[couponCode.toUpperCase()];
  if (!discountPercent) {
    return res.status(400).json({ error: 'Invalid coupon code' });
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  cart.couponCode = couponCode.toUpperCase();
  cart.discountAmount = Math.round(subtotal * (discountPercent / 100));
  await cart.save();

  return res.json(cart);
});

export default router;

