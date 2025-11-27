"use client";

import { useMemo, useState, useTransition } from "react";
import { saveRules } from "../actions";

/* ---------- Types aligned with JSON ---------- */

type Article = {
  number: string; // we normalize to string even if JSON had number
  title: string;
  content: string;
  items?: string[];
  note?: string;
  visible?: boolean; // show/hide in public page
};

type Amendment = {
  title: string;
  content: string;
  visible?: boolean;
};

type ComparisonSide = {
  title: string;
  content: string;
};

type Comparison = {
  title: string;
  subtitle: string;
  before: ComparisonSide;
  after: ComparisonSide;
  visible?: boolean;
};

type ExtraBlock = {
  title: string;
  content: string;
  visible?: boolean;
};

type RulesData = {
  title: string;
  subtitle?: string;
  associationName?: string;
  articles: Article[];
  amendment?: Amendment;
  comparison?: Comparison;
  extraBlocks?: ExtraBlock[]; // future custom blocks
};

type Props = {
  initialData: RulesData;
};

/* ---------- Styling helpers (flat, consistent admin UI) ---------- */

const btn =
  "border border-gray-300 px-3 py-2 text-sm whitespace-nowrap hover:bg-gray-50 cursor-pointer";
const primaryBtn =
  "bg-main-100 text-white text-sm px-5 py-2 cursor-pointer hover:bg-gray-800";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const smallLabel = "text-xs text-gray-500";

/* ---------- Normalization ---------- */

function normalize(initial: RulesData): RulesData {
  return {
    title: initial.title ?? "",
    subtitle: initial.subtitle ?? "",
    associationName: initial.associationName ?? "",
    articles: (initial.articles || []).map((a) => ({
      number: String(a.number ?? ""),
      title: a.title ?? "",
      content: a.content ?? "",
      items: a.items ? [...a.items] : [],
      note: a.note ?? "",
      visible: a.visible,
    })),
    amendment: initial.amendment
      ? {
          title: initial.amendment.title ?? "",
          content: initial.amendment.content ?? "",
          visible: initial.amendment.visible,
        }
      : undefined,
    comparison: initial.comparison
      ? {
          title: initial.comparison.title ?? "",
          subtitle: initial.comparison.subtitle ?? "",
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
    extraBlocks: (initial.extraBlocks || []).map((b) => ({
      title: b.title ?? "",
      content: b.content ?? "",
      visible: b.visible,
    })),
  };
}

/* ---------- Component ---------- */

export default function RulesAdminClient({ initialData }: Props) {
  const [data, setData] = useState<RulesData>(() => normalize(initialData));
  const [activeArticleIdx, setActiveArticleIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  /* ---- Top-level fields ---- */

  const updateField = <K extends keyof RulesData>(
    key: K,
    value: RulesData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  /* ---- Articles helpers ---- */

  const setArticles = (updater: (a: Article[]) => Article[]) => {
    setData((prev) => ({ ...prev, articles: updater(prev.articles || []) }));
  };

  const addArticle = () => {
    setArticles((articles) => [
      ...articles,
      {
        number: String(articles.length + 1),
        title: "عنوان مادة جديدة",
        content: "",
        items: [],
        note: "",
        visible: true,
      },
    ]);
    setActiveArticleIdx(data.articles.length);
  };

  const moveArticle = (index: number, direction: "up" | "down") => {
    setArticles((articles) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= articles.length) return articles;
      const copy = [...articles];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
    setActiveArticleIdx((idx) => {
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0) return 0;
      if (target >= data.articles.length) return data.articles.length - 1;
      return target;
    });
  };

  const deleteArticle = (index: number) => {
    setArticles((articles) => {
      const copy = [...articles];
      copy.splice(index, 1);
      return copy;
    });
    setActiveArticleIdx((idx) => (idx > 0 ? idx - 1 : 0));
  };

  const toggleArticleVisible = (index: number) => {
    setArticles((articles) =>
      articles.map((a, i) =>
        i === index ? { ...a, visible: a.visible === false ? true : false } : a
      )
    );
  };

  const updateArticleField = (
    index: number,
    field: keyof Article,
    value: string
  ) => {
    setArticles((articles) =>
      articles.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const addArticleItem = (index: number) => {
    setArticles((articles) =>
      articles.map((a, i) =>
        i === index ? { ...a, items: [...(a.items || []), ""] } : a
      )
    );
  };

  const updateArticleItem = (
    index: number,
    itemIndex: number,
    value: string
  ) => {
    setArticles((articles) =>
      articles.map((a, i) =>
        i === index
          ? {
              ...a,
              items: (a.items || []).map((it, ii) =>
                ii === itemIndex ? value : it
              ),
            }
          : a
      )
    );
  };

  const removeArticleItem = (index: number, itemIndex: number) => {
    setArticles((articles) =>
      articles.map((a, i) =>
        i === index
          ? {
              ...a,
              items: (a.items || []).filter((_, ii) => ii !== itemIndex),
            }
          : a
      )
    );
  };

  const articles = data.articles || [];
  const activeArticle = articles[activeArticleIdx] ?? articles[0];

  /* ---- Amendment helpers ---- */

  const ensureAmendment = () => {
    if (!data.amendment) {
      setData((prev) => ({
        ...prev,
        amendment: {
          title: "التعديل",
          content: "",
          visible: true,
        },
      }));
    }
  };

  const removeAmendment = () => {
    setData((prev) => ({ ...prev, amendment: undefined }));
  };

  const updateAmendmentField = (
    field: keyof Amendment,
    value: string | boolean
  ) => {
    setData((prev) => {
      if (!prev.amendment) return prev;
      return {
        ...prev,
        amendment: { ...prev.amendment, [field]: value as any },
      };
    });
  };

  /* ---- Comparison helpers ---- */

  const ensureComparison = () => {
    if (!data.comparison) {
      setData((prev) => ({
        ...prev,
        comparison: {
          title: "مقارنة بالمواد التي كانت قبل التعديل وبعده",
          subtitle: "",
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
        comparison: { ...prev.comparison, [field]: value as any },
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

  /* ---- Extra blocks (future custom blocks) ---- */

  const setExtraBlocks = (updater: (b: ExtraBlock[]) => ExtraBlock[]) => {
    setData((prev) => ({
      ...prev,
      extraBlocks: updater(prev.extraBlocks || []),
    }));
  };

  const addExtraBlock = () => {
    setExtraBlocks((blocks) => [
      ...blocks,
      {
        title: "عنوان كتلة جديدة",
        content: "",
        visible: true,
      },
    ]);
  };

  const updateExtraBlockField = (
    index: number,
    field: keyof ExtraBlock,
    value: string
  ) => {
    setExtraBlocks((blocks) =>
      blocks.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  const toggleExtraBlockVisible = (index: number) => {
    setExtraBlocks((blocks) =>
      blocks.map((b, i) =>
        i === index ? { ...b, visible: b.visible === false ? true : false } : b
      )
    );
  };

  const removeExtraBlock = (index: number) => {
    setExtraBlocks((blocks) => blocks.filter((_, i) => i !== index));
  };

  /* ---- Save ---- */

  const handleSave = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("payload", jsonString);
        await saveRules(fd);
        showToast("تم الحفظ وتحديث الملف بنجاح.");
      } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء الحفظ.");
      }
    });
  };

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

      {/* Articles toolbar + selector */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={addArticle}>
            + إضافة مادة جديدة
          </button>

          <div className="flex flex-wrap gap-2">
            {articles.map((a, idx) => {
              const active = idx === activeArticleIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={
                    "border px-3 py-2 text-sm whitespace-nowrap cursor-pointer" +
                    (active ? " bg-gray-200" : " hover:bg-gray-50")
                  }
                  onClick={() => setActiveArticleIdx(idx)}
                >
                  {a.number || idx + 1}. {a.title || "مادة بدون عنوان"}
                </button>
              );
            })}
          </div>
        </div>

        {activeArticle && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={btn}
                onClick={() => moveArticle(activeArticleIdx, "up")}
              >
                للأعلى ↑
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => moveArticle(activeArticleIdx, "down")}
              >
                للأسفل ↓
              </button>
              <button
                type="button"
                className={redBtn}
                onClick={() => deleteArticle(activeArticleIdx)}
              >
                حذف المادة
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => toggleArticleVisible(activeArticleIdx)}
              >
                {activeArticle.visible === false
                  ? "إظهار المادة في الموقع"
                  : "إخفاء المادة في الموقع"}
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={smallLabel}>رقم المادة</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeArticle.number}
                  onChange={(e) =>
                    updateArticleField(
                      activeArticleIdx,
                      "number",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={smallLabel}>عنوان المادة</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeArticle.title}
                  onChange={(e) =>
                    updateArticleField(
                      activeArticleIdx,
                      "title",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div>
              <label className={smallLabel}>نص المادة</label>
              <textarea
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-[120px]"
                value={activeArticle.content}
                onChange={(e) =>
                  updateArticleField(
                    activeArticleIdx,
                    "content",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className={smallLabel}>بنود مرقمة (قائمة)</span>
                <button
                  type="button"
                  className={btn}
                  onClick={() => addArticleItem(activeArticleIdx)}
                >
                  + إضافة بند
                </button>
              </div>
              {(activeArticle.items || []).map((it, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-2">
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeArticleItem(activeArticleIdx, itemIdx)}
                  >
                    حذف
                  </button>
                  <input
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm"
                    value={it}
                    onChange={(e) =>
                      updateArticleItem(
                        activeArticleIdx,
                        itemIdx,
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>

            <div>
              <label className={smallLabel}>ملاحظة (note) اختيارية</label>
              <textarea
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-[60px]"
                value={activeArticle.note ?? ""}
                onChange={(e) =>
                  updateArticleField(activeArticleIdx, "note", e.target.value)
                }
              />
            </div>
          </div>
        )}

        {!articles.length && (
          <p className="text-xs text-gray-500 mt-3">
            لا توجد مواد حالياً. اضغط على &quot;إضافة مادة جديدة&quot; للبدء.
          </p>
        )}
      </section>

      {/* Amendment section */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">قسم التعديل (Amendment)</h2>
          {data.amendment ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={btn}
                onClick={() =>
                  updateAmendmentField(
                    "visible",
                    data.amendment?.visible === false
                  )
                }
              >
                {data.amendment.visible === false
                  ? "إظهار التعديل في الموقع"
                  : "إخفاء التعديل في الموقع"}
              </button>
              <button
                type="button"
                className={redBtn}
                onClick={removeAmendment}
              >
                حذف قسم التعديل
              </button>
            </div>
          ) : (
            <button type="button" className={btn} onClick={ensureAmendment}>
              + إضافة قسم التعديل
            </button>
          )}
        </div>

        {data.amendment && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <label className={smallLabel}>عنوان التعديل</label>
              <input
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                value={data.amendment.title}
                onChange={(e) => updateAmendmentField("title", e.target.value)}
              />
            </div>
            <div>
              <label className={smallLabel}>نص التعديل</label>
              <textarea
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-[100px]"
                value={data.amendment.content}
                onChange={(e) =>
                  updateAmendmentField("content", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </section>

      {/* Comparison section */}
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={smallLabel}>عنوان الجدول</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm mb-2"
                  value={data.comparison.title}
                  onChange={(e) =>
                    updateComparisonField("title", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={smallLabel}>العنوان الفرعي (Subtitle)</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm mb-2"
                  value={data.comparison.subtitle}
                  onChange={(e) =>
                    updateComparisonField("subtitle", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={smallLabel}>
                  عنوان &quot;قبل التعديل&quot;
                </label>
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
                <label className={smallLabel}>
                  عنوان &quot;بعد التعديل&quot;
                </label>
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

      {/* Extra blocks (future use) */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">
            كتل إضافية (للاستخدام المستقبلي في الصفحة)
          </h2>
          <button type="button" className={btn} onClick={addExtraBlock}>
            + إضافة كتلة جديدة
          </button>
        </div>

        <div className="space-y-3">
          {(data.extraBlocks || []).map((b, idx) => (
            <div
              key={idx}
              className="border border-gray-200 px-3 py-3 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className={smallLabel}>عنوان الكتلة</label>
                  <input
                    className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                    value={b.title}
                    onChange={(e) =>
                      updateExtraBlockField(idx, "title", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={btn}
                    onClick={() => toggleExtraBlockVisible(idx)}
                  >
                    {b.visible === false
                      ? "إظهار في الموقع (عند الربط)"
                      : "إخفاء في الموقع (عند الربط)"}
                  </button>
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeExtraBlock(idx)}
                  >
                    حذف
                  </button>
                </div>
              </div>
              <div>
                <label className={smallLabel}>النص</label>
                <textarea
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-20"
                  value={b.content}
                  onChange={(e) =>
                    updateExtraBlockField(idx, "content", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          {!(data.extraBlocks || []).length && (
            <p className="text-xs text-gray-500">
              لا توجد كتل إضافية حالياً. يمكن استخدامها لاحقاً إذا قررنا عرض كتل
              جديدة في صفحة النظام الأساسي.
            </p>
          )}
        </div>
      </section>

      {/* Save bar */}
      <section className="border border-gray-300 bg-white px-4 py-4 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          سيتم الحفظ إلى الملف: <code>src/data/rules.json</code>
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
