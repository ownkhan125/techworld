import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import CardConstructProvider from "@/components/CardConstructProvider";
import SnapScrollProvider from "@/components/SnapScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Techworld — Computing fabric for autonomous systems",
  description:
    "Techworld is the compute fabric that powers a new generation of autonomous products. Build, deploy and orchestrate intelligent systems with cinematic clarity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-bg text-fg min-h-dvh flex flex-col">
        <SmoothScrollProvider>
          {/* Animated particle field — sits behind everything */}
          <ParticleBackground particleCount={6500} className="opacity-[0.65]" />
          <Navbar />
          <main className="relative z-[1] flex-1">{children}</main>
          <Footer />
          <CustomCursor />
          <CardConstructProvider />
          <SnapScrollProvider />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
