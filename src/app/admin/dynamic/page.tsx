import Footer from "@/app/components/footer";
import { getDynamicPage } from "./actions";
import DynamicAdminClient from "./ui/dynamic-client";

export const dynamic = "force-dynamic";

export default async function DynamicAdminPage() {
  const data = await getDynamicPage();

  return (
    <div>
      <main className="container mx-auto px-4 py-8" dir="rtl">
        <h1 className="text-2xl font-bold mb-6">الصفحة الديناميكية</h1>
        <DynamicAdminClient initialData={data} />
      </main>
      <Footer />
    </div>
  );
}
