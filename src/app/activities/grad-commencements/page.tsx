import Footer from "@/app/components/footer";
import LightboxGallery from "@/app/components/LightboxGallery";
import graduationData from "@/data/graduation.json"; // ✅ JSON via @ alias
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs"; // allow fs on server

type YearList = { key: string; title: string; names: string[] };
type YearBlock = { year: string; lists: YearList[]; visible?: boolean }; // 👈 add visible
type GraduationJSON = { years: YearBlock[] };

type SearchParams =
  | { [key: string]: string | string[] | undefined }
  | undefined;

// ---------- Config ----------
const IMG_BASE = "graduation"; // images under: /public/graduation/<year>/

// ---------- Utils ----------
function getQueryYear(sp: SearchParams): string | undefined {
  const raw = sp?.y; // ?y=2024
  return Array.isArray(raw) ? raw[0] : raw;
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
    // folder not found or empty
    return [];
  }
}

// ---------- Page ----------
export default async function GraduationPage({
  searchParams,
}: {
  // IMPORTANT: match your project's PageProps (Promise-based searchParams)
  searchParams?: Promise<SearchParams>;
}) {
  // Await the promised searchParams before accessing properties
  const sp = (await searchParams) ?? {};

  const data = (graduationData as GraduationJSON) || { years: [] };

  if (!data.years?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        ملف التخريج غير موجود أو فارغ.
      </div>
    );
  }

  // ✅ Only show years that are not explicitly hidden (visible === false)
  const visibleYears = data.years.filter((y) => y.visible !== false);

  if (!visibleYears.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        لا توجد دفعات متاحة للعرض حالياً.
      </div>
    );
  }

  // Sort newest year first
  const yearsSorted = [...visibleYears].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  // Pick selected year from ?y=YYYY or default to newest
  const allYears = yearsSorted.map((y) => y.year);
  const qy = getQueryYear(sp);
  const selectedYear = allYears.includes(qy ?? "")
    ? (qy as string)
    : yearsSorted[0].year;

  const current = yearsSorted.find((y) => y.year === selectedYear)!;

  // Images first
  const images = listAlbumImagesByYear(selectedYear);

  // Filter out empty lists
  const nonEmptyLists = (current.lists || []).filter(
    (lst) => lst.names?.length
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            تخريج {selectedYear}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            صور الدفعة والقوائم المرافقة — السنة {selectedYear}
          </p>
        </div>
      </div>

      {/* Year Switcher */}
      <div className="bg-white border border-main-100 py-8">
        <div className="container mx-auto px-4 flex flex-wrap gap-3">
          {yearsSorted.map((y) => {
            const active = y.year === selectedYear;
            return (
              <Link
                key={y.year}
                href={`?y=${encodeURIComponent(y.year)}`}
                prefetch={false}
                scroll={false}
                replace
                className={[
                  "px-6 py-3 transition-colors border",
                  active
                    ? "bg-main-100 text-white border-main-100"
                    : "bg-white text-main-100 border-main-100 hover:bg-main-100 hover:text-white",
                ].join(" ")}
              >
                دفعة {y.year}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Images FIRST */}
      <div className="container mx-auto px-4 py-8">
        <LightboxGallery images={images} yearLabel={selectedYear} />
      </div>

      {/* Lists (skip empty) */}
      <div className="container mx-auto px-4 pb-12">
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

      <Footer />
    </div>
  );
}
