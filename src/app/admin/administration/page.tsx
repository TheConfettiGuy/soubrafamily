import fs from "node:fs/promises";
import path from "node:path";
import AdministrationAdminClient from "./ui/administration-client"
import Footer from "@/app/components/footer";

const DATA_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "administration.json"
);

export const runtime = "nodejs";

export default async function AdministrationAdminPage() {
  let initialData: any = {
    title: "",
    subtitle: "",
    boards: [],
  };

  try {
    const file = await fs.readFile(DATA_PATH, "utf8");
    initialData = JSON.parse(file);
  } catch (err) {
    console.error("Could not read administration.json, using fallback:", err);
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">
          إدارة صفحة الهيئات الإدارية
        </h1>
        <AdministrationAdminClient initialData={initialData} />
      </main>
      <Footer />
    </div>
  );
}
