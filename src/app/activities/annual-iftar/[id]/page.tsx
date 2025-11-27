import Footer from "@/app/components/footer";
import LightboxGallery from "@/app/components/LightboxGallery";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

// ----- Types -----
type Params = { id: string };
type SearchParams = Record<string, string | string[] | undefined>;

// ----- Utils -----
function listAlbumImagesFromFolder(folder: string): string[] {
  const webBase = `/${folder}`;
  const abs = path.join(process.cwd(), "public", folder);
  try {
    const entries = fs.readdirSync(abs, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && /\.(jpe?g|png|webp|avif|gif)$/i.test(e.name))
      .map((e) => path.posix.join(webBase, e.name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

// ----- Page -----
export default async function AnnualIftarAlbumPage({
  params,
  searchParams,
}: {
  // match your project's PageProps: both props may be Promises
  params?: Promise<Params>;
  searchParams?: Promise<SearchParams>;
}) {
  const p = (await params) ?? { id: "" };
  const sp = (await searchParams) ?? {};

  const id = p.id?.trim();
  if (!id) return notFound();

  // albums are expected under /public/annual-iftar/<id>
  const folder = path.posix.join("annual-iftar", id);
  const images = listAlbumImagesFromFolder(folder);

  if (images.length === 0) {
    // no images found for that id → 404
    return notFound();
  }

  // Try to build a human header from id (fallback to id)
  const pretty =
    id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || id;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 text-right">{pretty}</h1>
          <p className="text-lg text-gray-200 text-right">
            ألبوم "الإفطار السنوي" — {id}
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-8">
        <section>
          <LightboxGallery images={images} yearLabel={pretty} />
        </section>
      </div>

      <Footer />
    </div>
  );
}
