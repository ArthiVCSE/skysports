"use client";
import Link from "next/link";
import { Card, CardContent, CardActions, Button, Typography, Chip, Rating, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  badge?: string;
  imageUrl?: string;
  emoji?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Card sx={{
      bgcolor: "#1e293b", color: "#e2e8f0", borderRadius: 3, border: "1px solid #334155",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(249,115,22,0.15)" },
      position: "relative", overflow: "visible",
    }}>
      {product.badge && (
        <Chip label={product.badge} size="small"
          sx={{ position: "absolute", top: 12, left: 12, bgcolor: "#f97316", color: "#fff", fontWeight: 700, zIndex: 1 }} />
      )}
      <IconButton size="small" sx={{ position: "absolute", top: 8, right: 8, color: "#64748b", "&:hover": { color: "#f43f5e" } }}>
        <FavoriteBorderIcon fontSize="small" />
      </IconButton>

      {/* Product Visual */}
      <div className="flex items-center justify-center h-44 bg-slate-700/40 rounded-t-xl overflow-hidden relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <div className="text-slate-500">No Image</div>
        )}
      </div>

      <CardContent sx={{ pb: 1 }}>
        <Chip label={product.category} size="small"
          sx={{ bgcolor: "#0f172a", color: "#94a3b8", fontSize: 11, mb: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}>
          {product.name}
        </Typography>
        <div className="flex items-center gap-2 mb-1">
          <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ color: "#f97316" }} />
          <Typography variant="caption" sx={{ color: "#64748b" }}>({product.reviews})</Typography>
        </div>
        <div className="flex items-center gap-2">
          <Typography variant="h6" sx={{ color: "#f97316", fontWeight: 800 }}>₹{product.price}</Typography>
          {product.originalPrice && (
            <Typography variant="body2" sx={{ color: "#64748b", textDecoration: "line-through" }}>
              ₹{product.originalPrice}
            </Typography>
          )}
          {discount && <Chip label={`-${discount}%`} size="small" sx={{ bgcolor: "#14532d", color: "#4ade80", fontSize: 11 }} />}
        </div>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button variant="contained" size="small" startIcon={<ShoppingCartIcon />}
          sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 2, flex: 1, textTransform: "none", fontWeight: 600 }}>
          Add to Cart
        </Button>
        <Link href={`/products/${product.id}`} className="no-underline flex-1">
          <Button variant="outlined" size="small" fullWidth
            sx={{ borderColor: "#334155", color: "#e2e8f0", "&:hover": { borderColor: "#f97316", color: "#f97316" }, borderRadius: 2, textTransform: "none" }}>
            View
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
