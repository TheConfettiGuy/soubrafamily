import honoringData from "@/data/honoring.json";
import ClientPage from "./ui/ClientPage";
import { listHonoringImages } from "./actions";
import Footer from "@/app/components/footer";

export const dynamic = "force-dynamic";

export default async function Page() {
  const allImages = await listHonoringImages();

  return (

    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">إدارة صفحة التكريم</h1>
        <ClientPage initialData={honoringData as any} allImages={allImages} />
      </main>
      <Footer />
    </div>
  )
}
