"use client";

import Image from "next/image";
import { useState } from "react";
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
  // default to visible when undefined
  if (typeof ev.visible === "undefined") return { ...ev, visible: true };
  return ev;
}

/* ============================================================= */
/*                         MAIN COMPONENT                        */
/* ============================================================= */

export default function AnnualIftarAdminClient({
  initialData,
  allImages,
}: Props) {
  const [data, setData] = useState<AnnualIftarData>({
    ...initialData,
    events: (initialData.events ?? []).map(ensureVisibleFlag),
  });

  const [imagePickerIndex, setImagePickerIndex] = useState<number | null>(null);
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

  const addEvent = () => {
    setData((prev) => {
      const year = new Date().getFullYear().toString();
      return {
        ...prev,
        events: [
          ...prev.events,
          {
            id: year,
            year,
            type: "إفطار سنوي",
            visible: true,
          },
        ],
      };
    });
  };

  const removeEvent = (index: number) => {
    setData((prev) => {
      const events = [...prev.events];
      events.splice(index, 1);
      return { ...prev, events };
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

      {/* Add event */}
      <section className="border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">الألبومات</h2>
          <button type="button" className={blueBtn} onClick={addEvent}>
            + إضافة ألبوم إفطار جديد
          </button>
        </div>
      </section>

      {/* Events list */}
      <section className="space-y-6">
        {data.events.map((ev, index) => {
          const visible = ev.visible !== false;

          return (
            <div
              key={index}
              className="border bg-white p-4 space-y-4 shadow-sm"
            >
              {/* Header row: type + visibility + controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-sm text-gray-600">نوع:</span>{" "}
                    <span className="font-bold">{ev.type || "إفطار سنوي"}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    الحالة:{" "}
                    <span
                      className={visible ? "text-green-600" : "text-red-600"}
                    >
                      {visible ? "ظاهر" : "مخفي"}
                    </span>
                  </div>
                  {/* show/hide as simple button */}
                  <button
                    type="button"
                    className={visible ? grayBtn : blueBtn}
                    onClick={() => updateEvent(index, { visible: !visible })}
                  >
                    {visible ? "إخفاء هذا الألبوم" : "إظهار هذا الألبوم"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={index === 0}
                    onClick={() => moveEvent(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={index === data.events.length - 1}
                    onClick={() => moveEvent(index, +1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeEvent(index)}
                  >
                    حذف
                  </button>
                </div>
              </div>

              {/* Main fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Year + id */}
                <div>
                  <label className="block text-sm mb-1">السنة</label>
                  <input
                    className="w-full border px-3 py-2"
                    value={ev.year}
                    onChange={(e) => handleYearChange(index, e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    id الألبوم: <code>{ev.id || "لم يتم التعيين"}</code>
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-1">التاريخ</label>
                  <input
                    className="w-full border px-3 py-2"
                    value={ev.date ?? ""}
                    onChange={(e) =>
                      updateEvent(index, { date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">المكان</label>
                  <input
                    className="w-full border px-3 py-2"
                    value={ev.location ?? ""}
                    onChange={(e) =>
                      updateEvent(index, { location: e.target.value })
                    }
                  />
                </div>

                {/* Cover image path + picker */}
                <div className="space-y-2">
                  <label className="block text-sm mb-1">
                    مسار صورة الغلاف (اختياري)
                  </label>
                  <input
                    className="w-full border px-3 py-2"
                    value={ev.image ?? ""}
                    onChange={(e) =>
                      updateEvent(index, { image: e.target.value })
                    }
                    placeholder="annual-iftar/2024/cover.jpg"
                  />

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={grayBtn}
                      onClick={() => openImagePicker(index)}
                    >
                      اختيار من المكتبة
                    </button>

                    {ev.image && (
                      <div
                        className="relative w-24 h-16 border cursor-pointer overflow-hidden"
                        title="إضغط على الصورة لاختيار غلاف جديد"
                        onClick={() => openImagePicker(index)}
                      >
                        <Image
                          src={`/${ev.image}`}
                          alt="cover preview"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {!ev.image && (
                    <p className="text-xs text-gray-500">
                      يمكنك اختيار صورة غلاف من المكتبة أو ترك الحقل فارغاً.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

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

      {/* Image picker modal */}
      {imagePickerIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* Modal shell */}
          <div className="bg-white max-w-5xl w-[95%] max-h-[80vh] rounded shadow-lg flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3" dir="rtl">
              <h3 className="text-lg font-medium">اختر صورة من مكتبة الصور</h3>
              <button
                type="button"
                className={redBtn}
                onClick={closeImagePicker}
              >
                إغلاق
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3" dir="rtl">
              يتم عرض المسارات من مجلد <code>public</code> والمجلدات الفرعية.
              يمكنك أيضاً الكتابة يدوياً في الحقل النصي.
            </p>

            {/* Scrollable images area */}
            <div className="overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allImages.map((img) => (
                  <button
                    key={img}
                    type="button"
                    className="border relative w-full h-28 overflow-hidden group bg-gray-50 cursor-pointer"
                    onClick={() => selectImageForCurrent(img)}
                  >
                    {/* Actual image */}
                    <img
                      src={img.startsWith("/") ? img : `/${img}`}
                      alt={img}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Path label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white px-1 py-0.5 truncate text-left">
                      {img}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
