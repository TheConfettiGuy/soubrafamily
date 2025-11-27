import Footer from "@/app/components/footer";
import ClientPage from "./ui/ClientPage";

export default function Page() {



  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">إدارة صفحة شجرة العائلة</h1>
        <ClientPage />
      </main>
      <Footer />
    </div>
  );
}
