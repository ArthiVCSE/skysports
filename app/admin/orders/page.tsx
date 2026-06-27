"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Chip } from "@mui/material";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'processing': return { bg: '#dbeafe', text: '#1e40af' };
      case 'shipped': return { bg: '#f3e8ff', text: '#6b21a8' };
      case 'delivered': return { bg: '#dcfce3', text: '#166534' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  if (loading) return <Typography>Loading orders...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Manage Orders</Typography>

      <TableContainer component={Paper} sx={{ bgcolor: "#1e293b", color: "#fff", border: "1px solid #334155", borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#0f172a" }}>
            <TableRow>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Order ID</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Items</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Total</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Current Status</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                  <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{o._id}</Typography>
                </TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                  {new Date(o.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                  {o.items?.length || 0} items
                </TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155", fontWeight: 700 }}>
                  ₹{o.totalAmount}
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #334155" }}>
                  <Chip 
                    label={o.status.toUpperCase()} 
                    size="small"
                    sx={{ 
                      bgcolor: getStatusColor(o.status).bg, 
                      color: getStatusColor(o.status).text,
                      fontWeight: 700,
                      fontSize: 11
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #334155" }}>
                  <Select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    size="small"
                    sx={{ 
                      bgcolor: "#0f172a", 
                      color: "#e2e8f0", 
                      borderRadius: 1, 
                      minWidth: 130,
                      ".MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#64748b" }
                    }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: "#94a3b8", py: 4, borderBottom: "none" }}>No orders found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
