// src/app/admin/donate/page.tsx
import donateData from "@/data/donate.json";
import ClientPage from "./ui/ClientPage";
import Footer from "@/app/components/footer";

export const dynamic = "force-dynamic";

export default function DonateAdminPage() {
  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">إدارة صفحة التبرع</h1>
        <ClientPage initialData={donateData} />
      </main>
      <Footer />
    </div>
  );
}
