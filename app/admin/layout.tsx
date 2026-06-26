"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Button, CircularProgress } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) setAuthenticated(true);
        else if (pathname !== "/admin") router.push("/admin");
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    router.push("/admin");
  };

  if (loading) return <Box className="min-h-screen bg-slate-900 flex items-center justify-center"><CircularProgress sx={{ color: "#f97316" }} /></Box>;

  // If not authenticated and we are on /admin, we just render children (which will be the login page)
  if (!authenticated) {
    return <>{children}</>;
  }

  const menu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Products", icon: <InventoryIcon />, path: "/admin/products" },
    { text: "Messages", icon: <EmailIcon />, path: "/admin/messages" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#0f172a", color: "#fff" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#1e293b",
            color: "#fff",
            borderRight: "1px solid #334155"
          },
        }}
      >
        <Box sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Sky<span style={{ color: "#f97316" }}>Admin</span>
          </Typography>
        </Box>
        <List>
          {menu.map((item) => {
            const active = pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
                <Link href={item.path} className="w-full no-underline">
                  <Button fullWidth sx={{ 
                    justifyContent: "flex-start", 
                    color: active ? "#fff" : "#94a3b8", 
                    bgcolor: active ? "#f97316" : "transparent",
                    textTransform: "none",
                    fontWeight: active ? 700 : 500,
                    borderRadius: 2,
                    "&:hover": { bgcolor: active ? "#ea580c" : "#334155" }
                  }}>
                    <Box sx={{ mr: 2, display: "flex" }}>{item.icon}</Box>
                    {item.text}
                  </Button>
                </Link>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ mt: "auto", p: 2 }}>
          <Button fullWidth onClick={handleLogout} sx={{ color: "#ef4444", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "rgba(239,68,68,0.1)" } }}>
            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} /> Logout
          </Button>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: "#0f172a" }}>
        {children}
      </Box>
    </Box>
  );
}
