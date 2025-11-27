"use client";

import { useState, useTransition } from "react";
import { saveGraduation } from "../actions";

// ---- Types ----
type YearList = {
  key: string;
  title: string;
  names: string[];
  visible?: boolean; // optional: hide/show this list on site
};

type YearBlock = {
  year: string;
  lists: YearList[];
  visible?: boolean; // optional: hide/show year on site
};

type GraduationJSON = {
  years: YearBlock[];
};

type Props = {
  initialData: GraduationJSON;
};

// ---- UI helpers (flat admin styling, no rounded / no shadow) ----
const btn =
  "border border-gray-300 px-3 py-2 text-sm whitespace-nowrap hover:bg-gray-50 cursor-pointer";
const primaryBtn =
  "bg-main-100 text-white text-sm px-5 py-2 cursor-pointer hover:bg-gray-800";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const smallLabel = "text-xs text-gray-500";

function normalizeData(initial: GraduationJSON): GraduationJSON {
  return {
    years: (initial.years || []).map((y) => ({
      year: y.year ?? "",
      visible: y.visible,
      lists: (y.lists || []).map((lst) => ({
        key: lst.key ?? "",
        title: lst.title ?? "",
        names: lst.names ? [...lst.names] : [],
        visible: lst.visible,
      })),
    })),
  };
}

// ---- Component ----
export default function GraduationAdminClient({ initialData }: Props) {
  const [data, setData] = useState<GraduationJSON>(() =>
    normalizeData(initialData)
  );
  const [activeYear, setActiveYear] = useState(data.years[0]?.year ?? "");
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ---- helpers to update state ----
  const setYears = (updater: (years: YearBlock[]) => YearBlock[]) => {
    setData((prev) => ({
      ...prev,
      years: updater(prev.years || []),
    }));
  };

  const currentIndex = Math.max(
    0,
    data.years.findIndex((y) => y.year === activeYear)
  );
  const currentYear = data.years[currentIndex];

  // add a new year with 8 empty categories
  const handleAddYear = () => {
    const newYearValue =
      (Number(data.years[0]?.year) || new Date().getFullYear()) + 1;
    const newYear: YearBlock = {
      year: String(newYearValue),
      visible: true,
      lists: Array.from({ length: 8 }).map((_, idx) => ({
        key: `cat${idx + 1}`,
        title: `فئة ${idx + 1}`,
        names: [],
        visible: true,
      })),
    };

    setYears((years) => [newYear, ...years]);
    setActiveYear(String(newYearValue));
  };

  const handleDeleteYear = (index: number) => {
    setYears((years) => {
      const copy = [...years];
      copy.splice(index, 1);
      const next = copy[0]?.year ?? "";
      setActiveYear(next);
      return copy;
    });
  };

  const moveYear = (index: number, direction: "up" | "down") => {
    setYears((years) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= years.length) return years;

      const copy = [...years];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);

      return copy;
    });
  };

  const toggleYearVisible = (index: number) => {
    setYears((years) =>
      years.map((y, i) =>
        i === index ? { ...y, visible: y.visible === false ? true : false } : y
      )
    );
  };

  const updateYearField = (index: number, value: string) => {
    setYears((years) =>
      years.map((y, i) => (i === index ? { ...y, year: value } : y))
    );
    if (index === currentIndex) {
      setActiveYear(value);
    }
  };

  const updateListTitle = (yearIdx: number, listIdx: number, title: string) => {
    setYears((years) =>
      years.map((y, yi) =>
        yi === yearIdx
          ? {
              ...y,
              lists: y.lists.map((lst, li) =>
                li === listIdx ? { ...lst, title } : lst
              ),
            }
          : y
      )
    );
  };

  const toggleListVisible = (yearIdx: number, listIdx: number) => {
    setYears((years) =>
      years.map((y, yi) =>
        yi === yearIdx
          ? {
              ...y,
              lists: y.lists.map((lst, li) =>
                li === listIdx
                  ? {
                      ...lst,
                      visible: lst.visible === false ? true : false,
                    }
                  : lst
              ),
            }
          : y
      )
    );
  };

  const updateName = (
    yearIdx: number,
    listIdx: number,
    nameIdx: number,
    value: string
  ) => {
    setYears((years) =>
      years.map((y, yi) =>
        yi === yearIdx
          ? {
              ...y,
              lists: y.lists.map((lst, li) =>
                li === listIdx
                  ? {
                      ...lst,
                      names: lst.names.map((n, ni) =>
                        ni === nameIdx ? value : n
                      ),
                    }
                  : lst
              ),
            }
          : y
      )
    );
  };

  const addName = (yearIdx: number, listIdx: number) => {
    setYears((years) =>
      years.map((y, yi) =>
        yi === yearIdx
          ? {
              ...y,
              lists: y.lists.map((lst, li) =>
                li === listIdx
                  ? {
                      ...lst,
                      names: [...lst.names, ""],
                    }
                  : lst
              ),
            }
          : y
      )
    );
  };

  const removeName = (yearIdx: number, listIdx: number, nameIdx: number) => {
    setYears((years) =>
      years.map((y, yi) =>
        yi === yearIdx
          ? {
              ...y,
              lists: y.lists.map((lst, li) =>
                li === listIdx
                  ? {
                      ...lst,
                      names: lst.names.filter((_, ni) => ni !== nameIdx),
                    }
                  : lst
              ),
            }
          : y
      )
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("payload", JSON.stringify(data));
        await saveGraduation(fd);
        setToast("تم الحفظ وتحديث الملف بنجاح.");
      } catch (e) {
        console.error(e);
        setToast("حدث خطأ أثناء الحفظ.");
      } finally {
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  if (!currentYear) {
    return (
      <div className="p-6 text-center text-gray-600">
        لا توجد سنوات بعد. اضغط على زر إضافة سنة جديدة.
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={btn} onClick={handleAddYear}>
          + إضافة سنة جديدة
        </button>

        {/* Year tabs */}
        <div className="flex flex-wrap gap-2">
          {data.years.map((y, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                className={
                  "border px-3 py-2 text-sm whitespace-nowrap cursor-pointer" +
                  (active ? " bg-gray-200" : " hover:bg-gray-50")
                }
                onClick={() => setActiveYear(y.year)}
              >
                سنة {y.year || "بدون اسم"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Year controls */}
      <div className="space-y-4 border border-gray-300 px-4 py-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={redBtn}
            onClick={() => handleDeleteYear(currentIndex)}
          >
            حذف السنة
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => moveYear(currentIndex, "down")}
          >
            للأسفل ↓
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => moveYear(currentIndex, "up")}
          >
            للأعلى ↑
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => toggleYearVisible(currentIndex)}
          >
            {currentYear.visible === false
              ? "إظهار السنة في الموقع"
              : "إخفاء السنة في الموقع"}
          </button>
        </div>

        <div className="flex flex-wrap gap-6 items-end">
          <div>
            <label className={smallLabel}>السنة</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 px-3 py-2 text-sm w-32"
              value={currentYear.year}
              onChange={(e) => updateYearField(currentIndex, e.target.value)}
            />
          </div>
          <div className="text-xs text-gray-500">
            سيظهر الرابط ك{" "}
            <code className="mr-1">?y={currentYear.year || "YYYY"}</code>
          </div>
        </div>

        <p className={smallLabel}>
          الصور لهذه السنة تُقرأ من المجلد{" "}
          <code>public/graduation/{currentYear.year}</code> في واجهة الموقع.
        </p>
      </div>

      {/* Lists for current year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(currentYear.lists || []).map((lst, listIdx) => {
          const noNames = lst.names.length === 0;
          return (
            <div
              key={lst.key || listIdx}
              className="border border-gray-300 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className={smallLabel}>عنوان الفئة</label>
                  <input
                    type="text"
                    className="mt-1 border border-gray-300 px-3 py-2 text-sm w-full"
                    value={lst.title}
                    onChange={(e) =>
                      updateListTitle(currentIndex, listIdx, e.target.value)
                    }
                  />
                  <div className={smallLabel}>
                    المفتاح: {lst.key || `cat${listIdx + 1}`}
                  </div>
                </div>
                <button
                  type="button"
                  className={btn}
                  onClick={() => toggleListVisible(currentIndex, listIdx)}
                >
                  {lst.visible === false
                    ? "إظهار الفئة في الموقع"
                    : "إخفاء الفئة في الموقع"}
                </button>
              </div>

              <div className="space-y-2">
                {lst.names.map((name, nameIdx) => (
                  <div key={nameIdx} className="flex items-center gap-2">
                    <button
                      type="button"
                      className={redBtn}
                      onClick={() => removeName(currentIndex, listIdx, nameIdx)}
                    >
                      حذف
                    </button>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 px-3 py-2 text-sm"
                      value={name}
                      onChange={(e) =>
                        updateName(
                          currentIndex,
                          listIdx,
                          nameIdx,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}

                {noNames && (
                  <p className="text-xs text-gray-500">
                    لا توجد أسماء مسجّلة لهذه الفئة في سنة {currentYear.year}.
                  </p>
                )}

                <button
                  type="button"
                  className={btn}
                  onClick={() => addName(currentIndex, listIdx)}
                >
                  + إضافة اسم
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save button */}
      <div className="border border-gray-300 p-4 flex justify-start">
        <button
          type="button"
          className={primaryBtn}
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "جارٍ الحفظ..." : "حفظ"}
        </button>
      </div>

      {/* Toast (bottom center) */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
