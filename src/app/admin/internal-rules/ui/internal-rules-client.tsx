"use client";

import { useMemo, useState, useTransition } from "react";
import { saveInternalRules } from "../actions";

// ---------- Types aligned with JSON ----------
type Article = {
  number?: string;
  title?: string;
  content?: string;
  items?: string[];
};

type Position = {
  title: string;
  responsibilities: string[];
};

type Section = {
  title: string;
  articles?: Article[];
  positions?: Position[];
  visible?: boolean; // for show/hide
};

type ComparisonSide = {
  title: string;
  content: string;
};

type Comparison = {
  title: string;
  article: string;
  before: ComparisonSide;
  after: ComparisonSide;
  visible?: boolean; // for show/hide
};

type InternalRulesData = {
  title: string;
  subtitle?: string;
  associationName?: string;
  sections: Section[];
  comparison?: Comparison;
};

type Props = {
  initialData: InternalRulesData;
};

// ---------- Styling helpers (flat, consistent admin UI) ----------
const btn =
  "border border-gray-300 px-3 py-2 text-sm whitespace-nowrap hover:bg-gray-50 cursor-pointer";
const primaryBtn =
  "bg-main-100 text-white text-sm px-5 py-2 cursor-pointer hover:bg-gray-800";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const smallLabel = "text-xs text-gray-500";

// Normalize incoming data so we always have arrays / strings
function normalize(initial: InternalRulesData): InternalRulesData {
  return {
    title: initial.title ?? "",
    subtitle: initial.subtitle ?? "",
    associationName: initial.associationName ?? "",
    sections: (initial.sections || []).map((s) => ({
      title: s.title ?? "",
      visible: s.visible,
      articles: (s.articles || []).map((a) => ({
        number: a.number ?? "",
        title: a.title ?? "",
        content: a.content ?? "",
        items: a.items ? [...a.items] : [],
      })),
      positions: (s.positions || []).map((p) => ({
        title: p.title ?? "",
        responsibilities: p.responsibilities ? [...p.responsibilities] : [],
      })),
    })),
    comparison: initial.comparison
      ? {
          title: initial.comparison.title ?? "",
          article: initial.comparison.article ?? "",
          before: {
            title: initial.comparison.before?.title ?? "",
            content: initial.comparison.before?.content ?? "",
          },
          after: {
            title: initial.comparison.after?.title ?? "",
            content: initial.comparison.after?.content ?? "",
          },
          visible: initial.comparison.visible,
        }
      : undefined,
  };
}

// ---------- Component ----------
export default function InternalRulesAdminClient({ initialData }: Props) {
  const [data, setData] = useState<InternalRulesData>(() =>
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

  // ---- Top-level fields ----
  const updateField = <K extends keyof InternalRulesData>(
    key: K,
    value: InternalRulesData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // ---- Sections helpers ----
  const setSections = (updater: (s: Section[]) => Section[]) => {
    setData((prev) => ({ ...prev, sections: updater(prev.sections || []) }));
  };

  const addSection = () => {
    setSections((sections) => [
      ...sections,
      {
        title: "قسم جديد",
        visible: true,
        articles: [],
        positions: [],
      },
    ]);
    setActiveSectionIdx(data.sections.length);
  };

  const deleteSection = (index: number) => {
    setSections((sections) => {
      const copy = [...sections];
      copy.splice(index, 1);
      return copy;
    });
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
      if (target >= data.sections.length) return data.sections.length - 1;
      return target;
    });
  };

  const toggleSectionVisible = (index: number) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === index ? { ...s, visible: s.visible === false ? true : false } : s
      )
    );
  };

  const updateSectionTitle = (index: number, value: string) => {
    setSections((sections) =>
      sections.map((s, i) => (i === index ? { ...s, title: value } : s))
    );
  };

  // ---- Articles helpers ----
  const addArticle = (sectionIndex: number) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              articles: [
                ...(s.articles || []),
                { number: "", title: "", content: "", items: [] },
              ],
            }
          : s
      )
    );
  };

  const updateArticleField = (
    sectionIndex: number,
    articleIndex: number,
    field: keyof Article,
    value: string
  ) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              articles: (s.articles || []).map((a, ai) =>
                ai === articleIndex ? { ...a, [field]: value } : a
              ),
            }
          : s
      )
    );
  };

  const addArticleItem = (sectionIndex: number, articleIndex: number) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              articles: (s.articles || []).map((a, ai) =>
                ai === articleIndex
                  ? {
                      ...a,
                      items: [...(a.items || []), ""],
                    }
                  : a
              ),
            }
          : s
      )
    );
  };

  const updateArticleItem = (
    sectionIndex: number,
    articleIndex: number,
    itemIndex: number,
    value: string
  ) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              articles: (s.articles || []).map((a, ai) =>
                ai === articleIndex
                  ? {
                      ...a,
                      items: (a.items || []).map((it, ii) =>
                        ii === itemIndex ? value : it
                      ),
                    }
                  : a
              ),
            }
          : s
      )
    );
  };

  const removeArticleItem = (
    sectionIndex: number,
    articleIndex: number,
    itemIndex: number
  ) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              articles: (s.articles || []).map((a, ai) =>
                ai === articleIndex
                  ? {
                      ...a,
                      items: (a.items || []).filter(
                        (_, ii) => ii !== itemIndex
                      ),
                    }
                  : a
              ),
            }
          : s
      )
    );
  };

  const removeArticle = (sectionIndex: number, articleIndex: number) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              articles: (s.articles || []).filter(
                (_, ai) => ai !== articleIndex
              ),
            }
          : s
      )
    );
  };

  // ---- Positions helpers ----
  const addPosition = (sectionIndex: number) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              positions: [
                ...(s.positions || []),
                { title: "", responsibilities: [] },
              ],
            }
          : s
      )
    );
  };

  const updatePositionTitle = (
    sectionIndex: number,
    positionIndex: number,
    value: string
  ) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              positions: (s.positions || []).map((p, pi) =>
                pi === positionIndex ? { ...p, title: value } : p
              ),
            }
          : s
      )
    );
  };

  const addResponsibility = (sectionIndex: number, positionIndex: number) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              positions: (s.positions || []).map((p, pi) =>
                pi === positionIndex
                  ? {
                      ...p,
                      responsibilities: [...(p.responsibilities || []), ""],
                    }
                  : p
              ),
            }
          : s
      )
    );
  };

  const updateResponsibility = (
    sectionIndex: number,
    positionIndex: number,
    respIndex: number,
    value: string
  ) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              positions: (s.positions || []).map((p, pi) =>
                pi === positionIndex
                  ? {
                      ...p,
                      responsibilities: (p.responsibilities || []).map(
                        (r, ri) => (ri === respIndex ? value : r)
                      ),
                    }
                  : p
              ),
            }
          : s
      )
    );
  };

  const removeResponsibility = (
    sectionIndex: number,
    positionIndex: number,
    respIndex: number
  ) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              positions: (s.positions || []).map((p, pi) =>
                pi === positionIndex
                  ? {
                      ...p,
                      responsibilities: (p.responsibilities || []).filter(
                        (_, ri) => ri !== respIndex
                      ),
                    }
                  : p
              ),
            }
          : s
      )
    );
  };

  const removePosition = (sectionIndex: number, positionIndex: number) => {
    setSections((sections) =>
      sections.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              positions: (s.positions || []).filter(
                (_, pi) => pi !== positionIndex
              ),
            }
          : s
      )
    );
  };

  // ---- Comparison helpers ----
  const ensureComparison = () => {
    if (!data.comparison) {
      setData((prev) => ({
        ...prev,
        comparison: {
          title: "جدول مقارنة",
          article: "",
          before: { title: "قبل التعديل", content: "" },
          after: { title: "بعد التعديل", content: "" },
          visible: true,
        },
      }));
    }
  };

  const removeComparison = () => {
    setData((prev) => ({ ...prev, comparison: undefined }));
  };

  const updateComparisonField = (
    field: keyof Comparison,
    value: string | boolean
  ) => {
    setData((prev) => {
      if (!prev.comparison) return prev;
      return {
        ...prev,
        comparison: {
          ...prev.comparison,
          [field]: value as any,
        },
      };
    });
  };

  const updateComparisonSide = (
    side: "before" | "after",
    field: keyof ComparisonSide,
    value: string
  ) => {
    setData((prev) => {
      if (!prev.comparison) return prev;
      return {
        ...prev,
        comparison: {
          ...prev.comparison,
          [side]: {
            ...prev.comparison[side],
            [field]: value,
          },
        },
      };
    });
  };

  // ---- Save ----
  const handleSave = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("payload", jsonString);
        await saveInternalRules(fd);
        showToast("تم الحفظ وتحديث الملف بنجاح.");
      } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء الحفظ.");
      }
    });
  };

  const sections = data.sections || [];
  const activeSection = sections[activeSectionIdx] ?? sections[0];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header (title / subtitle / association) */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-4">
        <h2 className="text-lg font-medium">العناوين الرئيسية</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className={smallLabel}>العنوان الرئيسي</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className={smallLabel}>العنوان الفرعي</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.subtitle ?? ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className={smallLabel}>اسم الجمعية</label>
            <input
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
              value={data.associationName ?? ""}
              onChange={(e) => updateField("associationName", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Sections toolbar */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={addSection}>
            + إضافة قسم جديد
          </button>

          <div className="flex flex-wrap gap-2">
            {sections.map((s, idx) => {
              const active = idx === activeSectionIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={
                    "border px-3 py-2 text-sm whitespace-nowrap cursor-pointer" +
                    (active ? " bg-gray-200" : " hover:bg-gray-50")
                  }
                  onClick={() => setActiveSectionIdx(idx)}
                >
                  {s.title || `قسم ${idx + 1}`}
                </button>
              );
            })}
          </div>
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
                className={redBtn}
                onClick={() => deleteSection(activeSectionIdx)}
              >
                حذف القسم
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
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={smallLabel}>عنوان القسم</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeSection.title}
                  onChange={(e) =>
                    updateSectionTitle(activeSectionIdx, e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Articles + Positions for active section */}
      {activeSection && (
        <section className="space-y-6">
          {/* Articles */}
          <div className="border border-gray-300 bg-white px-4 py-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">المواد / Articles</h3>
              <button
                type="button"
                className={btn}
                onClick={() => addArticle(activeSectionIdx)}
              >
                + إضافة مادة
              </button>
            </div>

            <div className="space-y-4">
              {(activeSection.articles || []).map((article, aIdx) => (
                <div
                  key={aIdx}
                  className="border border-gray-200 px-3 py-3 space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div className="flex flex-wrap gap-3 flex-1">
                      <div>
                        <label className={smallLabel}>رقم المادة</label>
                        <input
                          className="mt-1 border border-gray-300 px-3 py-2 text-sm w-40"
                          value={article.number ?? ""}
                          onChange={(e) =>
                            updateArticleField(
                              activeSectionIdx,
                              aIdx,
                              "number",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <label className={smallLabel}>
                          عنوان المادة (اختياري)
                        </label>
                        <input
                          className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                          value={article.title ?? ""}
                          onChange={(e) =>
                            updateArticleField(
                              activeSectionIdx,
                              aIdx,
                              "title",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className={redBtn}
                      onClick={() => removeArticle(activeSectionIdx, aIdx)}
                    >
                      حذف المادة
                    </button>
                  </div>

                  <div>
                    <label className={smallLabel}>نص المادة</label>
                    <textarea
                      className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-20"
                      value={article.content ?? ""}
                      onChange={(e) =>
                        updateArticleField(
                          activeSectionIdx,
                          aIdx,
                          "content",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className={smallLabel}>
                        بنود مرقمة (تظهر في قائمة مرقّمة)
                      </span>
                      <button
                        type="button"
                        className={btn}
                        onClick={() => addArticleItem(activeSectionIdx, aIdx)}
                      >
                        + إضافة بند
                      </button>
                    </div>
                    {(article.items || []).map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <button
                          type="button"
                          className={redBtn}
                          onClick={() =>
                            removeArticleItem(activeSectionIdx, aIdx, itemIdx)
                          }
                        >
                          حذف
                        </button>
                        <input
                          className="flex-1 border border-gray-300 px-3 py-2 text-sm"
                          value={item}
                          onChange={(e) =>
                            updateArticleItem(
                              activeSectionIdx,
                              aIdx,
                              itemIdx,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!(activeSection.articles || []).length && (
                <p className="text-xs text-gray-500">
                  لا توجد مواد لهذا القسم حالياً.
                </p>
              )}
            </div>
          </div>

          {/* Positions */}
          <div className="border border-gray-300 bg-white px-4 py-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">
                الصلاحيات / المناصب (Positions)
              </h3>
              <button
                type="button"
                className={btn}
                onClick={() => addPosition(activeSectionIdx)}
              >
                + إضافة منصب
              </button>
            </div>

            <div className="space-y-4">
              {(activeSection.positions || []).map((pos, pIdx) => (
                <div
                  key={pIdx}
                  className="border border-gray-200 px-3 py-3 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className={smallLabel}>اسم المنصب / الوظيفة</label>
                      <input
                        className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                        value={pos.title}
                        onChange={(e) =>
                          updatePositionTitle(
                            activeSectionIdx,
                            pIdx,
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className={redBtn}
                      onClick={() => removePosition(activeSectionIdx, pIdx)}
                    >
                      حذف المنصب
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className={smallLabel}>
                        المسؤوليات (قائمة مرقمة)
                      </span>
                      <button
                        type="button"
                        className={btn}
                        onClick={() =>
                          addResponsibility(activeSectionIdx, pIdx)
                        }
                      >
                        + إضافة مسؤولية
                      </button>
                    </div>
                    {(pos.responsibilities || []).map((resp, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2">
                        <button
                          type="button"
                          className={redBtn}
                          onClick={() =>
                            removeResponsibility(activeSectionIdx, pIdx, rIdx)
                          }
                        >
                          حذف
                        </button>
                        <input
                          className="flex-1 border border-gray-300 px-3 py-2 text-sm"
                          value={resp}
                          onChange={(e) =>
                            updateResponsibility(
                              activeSectionIdx,
                              pIdx,
                              rIdx,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!(activeSection.positions || []).length && (
                <p className="text-xs text-gray-500">
                  لا توجد مناصب / صلاحيات مضافة لهذا القسم.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Comparison block */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">
            جدول المقارنة (قبل / بعد التعديل)
          </h2>
          {data.comparison ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={btn}
                onClick={() =>
                  updateComparisonField(
                    "visible",
                    data.comparison?.visible === false
                  )
                }
              >
                {data.comparison.visible === false
                  ? "إظهار الجدول في الموقع"
                  : "إخفاء الجدول في الموقع"}
              </button>
              <button
                type="button"
                className={redBtn}
                onClick={removeComparison}
              >
                حذف الجدول
              </button>
            </div>
          ) : (
            <button type="button" className={btn} onClick={ensureComparison}>
              + إضافة جدول مقارنة
            </button>
          )}
        </div>

        {data.comparison && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className={smallLabel}>عنوان الجدول</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={data.comparison.title}
                  onChange={(e) =>
                    updateComparisonField("title", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={smallLabel}>
                  نص المادة (مثلاً: المادة الخامسة)
                </label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={data.comparison.article}
                  onChange={(e) =>
                    updateComparisonField("article", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={smallLabel}>عنوان "قبل التعديل"</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm mb-2"
                  value={data.comparison.before.title}
                  onChange={(e) =>
                    updateComparisonSide("before", "title", e.target.value)
                  }
                />
                <label className={smallLabel}>النص</label>
                <textarea
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-20"
                  value={data.comparison.before.content}
                  onChange={(e) =>
                    updateComparisonSide("before", "content", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={smallLabel}>عنوان "بعد التعديل"</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm mb-2"
                  value={data.comparison.after.title}
                  onChange={(e) =>
                    updateComparisonSide("after", "title", e.target.value)
                  }
                />
                <label className={smallLabel}>النص</label>
                <textarea
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-20"
                  value={data.comparison.after.content}
                  onChange={(e) =>
                    updateComparisonSide("after", "content", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Save bar */}
      <section className="border border-gray-300 bg-white px-4 py-4 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          سيتم الحفظ إلى الملف: <code>src/data/internal-rules.json</code>
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2">
          {toast}
        </div>
      )}
    </div>
  );
}
