"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function AdminLogoutPage() {
  useEffect(() => {
    // hit NON-/admin endpoint so middleware doesn't re-set the cookie
    fetch("/api/admin/clear-cookie", { method: "POST", credentials: "include" })
      .catch(() => {})
      .finally(() => {
        // sign out NextAuth and go wherever you prefer
        signOut({ callbackUrl: "/" });
      });
  }, []);

  return (
    <div dir="rtl" className="p-6">
      <p>جاري تسجيل الخروج...</p>
    </div>
  );
}
