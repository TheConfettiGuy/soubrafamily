import fs from "node:fs/promises";
import path from "node:path";
import RulesAdminClient from "./ui/rules-client";
import Footer from "@/app/components/footer";

const DATA_PATH = path.join(process.cwd(), "src", "data", "rules.json");

export const runtime = "nodejs";

export default async function RulesAdminPage() {
  let initialData: any = {
    title: "",
    subtitle: "",
    associationName: "",
    articles: [],
    amendment: undefined,
    comparison: undefined,
    extraBlocks: [],
  };

  try {
    const file = await fs.readFile(DATA_PATH, "utf8");
    initialData = JSON.parse(file);
  } catch (err) {
    console.error("Could not read rules.json, using fallback:", err);
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">
          إدارة صفحة النظام الأساسي
        </h1>
        <RulesAdminClient initialData={initialData} />
      </main>
      <Footer/>
    </div>
  );
}
