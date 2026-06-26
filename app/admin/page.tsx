"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, Card, CardContent } from "@mui/material";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(res => {
      if (res.ok) setAuthenticated(true);
    });
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
      setAuthenticated(true);
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

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Dashboard</Typography>
      <Typography sx={{ color: "#94a3b8" }}>Welcome to the admin panel. Select an option from the sidebar to manage your store.</Typography>
    </Box>
  );
}
