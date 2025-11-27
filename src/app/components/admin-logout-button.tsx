"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Clear the ribbon cookie WITHOUT touching /admin/*
      await fetch("/api/admin/clear-cookie", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    // End NextAuth session and leave admin area
    await signOut({ callbackUrl: "/admin" });
  };

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="bg-red-900 text-white cursor-pointer px-3 py-1 text-sm whitespace-nowrap disabled:opacity-60"
    >
      {loading ? "…" : "تسجيل الخروج"}
    </button>
  );
}
