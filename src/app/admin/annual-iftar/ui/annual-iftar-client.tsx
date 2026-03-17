"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { saveAnnualIftar } from "../actions";

/* ---------- Types (must match actions.ts JSON shape) ---------- */

export type AnnualIftarEvent = {
  id: string;
  year: string;
  date?: string;
  location?: string;
  type?: string;
  visible?: boolean; // true = shown, false = hidden
  image?: string; // e.g. "annual-iftar/2024/cover.jpg"
};

export type AnnualIftarData = {
  title: string;
  description?: string;
  events: AnnualIftarEvent[];
};

type Props = {
  initialData: AnnualIftarData;
  allImages: string[]; // list of "public"-relative paths
};

/* ---------- Small helpers ---------- */

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const grayBtn =
  "border border-gray-300 text-gray-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap bg-white";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";

function ensureVisibleFlag(ev: AnnualIftarEvent): AnnualIftarEvent {
  if (typeof ev.visible === "undefined") return { ...ev, visible: true };
  return ev;
}

function normalizeImgSrc(p?: string) {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return "/" + p.replace(/^\/+/, "");
}

/* ============================================================= */
/*                         MAIN COMPONENT                        */
/* ============================================================= */

export default function AnnualIftarAdminClient({
  initialData,
  allImages,
}: Props) {
  // ✅ only show annual-iftar images in picker
  const annualIftarImages = useMemo(() => {
    const normalized = (allImages ?? []).map((x) => x.replace(/^\/+/, ""));
    return normalized
      .filter((p) => p.toLowerCase().startsWith("annual-iftar/"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [allImages]);

  // ✅ group images by year folder: annual-iftar/2024/...
  const imagesByYear = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const p of annualIftarImages) {
      const parts = p.split("/");
      const year = parts[1] || "other";
      const arr = map.get(year) ?? [];
      arr.push(p);
      map.set(year, arr);
    }
    // sort each year list
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      map.set(k, arr);
    }
    return map;
  }, [annualIftarImages]);

  const [data, setData] = useState<AnnualIftarData>({
    ...initialData,
    events: (initialData.events ?? []).map(ensureVisibleFlag),
  });

  // ✅ selected album index (instead of rendering all)
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    return (initialData.events?.length ?? 0) > 0 ? 0 : -1;
  });

  const [imagePickerIndex, setImagePickerIndex] = useState<number | null>(null);
  const [pickerYear, setPickerYear] = useState<string>(""); // browsing year folders
  const [toast, setToast] = useState<string | null>(null);

  /* ---------- data helpers ---------- */

  const updateRoot = <K extends keyof AnnualIftarData>(
    key: K,
    value: AnnualIftarData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateEvent = (index: number, patch: Partial<AnnualIftarEvent>) => {
    setData((prev) => {
      const events = [...prev.events];
      events[index] = { ...events[index], ...patch };
      return { ...prev, events };
    });
  };

  // ✅ new event should appear FIRST
  const addEvent = () => {
    setData((prev) => {
      const year = new Date().getFullYear().toString();
      const newEvent: AnnualIftarEvent = {
        id: year,
        year,
        type: "إفطار سنوي",
        visible: true,
      };

      const events = [newEvent, ...(prev.events ?? [])];
      return { ...prev, events };
    });

    // ✅ open the newly created one immediately
    setActiveIndex(0);
  };

  const removeEvent = (index: number) => {
    setData((prev) => {
      const events = [...prev.events];
      events.splice(index, 1);
      return { ...prev, events };
    });

    // ✅ keep activeIndex valid
    setActiveIndex((curr) => {
      if (curr === index) return 0;
      if (curr > index) return curr - 1;
      return curr;
    });
  };

  const moveEvent = (index: number, dir: -1 | 1) => {
    setData((prev) => {
      const events = [...prev.events];
      const target = index + dir;
      if (target < 0 || target >= events.length) return prev;

      [events[index], events[target]] = [events[target], events[index]];
      return { ...prev, events };
    });

    // ✅ keep selected album consistent after reorder
    setActiveIndex((curr) => {
      if (curr === index) return index + dir;
      if (curr === index + dir) return index;
      return curr;
    });
  };

  const handleYearChange = (index: number, newYear: string) => {
    setData((prev) => {
      const events = [...prev.events];
      const ev = { ...events[index] };
      ev.year = newYear;

      // keep id in sync with year by default
      if (!ev.id || ev.id === events[index].year) {
        ev.id = newYear;
      }
      events[index] = ev;
      return { ...prev, events };
    });
  };

  const openImagePicker = (index: number) => {
    setImagePickerIndex(index);

    // ✅ default picker year = event year if exists
    const y = data.events?.[index]?.year;
    if (y && imagesByYear.has(y)) setPickerYear(y);
    else {
      // fallback: first available year folder
      const first = Array.from(imagesByYear.keys()).sort((a, b) =>
        b.localeCompare(a, undefined, { numeric: true })
      )[0];
      setPickerYear(first ?? "");
    }
  };

  const selectImageForCurrent = (path: string) => {
    if (imagePickerIndex === null) return;
    updateEvent(imagePickerIndex, { image: path });
    setImagePickerIndex(null);
  };

  const closeImagePicker = () => setImagePickerIndex(null);

  /* ---------- form submit (server action wrapper) ---------- */

  const handleSave = async (formData: FormData) => {
    formData.set("payload", JSON.stringify(data));
    await saveAnnualIftar(formData);
    setToast("تم الحفظ وتحديث البيانات بنجاح");
    setTimeout(() => setToast(null), 2500);
  };

  /* ---------- derived ---------- */

  const events = data.events ?? [];
  const active =
    activeIndex >= 0 && activeIndex < events.length
      ? events[activeIndex]
      : null;
  const activeVisible = active?.visible !== false;

  // years buttons in same order as events
  const albumButtons = events.map((ev, idx) => ({
    idx,
    year: ev.year || ev.id || `#${idx + 1}`,
    isHidden: ev.visible === false,
  }));

  /* ========================================================= */

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header info */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">إعدادات صفحة الإفطار السنوي</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">العنوان الرئيسي</label>
            <input
              className="w-full border px-3 py-2"
              value={data.title}
              onChange={(e) => updateRoot("title", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">وصف مختصر (اختياري)</label>
            <textarea
              className="w-full border px-3 py-2 min-h-[70px]"
              value={data.description ?? ""}
              onChange={(e) => updateRoot("description", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Add event + year buttons */}
      <section className="border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">الألبومات</h2>
          <button type="button" className={blueBtn} onClick={addEvent}>
            + إضافة ألبوم إفطار جديد
          </button>
        </div>

        {/* ✅ Buttons instead of showing all cards */}
        {events.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {albumButtons.map((b) => {
              const isActive = b.idx === activeIndex;
              return (
                <button
                  key={`${b.year}-${b.idx}`}
                  type="button"
                  onClick={() => setActiveIndex(b.idx)}
                  className={[
                    "border px-4 py-2 text-sm",
                    isActive
                      ? "bg-main-100 text-white border-main-100"
                      : "bg-white text-main-100 border-main-100 hover:bg-main-100 hover:text-white",
                  ].join(" ")}
                  title={b.isHidden ? "هذا الألبوم مخفي" : "هذا الألبوم ظاهر"}
                >
                  {b.year}
                  {b.isHidden ? " (مخفي)" : ""}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            لا يوجد ألبومات بعد. اضغط “إضافة ألبوم” لإنشاء واحد.
          </p>
        )}
      </section>

      {/* ✅ Single active album card */}
      {active && (
        <section className="space-y-6">
          <div className="border bg-white p-4 space-y-4">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <span className="text-sm text-gray-600">نوع:</span>{" "}
                  <span className="font-bold">
                    {active.type || "إفطار سنوي"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  الحالة:{" "}
                  <span
                    className={
                      activeVisible ? "text-green-600" : "text-red-600"
                    }
                  >
                    {activeVisible ? "ظاهر" : "مخفي"}
                  </span>
                </div>

                <button
                  type="button"
                  className={activeVisible ? grayBtn : blueBtn}
                  onClick={() =>
                    updateEvent(activeIndex, { visible: !activeVisible })
                  }
                >
                  {activeVisible ? "إخفاء هذا الألبوم" : "إظهار هذا الألبوم"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={grayBtn}
                  disabled={activeIndex === 0}
                  onClick={() => moveEvent(activeIndex, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={grayBtn}
                  disabled={activeIndex === events.length - 1}
                  onClick={() => moveEvent(activeIndex, +1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={redBtn}
                  onClick={() => removeEvent(activeIndex)}
                >
                  حذف
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">السنة</label>
                <input
                  className="w-full border px-3 py-2"
                  value={active.year}
                  onChange={(e) =>
                    handleYearChange(activeIndex, e.target.value)
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  id الألبوم: <code>{active.id || "لم يتم التعيين"}</code>
                </p>
              </div>

              <div>
                <label className="block text-sm mb-1">التاريخ</label>
                <input
                  className="w-full border px-3 py-2"
                  value={active.date ?? ""}
                  onChange={(e) =>
                    updateEvent(activeIndex, { date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-1">المكان</label>
                <input
                  className="w-full border px-3 py-2"
                  value={active.location ?? ""}
                  onChange={(e) =>
                    updateEvent(activeIndex, { location: e.target.value })
                  }
                />
              </div>

              {/* Cover image + picker */}
              <div className="space-y-2">
                <label className="block text-sm mb-1">
                  مسار صورة الغلاف (اختياري)
                </label>
                <input
                  className="w-full border px-3 py-2"
                  value={active.image ?? ""}
                  onChange={(e) =>
                    updateEvent(activeIndex, { image: e.target.value })
                  }
                  placeholder="annual-iftar/2024/cover.jpg"
                />

                <div className="flex items-center gap-3">
                  {/* ✅ thumbnail button to open picker */}
                  <button
                    type="button"
                    className={grayBtn}
                    onClick={() => openImagePicker(activeIndex)}
                  >
                    اختيار من مكتبة الإفطار السنوي
                  </button>

                  {active.image && (
                    <button
                      type="button"
                      className="relative w-24 h-16 border cursor-pointer overflow-hidden"
                      title="إضغط لتغيير صورة الغلاف"
                      onClick={() => openImagePicker(activeIndex)}
                    >
                      <Image
                        src={normalizeImgSrc(active.image)}
                        alt="cover preview"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  )}
                </div>

                {!active.image && (
                  <p className="text-xs text-gray-500">
                    يمكنك اختيار صورة غلاف من <code>public/annual-iftar</code>{" "}
                    أو ترك الحقل فارغاً.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Save section */}
      <section className="border bg-white p-4">
        <form
          action={async (fd) => {
            await handleSave(fd);
          }}
          className="flex items-center justify-between gap-3"
        >
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify(data)}
            readOnly
          />
          <div className="text-xs text-gray-500">
            سيتم الكتابة إلى: <code>src/data/annual-iftar.json</code>
          </div>
          <button className={blueBtn} type="submit">
            حفظ
          </button>
        </form>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}

      {/* Image picker modal (annual-iftar ONLY + year folders) */}
      {imagePickerIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white max-w-5xl w-[95%] max-h-[80vh] rounded shadow-lg flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3" dir="rtl">
              <h3 className="text-lg font-medium">
                اختر صورة من مكتبة الإفطار السنوي
              </h3>
              <button
                type="button"
                className={redBtn}
                onClick={closeImagePicker}
              >
                إغلاق
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3" dir="rtl">
              يتم عرض الصور فقط من <code>public/annual-iftar</code>. اختر سنة ثم
              اختر الصورة.
            </p>

            {/* Year folders tabs */}
            <div className="flex flex-wrap gap-2 mb-3" dir="rtl">
              {Array.from(imagesByYear.keys())
                .sort((a, b) =>
                  b.localeCompare(a, undefined, { numeric: true })
                )
                .map((y) => {
                  const active = y === pickerYear;
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setPickerYear(y)}
                      className={[
                        "border px-4 py-2 text-sm",
                        active
                          ? "bg-main-100 text-white border-main-100"
                          : "bg-white text-main-100 border-main-100 hover:bg-main-100 hover:text-white",
                      ].join(" ")}
                    >
                      {y}
                    </button>
                  );
                })}
            </div>

            {/* Scrollable images */}
            <div className="overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(imagesByYear.get(pickerYear) ?? []).map((img) => (
                  <button
                    key={img}
                    type="button"
                    className="border relative w-full h-28 overflow-hidden group bg-gray-50 cursor-pointer"
                    onClick={() => selectImageForCurrent(img)}
                  >
                    <img
                      src={img.startsWith("/") ? img : `/${img}`}
                      alt={img}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white px-1 py-0.5 truncate text-left">
                      {img}
                    </div>
                  </button>
                ))}
              </div>

              {(imagesByYear.get(pickerYear) ?? []).length === 0 && (
                <p className="text-sm text-gray-500 mt-4" dir="rtl">
                  لا توجد صور داخل <code>annual-iftar/{pickerYear}</code>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
