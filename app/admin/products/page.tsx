"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Product } from "@/components/ProductCard";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" } }}>
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "#1e293b", color: "#fff", border: "1px solid #334155", borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#0f172a" }}>
            <TableRow>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Image</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Price</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>{p.id}</TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                  <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded" />
                </TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>{p.name}</TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>{p.category}</TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>₹{p.price}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #334155" }} align="right">
                  <IconButton onClick={() => handleDelete(p.id)} sx={{ color: "#ef4444" }} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: "#94a3b8", py: 4, borderBottom: "none" }}>No products found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
