"use client";
import { useState, useEffect, useMemo } from "react";
import { Typography, Chip, InputBase, Box, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard, { Product } from "@/components/ProductCard";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["All", ...Array.from(cats)];
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

  const filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <main className="bg-slate-900 min-h-screen text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            All <span style={{ color: "#f97316" }}>Products</span>
          </Typography>
          <Typography sx={{ color: "#64748b" }}>
            {loading ? "Loading..." : `${filtered.length} products found`}
          </Typography>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <Box className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 gap-2 flex-1 max-w-sm">
            <SearchIcon sx={{ color: "#64748b", fontSize: 20 }} />
            <InputBase
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ color: "#e2e8f0", fontSize: 14, width: "100%" }}
            />
          </Box>

          {/* Sort */}
          <Select value={sort} onChange={(e) => setSort(e.target.value)} size="small"
            sx={{ bgcolor: "#1e293b", color: "#e2e8f0", borderRadius: 2, minWidth: 160, ".MuiOutlinedInput-notchedOutline": { borderColor: "#334155" } }}>
            <MenuItem value="default">Sort: Default</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="rating">Top Rated</MenuItem>
          </Select>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <Chip key={cat} label={cat} onClick={() => setActiveCategory(cat)}
              sx={{
                bgcolor: activeCategory === cat ? "#f97316" : "#1e293b",
                color: activeCategory === cat ? "#fff" : "#94a3b8",
                border: "1px solid",
                borderColor: activeCategory === cat ? "#f97316" : "#334155",
                fontWeight: activeCategory === cat ? 700 : 400,
                cursor: "pointer",
                "&:hover": { bgcolor: activeCategory === cat ? "#ea580c" : "#334155" },
              }}
            />
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-24">
            <Typography sx={{ color: "#64748b", mt: 2 }}>Loading products...</Typography>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl">🔍</span>
            <Typography sx={{ color: "#64748b", mt: 2 }}>No products found.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
