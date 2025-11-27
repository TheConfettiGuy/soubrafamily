"use client";

import { useMemo, useState } from "react";
import { saveOrigin } from "@/app/admin/origin/action";

/* ----------------- Types matching your JSON ----------------- */
type TextSection = {
  id: string;
  type: "text";
  content: string;
};

type HighlightSection = {
  id: string;
  type: "highlight";
  paragraphs: string[];
};

type ListItem = { name: string; description?: string };
type Profile = { name: string; description?: string };
type AdditionalMembers = { title: string; members: string[] };

type RichSection = {
  id: string;
  type: "section";
  title: string;
  intro?: string;
  paragraphs?: string[];
  list?: ListItem[];
  profiles?: Profile[];
  additionalMembers?: AdditionalMembers;
};

type Section = TextSection | HighlightSection | RichSection;

type OriginData = {
  title: string;
  subtitle?: string;
  author?: string;
  sections: Section[];
};

/* ----------------- Small helpers ----------------- */
function slugify(s: string) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-]+/gu, "")
    .replace(/\-+/g, "-")
    .replace(/^\-|\-$/g, "");
}
function uid(prefix = "sec") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ----------------- Toast (auto-hide) ----------------- */
function Toast({ open, text }: { open: boolean; text: string }) {
  return (
    <div
      className={[
        "fixed bottom-4 right-4 z-[1000] transition-all duration-300",
        open
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
      dir="rtl"
    >
      <div className=" px-4 py-3 bg-gray-900 text-white shadow-lg">
        {text}
      </div>
    </div>
  );
}

/* ----------------- Main component ----------------- */
export default function AdminOriginClient({
  initialData,
}: {
  initialData: OriginData;
}) {
  const [data, setData] = useState<OriginData>(initialData);
  const [newSectionType, setNewSectionType] = useState<
    "text" | "highlight" | "section"
  >("section");

  // toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("تم الحفظ وتحديث الصفحة.");

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const update = <K extends keyof OriginData>(key: K, val: OriginData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const updateSection = (idx: number, patch: Partial<Section>) =>
    setData((d) => {
      const next = [...d.sections];
      next[idx] = { ...next[idx], ...patch } as Section;
      return { ...d, sections: next };
    });

  const removeSection = (idx: number) =>
    setData((d) => {
      const next = [...d.sections];
      next.splice(idx, 1);
      return { ...d, sections: next };
    });

  const moveSection = (idx: number, dir: -1 | 1) =>
    setData((d) => {
      const next = [...d.sections];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return d;
      [next[idx], next[to]] = [next[to], next[idx]];
      return { ...d, sections: next };
    });

  const addSection = () =>
    setData((d) => {
      const next = [...d.sections];
      if (newSectionType === "text") {
        next.push({ id: uid("text"), type: "text", content: "" });
      } else if (newSectionType === "highlight") {
        next.push({ id: uid("hl"), type: "highlight", paragraphs: [""] });
      } else {
        next.push({
          id: uid("sec"),
          type: "section",
          title: "عنوان جديد",
          intro: "",
          paragraphs: [],
          list: [],
          profiles: [],
        });
      }
      return { ...d, sections: next };
    });

  // helper classes for buttons
  const blueBtn = "bg-main-100 text-white cursor-pointer  px-3 py-2 pointer";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap pointer";

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header fields */}
      <section className=" border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">العناوين الرئيسية</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">العنوان</label>
            <input
              className="w-full  border px-3 py-2"
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">العنوان الفرعي</label>
            <input
              className="w-full  border px-3 py-2"
              value={data.subtitle ?? ""}
              onChange={(e) => update("subtitle", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">المؤلف</label>
            <input
              className="w-full  border px-3 py-2"
              value={data.author ?? ""}
              onChange={(e) => update("author", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Add Section */}
      <section className=" border bg-white p-4 space-y-3">
        <h2 className="text-lg font-medium">إضافة قسم جديد</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className=" border px-3 py-2"
            value={newSectionType}
            onChange={(e) => setNewSectionType(e.target.value as any)}
          >
            <option value="section">قسم (عنوان/فقرات/قوائم/سير)</option>
            <option value="text">نص حر</option>
            <option value="highlight">إبراز (فقرات)</option>
          </select>
          <button className={blueBtn} onClick={addSection} type="button">
            + إضافة
          </button>
        </div>
      </section>

      {/* Sections */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium">الأقسام</h2>

        {data.sections.map((sec, i) => {
          const header = (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-gray-500">
                نوع: <b>{sec.type}</b> · id: <code>{sec.id}</code>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className=" px-3 py-2 border cursor-pointer"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                  type="button"
                >
                  ↑
                </button>
                <button
                  className=" px-3 py-2 border cursor-pointer"
                  onClick={() => moveSection(i, +1)}
                  disabled={i === data.sections.length - 1}
                  type="button"
                >
                  ↓
                </button>
                <button
                  className={redBtn}
                  onClick={() => removeSection(i)}
                  type="button"
                >
                  حذف
                </button>
              </div>
            </div>
          );

          if (sec.type === "text") {
            return (
              <div
                key={sec.id}
                className=" border bg-white p-4 space-y-3"
              >
                {header}
                <label className="block text-sm mb-1">المحتوى</label>
                <textarea
                  className="w-full  border px-3 py-2 min-h-[120px]"
                  value={sec.content}
                  onChange={(e) =>
                    updateSection(i, { content: e.target.value })
                  }
                />
              </div>
            );
          }

          if (sec.type === "highlight") {
            return (
              <div
                key={sec.id}
                className=" border bg-white p-4 space-y-3"
              >
                {header}
                <div className="flex items-center justify-between">
                  <label className="block text-sm">الفقرات</label>
                  <button
                    className={blueBtn}
                    onClick={() =>
                      updateSection(i, {
                        paragraphs: [...(sec.paragraphs ?? []), ""],
                      })
                    }
                    type="button"
                  >
                    + فقرة
                  </button>
                </div>
                {(sec.paragraphs ?? []).map((p, pi) => (
                  <div key={pi} className="mb-2">
                    <textarea
                      className="w-full  border px-3 py-2 min-h-[80px]"
                      value={p}
                      onChange={(e) => {
                        const arr = [...(sec.paragraphs ?? [])];
                        arr[pi] = e.target.value;
                        updateSection(i, { paragraphs: arr });
                      }}
                    />
                    <div className="mt-1 text-left">
                      <button
                        className={redBtn}
                        onClick={() => {
                          const arr = [...(sec.paragraphs ?? [])];
                          arr.splice(pi, 1);
                          updateSection(i, { paragraphs: arr });
                        }}
                        type="button"
                      >
                        حذف الفقرة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          // rich "section"
          const rs = sec as RichSection;

          return (
            <div
              key={rs.id}
              className=" border bg-white p-4 space-y-4"
            >
              {header}

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">العنوان</label>
                  <input
                    className="w-full  border px-3 py-2"
                    value={rs.title}
                    onChange={(e) =>
                      updateSection(i, { title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    توليد معرف من العنوان
                  </label>
                  <button
                    className=" px-3 py-2 border cursor-pointer w-full"
                    onClick={() =>
                      updateSection(i, { id: slugify(rs.title) || uid("sec") })
                    }
                    type="button"
                  >
                    ضبط id تلقائياً
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">مقدمة (اختياري)</label>
                <textarea
                  className="w-full  border px-3 py-2 min-h-[80px]"
                  value={rs.intro ?? ""}
                  onChange={(e) => updateSection(i, { intro: e.target.value })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm">فقرات</label>
                  <button
                    className={blueBtn}
                    onClick={() =>
                      updateSection(i, {
                        paragraphs: [...(rs.paragraphs ?? []), ""],
                      })
                    }
                    type="button"
                  >
                    + فقرة
                  </button>
                </div>
                {(rs.paragraphs ?? []).map((p, pi) => (
                  <div key={pi} className="mb-2">
                    <textarea
                      className="w-full  border px-3 py-2 min-h-[80px]"
                      value={p}
                      onChange={(e) => {
                        const arr = [...(rs.paragraphs ?? [])];
                        arr[pi] = e.target.value;
                        updateSection(i, { paragraphs: arr });
                      }}
                    />
                    <div className="mt-1 text-left">
                      <button
                        className={redBtn}
                        onClick={() => {
                          const arr = [...(rs.paragraphs ?? [])];
                          arr.splice(pi, 1);
                          updateSection(i, { paragraphs: arr });
                        }}
                        type="button"
                      >
                        حذف الفقرة
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm">قائمة (أسماء + وصف)</label>
                  <button
                    className={blueBtn}
                    onClick={() =>
                      updateSection(i, {
                        list: [
                          ...(rs.list ?? []),
                          { name: "", description: "" },
                        ],
                      })
                    }
                    type="button"
                  >
                    + عنصر قائمة
                  </button>
                </div>
                {(rs.list ?? []).map((it, li) => (
                  <div key={li} className="grid sm:grid-cols-2 gap-2 mb-2">
                    <input
                      className=" border px-3 py-2"
                      value={it.name}
                      placeholder="الاسم"
                      onChange={(e) => {
                        const arr = [...(rs.list ?? [])];
                        arr[li] = { ...arr[li], name: e.target.value };
                        updateSection(i, { list: arr });
                      }}
                    />
                    <div className="flex gap-2">
                      <input
                        className="flex-1  border px-3 py-2"
                        value={it.description ?? ""}
                        placeholder="الوصف (اختياري)"
                        onChange={(e) => {
                          const arr = [...(rs.list ?? [])];
                          arr[li] = { ...arr[li], description: e.target.value };
                          updateSection(i, { list: arr });
                        }}
                      />
                      <button
                        className={redBtn}
                        onClick={() => {
                          const arr = [...(rs.list ?? [])];
                          arr.splice(li, 1);
                          updateSection(i, { list: arr });
                        }}
                        type="button"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm">أعلام / سير</label>
                  <button
                    className={blueBtn}
                    onClick={() =>
                      updateSection(i, {
                        profiles: [
                          ...(rs.profiles ?? []),
                          { name: "", description: "" },
                        ],
                      })
                    }
                    type="button"
                  >
                    + سيرة
                  </button>
                </div>
                {(rs.profiles ?? []).map((pf, pi) => (
                  <div key={pi} className="grid sm:grid-cols-2 gap-2 mb-2">
                    <input
                      className=" border px-3 py-2"
                      value={pf.name}
                      placeholder="الاسم"
                      onChange={(e) => {
                        const arr = [...(rs.profiles ?? [])];
                        arr[pi] = { ...arr[pi], name: e.target.value };
                        updateSection(i, { profiles: arr });
                      }}
                    />
                    <div className="flex gap-2">
                      <input
                        className="flex-1  border px-3 py-2"
                        value={pf.description ?? ""}
                        placeholder="الوصف"
                        onChange={(e) => {
                          const arr = [...(rs.profiles ?? [])];
                          arr[pi] = { ...arr[pi], description: e.target.value };
                          updateSection(i, { profiles: arr });
                        }}
                      />
                      <button
                        className={redBtn}
                        onClick={() => {
                          const arr = [...(rs.profiles ?? [])];
                          arr.splice(pi, 1);
                          updateSection(i, { profiles: arr });
                        }}
                        type="button"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm">أعضاء إضافيون</label>
                  {rs.additionalMembers ? (
                    <button
                      className={redBtn}
                      onClick={() =>
                        updateSection(i, { additionalMembers: undefined })
                      }
                      type="button"
                    >
                      إزالة الكتلة
                    </button>
                  ) : (
                    <button
                      className={blueBtn}
                      onClick={() =>
                        updateSection(i, {
                          additionalMembers: {
                            title: "أعضاء بارزون آخرون:",
                            members: [],
                          },
                        })
                      }
                      type="button"
                    >
                      + إضافة كتلة
                    </button>
                  )}
                </div>

                {rs.additionalMembers && (
                  <div className=" border p-3 space-y-3">
                    <input
                      className="w-full  border px-3 py-2"
                      value={rs.additionalMembers.title}
                      onChange={(e) =>
                        updateSection(i, {
                          additionalMembers: {
                            ...rs.additionalMembers!,
                            title: e.target.value,
                          },
                        })
                      }
                    />

                    <div className="space-y-2">
                      {(rs.additionalMembers.members ?? []).map((m, mi) => (
                        <div key={mi} className="flex gap-2">
                          <input
                            className="flex-1  border px-3 py-2"
                            value={m}
                            onChange={(e) => {
                              const arr = [
                                ...(rs.additionalMembers!.members ?? []),
                              ];
                              arr[mi] = e.target.value;
                              updateSection(i, {
                                additionalMembers: {
                                  ...rs.additionalMembers!,
                                  members: arr,
                                },
                              });
                            }}
                          />
                          <button
                            className={redBtn}
                            onClick={() => {
                              const arr = [
                                ...(rs.additionalMembers!.members ?? []),
                              ];
                              arr.splice(mi, 1);
                              updateSection(i, {
                                additionalMembers: {
                                  ...rs.additionalMembers!,
                                  members: arr,
                                },
                              });
                            }}
                            type="button"
                          >
                            حذف
                          </button>
                        </div>
                      ))}
                      <button
                        className={blueBtn}
                        onClick={() =>
                          updateSection(i, {
                            additionalMembers: {
                              ...rs.additionalMembers!,
                              members: [
                                ...(rs.additionalMembers!.members ?? []),
                                "",
                              ],
                            },
                          })
                        }
                        type="button"
                      >
                        + اسم
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Save */}
      <section className=" border bg-white p-4">
        <form
          action={async (fd) => {
            fd.set("payload", jsonString);
            await saveOrigin(fd);
            setToastText("تم الحفظ وتحديث الصفحة.");
            setToastOpen(true);
            setTimeout(() => setToastOpen(false), 2200);
          }}
          className="flex items-center justify-between gap-3"
        >
          <input type="hidden" name="payload" value={jsonString} readOnly />
          <div className="text-xs text-gray-500">
            سيتم الكتابة إلى: <code>src/data/origin.json</code>
          </div>
          <button className={blueBtn} type="submit">
            حفظ
          </button>
        </form>
      </section>

      {/* Toast */}
      <Toast open={toastOpen} text={toastText} />
    </div>
  );
}
