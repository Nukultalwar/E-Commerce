import { Router } from 'express';
import Product from '../models/Product';
import Seller from '../models/Seller';

const router = Router();

router.get('/search', async (req, res) => {
  const query = (req.query.q as string) ?? '';
  const category = (req.query.category as string) ?? '';
  const keywords = query.split(' ').filter(Boolean);

  const filter: any = {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { shortDescription: { $regex: query, $options: 'i' } },
      { category: { $regex: category, $options: 'i' } },
    ],
  };
  if (!query) {
    filter.$or = undefined;
  }

  const results = await Product.find(filter).limit(12).lean();
  return res.json({ query, keywords, results });
});

router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).lean();
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const recommendations = await Product.find({ category: product.category, slug: { $ne: product.slug } }).limit(4).lean();
  return res.json({ product, recommendations });
});

router.post('/compare', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length < 2) {
    return res.status(400).json({ error: 'Provide at least two product IDs or slugs' });
  }

  const products = await Product.find({ slug: { $in: ids } }).lean();
  return res.json({ products });
});

router.get('/:slug/deal-analyzer', async (req, res) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug }).lean();
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const seller = await Seller.findOne({ name: product.seller }).lean();

  const history = Array.isArray(product.priceHistory) ? product.priceHistory : [];
  const averagePriceRaw =
    history.reduce((sum: number, point: any) => sum + Number(point.price ?? 0), 0) / Math.max(history.length, 1);
  const averagePrice = Number(averagePriceRaw.toFixed(2));
  const delta = Number(product.currentPrice) - averagePrice;

  // Normalize into contract-friendly enums.
  const decision: 'buy_now' | 'wait' | 'alternative' = delta <= 0 ? 'buy_now' : 'wait';

  // confidence in [0..1]
  const pct = averagePrice > 0 ? delta / averagePrice : 0;
  const confidence = Math.max(0, Math.min(1, decision === 'buy_now' ? 0.75 + Math.abs(Math.min(0, pct)) : 0.35));

  const reasons: string[] = [];
  if (delta <= 0) {
    reasons.push('Current price is at or below the historical average for this product/category.');
  } else {
    reasons.push('Current price is above the historical average; waiting may yield a better drop.');
  }
  reasons.push('Seller trust is based on delivery/support reliability.');

  const suggestedAlternativeSlugs = [] as string[];

  return res.json({
    slug,
    currentPrice: Number(product.currentPrice),
    averageHistoricalPrice: averagePrice,
    sellerTrust: seller?.trustScore ?? 82,
    decision,
    confidence,
    reasons,
    nextStep:
      decision === 'buy_now'
        ? 'Purchase now to lock the deal, and consider adding a matched warranty.'
        : 'Monitor price trends for the next repricing cycle or consider alternatives.',
    suggestedAlternativeSlugs,
  });
});

export default router;
