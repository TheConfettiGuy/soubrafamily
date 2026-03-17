import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/navbar";
import "./globals.css";
import AdminRibbon from "./components/admin-ribbon";
import AuthProvider from "./providers/AuthProvider";
import { NotificationCenter } from "./components/notification-center";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soubra Family",
  description: "Soubra Family official website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <AdminRibbon />
          {children}
        </AuthProvider>
        <NotificationCenter />
      </body>
    </html>
  );
}
