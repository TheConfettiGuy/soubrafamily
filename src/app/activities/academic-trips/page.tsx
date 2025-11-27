import Footer from "@/app/components/footer";
import LightboxGallery from "@/app/components/LightboxGallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import academicTripsData from "@/data/academic-trips.json";

export const runtime = "nodejs";

// ----- Types -----
type Category = {
  id: string;
  folder: string;
  label: string;
  visible?: boolean;
};
type SearchParams = Record<string, string | string[] | undefined>;

type AcademicTripsJSON = {
  title: string;
  subtitle?: string;
  categories: Category[];
};

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

function getQueryCat(sp?: SearchParams): string | undefined {
  const raw = sp?.cat;
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

// ----- Page -----
export default async function AcademicTripsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const data = academicTripsData as AcademicTripsJSON;
  const allCategories = (data.categories || []).filter(
    (c) => c.visible !== false
  );

  if (!allCategories.length) return notFound();

  const sp = (await searchParams) ?? {};

  const validFolders = allCategories.map((c) => c.folder);
  const queryCat = getQueryCat(sp);

  const selectedFolder = validFolders.includes(queryCat ?? "")
    ? (queryCat as string)
    : allCategories[0].folder;

  const current =
    allCategories.find((c) => c.folder === selectedFolder) ?? allCategories[0];

  const images = listAlbumImagesFromFolder(current.folder);

  const headerLabel =
    current.label || current.folder.match(/\d{4}/)?.[0] || current.folder;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{data.title}</h1>
          {data.subtitle && (
            <p className="text-xl text-gray-300 mt-4 text-right italic">
              {data.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Category Switcher */}
      <div className="bg-white border border-main-100 py-10">
        <div className="container mx-auto px-4 flex flex-wrap gap-3">
          {allCategories.map((cat) => {
            const active = cat.folder === selectedFolder;
            return (
              <Link
                key={cat.id || cat.folder}
                href={`?cat=${encodeURIComponent(cat.folder)}`}
                prefetch={false}
                scroll={false}
                replace
                aria-current={active ? "page" : undefined}
                className={[
                  "px-6 py-4 transition-colors border",
                  active
                    ? "bg-main-100 text-white border-main-100"
                    : "bg-white text-main-100 border-main-100 hover:bg-main-100 hover:text-white",
                ].join(" ")}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-8">
        <section>
          <LightboxGallery images={images} yearLabel={headerLabel} />
        </section>
      </div>

      <Footer />
    </div>
  );
}
