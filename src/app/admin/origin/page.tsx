import AdminOriginClient from "@/app/admin/origin/ui/admin-origin-client";
import Footer from "@/app/components/footer";
import { readFile } from "node:fs/promises";
import path from "node:path";

async function getOriginData() {
  const p = path.join(process.cwd(), "src", "data", "origin.json"); // adjust if needed
  const raw = await readFile(p, "utf-8");
  return JSON.parse(raw);
}

export default async function AdminOriginPage() {
  const data = await getOriginData();
  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between py-10">
          <h1 className="text-2xl font-semibold">تحرير صفحة: أصل آل سوبره</h1>
        </header>
        <AdminOriginClient initialData={data} />
      </div>
      <Footer />
    </main>
  );
}
