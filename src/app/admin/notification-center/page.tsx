import Footer from "@/app/components/footer";
import fs from "node:fs/promises";
import path from "node:path";
import NotificationsAdminClient, { NotificationsConfig } from "./ui/ClientPage";

export const runtime = "nodejs";

async function loadNotificationsConfig(): Promise<NotificationsConfig> {
  const full = path.join(process.cwd(), "src", "data", "notifications.json");
  const raw = await fs.readFile(full, "utf8");
  return JSON.parse(raw) as NotificationsConfig;
}

export default async function NotificationsAdminPage() {
  const initialData = await loadNotificationsConfig();

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">
          لوحة التحكم – مركز الإشعارات
        </h1>
        <NotificationsAdminClient initialData={initialData} />
      </main>
      <Footer />
    </div>
  );
}
