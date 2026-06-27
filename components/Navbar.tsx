"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import {
  AppBar, Toolbar, Typography, IconButton, Badge,
  Drawer, List, ListItem, ListItemText, Box, InputBase, Button,
} from "@mui/material";

import { useAuth } from "@/app/context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import SportsIcon from "@mui/icons-material/Sports";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav>
      <AppBar position="sticky" sx={{ bgcolor: "#0f172a", boxShadow: "none", borderBottom: "1px solid #1e293b" }}>
        <Toolbar className="flex justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <SportsIcon sx={{ color: "#f97316", fontSize: 28 }} />
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, letterSpacing: 1 }}>
              Sky<span style={{ color: "#f97316" }}>Sports</span>
            </Typography>
          </Link>

          {/* Desktop Nav */}
          <Box className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-slate-300 hover:text-orange-400 transition-colors text-sm font-medium no-underline">
                {link.label}
              </Link>
            ))}
          </Box>

          {/* Search Bar */}
          <Box className="hidden md:flex items-center bg-slate-800 rounded-full px-3 py-1 gap-2 flex-1 max-w-xs">
            <SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
            <InputBase placeholder="Search products..." sx={{ color: "#e2e8f0", fontSize: 14, width: "100%" }} />
          </Box>

            {user ? (
              <Box className="flex items-center gap-4">
                <Link href="/profile" className="text-sm text-orange-400 hover:text-orange-300 no-underline font-medium">Profile</Link>
                <Button variant="text" onClick={logout} sx={{ color: "#fff", textTransform: "none", minWidth: "auto", p: 0, fontWeight: 500 }}>Logout</Button>
              </Box>
            ) : (
              <Link href="/login" className="text-sm text-orange-400 hover:text-orange-300 no-underline mr-4 font-medium">Sign In</Link>
            )}

          {/* Cart + Auth + Menu */}
          <Box className="flex items-center gap-1">
            <Box className="hidden md:flex items-center gap-1" />
            <Link href="/cart">
              <IconButton>
                <Badge badgeContent={itemCount} color="error">
                  <ShoppingCartIcon sx={{ color: "#f97316" }} />
                </Badge>
              </IconButton>
            </Link>
            <IconButton className="md:hidden" onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        sx={{ "& .MuiDrawer-paper": { bgcolor: "#0f172a", width: 240 } }}>
        <List className="pt-6">
          {navLinks.map((link) => (
            <ListItem key={link.href} component={Link} href={link.href} onClick={() => setDrawerOpen(false)}>
              <ListItemText primary={link.label} sx={{ color: "#e2e8f0" }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </nav>
  );
}
