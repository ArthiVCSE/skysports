"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { Button, Typography, Chip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import ProductCard, { Product } from "@/components/ProductCard";

const perks = [
  { icon: <LocalShippingIcon />, title: "Free Shipping", desc: "On orders over ₹75" },
  { icon: <VerifiedIcon />, title: "Authentic Gear", desc: "100% genuine products" },
  { icon: <HeadsetMicIcon />, title: "24/7 Support", desc: "Always here to help" },
];

const categoryIcons: Record<string, string> = {
  Footwear: "👟",
  Football: "⚽",
  Basketball: "🏀",
  Tennis: "🎾",
  Swimming: "🏊",
  Cycling: "🚴",
  Fitness: "🏋️",
  Apparel: "👕",
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const categories = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([label, count]) => ({
      label,
      count,
      emoji: categoryIcons[label] || "🏆",
    }));
  }, [products]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="bg-slate-900 min-h-screen text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-6">
        <div className="absolute inset-0 opacity-5 text-[20rem] flex items-center justify-center select-none pointer-events-none">
          🏆
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <Chip label="🔥 New Season Collection" sx={{ bgcolor: "#1e293b", color: "#f97316", mb: 3, fontWeight: 600 }} />
            <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 3 }}>
              Gear Up for{" "}
              <span style={{ color: "#f97316" }}>Greatness</span>
            </Typography>
            <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 400, mb: 4, lineHeight: 1.7 }}>
              Premium sports equipment for every athlete. From beginners to pros — find your edge with SkySports.
            </Typography>
            <div className="flex gap-4 flex-wrap">
              <Link href="/products">
                <Button variant="contained" endIcon={<ArrowForwardIcon />} size="large"
                  sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 3, px: 4, textTransform: "none", fontWeight: 700 }}>
                  Shop Now
                </Button>
              </Link>
              {!user && (
                <Link href="/login">
                  <Button variant="outlined" size="large"
                    sx={{ borderColor: "#f97316", color: "#f97316", "&:hover": { borderColor: "#ea580c", bgcolor: "rgba(249,115,22,0.05)" }, borderRadius: 3, px: 4, textTransform: "none" }}>
                    Sign In
                  </Button>
                </Link>
              )}
              {user && (
                <Link href="/about">
                  <Button variant="outlined" size="large"
                    sx={{ borderColor: "#334155", color: "#e2e8f0", "&:hover": { borderColor: "#f97316", color: "#f97316" }, borderRadius: 3, px: 4, textTransform: "none" }}>
                    Our Story
                  </Button>
                </Link>
              )}
            </div>
          </div>
          {/* Hero visual */}
          <div className="hidden md:flex items-center justify-center gap-4 flex-wrap">
            {["⚽", "🏀", "🎾", "🏋️", "🚴", "🏊"].map((emoji, i) => (
              <div key={i}
                className="w-20 h-20 rounded-2xl bg-slate-700/60 border border-slate-600 flex items-center justify-center text-4xl hover:scale-110 transition-transform cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}>
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Bar */}
      <section className="bg-slate-800 border-y border-slate-700 py-6 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {perks.map((p, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="text-orange-400">{p.icon}</div>
              <div>
                <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>{p.title}</Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>{p.desc}</Typography>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 8, textAlign: "center" }}>
            Shop by <span style={{ color: "#f97316" }}>Category</span>
          </Typography>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.label} href={`/products?category=${encodeURIComponent(cat.label)}`} className="no-underline group">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-orange-500 hover:bg-slate-700/60 transition-all">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                  <Typography variant="subtitle2" sx={{ color: "#e2e8f0", fontWeight: 700 }}>{cat.label}</Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>{cat.count} items</Typography>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6 bg-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Featured <span style={{ color: "#f97316" }}>Products</span>
            </Typography>
            <Link href="/products">
              <Button endIcon={<ArrowForwardIcon />} sx={{ color: "#f97316", textTransform: "none" }}>View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <Typography sx={{ color: "#94a3b8" }}>Loading products...</Typography>
            ) : (
              products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-3xl mx-auto text-center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff", mb: 2 }}>
            Ready to Take Your Game to the Next Level?
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", mb: 4 }}>
            Join 50,000+ athletes who trust SkySports for their training gear.
          </Typography>
          <Link href="/products">
            <Button variant="contained" size="large"
              sx={{ bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" }, borderRadius: 3, px: 6, textTransform: "none", fontWeight: 700 }}>
              Explore All Products
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
