import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IASD Central de Hualqui",
  description: "Sitio web oficial de la Iglesia Adventista del Séptimo Día Central de Hualqui",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col justify-between bg-slate-50 relative">
        <main className="flex-1">{children}</main>
        {/* ✅ Única instancia global del Footer */}
        <Footer />
        {/* ✅ Chatbot Esperanza Flotante 24/7 */}
        <ChatWidget />
      </body>
    </html>
  );
}