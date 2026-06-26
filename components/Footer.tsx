import Link from "next/link";
import { Box, Typography, Divider } from "@mui/material";
import SportsIcon from "@mui/icons-material/Sports";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#0f172a", color: "#94a3b8", pt: 6, pb: 3, mt: "auto" }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <SportsIcon sx={{ color: "#f97316" }} />
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>
              Sky<span style={{ color: "#f97316" }}>Sports</span>
            </Typography>
          </div>
          <Typography variant="body2">
            Premium sports gear for every athlete. Push your limits with SkySports.
          </Typography>
          <div className="flex gap-3 mt-4">
            {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
              <Icon key={i} sx={{ color: "#64748b", cursor: "pointer", "&:hover": { color: "#f97316" }, transition: "color 0.2s" }} />
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, mb: 2 }}>Quick Links</Typography>
          {[["Home", "/"], ["Products", "/products"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
            <Link key={href} href={href}
              className="block text-slate-400 hover:text-orange-400 text-sm mb-1 no-underline transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, mb: 2 }}>Contact Us</Typography>
          <Typography variant="body2" className="mb-1">📍 123 Sport Ave, Athletic City</Typography>
          <Typography variant="body2" className="mb-1">📞 +1 (555) 000-1234</Typography>
          <Typography variant="body2">✉️ support@skysports.com</Typography>
        </div>
      </div>

      <Divider sx={{ borderColor: "#1e293b", my: 3 }} />
      <Typography variant="body2" align="center" sx={{ color: "#475569" }}>
        © {new Date().getFullYear()} SkySports. All rights reserved.
      </Typography>
    </Box>
  );
}
