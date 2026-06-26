// lib/models/Product.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product as mongoose.Model<IProduct> ||
  mongoose.model<IProduct>("Product", ProductSchema);
