import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientProviders from "@/app/components/ClientProviders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkySports — Premium Sports Gear",
  description: "Premium sports equipment for every athlete.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-900">
        <ClientProviders>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
