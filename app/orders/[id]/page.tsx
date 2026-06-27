"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Typography, Card, CircularProgress, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // In a real app, we'd have a specific endpoint for order by ID.
    // For now, reuse the user orders endpoint and filter.
    fetch(`/api/orders/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.orders.find((o: any) => o._id === id);
          setOrder(found);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, id, router]);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><CircularProgress sx={{ color: "#f97316" }} /></div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-slate-300">Order not found.</div>;
  }

  const steps = [
    { label: "Order Placed", icon: <InventoryIcon />, active: true },
    { label: "Processing", icon: <InventoryIcon />, active: order.status !== "pending" },
    { label: "Shipped", icon: <LocalShippingIcon />, active: order.status === "shipped" || order.status === "delivered" },
    { label: "Delivered", icon: <CheckCircleIcon />, active: order.status === "delivered" }
  ];

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-orange-400 mb-8 transition-colors">
          <ArrowBackIcon fontSize="small" /> Back to Orders
        </button>

        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Track Order <span style={{ color: "#f97316" }}>#{order._id.slice(-6).toUpperCase()}</span>
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 6 }}>
          Placed on {new Date(order.createdAt).toLocaleString()}
        </Typography>

        <Card sx={{ bgcolor: "#1e293b", p: 4, borderRadius: 4, border: "1px solid #334155", mb: 6 }}>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>Order Status</Typography>
          
          <div className="flex flex-col md:flex-row justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-700 hidden md:block z-0"></div>
            
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center relative z-10 mb-6 md:mb-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors duration-500
                  ${step.active ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]" : "bg-slate-800 text-slate-500 border-2 border-slate-700"}`}>
                  {step.icon}
                </div>
                <Typography sx={{ color: step.active ? "#fff" : "#64748b", fontWeight: step.active ? 600 : 400, fontSize: "0.9rem" }}>
                  {step.label}
                </Typography>
              </div>
            ))}
          </div>
        </Card>

        <Card sx={{ bgcolor: "#0f172a", p: 4, borderRadius: 4, border: "1px solid #1e293b" }}>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 3 }}>Order Summary</Typography>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <Box sx={{ width: 48, height: 48, bgcolor: "#1e293b", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    🛒
                  </Box>
                  <div>
                    <Typography sx={{ color: "#e2e8f0", fontWeight: 500 }}>Product ID: {item.productId}</Typography>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>Qty: {item.quantity}</Typography>
                  </div>
                </div>
                <Typography sx={{ color: "#fff", fontWeight: 600 }}>₹{item.price * item.quantity}</Typography>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <Typography sx={{ color: "#e2e8f0", fontWeight: 600 }}>Total Amount</Typography>
            <Typography variant="h5" sx={{ color: "#f97316", fontWeight: 900 }}>₹{order.totalAmount}</Typography>
          </div>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", textAlign: "right", mt: 1 }}>
            Payment Method: {order.paymentMethod}
          </Typography>
        </Card>
      </div>
    </main>
  );
}
