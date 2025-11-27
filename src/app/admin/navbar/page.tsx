import AdminNavbarClient from "@/app/admin/navbar/ui/admin-navbar-client";
import Footer from "@/app/components/footer";
import { readFile } from "node:fs/promises";
import path from "node:path";

async function getNavbarData() {
  const p = path.join(process.cwd(), "src", "data", "navbar.json");
  const raw = await readFile(p, "utf-8");
  return JSON.parse(raw);
}

export default async function AdminNavbarPage() {
  const data = await getNavbarData();
  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between py-10">
          <h1 className="text-2xl font-semibold">تحرير شريط التنقّل</h1>
        </header>
        <AdminNavbarClient initialData={data} />
      </main>
      <Footer />
    </div>
  );
}
