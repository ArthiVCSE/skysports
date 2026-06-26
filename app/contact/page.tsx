"use client";
import { useState } from "react";
import { Typography, TextField, Button, Chip, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const contactInfo = [
  { icon: <LocationOnIcon />, label: "Address", value: "123 Sport Ave, Athletic City, AC 10001" },
  { icon: <PhoneIcon />, label: "Phone", value: "+1 (555) 000-1234" },
  { icon: <EmailIcon />, label: "Email", value: "support@skysports.com" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#1e293b", color: "#e2e8f0", borderRadius: 2,
      "& fieldset": { borderColor: "#334155" },
      "&:hover fieldset": { borderColor: "#f97316" },
      "&.Mui-focused fieldset": { borderColor: "#f97316" },
    },
    "& .MuiInputLabel-root": { color: "#64748b" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
  };

  return (
    <main className="bg-slate-900 min-h-screen text-white">
      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Chip label="Get in Touch" sx={{ bgcolor: "#1e293b", color: "#f97316", mb: 3, fontWeight: 600 }} />
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
          Contact <span style={{ color: "#f97316" }}>Us</span>
        </Typography>
        <Typography sx={{ color: "#94a3b8", maxWidth: 500, mx: "auto" }}>
          Have a question or feedback? We'd love to hear from you.
        </Typography>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 6 }}>Reach Out</Typography>
            <div className="space-y-6">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="text-orange-400 mt-0.5">{c.icon}</div>
                  <div>
                    <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>{c.label}</Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>{c.value}</Typography>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-10 bg-slate-800 border border-slate-700 rounded-2xl h-64 overflow-hidden relative">
              <iframe
                title="map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.015,40.710,-73.995,40.720&amp;layer=mapnik&amp;marker=40.715,-74.005"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 6 }}>Send a Message</Typography>
            {submitted ? (
              <Alert severity="success" sx={{ bgcolor: "#14532d", color: "#4ade80", borderRadius: 2 }}>
                ✅ Message sent! We'll get back to you within 24 hours.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Name" required fullWidth value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} sx={fieldSx} />
                  <TextField label="Email" type="email" required fullWidth value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} sx={fieldSx} />
                </div>
                <TextField label="Subject" required fullWidth value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })} sx={fieldSx} />
                <TextField label="Message" required fullWidth multiline rows={5} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} sx={fieldSx} />
                <Button type="submit" variant="contained" fullWidth endIcon={<SendIcon />} size="large"
                  sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 3, textTransform: "none", fontWeight: 700, mt: 1 }}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
