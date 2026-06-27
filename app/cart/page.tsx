"use client";
import { useState } from "react";
import Link from "next/link";
import { Typography, Button, Divider, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { state: { items: cart }, dispatch } = useCart();
  const [coupon, setCoupon] = useState("");

  const updateQty = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const remove = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <main className="bg-slate-900 min-h-screen text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 8 }}>
          Your <span style={{ color: "#f97316" }}>Cart</span>
          <span className="text-slate-500 text-lg font-normal ml-3">({cart.length} items)</span>
        </Typography>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-7xl">🛒</span>
            <Typography sx={{ color: "#64748b", mt: 3, mb: 4 }}>Your cart is empty.</Typography>
            <Link href="/products">
              <Button variant="contained" sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 3, textTransform: "none", fontWeight: 700 }}>
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex gap-5 items-center">
                  <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>{item.category}</Typography>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-slate-600 rounded-lg overflow-hidden text-sm">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 transition-colors">−</button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Typography sx={{ color: "#f97316", fontWeight: 800 }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>₹{item.price} each</Typography>
                    <div>
                      <IconButton size="small" onClick={() => remove(item.id)} sx={{ color: "#64748b", "&:hover": { color: "#f43f5e" }, mt: 0.5 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 h-fit sticky top-24">
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Order Summary</Typography>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Add ₹{(75 - subtotal).toFixed(2)} more for free shipping
                  </Typography>
                )}
              </div>

              <Divider sx={{ borderColor: "#334155", my: 3 }} />

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <TextField size="small" placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)}
                  sx={{ flex: 1, "& .MuiOutlinedInput-root": { bgcolor: "#0f172a", color: "#e2e8f0", borderRadius: 2, "& fieldset": { borderColor: "#334155" } } }} />
                <Button variant="outlined" size="small"
                  sx={{ borderColor: "#334155", color: "#94a3b8", borderRadius: 2, textTransform: "none", whiteSpace: "nowrap" }}>
                  Apply
                </Button>
              </div>

              <Divider sx={{ borderColor: "#334155", mb: 3 }} />

              <div className="flex justify-between font-bold text-lg mb-5">
                <span>Total</span>
                <span className="text-orange-400">₹{total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" style={{ textDecoration: 'none' }}>
                <Button variant="contained" fullWidth endIcon={<ArrowForwardIcon />} size="large"
                  sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 3, textTransform: "none", fontWeight: 700 }}>
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
