// lib/models/CartItem.ts
import mongoose from "mongoose";
import { getModel } from "@/lib/mongoose";

export interface ICartItem {
  userId: string;
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

const CartItemSchema = new mongoose.Schema<ICartItem>({
  userId: { type: String, required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

export default getModel<ICartItem>("CartItem", CartItemSchema);
