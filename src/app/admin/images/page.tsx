import Footer from "@/app/components/footer";
import { listImages } from "./actions";
import ImagesAdminClient from "./ui/images-client";

export const dynamic = "force-dynamic";

export default async function ImagesAdminPage() {
  const tree = await listImages("");

  return (
    <div>
      <main className="container mx-auto px-4 py-8" dir="rtl">
        <ImagesAdminClient initialTree={tree} />
      </main>
      <Footer/>
    </div>
  );
}
