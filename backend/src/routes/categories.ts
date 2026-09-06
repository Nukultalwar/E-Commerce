import { Router } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import { validateSlug } from '../middleware/validate';

const router = Router();

// Get all active categories
router.get('/', async (_req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .lean();
  return res.json({ categories });
});

// Get single category with subcategories
router.get('/:slug', validateSlug, async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Get product count for this category
  const productCount = await Product.countDocuments({ categorySlug: req.params.slug });

  return res.json({ category, productCount });
});

// Get products by category with pagination and filters
router.get('/:slug/products', validateSlug, async (req, res) => {
  const { slug } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const sort = (req.query.sort as string) || 'rating';
  const minPrice = parseFloat(req.query.minPrice as string) || 0;
  const maxPrice = parseFloat(req.query.maxPrice as string) || Infinity;
  const minRating = parseFloat(req.query.rating as string) || 0;

  const category = await Category.findOne({ slug, isActive: true }).lean();
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const filter: Record<string, unknown> = {
    categorySlug: slug,
    currentPrice: { $gte: minPrice, $lte: maxPrice },
    rating: { $gte: minRating },
  };

  // Build sort object
  const sortOptions: Record<string, 1 | -1> = {};
  switch (sort) {
    case 'price_asc':
      sortOptions.currentPrice = 1;
      break;
    case 'price_desc':
      sortOptions.currentPrice = -1;
      break;
    case 'rating':
      sortOptions.rating = -1;
      break;
    case 'newest':
      sortOptions.createdAt = -1;
      break;
    case 'popular':
      sortOptions.reviewCount = -1;
      break;
    default:
      sortOptions.rating = -1;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return res.json({
    category,
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Get subcategory by slug
router.get('/:slug/subcategories', validateSlug, async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  return res.json({ category: category.name, subcategories: category.subcategories });
});

export default router;

