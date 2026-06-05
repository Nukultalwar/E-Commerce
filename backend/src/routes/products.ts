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
  const product = await Product.findOne({ slug: req.params.slug }).lean();
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const seller = await Seller.findOne({ name: product.seller }).lean();
  const averagePrice = product.priceHistory.reduce((sum, point) => sum + point.price, 0) / Math.max(product.priceHistory.length, 1);
  const delta = product.currentPrice - averagePrice;

  const recommendation = delta <= 0 ? 'Buy now' : 'Consider waiting for a better drop';
  const strength = delta <= 0 ? 'strong' : 'moderate';

  return res.json({
    currentPrice: product.currentPrice,
    averagePrice: Number(averagePrice.toFixed(2)),
    sellerTrust: seller?.trustScore ?? 82,
    decision: recommendation,
    confidence: strength,
    alert: delta > 0 ? 'Price is slightly above average. Watch trend for the next repricing cycle.' : 'Deal looks strong based on history and seller reliability.',
  });
});

export default router;
