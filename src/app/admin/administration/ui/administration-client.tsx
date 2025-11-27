"use client";

import { useMemo, useState, useTransition } from "react";
import { saveAdministration } from "../actions";

/* ---------- Types aligned with JSON ---------- */

type Member = {
  name: string;
  position: string;
  visible?: boolean; // for future use if needed
};

type Board = {
  year: string;
  title: string;
  description?: string;
  note?: string;
  members: Member[];
  visible?: boolean; // show/hide in public page
};

type AdministrationData = {
  title: string;
  subtitle?: string;
  boards: Board[];
};

type Props = {
  initialData: AdministrationData;
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

function normalize(initial: AdministrationData): AdministrationData {
  return {
    title: initial.title ?? "",
    subtitle: initial.subtitle ?? "",
    boards: (initial.boards || []).map((b) => ({
      year: b.year ?? "",
      title: b.title ?? "",
      description: b.description ?? "",
      note: b.note ?? "",
      visible: b.visible, // keep as-is if present
      members: (b.members || []).map((m) => ({
        name: m.name ?? "",
        position: m.position ?? "",
        visible: m.visible,
      })),
    })),
  };
}

/* ---------- Component ---------- */

export default function AdministrationAdminClient({ initialData }: Props) {
  const [data, setData] = useState<AdministrationData>(() =>
    normalize(initialData)
  );
  const [activeBoardIdx, setActiveBoardIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  /* ---- Top-level fields ---- */

  const updateField = <K extends keyof AdministrationData>(
    key: K,
    value: AdministrationData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  /* ---- Boards helpers ---- */

  const setBoards = (updater: (b: Board[]) => Board[]) => {
    setData((prev) => ({ ...prev, boards: updater(prev.boards || []) }));
  };

  const addBoard = () => {
    setBoards((boards) => [
      ...boards,
      {
        year: "",
        title: "هيئة إدارية جديدة",
        description: "",
        note: "",
        members: [],
        visible: true,
      },
    ]);
    setActiveBoardIdx(data.boards.length);
  };

  const moveBoard = (index: number, direction: "up" | "down") => {
    setBoards((boards) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= boards.length) return boards;
      const copy = [...boards];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
    setActiveBoardIdx((idx) => {
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0) return 0;
      if (target >= data.boards.length) return data.boards.length - 1;
      return target;
    });
  };

  const deleteBoard = (index: number) => {
    setBoards((boards) => {
      const copy = [...boards];
      copy.splice(index, 1);
      return copy;
    });
    setActiveBoardIdx((idx) => (idx > 0 ? idx - 1 : 0));
  };

  const toggleBoardVisible = (index: number) => {
    setBoards((boards) =>
      boards.map((b, i) =>
        i === index ? { ...b, visible: b.visible === false ? true : false } : b
      )
    );
  };

  const updateBoardField = (
    index: number,
    field: keyof Board,
    value: string
  ) => {
    setBoards((boards) =>
      boards.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  const boards = data.boards || [];
  const activeBoard = boards[activeBoardIdx] ?? boards[0];

  /* ---- Members helpers ---- */

  const setMembers = (
    boardIndex: number,
    updater: (m: Member[]) => Member[]
  ) => {
    setBoards((boards) =>
      boards.map((b, i) =>
        i === boardIndex ? { ...b, members: updater(b.members || []) } : b
      )
    );
  };

  const addMember = (boardIndex: number) => {
    setMembers(boardIndex, (members) => [
      ...members,
      { name: "", position: "", visible: true },
    ]);
  };

  const updateMemberField = (
    boardIndex: number,
    memberIndex: number,
    field: keyof Member,
    value: string
  ) => {
    setMembers(boardIndex, (members) =>
      members.map((m, i) => (i === memberIndex ? { ...m, [field]: value } : m))
    );
  };

  const removeMember = (boardIndex: number, memberIndex: number) => {
    setMembers(boardIndex, (members) =>
      members.filter((_, i) => i !== memberIndex)
    );
  };

  /* ---- Save ---- */

  const handleSave = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("payload", jsonString);
        await saveAdministration(fd);
        showToast("تم الحفظ وتحديث الملف بنجاح.");
      } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء الحفظ.");
      }
    });
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header (title / subtitle) */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-4">
        <h2 className="text-lg font-medium">العناوين الرئيسية</h2>
        <div className="grid sm:grid-cols-2 gap-4">
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
        </div>
      </section>

      {/* Boards toolbar + selector */}
      <section className="border border-gray-300 bg-white px-4 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={addBoard}>
            + إضافة هيئة إدارية جديدة
          </button>

          <div className="flex flex-wrap gap-2">
            {boards.map((b, idx) => {
              const active = idx === activeBoardIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={
                    "border px-3 py-2 text-sm whitespace-nowrap cursor-pointer" +
                    (active ? " bg-gray-200" : " hover:bg-gray-50")
                  }
                  onClick={() => setActiveBoardIdx(idx)}
                >
                  {b.year || "بدون سنة"} — {b.title || "هيئة بدون عنوان"}
                </button>
              );
            })}
          </div>
        </div>

        {activeBoard && (
          <div className="space-y-4 border-top border-gray-200 pt-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={btn}
                onClick={() => moveBoard(activeBoardIdx, "up")}
              >
                للأعلى ↑
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => moveBoard(activeBoardIdx, "down")}
              >
                للأسفل ↓
              </button>
              <button
                type="button"
                className={redBtn}
                onClick={() => deleteBoard(activeBoardIdx)}
              >
                حذف هذه الهيئة
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => toggleBoardVisible(activeBoardIdx)}
              >
                {activeBoard.visible === false
                  ? "إظهار الهيئة في الموقع"
                  : "إخفاء الهيئة في الموقع"}
              </button>
            </div>

            {/* Board fields */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={smallLabel}>السنة</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeBoard.year}
                  onChange={(e) =>
                    updateBoardField(activeBoardIdx, "year", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={smallLabel}>عنوان الهيئة</label>
                <input
                  className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                  value={activeBoard.title}
                  onChange={(e) =>
                    updateBoardField(activeBoardIdx, "title", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className={smallLabel}>الوصف</label>
              <textarea
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-20"
                value={activeBoard.description ?? ""}
                onChange={(e) =>
                  updateBoardField(
                    activeBoardIdx,
                    "description",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className={smallLabel}>ملاحظة (اختيارية)</label>
              <textarea
                className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm min-h-[60px]"
                value={activeBoard.note ?? ""}
                onChange={(e) =>
                  updateBoardField(activeBoardIdx, "note", e.target.value)
                }
              />
            </div>

            {/* Members */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">
                  أعضاء هذه الهيئة الإدارية
                </h3>
                <button
                  type="button"
                  className={btn}
                  onClick={() => addMember(activeBoardIdx)}
                >
                  + إضافة عضو
                </button>
              </div>

              <div className="space-y-2">
                {(activeBoard.members || []).map((m, memberIdx) => (
                  <div
                    key={memberIdx}
                    className="border border-gray-200 px-3 py-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-500">
                        عضو رقم {memberIdx + 1}
                      </span>
                      <button
                        type="button"
                        className={redBtn}
                        onClick={() => removeMember(activeBoardIdx, memberIdx)}
                      >
                        حذف العضو
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={smallLabel}>الاسم</label>
                        <input
                          className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                          value={m.name}
                          onChange={(e) =>
                            updateMemberField(
                              activeBoardIdx,
                              memberIdx,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className={smallLabel}>الصفة / المنصب</label>
                        <input
                          className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm"
                          value={m.position}
                          onChange={(e) =>
                            updateMemberField(
                              activeBoardIdx,
                              memberIdx,
                              "position",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {!(activeBoard.members || []).length && (
                  <p className="text-xs text-gray-500">
                    لا يوجد أعضاء حالياً. اضغط على &quot;إضافة عضو&quot; لبدء
                    تعبئة الهيئة الإدارية.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!boards.length && (
          <p className="text-xs text-gray-500 mt-3">
            لا توجد هيئات إدارية حالياً. اضغط على &quot;إضافة هيئة إدارية
            جديدة&quot; للبدء.
          </p>
        )}
      </section>

      {/* Save bar */}
      <section className="border border-gray-300 bg-white px-4 py-4 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          سيتم الحفظ إلى الملف: <code>src/data/administration.json</code>
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
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
