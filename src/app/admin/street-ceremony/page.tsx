import StreetCeremonyAdminClient from "./ui/street-ceremony-client";
import { getStreetCeremony, listPublicImages } from "./actions";
import Footer from "@/app/components/footer";

export const dynamic = "force-dynamic";

export default async function StreetCeremonyAdminPage() {
  const [data, allImages] = await Promise.all([
    getStreetCeremony(),
    listPublicImages(),
  ]);

  return (

    <main>
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between py-10">
          <h1 className="text-2xl font-semibold">تحرير صفحة: مراسم افتتاح شارع سوبره</h1>
        </header>
        <StreetCeremonyAdminClient initialData={data} allImages={allImages} />
      </div>
      <Footer />
    </main>

  );
}
