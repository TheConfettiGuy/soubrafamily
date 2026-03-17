import fs from "node:fs/promises";
import path from "node:path";
import AdminHomeClient, { HeroData, WelcomeData } from "./ui/ClientPage";
import Footer from "../components/footer";

export const runtime = "nodejs";

async function loadJson<T>(relPath: string): Promise<T> {
  const full = path.join(process.cwd(), "src", "data", relPath);
  const raw = await fs.readFile(full, "utf8");
  return JSON.parse(raw) as T;
}

export default async function AdminPage() {
  const hero = await loadJson<HeroData>("hero.json");
  const welcome = await loadJson<WelcomeData>("welcoming-letter.json");

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">إدارة صفحةالرئيسية</h1>
        <AdminHomeClient initialHero={hero} initialWelcome={welcome} />
      </main>
      <Footer />
    </div>
  );
}
