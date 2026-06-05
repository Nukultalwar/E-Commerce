import { Schema, model, Document } from 'mongoose';

export interface SellerDocument extends Document {
  name: string;
  trustScore: number;
  deliveryPerformance: number;
  returnRate: number;
  satisfaction: number;
  authenticity: number;
}

const sellerSchema = new Schema<SellerDocument>({
  name: { type: String, required: true },
  trustScore: { type: Number, default: 82 },
  deliveryPerformance: { type: Number, default: 88 },
  returnRate: { type: Number, default: 12 },
  satisfaction: { type: Number, default: 89 },
  authenticity: { type: Number, default: 91 },
});

export default model<SellerDocument>('Seller', sellerSchema);
