import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    category: { type: String, required: true },
    badge: { type: String },
    imageUrl: { type: String, default: "https://placehold.co/400" },
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
