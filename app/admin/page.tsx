"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, Card, CardContent, CircularProgress, Chip } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

interface AdminStats {
  productCount: number;
  orderCount: number;
  totalRevenue: number;
  pendingOrders: number;
  activeOrders: number;
  itemsSold: number;
  productsByCategory: { category: string; count: number }[];
  recentOrders: { id: string; totalAmount: number; status: string; createdAt: string; itemCount: number }[];
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fetchStats = () => {
    setStatsLoading(true);
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load dashboard data");
        return res.json();
      })
      .then((data) => {
        if (data.success) setStats(data.stats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setStatsLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (data.user?.role === "admin") {
          setAuthenticated(true);
          fetchStats();
        }
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
      const me = await fetch("/api/auth/me").then((response) => response.json());
      if (me.user?.role === "admin") {
        setAuthenticated(true);
        fetchStats();
      } else {
        setError("Admin access is required");
      }
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#1e293b", color: "#e2e8f0", borderRadius: 2,
      "& fieldset": { borderColor: "#334155" },
      "&.Mui-focused fieldset": { borderColor: "#f97316" },
    },
    "& .MuiInputLabel-root": { color: "#64748b" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
  };

  if (checkingAuth) {
    return <Box className="min-h-screen bg-slate-900 flex items-center justify-center"><CircularProgress sx={{ color: "#f97316" }} /></Box>;
  }

  if (!authenticated) {
    return (
      <Box className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 4 }}>
          Admin <span style={{ color: "#f97316" }}>Login</span>
        </Typography>
        <Card sx={{ bgcolor: "#1e293b", width: "100%", maxWidth: 400, borderRadius: 3, border: "1px solid #334155" }}>
          <CardContent sx={{ p: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <form onSubmit={handleLogin} className="space-y-4">
              <TextField fullWidth label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} sx={fieldSx} />
              <TextField fullWidth label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} sx={fieldSx} />
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 2, textTransform: "none", fontWeight: 700, mt: 2 }}>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const cards = stats ? [
    { label: "Products", value: stats.productCount, sub: "Live catalog items", icon: <InventoryIcon />, color: "#38bdf8" },
    { label: "Orders", value: stats.orderCount, sub: `${stats.activeOrders} active`, icon: <LocalShippingIcon />, color: "#a78bfa" },
    { label: "Revenue", value: `₹${stats.totalRevenue.toFixed(2)}`, sub: "Delivered orders", icon: <PaymentsIcon />, color: "#4ade80" },
    { label: "Pending", value: stats.pendingOrders, sub: `${stats.itemsSold} delivered items`, icon: <PendingActionsIcon />, color: "#fb923c" },
  ] : [];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Dashboard</Typography>
      <Typography sx={{ color: "#94a3b8", mb: 4 }}>Live store performance from products, orders, and delivered revenue.</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {statsLoading && <CircularProgress sx={{ color: "#f97316" }} />}

      {stats && (
        <>
          <Box className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {cards.map((card) => (
              <Card key={card.label} sx={{ bgcolor: "#1e293b", border: "1px solid #334155", borderRadius: 2 }}>
                <CardContent>
                  <Box className="flex items-start justify-between gap-4">
                    <Box>
                      <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{card.label}</Typography>
                      <Typography variant="h4" sx={{ color: "#fff", fontWeight: 900, my: 1 }}>{card.value}</Typography>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>{card.sub}</Typography>
                    </Box>
                    <Box sx={{ color: card.color, bgcolor: "rgba(15,23,42,0.8)", border: "1px solid #334155", borderRadius: 2, p: 1.25, display: "flex" }}>
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card sx={{ bgcolor: "#1e293b", border: "1px solid #334155", borderRadius: 2 }} className="xl:col-span-2">
              <CardContent>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, mb: 3 }}>Recent Orders</Typography>
                <Box className="space-y-3">
                  {stats.recentOrders.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8" }}>No orders yet.</Typography>
                  ) : stats.recentOrders.map((order) => (
                    <Box key={order.id} className="flex items-center justify-between gap-4 border-b border-slate-700 pb-3 last:border-0 last:pb-0">
                      <Box>
                        <Typography sx={{ color: "#e2e8f0", fontWeight: 700 }}>#{order.id.slice(-6).toUpperCase()}</Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>{new Date(order.createdAt).toLocaleString()} • {order.itemCount} items</Typography>
                      </Box>
                      <Box className="text-right">
                        <Typography sx={{ color: "#f97316", fontWeight: 800 }}>₹{Number(order.totalAmount).toFixed(2)}</Typography>
                        <Chip label={order.status.toUpperCase()} size="small" sx={{ bgcolor: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", fontWeight: 700 }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: "#1e293b", border: "1px solid #334155", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, mb: 3 }}>Catalog by Category</Typography>
                <Box className="space-y-3">
                  {stats.productsByCategory.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8" }}>No products yet.</Typography>
                  ) : stats.productsByCategory.map((item) => (
                    <Box key={item.category} className="flex items-center justify-between">
                      <Typography sx={{ color: "#e2e8f0" }}>{item.category}</Typography>
                      <Chip label={item.count} size="small" sx={{ bgcolor: "#f97316", color: "#fff", fontWeight: 800 }} />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </Box>
  );
}
