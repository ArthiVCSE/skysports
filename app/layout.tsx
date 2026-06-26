import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SkySports — Premium Sports Gear",
  description: "Premium sports equipment for every athlete.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-900">
        <AppRouterCacheProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
