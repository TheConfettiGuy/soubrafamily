"use client";

import { useMemo, useState, useTransition } from "react";
import academicTripsData from "@/data/academic-trips.json";
import { saveAcademicTrips } from "../actions";

/* ---------- Types ---------- */

type Category = {
  id: string;
  folder: string;
  label: string;
  description?: string;
  visible?: boolean;
};

type AcademicTripsData = {
  title: string;
  subtitle?: string;
  categories: Category[];
};

/* ---------- Styles ---------- */

const btn =
  "border border-gray-300 px-3 py-2 text-sm whitespace-nowrap hover:bg-gray-50 cursor-pointer";

const primaryBtn =
  "bg-main-100 text-white text-sm px-5 py-2 cursor-pointer hover:bg-gray-800";

const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";

const smallLabel = "text-xs text-gray-500";

/* ---------- Normalize ---------- */

function normalize(data: any): AcademicTripsData {
  const raw = data as AcademicTripsData;

  return {
    title: raw.title ?? "",
    subtitle: raw.subtitle ?? "",
    categories: (raw.categories || []).map((c, idx) => ({
      id: c.id || `cat_${idx + 1}`,
      folder: c.folder ?? "",
      label: c.label ?? "",
      description: c.description ?? "",
      visible: c.visible === false ? false : true,
    })),
  };
}

/* ---------- Component ---------- */

export default function ClientPage() {
  const [data, setData] = useState<AcademicTripsData>(() =>
    normalize(academicTripsData),
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const categories = data.categories || [];
  const activeCat = categories[activeIdx] ?? categories[0];

  /* ---------- Helpers ---------- */

  const updateRootField = <K extends keyof AcademicTripsData>(
    key: K,
    value: AcademicTripsData[K],
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const setCategories = (updater: (cats: Category[]) => Category[]) => {
    setData((prev) => ({
      ...prev,
      categories: updater(prev.categories || []),
    }));
  };

  const addCategory = () => {
    setCategories((cats) => [
      ...cats,
      {
        id: `cat_${cats.length + 1}`,
        folder: "academic-trips/new-folder",
        label: "عنوان رحلة جديدة",
        description: "",
        visible: true,
      },
    ]);
    setActiveIdx(categories.length);
  };

  const deleteCategory = (index: number) => {
    setCategories((cats) => cats.filter((_, i) => i !== index));
    setActiveIdx((idx) => (idx > 0 ? idx - 1 : 0));
  };

  const moveCategory = (index: number, dir: "up" | "down") => {
    setCategories((cats) => {
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= cats.length) return cats;

      const copy = [...cats];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);

      return copy;
    });

    setActiveIdx((idx) => {
      if (idx !== index) return idx;

      const target = dir === "up" ? idx - 1 : idx + 1;

      if (target < 0) return 0;
      if (target >= categories.length) return categories.length - 1;

      return target;
    });
  };

  const toggleVisible = (index: number) => {
    setCategories((cats) =>
      cats.map((c, i) =>
        i === index ? { ...c, visible: c.visible === false ? true : false } : c,
      ),
    );
  };

  const updateCategoryField = (
    index: number,
    field: keyof Category,
    value: string,
  ) => {
    setCategories((cats) =>
      cats.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  };

  /* ---------- Save ---------- */

  const handleSave = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("payload", jsonString);

        await saveAcademicTrips(fd);

        showToast("تم الحفظ وتحديث الملف بنجاح.");
      } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء الحفظ.");
      }
    });
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header config */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-4">
        <h2 className="text-lg font-medium">إعدادات صفحة الرحلات الأكاديمية</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={smallLabel}>العنوان الرئيسي</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.title}
              onChange={(e) => updateRootField("title", e.target.value)}
            />
          </div>

          <div>
            <label className={smallLabel}>النص تحت العنوان</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.subtitle ?? ""}
              onChange={(e) => updateRootField("subtitle", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={addCategory}>
            + إضافة رحلة جديدة
          </button>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => {
              const active = idx === activeIdx;

              return (
                <button
                  key={cat.id || idx}
                  type="button"
                  className={
                    "border px-3 py-2 text-sm whitespace-nowrap cursor-pointer" +
                    (active ? " bg-gray-200" : " hover:bg-gray-50")
                  }
                  onClick={() => setActiveIdx(idx)}
                >
                  {cat.label || `رحلة ${idx + 1}`}
                </button>
              );
            })}
          </div>
        </div>

        {activeCat && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={btn}
                onClick={() => moveCategory(activeIdx, "up")}
              >
                ↑ للأعلى
              </button>

              <button
                type="button"
                className={btn}
                onClick={() => moveCategory(activeIdx, "down")}
              >
                ↓ للأسفل
              </button>

              <button
                type="button"
                className={btn}
                onClick={() => toggleVisible(activeIdx)}
              >
                {activeCat.visible === false
                  ? "إظهار الرحلة في الموقع"
                  : "إخفاء الرحلة في الموقع"}
              </button>

              <button
                type="button"
                className={redBtn}
                onClick={() => deleteCategory(activeIdx)}
              >
                حذف الرحلة
              </button>
            </div>

            {/* Fields */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={smallLabel}>المعرّف (ID)</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeCat.id}
                  onChange={(e) =>
                    updateCategoryField(activeIdx, "id", e.target.value)
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className={smallLabel}>عنوان الرحلة</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeCat.label}
                  onChange={(e) =>
                    updateCategoryField(activeIdx, "label", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className={smallLabel}>وصف الرحلة</label>

              <textarea
                rows={4}
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                value={activeCat.description ?? ""}
                onChange={(e) =>
                  updateCategoryField(activeIdx, "description", e.target.value)
                }
              />
            </div>

            <div>
              <label className={smallLabel}>
                مسار المجلد داخل <code>public/</code>
              </label>

              <input
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                value={activeCat.folder}
                onChange={(e) =>
                  updateCategoryField(activeIdx, "folder", e.target.value)
                }
              />

              <p className="mt-1 text-[11px] text-gray-500">
                مثال: <code>academic-trips/trips-3</code>
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Save */}
      <section className="border border-gray-300 bg-white px-4 py-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          سيتم الحفظ إلى الملف: <code>src/data/academic-trips.json</code>
        </div>

        <button
          type="button"
          className={primaryBtn}
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "جارٍ الحفظ..." : "حفظ"}
        </button>
      </section>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
