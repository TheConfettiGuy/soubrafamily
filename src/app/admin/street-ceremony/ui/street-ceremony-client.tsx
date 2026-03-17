"use client";

import { useMemo, useState } from "react";
import { saveStreetCeremony } from "../actions";

/* ---------------- Types ---------------- */

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
    folder?: string; // public-relative folder, e.g. "street-ceremony"
  };
};

type Props = {
  initialData: StreetCeremonyData;
  allImages: string[]; // returned as "/path/in/public.jpg"
};

/* ---------------- Button styles (same pattern) ---------------- */

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const grayBtn =
  "border border-gray-300 text-gray-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap bg-white";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";

/* ---------------- Helpers ---------------- */

function normalize(d: StreetCeremonyData): StreetCeremonyData {
  return {
    visible: d.visible !== false,
    title: d.title ?? "",
    description: d.description ?? "",
    tabs: {
      text: d.tabs?.text ?? "النص",
      photos: d.tabs?.photos ?? "الصور",
    },
    text: {
      heading: d.text?.heading ?? "وصف المناسبة",
      visible: d.text?.visible !== false,
      paragraphs: Array.isArray(d.text?.paragraphs)
        ? [...d.text!.paragraphs!]
        : [],
    },
    gallery: {
      heading: d.gallery?.heading ?? "ألبوم الصور",
      visible: d.gallery?.visible !== false,
      folder: (d.gallery?.folder ?? "street-ceremony").replace(/^\/+/, ""),
    },
  };
}

function dirnameFromPublicPath(p: string): string {
  // p can be "/a/b/c.jpg"
  const clean = (p || "").replace(/^\/+/, "");
  const idx = clean.lastIndexOf("/");
  if (idx <= 0) return clean; // "file.jpg" (unlikely)
  return clean.slice(0, idx);
}

/* ---------------- Component ---------------- */

export default function StreetCeremonyAdminClient({
  initialData,
  allImages,
}: Props) {
  const [data, setData] = useState<StreetCeremonyData>(() =>
    normalize(initialData)
  );
  const [toast, setToast] = useState<string | null>(null);

  const [folderPickerOpen, setFolderPickerOpen] = useState(false);

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const updateRoot = <K extends keyof StreetCeremonyData>(
    key: K,
    value: StreetCeremonyData[K]
  ) => setData((prev) => ({ ...prev, [key]: value }));

  const updateText = (
    patch: Partial<NonNullable<StreetCeremonyData["text"]>>
  ) =>
    setData((prev) => ({ ...prev, text: { ...(prev.text || {}), ...patch } }));

  const updateGallery = (
    patch: Partial<NonNullable<StreetCeremonyData["gallery"]>>
  ) =>
    setData((prev) => ({
      ...prev,
      gallery: { ...(prev.gallery || {}), ...patch },
    }));

  /* paragraphs */
  const addParagraph = () => {
    const next = [...(data.text?.paragraphs || []), ""];
    updateText({ paragraphs: next });
  };

  const updateParagraph = (idx: number, value: string) => {
    const next = [...(data.text?.paragraphs || [])];
    next[idx] = value;
    updateText({ paragraphs: next });
  };

  const removeParagraph = (idx: number) => {
    const next = [...(data.text?.paragraphs || [])];
    next.splice(idx, 1);
    updateText({ paragraphs: next });
  };

  const moveParagraph = (idx: number, dir: -1 | 1) => {
    const next = [...(data.text?.paragraphs || [])];
    const to = idx + dir;
    if (to < 0 || to >= next.length) return;
    [next[idx], next[to]] = [next[to], next[idx]];
    updateText({ paragraphs: next });
  };

  /* folder picking */
  const openFolderPicker = () => setFolderPickerOpen(true);
  const closeFolderPicker = () => setFolderPickerOpen(false);

  const selectFolderFromImage = (img: string) => {
    const folder = dirnameFromPublicPath(img);
    updateGallery({ folder });
    closeFolderPicker();
    showToast("تم تحديد مجلد الصور تلقائياً من الصورة المختارة.");
  };

  const folder = (data.gallery?.folder || "street-ceremony").replace(
    /^\/+/,
    ""
  );
  const folderImages = allImages
    .filter((p) => p.replace(/^\/+/, "").startsWith(folder + "/"))
    .slice(0, 6);

  /* save */
  const handleSave = async (fd: FormData) => {
    fd.set("payload", jsonString);
    const res = await saveStreetCeremony(fd);
    if ((res as any)?.ok) showToast("تم الحفظ وتحديث البيانات بنجاح");
    else showToast("حدث خطأ أثناء الحفظ");
  };

  const pageVisible = data.visible !== false;
  const textVisible = data.text?.visible !== false;
  const galleryVisible = data.gallery?.visible !== false;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Page settings */}
      <section className="border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium">إعدادات الصفحة</h2>
          <button
            type="button"
            className={pageVisible ? grayBtn : blueBtn}
            onClick={() => updateRoot("visible", !pageVisible)}
          >
            {pageVisible ? "إخفاء الصفحة" : "إظهار الصفحة"}
          </button>
        </div>
      </section>

      {/* Header fields */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">العنوان والوصف</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">العنوان</label>
            <input
              className="w-full border px-3 py-2"
              value={data.title}
              onChange={(e) => updateRoot("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">الوصف (اختياري)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.description ?? ""}
              onChange={(e) => updateRoot("description", e.target.value)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">اسم تبويب النص</label>
            <input
              className="w-full border px-3 py-2"
              value={data.tabs?.text ?? ""}
              onChange={(e) =>
                updateRoot("tabs", {
                  ...(data.tabs || {}),
                  text: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">اسم تبويب الصور</label>
            <input
              className="w-full border px-3 py-2"
              value={data.tabs?.photos ?? ""}
              onChange={(e) =>
                updateRoot("tabs", {
                  ...(data.tabs || {}),
                  photos: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* Text section */}
      <section className="border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium">قسم النص</h2>
          <button
            type="button"
            className={textVisible ? grayBtn : blueBtn}
            onClick={() => updateText({ visible: !textVisible })}
          >
            {textVisible ? "إخفاء قسم النص" : "إظهار قسم النص"}
          </button>
        </div>

        <div>
          <label className="block text-sm mb-1">عنوان قسم النص</label>
          <input
            className="w-full border px-3 py-2"
            value={data.text?.heading ?? ""}
            onChange={(e) => updateText({ heading: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="block text-sm">الفقرات</label>
          <button type="button" className={blueBtn} onClick={addParagraph}>
            + إضافة فقرة
          </button>
        </div>

        {(data.text?.paragraphs || []).map((p, idx) => (
          <div key={idx} className="border p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={grayBtn}
                  disabled={idx === 0}
                  onClick={() => moveParagraph(idx, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={grayBtn}
                  disabled={idx === (data.text?.paragraphs || []).length - 1}
                  onClick={() => moveParagraph(idx, +1)}
                >
                  ↓
                </button>
              </div>

              <button
                type="button"
                className={redBtn}
                onClick={() => removeParagraph(idx)}
              >
                حذف
              </button>
            </div>

            <textarea
              className="w-full border px-3 py-2 min-h-22.5"
              value={p}
              onChange={(e) => updateParagraph(idx, e.target.value)}
            />
          </div>
        ))}

        {(data.text?.paragraphs || []).length === 0 && (
          <p className="text-xs text-gray-500">لا توجد فقرات حالياً.</p>
        )}
      </section>

      {/* Gallery section */}
      <section className="border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium">قسم الصور</h2>
          <button
            type="button"
            className={galleryVisible ? grayBtn : blueBtn}
            onClick={() => updateGallery({ visible: !galleryVisible })}
          >
            {galleryVisible ? "إخفاء قسم الصور" : "إظهار قسم الصور"}
          </button>
        </div>

        <div>
          <label className="block text-sm mb-1">عنوان قسم الصور</label>
          <input
            className="w-full border px-3 py-2"
            value={data.gallery?.heading ?? ""}
            onChange={(e) => updateGallery({ heading: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm mb-1">
            مجلد الصور داخل <code>public</code>
          </label>

          <div className="flex items-center gap-3">
            <input
              className="flex-1 border px-3 py-2"
              value={data.gallery?.folder ?? ""}
              onChange={(e) =>
                updateGallery({ folder: e.target.value.replace(/^\/+/, "") })
              }
              placeholder="street-ceremony"
            />
            <button
              type="button"
              className={grayBtn}
              onClick={openFolderPicker}
            >
              اختيار من المكتبة
            </button>
          </div>

          <p className="text-xs text-gray-500">
            سيتم عرض الصور من: <code>public/{folder}</code>
          </p>

          {folderImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {folderImages.map((img) => (
                <div
                  key={img}
                  className="border w-full h-16 overflow-hidden bg-gray-50"
                >
                  <img
                    src={img}
                    alt={img}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Save */}
      <section className="border bg-white p-4">
        <form
          action={async (fd) => {
            await handleSave(fd);
          }}
          className="flex items-center justify-between gap-3"
        >
          <input type="hidden" name="payload" value={jsonString} readOnly />
          <div className="text-xs text-gray-500">
            سيتم الكتابة إلى: <code>src/data/street-ceremony.json</code>
          </div>
          <button className={blueBtn} type="submit">
            حفظ
          </button>
        </form>
      </section>

      {/* Toast (bottom-right popup like your other pages) */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}

      {/* Folder picker modal (pick any image -> set folder = its directory) */}
      {folderPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white max-w-5xl w-[95%] max-h-[80vh] overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3" dir="rtl">
              <h3 className="text-lg font-medium">اختر صورة من مكتبة الصور</h3>
              <button
                type="button"
                className={redBtn}
                onClick={closeFolderPicker}
              >
                إغلاق
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3" dir="rtl">
              عند اختيار صورة سيتم تعيين <b>مجلد الصور</b> تلقائياً إلى مجلد تلك
              الصورة داخل <code>public</code>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allImages.map((img) => (
                <button
                  key={img}
                  type="button"
                  className="border relative w-full h-28 overflow-hidden group bg-gray-50 cursor-pointer"
                  onClick={() => selectFolderFromImage(img)}
                >
                  <img
                    src={img}
                    alt={img}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white px-1 py-0.5 truncate text-left">
                    {img}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
