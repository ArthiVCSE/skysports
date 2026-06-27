"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { Typography, Card, CardContent, CircularProgress, Chip } from "@mui/material";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetch(`/api/orders/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return <div className="p-8 text-center text-slate-300">Please sign in to view your orders.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-300"><CircularProgress sx={{ color: "#f97316" }} /></div>;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 4 }}>
          Your <span style={{ color: "#f97316" }}>Orders</span>
        </Typography>

        {orders.length === 0 ? (
          <Typography sx={{ color: "#94a3b8" }}>You haven't placed any orders yet.</Typography>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link href={`/orders/${order._id}`} key={order._id} className="block no-underline">
                <Card sx={{ 
                  bgcolor: "#1e293b", 
                  color: "#fff", 
                  borderRadius: 3,
                  border: "1px solid #334155",
                  transition: "all 0.3s ease",
                  "&:hover": { borderColor: "#f97316", transform: "translateY(-2px)" }
                }}>
                  <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Order #{order._id.slice(-6).toUpperCase()}</Typography>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-6">
                      <Typography variant="h6" sx={{ color: "#f97316", fontWeight: 700 }}>
                        ₹{order.totalAmount}
                      </Typography>
                      <Chip 
                        label={order.status.toUpperCase()} 
                        sx={{ 
                          bgcolor: order.status === "delivered" ? "#065f46" : "#7c2d12",
                          color: "#fff",
                          fontWeight: 600
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
