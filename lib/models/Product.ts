// lib/models/Product.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  category: string;
  badge?: string;
  emoji?: string;
  description?: string;
  imageUrl?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number },
    reviews: { type: Number },
    category: { type: String, required: true },
    badge: { type: String },
    emoji: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product as mongoose.Model<IProduct> ||
  mongoose.model<IProduct>("Product", ProductSchema);
