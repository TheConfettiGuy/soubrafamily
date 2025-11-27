import AdminLogoutButton from "@/app/components/admin-logout-button";
import { ADMIN_LINKS } from "@/config/admin-links";
import { cookies } from "next/headers";
import Link from "next/link";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminRibbon() {
  const c = await cookies();
  const authed = c.get("ADMIN_AUTH")?.value === "1";
  if (!authed) return null;

  return (
    <div dir="rtl" className="bg-blue-50 border-b border-blue-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-yellow-800">
          وضع الإدارة
        </span>
        <div className="h-4 w-px bg-blue-300" />
        {ADMIN_LINKS.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="text-xs font-semibold px-1 py-1 hover:bg-blue-100 whitespace-nowrap"
          >
            {i.label}
          </Link>
        ))}
        <div className="flex-1" />
        <AdminLogoutButton />
      </div>
    </div>
  );
}
