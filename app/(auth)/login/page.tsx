"use client";
import { useState } from "react";
import Link from "next/link";
import { Typography, TextField, Button, Divider, Alert, IconButton, InputAdornment } from "@mui/material";
import SportsIcon from "@mui/icons-material/Sports";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const floatingItems = [
  { emoji: "⚽", top: "10%", left: "15%", size: "text-5xl", delay: "0s" },
  { emoji: "🏀", top: "25%", right: "10%", size: "text-4xl", delay: "0.3s" },
  { emoji: "🎾", top: "55%", left: "8%", size: "text-3xl", delay: "0.6s" },
  { emoji: "🏋️", bottom: "20%", right: "15%", size: "text-5xl", delay: "0.9s" },
  { emoji: "🚴", bottom: "10%", left: "25%", size: "text-4xl", delay: "1.2s" },
  { emoji: "🏊", top: "70%", right: "5%", size: "text-3xl", delay: "1.5s" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#0f172a",
    color: "#e2e8f0",
    borderRadius: 2,
    "& fieldset": { borderColor: "#1e293b" },
    "&:hover fieldset": { borderColor: "#f97316" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "#475569" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    if (form.email !== "demo@skysports.com") {
      setError("Invalid credentials. Try demo@skysports.com");
    }
  };

  return (
    <>
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-900 via-orange-950/20 to-slate-900 border-r border-slate-800 p-12 relative overflow-hidden">
        {/* Floating sports emojis */}
        {floatingItems.map((item, i) => (
          <span
            key={i}
            className={`absolute ${item.size} opacity-20 select-none`}
            style={{
              top: item.top,
              bottom: item.bottom,
              left: item.left,
              right: item.right,
              animation: `float 4s ease-in-out ${item.delay} infinite alternate`,
            }}
          >
            {item.emoji}
          </span>
        ))}

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline z-10">
          <SportsIcon sx={{ color: "#f97316", fontSize: 32 }} />
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: 900, letterSpacing: 1 }}>
            Sky<span style={{ color: "#f97316" }}>Sports</span>
          </Typography>
        </Link>

        {/* Center content */}
        <div className="z-10">
          <div className="text-8xl mb-6">🏆</div>
          <Typography variant="h3" sx={{ fontWeight: 900, color: "#fff", lineHeight: 1.2, mb: 3 }}>
            Welcome<br />
            <span style={{ color: "#f97316" }}>Back,</span><br />
            Champion.
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 16, lineHeight: 1.8 }}>
            Your gear is waiting. Log in to track orders,<br />
            manage your wishlist, and shop the latest drops.
          </Typography>
        </div>

        {/* Stats row */}
        <div className="flex gap-8 z-10">
          {[["50K+", "Athletes"], ["4.8★", "Rating"], ["30+", "Countries"]].map(([val, label]) => (
            <div key={label}>
              <Typography sx={{ color: "#f97316", fontWeight: 900, fontSize: 20 }}>{val}</Typography>
              <Typography sx={{ color: "#475569", fontSize: 12 }}>{label}</Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 relative">
        {/* Back button */}
        <Link href="/" className="no-underline absolute top-8 left-8">
          <IconButton sx={{ color: "#475569", "&:hover": { color: "#f97316", bgcolor: "#1e293b" } }}>
            <ArrowBackIcon />
          </IconButton>
        </Link>

        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <SportsIcon sx={{ color: "#f97316", fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
            Sky<span style={{ color: "#f97316" }}>Sports</span>
          </Typography>
        </div>

        <div className="max-w-md w-full mx-auto">
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>Sign in</Typography>
          <Typography sx={{ color: "#475569", mb: 5 }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 no-underline font-semibold">
              Create one
            </Link>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ bgcolor: "#450a0a", color: "#fca5a5", borderRadius: 2, mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Email address"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              sx={fieldSx}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              sx={fieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "#475569" }}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />

            <div className="flex justify-end">
              <Link href="#" className="text-sm text-orange-400 hover:text-orange-300 no-underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                bgcolor: "#f97316",
                "&:hover": { bgcolor: "#ea580c" },
                "&:disabled": { bgcolor: "#7c2d12", color: "#9a3412" },
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 16,
                py: 1.5,
                mt: 1,
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <Divider sx={{ borderColor: "#1e293b", my: 4 }}>
            <Typography sx={{ color: "#334155", fontSize: 13, px: 2 }}>or continue with</Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            size="large"
            sx={{
              borderColor: "#1e293b",
              color: "#94a3b8",
              "&:hover": { borderColor: "#334155", bgcolor: "#0f172a" },
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
            }}
          >
            Continue with Google
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </>
  );
}
