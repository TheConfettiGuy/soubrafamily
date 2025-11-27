"use client";

import { useMemo, useState, useTransition } from "react";
import { saveFamilyGuide } from "../action";
import familyGuideData from "@/data/family-guide.json";

/* ---------- Types ---------- */

type DocIcon = "book" | "medical" | "pharmacy" | "users" | "globe";

type FamilyGuideDocument = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  icon: DocIcon | string;
  visible?: boolean;
};

type FamilyGuideData = {
  title: string;
  description: string;
  documents: FamilyGuideDocument[];
};

/* ---------- Styles (same as other admin pages) ---------- */

const btn =
  "border border-gray-300 px-3 py-2 text-sm whitespace-nowrap hover:bg-gray-50 cursor-pointer";
const primaryBtn =
  "bg-main-100 text-white text-sm px-5 py-2 cursor-pointer hover:bg-gray-800";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const smallLabel = "text-xs text-gray-500";

/* ---------- Normalise ---------- */

function normalize(data: any): FamilyGuideData {
  const raw = data as FamilyGuideData;

  return {
    title: raw.title ?? "",
    description: raw.description ?? "",
    documents: (raw.documents || []).map((d, idx) => ({
      id: d.id || `doc_${idx + 1}`,
      title: d.title ?? "",
      description: d.description ?? "",
      fileUrl: d.fileUrl ?? "",
      fileName: d.fileName ?? "",
      icon: (d.icon as DocIcon) || "book",
      visible: d.visible === false ? false : true,
    })),
  };
}

/* ---------- Component ---------- */

export default function ClientPage() {
  const [data, setData] = useState<FamilyGuideData>(() =>
    normalize(familyGuideData)
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const documents = data.documents || [];
  const activeDoc = documents[activeIdx] ?? documents[0];

  /* ---------- Helpers ---------- */

  const updateRootField = <K extends keyof FamilyGuideData>(
    key: K,
    value: FamilyGuideData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const setDocuments = (
    updater: (docs: FamilyGuideDocument[]) => FamilyGuideDocument[]
  ) => {
    setData((prev) => ({ ...prev, documents: updater(prev.documents || []) }));
  };

  const addDocument = () => {
    setDocuments((docs) => [
      ...docs,
      {
        id: `doc_${docs.length + 1}`,
        title: "عنوان جديد",
        description: "",
        fileUrl: "",
        fileName: "",
        icon: "book",
        visible: true,
      },
    ]);
    setActiveIdx(documents.length);
  };

  const deleteDocument = (index: number) => {
    setDocuments((docs) => docs.filter((_, i) => i !== index));
    setActiveIdx((idx) => (idx > 0 ? idx - 1 : 0));
  };

  const moveDocument = (index: number, dir: "up" | "down") => {
    setDocuments((docs) => {
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= docs.length) return docs;
      const copy = [...docs];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });

    setActiveIdx((idx) => {
      if (idx !== index) return idx;
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0) return 0;
      if (target >= documents.length) return documents.length - 1;
      return target;
    });
  };

  const toggleVisible = (index: number) => {
    setDocuments((docs) =>
      docs.map((d, i) =>
        i === index ? { ...d, visible: d.visible === false ? true : false } : d
      )
    );
  };

  const updateDocField = (
    index: number,
    field: keyof FamilyGuideDocument,
    value: string
  ) => {
    setDocuments((docs) =>
      docs.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  /* ---------- Save ---------- */

  const handleSave = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("payload", jsonString);
        await saveFamilyGuide(fd);
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
      {/* Header fields */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-4">
        <h2 className="text-lg font-medium">إعدادات صفحة دليل العائلة</h2>
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
            <label className={smallLabel}>الوصف تحت العنوان</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.description}
              onChange={(e) => updateRootField("description", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Documents selector + toolbar */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={addDocument}>
            + إضافة بطاقة جديدة
          </button>

          <div className="flex flex-wrap gap-2">
            {documents.map((doc, idx) => {
              const active = idx === activeIdx;
              return (
                <button
                  key={doc.id || idx}
                  type="button"
                  className={
                    "border px-3 py-2 text-sm whitespace-nowrap cursor-pointer" +
                    (active ? " bg-gray-200" : " hover:bg-gray-50")
                  }
                  onClick={() => setActiveIdx(idx)}
                >
                  {doc.title || `بطاقة ${idx + 1}`}
                </button>
              );
            })}
          </div>
        </div>

        {activeDoc && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={btn}
                onClick={() => moveDocument(activeIdx, "up")}
              >
                للأعلى ↑
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => moveDocument(activeIdx, "down")}
              >
                للأسفل ↓
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => toggleVisible(activeIdx)}
              >
                {activeDoc.visible === false
                  ? "إظهار البطاقة في الموقع"
                  : "إخفاء البطاقة في الموقع"}
              </button>
              <button
                type="button"
                className={redBtn}
                onClick={() => deleteDocument(activeIdx)}
              >
                حذف البطاقة
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={smallLabel}>المعرّف (ID)</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeDoc.id}
                  onChange={(e) =>
                    updateDocField(activeIdx, "id", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={smallLabel}>عنوان البطاقة</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeDoc.title}
                  onChange={(e) =>
                    updateDocField(activeIdx, "title", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className={smallLabel}>الوصف أسفل العنوان</label>
              <textarea
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-20"
                value={activeDoc.description}
                onChange={(e) =>
                  updateDocField(activeIdx, "description", e.target.value)
                }
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={smallLabel}>رابط ملف PDF</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeDoc.fileUrl}
                  onChange={(e) =>
                    updateDocField(activeIdx, "fileUrl", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={smallLabel}>اسم الملف الظاهر في الزر</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeDoc.fileName}
                  onChange={(e) =>
                    updateDocField(activeIdx, "fileName", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={smallLabel}>الأيقونة</label>
                <select
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeDoc.icon}
                  onChange={(e) =>
                    updateDocField(activeIdx, "icon", e.target.value)
                  }
                >
                  <option value="book">كتاب (دليل)</option>
                  <option value="medical">طبية (أطباء)</option>
                  <option value="pharmacy">صيدلية</option>
                  <option value="users">أشخاص / لجنة</option>
                  <option value="globe">كرة أرضية (مغتربين)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {!documents.length && (
          <p className="text-xs text-gray-500 mt-3">
            لا توجد بطاقات حالياً. اضغط على &quot;إضافة بطاقة جديدة&quot; للبدء.
          </p>
        )}
      </section>

      {/* Save bar */}
      <section className="border border-gray-300 bg-white px-4 py-4 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          سيتم الحفظ إلى الملف: <code>src/data/family-guide.json</code>
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

      {/* Toast pop-up bottom center */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
