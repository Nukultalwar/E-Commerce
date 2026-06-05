import { Schema, model, Document } from 'mongoose';

export interface PricePoint {
  timestamp: Date;
  price: number;
}

export interface VariantOption {
  id: string;
  label: string;
  priceDelta: number;
  stock: number;
  deliveryDays: number;
}

export interface ProductDocument extends Document {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  features: string[];
  currentPrice: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  seller: string;
  sellerTrustScore: number;
  variants: VariantOption[];
  priceHistory: PricePoint[];
  scoreTags: string[];
  metadata: Record<string, unknown>;
}

const variantSchema = new Schema<VariantOption>({
  id: String,
  label: String,
  priceDelta: Number,
  stock: Number,
  deliveryDays: Number,
});

const priceHistorySchema = new Schema<PricePoint>({
  timestamp: { type: Date, default: Date.now },
  price: Number,
});

const productSchema = new Schema<ProductDocument>({
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
  metadata: { type: Schema.Types.Mixed, default: {} },
});

export default model<ProductDocument>('Product', productSchema);
