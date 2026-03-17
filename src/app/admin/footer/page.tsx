import Footer from "@/app/components/footer";
import fs from "node:fs/promises";
import path from "node:path";
import ClientPage from "./ui/ClientPage";

export const runtime = "nodejs";

export default async function FooterAdminPage() {
  const file = path.join(process.cwd(), "src", "data", "footer.json");
  const raw = await fs.readFile(file, "utf8");
  const json = JSON.parse(raw);

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">إدارة ذيل الصفحة</h1>
        <ClientPage initialData={json} />
      </main>
      <Footer />
    </div>
  );
}
