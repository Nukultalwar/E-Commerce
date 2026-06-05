import { Schema, model, Document } from 'mongoose';

export interface SessionInfo {
  device: string;
  ip: string;
  location: string;
  startedAt: Date;
  lastSeenAt: Date;
  suspicious: boolean;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  verifiedEmail: boolean;
  twoFactorEnabled: boolean;
  sessions: SessionInfo[];
  wishlist: string[];
  preferences: Record<string, unknown>;
  loginHistory: Array<{ ip: string; device: string; location: string; createdAt: Date }>;
}

const sessionSchema = new Schema<SessionInfo>({
  device: { type: String, default: 'Unknown' },
  ip: { type: String, default: '' },
  location: { type: String, default: '' },
  startedAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  suspicious: { type: Boolean, default: false },
});

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  verifiedEmail: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  sessions: { type: [sessionSchema], default: [] },
  wishlist: { type: [String], default: [] },
  preferences: { type: Schema.Types.Mixed, default: {} },
  loginHistory: { type: [{ ip: String, device: String, location: String, createdAt: Date }], default: [] },
});

export default model<UserDocument>('User', userSchema);
