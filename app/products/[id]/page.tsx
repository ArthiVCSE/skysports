"use client";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { Typography, Button, Rating, Chip, Divider, Tabs, Tab } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { products } from "@/lib/data";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <main className="bg-slate-900 min-h-screen text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Visual */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center h-80 text-9xl">
            {product.emoji}
          </div>

          {/* Info */}
          <div>
            <Chip label={product.category} size="small" sx={{ bgcolor: "#1e293b", color: "#94a3b8", mb: 2 }} />
            {product.badge && (
              <Chip label={product.badge} size="small" sx={{ bgcolor: "#f97316", color: "#fff", fontWeight: 700, ml: 1, mb: 2 }} />
            )}
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>{product.name}</Typography>

            <div className="flex items-center gap-3 mb-4">
              <Rating value={product.rating} precision={0.5} readOnly sx={{ color: "#f97316" }} />
              <Typography sx={{ color: "#64748b", fontSize: 14 }}>({product.reviews} reviews)</Typography>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Typography variant="h4" sx={{ color: "#f97316", fontWeight: 900 }}>₹{product.price}</Typography>
              {product.originalPrice && (
                <Typography variant="h6" sx={{ color: "#64748b", textDecoration: "line-through" }}>
                  ₹{product.originalPrice}
                </Typography>
              )}
              {discount && <Chip label={`${discount}% OFF`} sx={{ bgcolor: "#14532d", color: "#4ade80", fontWeight: 700 }} />}
            </div>

            <Divider sx={{ borderColor: "#1e293b", mb: 4 }} />

            {/* Qty Selector */}
            <div className="flex items-center gap-4 mb-6">
              <Typography sx={{ color: "#94a3b8" }}>Quantity:</Typography>
              <div className="flex items-center border border-slate-600 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-lg transition-colors">−</button>
                <span className="px-5 py-2 bg-slate-900 text-white font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-lg transition-colors">+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="contained" startIcon={<ShoppingCartIcon />} size="large" fullWidth
                sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 3, textTransform: "none", fontWeight: 700 }}>
                Add to Cart
              </Button>
              <Button variant="outlined" size="large"
                sx={{ borderColor: "#334155", color: "#e2e8f0", "&:hover": { borderColor: "#f43f5e", color: "#f43f5e" }, borderRadius: 3, minWidth: 56 }}>
                <FavoriteBorderIcon />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <Tabs value={tab} onChange={(_, v) => setTab(v)}
            sx={{ "& .MuiTab-root": { color: "#64748b", textTransform: "none" }, "& .Mui-selected": { color: "#f97316" }, "& .MuiTabs-indicator": { bgcolor: "#f97316" } }}>
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
          </Tabs>
          <Divider sx={{ borderColor: "#1e293b" }} />
          <div className="py-6 text-slate-400">
            {tab === 0 && <Typography>High-performance {product.name} designed for serious athletes. Built with premium materials to deliver exceptional durability and comfort during intense training sessions.</Typography>}
            {tab === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {[["Material", "Premium Composite"], ["Weight", "320g"], ["Warranty", "2 Years"], ["Origin", "Manufactured in EU"]].map(([k, v]) => (
                  <div key={k} className="bg-slate-800 rounded-xl p-3">
                    <Typography variant="caption" sx={{ color: "#64748b" }}>{k}</Typography>
                    <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600 }}>{v}</Typography>
                  </div>
                ))}
              </div>
            )}
            {tab === 2 && <Typography>⭐ {product.rating}/5 based on {product.reviews} verified reviews. Customer reviews coming soon.</Typography>}
          </div>
        </div>
      </div>
    </main>
  );
}
