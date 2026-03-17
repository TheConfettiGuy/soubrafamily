"use client";

import { useState } from "react";
import Image from "next/image";
import { saveHonoringConfig } from "../actions";

export type HonoringEvent = {
  id: string;
  year: string;
  date?: string;
  name: string;
  occasion?: string;
  location?: string;
  image?: string;
  visible?: boolean;
};

export type HonoringJSON = {
  title: string;
  subtitle?: string;
  events: HonoringEvent[];
};

const blueBtn =
  "bg-main-100 text-white px-3 py-2 text-sm cursor-pointer hover:bg-white hover:text-main-100 hover:border-main-100 border border-transparent";
const grayBtn =
  "border border-gray-300 px-3 py-2 text-sm bg-white cursor-pointer hover:bg-gray-50";
const redBtn =
  "bg-red-50 text-red-700 px-3 py-2 text-sm cursor-pointer border border-red-200 hover:bg-red-100";

type Props = {
  initialData: HonoringJSON;
  allImages: string[]; // like: ["honoring/2024/p1.jpg", "/honoring/2024/p1.jpg", ...]
};

// helper so Next <Image> always gets a path starting with "/"
function normalizeSrc(src?: string): string {
  if (!src) return "";
  return src.startsWith("/") ? src : `/${src}`;
}

export default function ClientPage({ initialData, allImages }: Props) {
  const [data, setData] = useState<HonoringJSON>(initialData);
  const [activeIndex, setActiveIndex] = useState(0); // which card we are editing
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const updateRoot = (key: keyof HonoringJSON, val: any) =>
    setData((p) => ({ ...p, [key]: val }));

  const updateEvent = (i: number, patch: Partial<HonoringEvent>) =>
    setData((p) => {
      const events = [...p.events];
      events[i] = { ...events[i], ...patch };
      return { ...p, events };
    });

  const addEvent = () =>
    setData((p) => {
      const newEvent: HonoringEvent = {
        id: `id-${Date.now()}`,
        year: new Date().getFullYear().toString(),
        name: "اسم المكرّم",
        visible: true,
      };
      const events = [...p.events, newEvent];
      // after adding, select the new one
      setActiveIndex(events.length - 1);
      return { ...p, events };
    });

  const removeEvent = (i: number) => {
    setData((p) => {
      const events = [...p.events];
      events.splice(i, 1);
      return { ...p, events };
    });

    setActiveIndex((prev) => {
      if (prev > i) return prev - 1;
      if (prev === i) return Math.max(0, prev - 1);
      return prev;
    });
  };

  const move = (i: number, dir: -1 | 1) => {
    setData((p) => {
      const e = [...p.events];
      const t = i + dir;
      if (t < 0 || t >= e.length) return p;
      [e[i], e[t]] = [e[t], e[i]];
      return { ...p, events: e };
    });

    // keep selection roughly with the same event
    setActiveIndex((prev) => {
      const t = i + dir;
      if (prev === i) return t;
      if (prev === t) return i;
      return prev;
    });
  };

  const openPicker = (i: number) => setPickerIndex(i);
  const closePicker = () => setPickerIndex(null);

  const selectImage = (path: string) => {
    if (pickerIndex === null) return;
    updateEvent(pickerIndex, { image: path });
    closePicker();
  };

  const handleSave = async (fd: FormData) => {
    fd.set("payload", JSON.stringify(data, null, 2));
    await saveHonoringConfig(fd);
    setToast("تم حفظ بيانات التكريم بنجاح");
    setTimeout(() => setToast(null), 2500);
  };

  const hasEvents = data.events && data.events.length > 0;
  const safeIndex =
    !hasEvents || activeIndex < 0
      ? 0
      : activeIndex >= data.events.length
        ? data.events.length - 1
        : activeIndex;

  const current = hasEvents ? data.events[safeIndex] : null;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header settings */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">إعدادات صفحة التكريم</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm">العنوان</label>
            <input
              className="w-full border px-3 py-2"
              value={data.title}
              onChange={(e) => updateRoot("title", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm">الوصف</label>
            <textarea
              className="w-full border px-3 py-2 min-h-[70px]"
              value={data.subtitle ?? ""}
              onChange={(e) => updateRoot("subtitle", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Years tabs + add */}
      <section className="border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">التكريمات</h2>
          <button className={blueBtn} type="button" onClick={addEvent}>
            + إضافة تكريم
          </button>
        </div>

        {hasEvents ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.events.map((ev, idx) => {
              const active = idx === safeIndex;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={[
                    "px-3 py-1 text-sm border transition-colors",
                    active
                      ? "bg-main-100 text-white border-main-100"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-main-100 hover:text-white",
                  ].join(" ")}
                >
                  {ev.year || "بدون سنة"} — {ev.name || "بدون اسم"}
                  {ev.visible === false && (
                    <span className="ml-2 text-xs text-red-500">(مخفي)</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            لا توجد تكريمات بعد. اضغط على &quot;إضافة تكريم&quot; لإنشاء أول
            تكريم.
          </p>
        )}
      </section>

      {/* Active event editor */}
      {hasEvents && current && (
        <section className="border bg-white p-4 space-y-4">
          {/* controls line */}
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex gap-2">
              <button
                className={grayBtn}
                disabled={safeIndex === 0}
                onClick={() => move(safeIndex, -1)}
                type="button"
              >
                ↑
              </button>
              <button
                className={grayBtn}
                disabled={safeIndex === data.events.length - 1}
                onClick={() => move(safeIndex, +1)}
                type="button"
              >
                ↓
              </button>
              <button
                className={redBtn}
                onClick={() => removeEvent(safeIndex)}
                type="button"
              >
                حذف هذا التكريم
              </button>
            </div>

            <button
              className={current.visible !== false ? grayBtn : blueBtn}
              type="button"
              onClick={() =>
                updateEvent(safeIndex, { visible: current.visible === false })
              }
            >
              {current.visible === false
                ? "إظهار في الموقع"
                : "إخفاء من الموقع"}
            </button>
          </div>

          {/* Fields for active event */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm">السنة</label>
              <input
                className="w-full border px-3 py-2"
                value={current.year}
                onChange={(e) =>
                  updateEvent(safeIndex, { year: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm">التاريخ</label>
              <input
                className="w-full border px-3 py-2"
                value={current.date ?? ""}
                onChange={(e) =>
                  updateEvent(safeIndex, { date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm">اسم المكرّم</label>
              <input
                className="w-full border px-3 py-2"
                value={current.name}
                onChange={(e) =>
                  updateEvent(safeIndex, { name: e.target.value })
                }
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm">المناسبة</label>
              <textarea
                className="w-full border px-3 py-2 min-h-[70px]"
                value={current.occasion ?? ""}
                onChange={(e) =>
                  updateEvent(safeIndex, { occasion: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm">المكان</label>
              <input
                className="w-full border px-3 py-2"
                value={current.location ?? ""}
                onChange={(e) =>
                  updateEvent(safeIndex, { location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">الصورة</label>
              <input
                className="w-full border px-3 py-2"
                value={current.image ?? ""}
                onChange={(e) =>
                  updateEvent(safeIndex, { image: e.target.value })
                }
              />
              <button
                className={grayBtn}
                onClick={() => openPicker(safeIndex)}
                type="button"
              >
                اختيار من المكتبة
              </button>

              {current.image && (
                <div className="relative w-28 h-20 border overflow-hidden">
                  <Image
                    src={normalizeSrc(current.image)}
                    alt="preview"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Save */}
      <section className="border bg-white p-4">
        <form
          action={async (fd) => {
            await handleSave(fd);
          }}
          className="flex items-center justify-between gap-3"
        >
          <div className="text-xs text-gray-500">
            سيتم الكتابة إلى: <code>src/data/honoring.json</code>
          </div>
          <button className={blueBtn} type="submit">
            حفظ
          </button>
        </form>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2">
          {toast}
        </div>
      )}

      {/* Image Picker */}
      {pickerIndex !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-5xl max-h-[80vh] p-4 flex flex-col">
            <div className="flex justify-between mb-2" dir="rtl">
              <h3 className="font-medium">اختر صورة من مكتبة الصور</h3>
              <button className={redBtn} onClick={closePicker} type="button">
                إغلاق
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-2" dir="rtl">
              يتم عرض المسارات من مجلد <code>public</code> والمجلدات الفرعية.
            </p>

            <div className="overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-3 pr-1">
              {allImages.length === 0 && (
                <p className="text-sm text-gray-500 col-span-full">
                  لم يتم العثور على صور في مجلد التكريم.
                </p>
              )}

              {allImages.map((img) => {
                const src = normalizeSrc(img);
                return (
                  <button
                    key={img}
                    type="button"
                    onClick={() => selectImage(img)}
                    className="border relative h-28 bg-gray-50 cursor-pointer overflow-hidden group"
                  >
                    <Image
                      src={src}
                      alt={img}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white px-1 py-0.5 truncate text-left">
                      {img}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
