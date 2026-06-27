import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji?: string;
  imageUrl?: string;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  emoji: { type: String },
  imageUrl: { type: String },
}, { _id: false });

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.models.Cart as mongoose.Model<ICart> || mongoose.model<ICart>("Cart", CartSchema);
