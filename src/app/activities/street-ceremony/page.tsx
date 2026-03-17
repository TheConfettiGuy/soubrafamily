import Footer from "@/app/components/footer";
import LightboxGallery from "@/app/components/LightboxGallery";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type SearchParams = Record<string, string | string[] | undefined>;

type StreetCeremonyData = {
  visible?: boolean;
  title: string;
  description?: string;
  tabs?: { text?: string; photos?: string };
  text?: {
    heading?: string;
    visible?: boolean;
    paragraphs?: string[];
  };
  gallery?: {
    heading?: string;
    visible?: boolean;
    folder?: string; // public-relative folder, no leading "/"
  };
};

function readJson(): StreetCeremonyData {
  const p = path.join(process.cwd(), "src", "data", "street-ceremony.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as StreetCeremonyData;
}

function listImagesFromFolder(folder: string): string[] {
  const safeFolder = (folder || "").replace(/^\/+/, "").replace(/\.\./g, "");
  const webBase = `/${safeFolder}`;
  const abs = path.join(process.cwd(), "public", safeFolder);

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

function getView(sp: SearchParams): "text" | "photos" {
  const raw = sp?.view;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "photos" ? "photos" : "text"; // default = text
}

export default async function StreetCeremonyPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const data = readJson();

  if (data.visible === false) return notFound();

  const tabs = {
    text: data.tabs?.text || "النص",
    photos: data.tabs?.photos || "الصور",
  };

  // If text is hidden, fallback to photos (and vice versa)
  const canText = data.text?.visible !== false;
  const canPhotos = data.gallery?.visible !== false;

  let view = getView(sp);
  if (view === "text" && !canText && canPhotos) view = "photos";
  if (view === "photos" && !canPhotos && canText) view = "text";

  const galleryFolder = data.gallery?.folder || "street-ceremony";
  const images = canPhotos ? listImagesFromFolder(galleryFolder) : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{data.title}</h1>
          {data.description && (
            <p className="text-xl text-gray-300 mt-4 text-right italic">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* Category Switcher */}
      {/* <div className="bg-white border border-main-100 py-8">
        <div className="container mx-auto px-4 flex flex-wrap gap-3" dir="rtl">
          {canText && (
            <Link
              href={`?view=text`}
              replace
              scroll={false}
              prefetch={false}
              className={[
                "px-6 py-3 transition-colors border",
                view === "text"
                  ? "bg-main-100 text-white border-main-100"
                  : "bg-white text-main-100 border-main-100 hover:bg-main-100 hover:text-white",
              ].join(" ")}
            >
              {tabs.text}
            </Link>
          )}

          {canPhotos && (
            <Link
              href={`?view=photos`}
              replace
              scroll={false}
              prefetch={false}
              className={[
                "px-6 py-3 transition-colors border",
                view === "photos"
                  ? "bg-main-100 text-white border-main-100"
                  : "bg-white text-main-100 border-main-100 hover:bg-main-100 hover:text-white",
              ].join(" ")}
            >
              {tabs.photos}
            </Link>
          )}
        </div>
      </div> */}

      {/* Content */}
      <div className="container mx-auto px-4 py-10" dir="rtl">
        {view === "text" && canText && (
          <div className="space-y-6">
            {data.text?.heading && (
              <h2 className="text-2xl font-bold text-main-100 text-right">
                {data.text.heading}
              </h2>
            )}

            {(data.text?.paragraphs || []).map((p, i) => (
              <p
                key={i}
                className="text-gray-700 leading-relaxed text-right text-lg"
              >
                {p}
              </p>
            ))}

            {(data.text?.paragraphs || []).length === 0 && (
              <p className="text-gray-500 text-right">لا يوجد نص حالياً.</p>
            )}
          </div>
        )}

        {view === "photos" && canPhotos && (
          <div className="space-y-6">
            {/* {data.gallery?.heading && (
              <h2 className="text-2xl font-bold text-main-100 text-right">
                {data.gallery.heading}
              </h2>
            )} */}

            {images.length > 0 ? (
              <LightboxGallery images={images} yearLabel={data.title} />
            ) : (
              <p className="text-gray-500 text-right">
                لا توجد صور ضمن مجلد: <code>{galleryFolder}</code>
              </p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
