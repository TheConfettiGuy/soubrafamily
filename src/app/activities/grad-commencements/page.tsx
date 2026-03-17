import Footer from "@/app/components/footer";
import LightboxGallery from "@/app/components/LightboxGallery";
import graduationData from "@/data/graduation.json";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import YearSelector from "./YearSelector"; // 👈 NEW

export const runtime = "nodejs";

type YearList = { key: string; title: string; names: string[] };
type YearBlock = { year: string; lists: YearList[]; visible?: boolean };
type GraduationJSON = { years: YearBlock[] };

type SearchParams =
  | { [key: string]: string | string[] | undefined }
  | undefined;

// ---------- Config ----------
const IMG_BASE = "graduation";

// ---------- Utils ----------
function getQueryYear(sp: SearchParams): string | undefined {
  const raw = sp?.y;
  return Array.isArray(raw) ? raw[0] : raw;
}

function getQueryView(sp: SearchParams): "photos" | "lists" {
  const raw = sp?.view;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "photos" ? "photos" : "lists"; // ✅ default = lists
}

function listAlbumImagesByYear(year: string): string[] {
  const webBase = `/${IMG_BASE}/${year}`;
  const abs = path.join(process.cwd(), "public", IMG_BASE, year);

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

// ---------- Page ----------
export default async function GraduationPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};

  const data = (graduationData as GraduationJSON) || { years: [] };

  if (!data.years?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        ملف التخريج غير موجود أو فارغ.
      </div>
    );
  }

  const visibleYears = data.years.filter((y) => y.visible !== false);

  if (!visibleYears.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        لا توجد دفعات متاحة للعرض حالياً.
      </div>
    );
  }

  // newest first – same as before
  const yearsSorted = [...visibleYears].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  const allYears = yearsSorted.map((y) => y.year);
  const qy = getQueryYear(sp);
  const selectedYear = allYears.includes(qy ?? "")
    ? (qy as string)
    : yearsSorted[0].year;

  const selectedView = getQueryView(sp); // "photos" | "lists"

  const current = yearsSorted.find((y) => y.year === selectedYear)!;

  const images = listAlbumImagesByYear(selectedYear);
  const nonEmptyLists = (current.lists || []).filter(
    (lst) => lst.names?.length
  );

  const photosTabHref = `?y=${encodeURIComponent(selectedYear)}&view=photos`;
  const listsTabHref = `?y=${encodeURIComponent(selectedYear)}&view=lists`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            حفل تكريم طلاب وطالبات آل سوبره وأنسبائهم المتخرجين عام {selectedYear}
          </h1>
        </div>
      </div>

      {/* Controls bar: view tabs + year dropdown */}
      <div className="bg-white border border-main-100 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* View tabs – same style as old buttons */}
          <div className="flex gap-2">
            <Link
              href={listsTabHref}
              prefetch={false}
              scroll={false}
              replace
              className={[
                "px-6 py-3 transition-colors border",
                selectedView === "lists"
                  ? "bg-main-100 text-white border-main-100"
                  : "bg-white text-main-100 border-main-100 hover:bg-main-100 hover:text-white",
              ].join(" ")}
            >
              اسماء الطلاب
            </Link>
            <Link
              href={photosTabHref}
              prefetch={false}
              scroll={false}
              replace
              className={[
                "px-6 py-3 transition-colors border",
                selectedView === "photos"
                  ? "bg-main-100 text-white border-main-100"
                  : "bg-white text-main-100 border-main-100 hover:bg-main-100 hover:text-white",
              ].join(" ")}
            >
              صور الحفل
            </Link>
          </div>

          {/* Year dropdown (auto-change, no button) */}
          <YearSelector
            years={allYears}
            selectedYear={selectedYear}
            view={selectedView}
          />
        </div>
      </div>

      {/* Images view */}
      {selectedView === "photos" && (
        <div className="container mx-auto px-4 py-8">
          <LightboxGallery images={images} yearLabel={selectedYear} />
          {images.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              لا توجد صور مرفوعة لسنة {selectedYear}.
            </p>
          )}
        </div>
      )}

      {/* Lists view */}
      {selectedView === "lists" && (
        <div className="container mx-auto px-4 pb-12 pt-8">
          <section className="space-y-8">
            {nonEmptyLists.map((lst) => (
              <div key={lst.key} className="border border-main-100 p-6">
                <h2 className="text-2xl font-semibold text-main-100 mb-4 text-right">
                  {lst.title}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-right">
                  {lst.names.map((name, idx) => (
                    <li key={`${lst.key}-${idx}`} className="px-4 py-2 border">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {nonEmptyLists.length === 0 && (
              <p className="text-center text-gray-500">
                لا توجد قوائم معروضة لسنة {selectedYear}.
              </p>
            )}
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
