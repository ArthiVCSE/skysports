"use client";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Typography, Card, Box, Button } from "@mui/material";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <Typography sx={{ color: "#94a3b8" }}>Please sign in to view your profile.</Typography>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 6 }}>
          Your <span style={{ color: "#f97316" }}>Profile</span>
        </Typography>

        <Card sx={{ bgcolor: "#1e293b", p: 4, borderRadius: 4, border: "1px solid #334155", mb: 6 }}>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
            <AccountCircleIcon sx={{ fontSize: 64, color: "#f97316" }} />
            <div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>{user.name}</Typography>
              <Typography sx={{ color: "#94a3b8" }}>{user.email}</Typography>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/orders" className="no-underline">
              <Button 
                variant="outlined" 
                startIcon={<ShoppingBagIcon />}
                fullWidth
                sx={{ 
                  borderColor: "#334155", 
                  color: "#e2e8f0", 
                  justifyContent: "flex-start",
                  py: 1.5,
                  "&:hover": { borderColor: "#f97316", color: "#f97316" },
                  textTransform: "none",
                  fontSize: 16
                }}
              >
                View My Orders
              </Button>
            </Link>
            
            <Button 
              variant="text" 
              onClick={handleLogout}
              fullWidth
              sx={{ 
                color: "#ef4444", 
                justifyContent: "flex-start",
                py: 1.5,
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
                textTransform: "none",
                fontSize: 16
              }}
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
