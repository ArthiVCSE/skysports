"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    imageUrl: "",
    emoji: "",
  });

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

  const handleOpen = (product?: any) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        imageUrl: product.imageUrl || "",
        emoji: product.emoji || "",
      });
    } else {
      setEditProduct(null);
      setFormData({ name: "", category: "", price: "", imageUrl: "", emoji: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProduct(null);
  };

  const handleSave = async () => {
    const method = editProduct ? "PUT" : "POST";
    const url = editProduct ? `/api/products/${editProduct.id}` : "/api/products";
    const body = {
      ...formData,
      price: Number(formData.price),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchProducts();
        handleClose();
      } else {
        alert("Failed to save product");
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
        <Button onClick={() => handleOpen()} variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" } }}>
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
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center text-2xl bg-slate-800 rounded">{p.emoji}</div>
                  )}
                </TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>{p.name}</TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>{p.category}</TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>₹{p.price}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #334155" }} align="right">
                  <IconButton onClick={() => handleOpen(p)} sx={{ color: "#38bdf8", mr: 1 }} size="small">
                    <EditIcon />
                  </IconButton>
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

      <Dialog open={open} onClose={handleClose} sx={{ "& .MuiDialog-paper": { bgcolor: "#1e293b", color: "#fff", minWidth: 400 } }}>
        <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense" label="Name" fullWidth variant="outlined"
            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#94a3b8" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#334155" } } }}
          />
          <TextField
            margin="dense" label="Category" fullWidth variant="outlined"
            value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#94a3b8" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#334155" } } }}
          />
          <TextField
            margin="dense" label="Price (₹)" type="number" fullWidth variant="outlined"
            value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#94a3b8" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#334155" } } }}
          />
          <TextField
            margin="dense" label="Emoji (Optional)" fullWidth variant="outlined"
            value={formData.emoji} onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
            sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#94a3b8" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#334155" } } }}
          />
          <TextField
            margin="dense" label="Image URL (Optional)" fullWidth variant="outlined"
            value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#94a3b8" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#334155" } } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} sx={{ color: "#94a3b8" }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
