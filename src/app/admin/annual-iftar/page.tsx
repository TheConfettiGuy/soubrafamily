import AnnualIftarAdminClient from "./ui/annual-iftar-client";
import { getAnnualIftar, listPublicImages } from "./actions";
import Footer from "@/app/components/footer";

export const dynamic = "force-dynamic";

export default async function AnnualIftarAdminPage() {
  const [data, allImages] = await Promise.all([
    getAnnualIftar(),
    listPublicImages(), // returns string[]
  ]);

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">إدارة صفحة الإفطار السنوي</h1>
        <AnnualIftarAdminClient initialData={data} allImages={allImages} />
      </main>
      <Footer/>
    </div>
  );
}
