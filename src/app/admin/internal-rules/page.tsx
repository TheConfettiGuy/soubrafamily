import fs from "node:fs/promises";
import path from "node:path";
import InternalRulesAdminClient from "./ui/internal-rules-client";
import Footer from "@/app/components/footer";

const DATA_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "internal-rules.json"
);

export const runtime = "nodejs";

export default async function InternalRulesAdminPage() {
  let initialData: any = {
    title: "",
    subtitle: "",
    associationName: "",
    sections: [],
    comparison: undefined,
  };

  try {
    const file = await fs.readFile(DATA_PATH, "utf8");
    initialData = JSON.parse(file);
  } catch (err) {
    console.error("Could not read internal-rules.json, using fallback:", err);
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="">
          <h1 className="text-xl font-semibold mb-4">
            إدارة صفحة النظام الداخلي
          </h1>
          <InternalRulesAdminClient initialData={initialData} />
        </div>
      </main>
      <Footer/>
    </div>
  );
}
