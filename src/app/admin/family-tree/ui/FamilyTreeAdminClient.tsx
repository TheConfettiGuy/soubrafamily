"use client";

import { useMemo, useState, useTransition } from "react";
import { saveFamilyTree } from "../actions";

/* ---------- Types ---------- */

type StorySectionType = "introduction" | "section" | "conclusion";

type StorySection = {
  id: string;
  type: StorySectionType;
  title: string;
  content: string[];
  visible?: boolean;
};

type KeyFigure = {
  name: string;
  role: string;
};

type TimelineStyle = "main" | "muted" | "end";

type TimelineItem = {
  year: string;
  description: string;
  style?: TimelineStyle;
};

type FamilyStoryData = {
  title: string;
  subtitle?: string;
  author?: string;
  sections: StorySection[];
  keyFigures: KeyFigure[];
  showKeyFigures?: boolean;
  timeline?: TimelineItem[];
  showTimeline?: boolean;
};

type Props = {
  initialData: FamilyStoryData;
};

/* ---------- Styling (consistent admin UI) ---------- */

const btn =
  "border border-gray-300 px-3 py-2 text-sm whitespace-nowrap hover:bg-gray-50 cursor-pointer";
const primaryBtn =
  "bg-main-100 text-white text-sm px-5 py-2 cursor-pointer hover:bg-gray-800";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const smallLabel = "text-xs text-gray-500";

/* ---------- Helpers ---------- */

function normalize(initial: FamilyStoryData): FamilyStoryData {
  return {
    title: initial.title ?? "",
    subtitle: initial.subtitle ?? "",
    author: initial.author ?? "",
    showKeyFigures:
      typeof initial.showKeyFigures === "boolean"
        ? initial.showKeyFigures
        : true,
    showTimeline:
      typeof initial.showTimeline === "boolean" ? initial.showTimeline : true,
    keyFigures: (initial.keyFigures || []).map((f) => ({
      name: f.name ?? "",
      role: f.role ?? "",
    })),
    sections: (initial.sections || []).map((s, index) => ({
      id: s.id || `sec-${index}`,
      type: s.type || "section",
      title: s.title ?? "",
      content: s.content ? [...s.content] : [""],
      visible: s.visible !== false,
    })),
    timeline: (initial.timeline || []).map((t) => ({
      year: t.year ?? "",
      description: t.description ?? "",
      style: t.style ?? "main",
    })),
  };
}

/* ---------- Component ---------- */

export default function FamilyTreeAdminClient({ initialData }: Props) {
  const [data, setData] = useState<FamilyStoryData>(() =>
    normalize(initialData)
  );
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  /* ---- Top-level fields ---- */

  const updateField = <K extends keyof FamilyStoryData>(
    key: K,
    value: FamilyStoryData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  /* ---- Key figures ---- */

  const setKeyFigures = (updater: (k: KeyFigure[]) => KeyFigure[]) => {
    setData((prev) => ({
      ...prev,
      keyFigures: updater(prev.keyFigures || []),
    }));
  };

  const addKeyFigure = () => {
    setKeyFigures((figs) => [
      ...figs,
      { name: "شخصية جديدة", role: "الدور / الوصف" },
    ]);
  };

  const updateKeyFigureField = (
    index: number,
    field: keyof KeyFigure,
    value: string
  ) => {
    setKeyFigures((figs) =>
      figs.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const removeKeyFigure = (index: number) => {
    setKeyFigures((figs) => figs.filter((_, i) => i !== index));
  };

  /* ---- Sections ---- */

  const setSections = (updater: (s: StorySection[]) => StorySection[]) => {
    setData((prev) => ({
      ...prev,
      sections: updater(prev.sections || []),
    }));
  };

  const addSection = (type: StorySectionType) => {
    setSections((sections) => [
      ...sections,
      {
        id: `sec-${sections.length}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        title:
          type === "introduction"
            ? "مقدمة جديدة"
            : type === "conclusion"
              ? "خاتمة جديدة"
              : "قسم جديد",
        content: [""],
        visible: true,
      },
    ]);
    setActiveSectionIdx(data.sections.length);
  };

  const updateSectionField = (
    index: number,
    field: keyof StorySection,
    value: string | StorySectionType
  ) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === index ? { ...s, [field]: value as any } : s
      )
    );
  };

  const toggleSectionVisible = (index: number) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === index ? { ...s, visible: s.visible === false ? true : false } : s
      )
    );
  };

  const deleteSection = (index: number) => {
    setSections((sections) => sections.filter((_, i) => i !== index));
    setActiveSectionIdx((idx) => (idx > 0 ? idx - 1 : 0));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    setSections((sections) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= sections.length) return sections;
      const copy = [...sections];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
    setActiveSectionIdx((idx) => {
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0) return 0;
      const len = data.sections.length;
      if (target >= len) return len - 1;
      return target;
    });
  };

  /* ---- Section paragraphs ---- */

  const addParagraph = (index: number) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === index ? { ...s, content: [...s.content, ""] } : s
      )
    );
  };

  const updateParagraph = (
    sectionIndex: number,
    paragraphIndex: number,
    value: string
  ) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              content: s.content.map((p, pi) =>
                pi === paragraphIndex ? value : p
              ),
            }
          : s
      )
    );
  };

  const removeParagraph = (sectionIndex: number, paragraphIndex: number) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              content: s.content.filter((_, pi) => pi !== paragraphIndex),
            }
          : s
      )
    );
  };

  const sections = data.sections || [];
  const activeSection = sections[activeSectionIdx] ?? sections[0];

  /* ---- Timeline ---- */

  const setTimeline = (updater: (t: TimelineItem[]) => TimelineItem[]) => {
    setData((prev) => ({
      ...prev,
      timeline: updater(prev.timeline || []),
    }));
  };

  const addTimelineItem = () => {
    setTimeline((items) => [
      ...items,
      {
        year: "",
        description: "",
        style: "main",
      },
    ]);
  };

  const updateTimelineItemField = (
    index: number,
    field: keyof TimelineItem,
    value: string
  ) => {
    setTimeline((items) =>
      items.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const removeTimelineItem = (index: number) => {
    setTimeline((items) => items.filter((_, i) => i !== index));
  };

  const moveTimelineItem = (index: number, direction: "up" | "down") => {
    setTimeline((items) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return items;
      const copy = [...items];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  };

  /* ---- Save ---- */

  const handleSave = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("payload", jsonString);
        await saveFamilyTree(fd);
        showToast("تم الحفظ وتحديث الملف بنجاح.");
      } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء الحفظ.");
      }
    });
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header meta: title / subtitle / author */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-4">
        <h2 className="text-lg font-medium">معلومات الصفحة</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={smallLabel}>العنوان الرئيسي</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div>
            <label className={smallLabel}>العنوان الفرعي</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.subtitle ?? ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
            />
          </div>
          <div>
            <label className={smallLabel}>اسم الكاتب</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.author ?? ""}
              onChange={(e) => updateField("author", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Key figures section */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">الشخصيات الرئيسية</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btn}
              onClick={() =>
                updateField("showKeyFigures", data.showKeyFigures === false)
              }
            >
              {data.showKeyFigures === false
                ? "إظهار القسم في الموقع"
                : "إخفاء القسم في الموقع"}
            </button>
            <button type="button" className={btn} onClick={addKeyFigure}>
              + إضافة شخصية
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {(data.keyFigures || []).map((f, idx) => (
            <div
              key={idx}
              className="border border-gray-200 px-3 py-3 flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1">
                <label className={smallLabel}>الاسم</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={f.name}
                  onChange={(e) =>
                    updateKeyFigureField(idx, "name", e.target.value)
                  }
                />
              </div>
              <div className="flex-1">
                <label className={smallLabel}>الدور / الوصف</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={f.role}
                  onChange={(e) =>
                    updateKeyFigureField(idx, "role", e.target.value)
                  }
                />
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <button
                  type="button"
                  className={redBtn}
                  onClick={() => removeKeyFigure(idx)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}

          {!(data.keyFigures || []).length && (
            <p className="text-xs text-gray-500">
              لا توجد شخصيات حالياً. يمكنك إضافتها من زر &quot;إضافة
              شخصية&quot;.
            </p>
          )}
        </div>
      </section>

      {/* Sections toolbar + editor */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold">أقسام القصة</span>
          <button
            type="button"
            className={btn}
            onClick={() => addSection("introduction")}
          >
            + مقدمة
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => addSection("section")}
          >
            + قسم عادي
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => addSection("conclusion")}
          >
            + خاتمة
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {sections.map((s, idx) => {
            const active = idx === activeSectionIdx;
            const label =
              (s.type === "introduction"
                ? "مقدمة: "
                : s.type === "conclusion"
                  ? "خاتمة: "
                  : "قسم: ") + (s.title || "بدون عنوان");

            return (
              <button
                key={s.id || idx}
                type="button"
                className={
                  "border px-3 py-2 text-sm whitespace-nowrap cursor-pointer" +
                  (active ? " bg-gray-200" : " hover:bg-gray-50")
                }
                onClick={() => setActiveSectionIdx(idx)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {activeSection && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={btn}
                onClick={() => moveSection(activeSectionIdx, "up")}
              >
                للأعلى ↑
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => moveSection(activeSectionIdx, "down")}
              >
                للأسفل ↓
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => toggleSectionVisible(activeSectionIdx)}
              >
                {activeSection.visible === false
                  ? "إظهار القسم في الموقع"
                  : "إخفاء القسم في الموقع"}
              </button>
              <button
                type="button"
                className={redBtn}
                onClick={() => deleteSection(activeSectionIdx)}
              >
                حذف القسم
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={smallLabel}>نوع القسم</label>
                <select
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm bg-white"
                  value={activeSection.type}
                  onChange={(e) =>
                    updateSectionField(
                      activeSectionIdx,
                      "type",
                      e.target.value as StorySectionType
                    )
                  }
                >
                  <option value="introduction">مقدمة</option>
                  <option value="section">قسم عادي</option>
                  <option value="conclusion">خاتمة</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={smallLabel}>عنوان القسم</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeSection.title}
                  onChange={(e) =>
                    updateSectionField(
                      activeSectionIdx,
                      "title",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className={smallLabel}>فقرات النص</span>
                <button
                  type="button"
                  className={btn}
                  onClick={() => addParagraph(activeSectionIdx)}
                >
                  + إضافة فقرة
                </button>
              </div>
              {activeSection.content.map((para, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2">
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeParagraph(activeSectionIdx, pIdx)}
                  >
                    حذف
                  </button>
                  <textarea
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm min-h-20"
                    value={para}
                    onChange={(e) =>
                      updateParagraph(activeSectionIdx, pIdx, e.target.value)
                    }
                  />
                </div>
              ))}
              {!activeSection.content.length && (
                <p className="text-xs text-gray-500">
                  لا توجد فقرات حالياً، يمكنك إضافة فقرة من الزر أعلاه.
                </p>
              )}
            </div>
          </div>
        )}

        {!sections.length && (
          <p className="text-xs text-gray-500 mt-3">
            لا توجد أقسام حالياً. استخدم الأزرار أعلاه لإضافة مقدمة أو قسم أو
            خاتمة.
          </p>
        )}
      </section>

      {/* Timeline editor */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">الخط الزمني للمشروع</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btn}
              onClick={() =>
                updateField("showTimeline", data.showTimeline === false)
              }
            >
              {data.showTimeline === false
                ? "إظهار الخط الزمني في الموقع"
                : "إخفاء الخط الزمني في الموقع"}
            </button>
            <button type="button" className={btn} onClick={addTimelineItem}>
              + إضافة حدث زمني
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {(data.timeline || []).map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 px-3 py-3 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={btn}
                    onClick={() => moveTimelineItem(idx, "up")}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={btn}
                    onClick={() => moveTimelineItem(idx, "down")}
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  className={redBtn}
                  onClick={() => removeTimelineItem(idx)}
                >
                  حذف الحدث
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className={smallLabel}>السنة / الفترة</label>
                  <input
                    className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                    value={item.year}
                    onChange={(e) =>
                      updateTimelineItemField(idx, "year", e.target.value)
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={smallLabel}>وصف الحدث</label>
                  <input
                    className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                    value={item.description}
                    onChange={(e) =>
                      updateTimelineItemField(
                        idx,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <label className={smallLabel}>نمط النقطة (لون الدائرة)</label>
                <select
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm bg-white max-w-xs"
                  value={item.style ?? "main"}
                  onChange={(e) =>
                    updateTimelineItemField(
                      idx,
                      "style",
                      e.target.value as TimelineStyle
                    )
                  }
                >
                  <option value="main">رئيسي (أزرق داكن)</option>
                  <option value="muted">هادئ / فترة توقف (رمادي)</option>
                  <option value="end">نهاية / إنجاز (أسود)</option>
                </select>
              </div>
            </div>
          ))}

          {!(data.timeline || []).length && (
            <p className="text-xs text-gray-500">
              لا يوجد خط زمني حالياً. يمكنك إضافة أحداث زمنية جديدة من الزر
              أعلاه.
            </p>
          )}
        </div>
      </section>

      {/* Save bar */}
      <section className="border border-gray-300 bg-white px-4 py-4 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          سيتم الحفظ إلى الملف: <code>src/data/family-tree.json</code>
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

      {/* Toast (popup at bottom, like other pages) */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
