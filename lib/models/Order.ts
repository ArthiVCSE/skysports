// lib/models/Order.ts
import mongoose from "mongoose";
import { getModel } from "@/lib/mongoose";

export interface IOrderItem {
  productId: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: "COD";
  deliveryDate?: Date;
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD"], default: "COD" },
    deliveryDate: { type: Date },
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered"], default: "pending" },
  },
  { timestamps: true }
);

export default getModel<IOrder>("Order", OrderSchema);
