import { Typography, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import StarIcon from "@mui/icons-material/Star";

const stats = [
  { icon: <EmojiEventsIcon />, value: "12+", label: "Years of Excellence" },
  { icon: <GroupsIcon />, value: "50K+", label: "Happy Athletes" },
  { icon: <PublicIcon />, value: "30+", label: "Countries Served" },
  { icon: <StarIcon />, value: "4.8★", label: "Average Rating" },
];

const team = [
  { name: "Alex Carter", role: "Founder & CEO", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFb8FWaRs-Vjnj4x9gd1jJxlch6n4QMwioKjCZDZst6w&s=10" },
  { name: "Maria Silva", role: "Head of Product", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD0XMoUYKBapMwDMjkZ2qkyaCm9EMFa7xq2sopFY5AYW-7XbAaOtGU2Do&s=10" },
  { name: "James Kim", role: "Lead Designer", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuqM5fnB6_lUaMYXl40WBAjoDM4i6p_MyYsfR7lVA6FQ&s=10" },
];

export default function AboutPage() {
  return (
    <main className="bg-slate-900 min-h-screen text-white">
      {/* Hero */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-center">
        <Chip label="Our Story" sx={{ bgcolor: "#1e293b", color: "#f97316", mb: 3, fontWeight: 600 }} />
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>
          Built by Athletes,<br /><span style={{ color: "#f97316" }}>For Athletes</span>
        </Typography>
        <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 400, maxWidth: 600, mx: "auto", lineHeight: 1.8 }}>
          SkySports was founded with one mission — to make elite-grade sports equipment accessible to every athlete, regardless of level.
        </Typography>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-orange-400 flex justify-center mb-2">{s.icon}</div>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff" }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>{s.label}</Typography>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
              Our <span style={{ color: "#f97316" }}>Mission</span>
            </Typography>
            <Typography sx={{ color: "#94a3b8", lineHeight: 1.9, mb: 3 }}>
              We believe every athlete deserves the best tools to perform at their peak. That&apos;s why we source only the highest quality gear — tested by professionals, approved for everyone.
            </Typography>
            <Typography sx={{ color: "#94a3b8", lineHeight: 1.9 }}>
              From weekend warriors to professional athletes, SkySports is your trusted partner in performance, training, and recovery.
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Strength", "Speed", "Precision", "Endurance"].map((v) => (
              <div key={v} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 text-center hover:border-orange-500 transition-colors">
                <Typography sx={{ color: "#e2e8f0", fontWeight: 600 }}>{v}</Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-slate-800/40">
        <div className="max-w-4xl mx-auto text-center">
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, mb: 12 }}
          ></Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {team.map((m) => (
              <div key={m.name} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-orange-500 transition-all flex flex-col items-center">
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-slate-700 relative">
                  <img src={m.imageUrl} alt={m.name} className="object-cover w-full h-full" />
                </div>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{m.name}</Typography>
                <Typography variant="body2" sx={{ color: "#f97316" }}>{m.role}</Typography>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
