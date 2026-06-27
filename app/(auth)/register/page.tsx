"use client";
import { useState } from "react";
import Link from "next/link";
import { Typography, TextField, Button, Divider, Alert, IconButton, InputAdornment, LinearProgress } from "@mui/material";
import SportsIcon from "@mui/icons-material/Sports";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const perks = [
  "🚀 Early access to new drops",
  "💰 Member-only discounts",
  "📦 Free shipping on first order",
  "🏅 Loyalty rewards on every purchase",
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

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const map = [
    { label: "", color: "#1e293b" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#3b82f6" },
    { label: "Strong", color: "#22c55e" },
  ];
  return { score, ...map[score] };
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (strength.score < 2) {
      setError("Please choose a stronger password.");
      return;
    }
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Left — Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 relative">
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
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>Create account</Typography>
          <Typography sx={{ color: "#475569", mb: 4 }}>
            Already have one?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 no-underline font-semibold">
              Sign in
            </Link>
          </Typography>

          {success ? (
            <div className="text-center py-8">
              <div className="text-7xl mb-4">🎉</div>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>You&apos;re in!</Typography>
              <Typography sx={{ color: "#64748b", mb: 4 }}>Account created successfully. Welcome to SkySports!</Typography>
              <Link href="/login">
                <Button variant="contained" sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 3, textTransform: "none", fontWeight: 700, px: 6 }}>
                  Sign in now
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ bgcolor: "#450a0a", color: "#fca5a5", borderRadius: 2, mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  label="Full name"
                  required
                  fullWidth
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  sx={fieldSx}
                />
                <TextField
                  label="Email address"
                  type="email"
                  required
                  fullWidth
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  sx={fieldSx}
                />
                <div>
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
                  {form.password && (
                    <div className="mt-2">
                      <LinearProgress
                        variant="determinate"
                        value={(strength.score / 4) * 100}
                        sx={{
                          height: 4, borderRadius: 2, bgcolor: "#1e293b",
                          "& .MuiLinearProgress-bar": { bgcolor: strength.color, borderRadius: 2 },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: strength.color, mt: 0.5, display: "block" }}>
                        {strength.label}
                      </Typography>
                    </div>
                  )}
                </div>
                <TextField
                  label="Confirm password"
                  type="password"
                  required
                  fullWidth
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  sx={{
                    ...fieldSx,
                    ...(form.confirm && form.confirm !== form.password && {
                      "& .MuiOutlinedInput-root fieldset": { borderColor: "#ef4444 !important" },
                    }),
                  }}
                />

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
                  {loading ? "Creating account..." : "Create account"}
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

              <Typography variant="caption" sx={{ color: "#334155", display: "block", textAlign: "center", mt: 3 }}>
                By creating an account you agree to our{" "}
                <Link href="#" className="text-orange-400 no-underline">Terms</Link> and{" "}
                <Link href="#" className="text-orange-400 no-underline">Privacy Policy</Link>.
              </Typography>
            </>
          )}
        </div>
      </div>

      {/* Right — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-bl from-slate-900 via-orange-950/20 to-slate-900 border-l border-slate-800 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-orange-500/10" />
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full border border-orange-500/10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-orange-500/10" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline z-10 self-end">
          <SportsIcon sx={{ color: "#f97316", fontSize: 32 }} />
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: 900, letterSpacing: 1 }}>
            Sky<span style={{ color: "#f97316" }}>Sports</span>
          </Typography>
        </Link>

        {/* Center content */}
        <div className="z-10">
          <div className="text-8xl mb-6">🥇</div>
          <Typography variant="h3" sx={{ fontWeight: 900, color: "#fff", lineHeight: 1.2, mb: 3 }}>
            Join the<br />
            <span style={{ color: "#f97316" }}>Champions</span><br />
            Club.
          </Typography>
          <div className="space-y-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircleIcon sx={{ color: "#f97316", fontSize: 18 }} />
                <Typography sx={{ color: "#94a3b8", fontSize: 15 }}>{perk}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 z-10">
          <Typography sx={{ color: "#e2e8f0", fontSize: 14, fontStyle: "italic", lineHeight: 1.7, mb: 2 }}>
            &ldquo;SkySports has the best gear I&apos;ve ever trained with. Fast shipping, great quality.&rdquo;
          </Typography>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-lg">
              👤
            </div>
            <div>
              <Typography sx={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Jordan M.</Typography>
              <Typography sx={{ color: "#f97316", fontSize: 11 }}>Pro Athlete</Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
