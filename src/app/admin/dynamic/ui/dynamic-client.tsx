"use client";

import { useState, useTransition } from "react";
import {
  CardsBlock,
  DynamicBlock,
  DynamicPageData,
  GalleryBlock,
  HeroBlock,
  ImageBlock,
  KeyFiguresBlock,
  ListBlock,
  saveDynamicPage,
  SectionBlock,
  SpacerBlock,
  TextBlock,
  TimelineBlock,
  TimelineItem,
} from "../actions";

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap pointer";

const toggleBase =
  "inline-flex items-center px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer";
const toggleOn = "bg-main-100 text-white border-main-100";
const toggleOff = "bg-gray-100 text-gray-600 border-gray-300";

function Toggle({
  on,
  labelOn,
  labelOff,
  onClick,
}: {
  on: boolean;
  labelOn: string;
  labelOff: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${toggleBase} ${on ? toggleOn : toggleOff}`}
      onClick={onClick}
    >
      <span className="ml-1 inline-block w-2 h-2 rounded-full bg-white" />
      {on ? labelOn : labelOff}
    </button>
  );
}

function makeId(prefix = "blk") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export default function DynamicAdminClient({
  initialData,
}: {
  initialData: DynamicPageData;
}) {
  const [data, setData] = useState<DynamicPageData>(initialData);
  const [saving, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  /* ---- generic updater ---- */
  const update = <K extends keyof DynamicPageData>(
    key: K,
    value: DynamicPageData[K]
  ) => setData((prev) => ({ ...prev, [key]: value }));

  const updateBlock = (index: number, patch: Partial<DynamicBlock>) =>
    setData((prev) => {
      const blocks = [...prev.blocks];
      blocks[index] = { ...blocks[index], ...patch } as DynamicBlock;
      return { ...prev, blocks };
    });

  const deleteBlock = (index: number) =>
    setData((prev) => {
      const blocks = [...prev.blocks];
      blocks.splice(index, 1);
      return { ...prev, blocks };
    });

  const moveBlock = (index: number, dir: -1 | 1) =>
    setData((prev) => {
      const blocks = [...prev.blocks];
      const to = index + dir;
      if (to < 0 || to >= blocks.length) return prev;
      [blocks[index], blocks[to]] = [blocks[to], blocks[index]];
      return { ...prev, blocks };
    });

  /* ---- add block helpers ---- */

  function addHero() {
    const block: HeroBlock = {
      id: makeId("hero"),
      type: "hero",
      visible: true,
      title: "عنوان كبير",
      subtitle: "",
    };
    update("blocks", [...data.blocks, block]);
  }

  function addSection() {
    const block: SectionBlock = {
      id: makeId("section"),
      type: "section",
      visible: true,
      title: "قسم جديد",
      paragraphs: [""],
    };
    update("blocks", [...data.blocks, block]);
  }

  function addText() {
    const block: TextBlock = {
      id: makeId("text"),
      type: "text",
      visible: true,
      text: "",
    };
    update("blocks", [...data.blocks, block]);
  }

  function addList() {
    const block: ListBlock = {
      id: makeId("list"),
      type: "list",
      visible: true,
      title: "قائمة جديدة",
      items: [""],
    };
    update("blocks", [...data.blocks, block]);
  }

  function addSpacer() {
    const block: SpacerBlock = {
      id: makeId("spacer"),
      type: "spacer",
      visible: true,
      height: 32,
    };
    update("blocks", [...data.blocks, block]);
  }

  function addTimeline() {
    const block: TimelineBlock = {
      id: makeId("timeline"),
      type: "timeline",
      visible: true,
      title: "الخط الزمني",
      items: [
        {
          id: makeId("tl"),
          label: "سنة",
          description: "وصف الحدث",
          color: "main",
        },
      ],
    };
    update("blocks", [...data.blocks, block]);
  }

  function addKeyFigures() {
    const block: KeyFiguresBlock = {
      id: makeId("figures"),
      type: "keyFigures",
      visible: true,
      title: "الشخصيات الرئيسية",
      figures: [
        {
          id: makeId("fig"),
          name: "الاسم",
          role: "الدور / الوصف",
        },
      ],
    };
    update("blocks", [...data.blocks, block]);
  }

  function addCards() {
    const block: CardsBlock = {
      id: makeId("cards"),
      type: "cards",
      visible: true,
      title: "شبكة بطاقات",
      layout: "3",
      cards: [
        {
          id: makeId("card"),
          title: "عنوان البطاقة",
          text: "نص توضيحي قصير",
        },
      ],
    };
    update("blocks", [...data.blocks, block]);
  }

  function addImage() {
    const block: ImageBlock = {
      id: makeId("image"),
      type: "image",
      visible: true,
      src: "/images/example.jpg",
      alt: "صورة",
      caption: "",
      fullWidth: false,
    };
    update("blocks", [...data.blocks, block]);
  }

  function addGallery() {
    const block: GalleryBlock = {
      id: makeId("gallery"),
      type: "gallery",
      visible: true,
      title: "معرض صور",
      columns: 3,
      images: [
        {
          id: makeId("img"),
          src: "/images/example.jpg",
          alt: "صورة",
          caption: "",
        },
      ],
    };
    update("blocks", [...data.blocks, block]);
  }

  /* ---- Save ---- */

  async function handleSave(formData: FormData) {
    formData.set("payload", JSON.stringify(data));
    const res = await saveDynamicPage(formData);
    if (res.ok) {
      setToast("تم الحفظ وتحديث الصفحة.");
      setTimeout(() => setToast(null), 2200);
    } else {
      setToast(res.error ?? "حدث خطأ أثناء الحفظ");
      setTimeout(() => setToast(null), 3000);
    }
  }

  /* ---- block editors ---- */

  const renderBlockHeader = (
    block: DynamicBlock,
    index: number,
    label: string
  ) => {
    const visible = block.visible !== false;
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="text-xs text-gray-500">
          <span className="ml-2">
            نوع: <b>{label}</b>
          </span>
          <span className="ml-2">
            id: <code>{block.id}</code>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Toggle
            on={visible}
            labelOn="ظاهر"
            labelOff="مخفي"
            onClick={() => updateBlock(index, { visible: !visible })}
          />
          <button
            type="button"
            className="px-3 py-2 border cursor-pointer"
            disabled={index === 0}
            onClick={() => moveBlock(index, -1)}
          >
            ↑
          </button>
          <button
            type="button"
            className="px-3 py-2 border cursor-pointer"
            disabled={index === data.blocks.length - 1}
            onClick={() => moveBlock(index, +1)}
          >
            ↓
          </button>
          <button
            type="button"
            className={redBtn}
            onClick={() => deleteBlock(index)}
          >
            حذف
          </button>
        </div>
      </div>
    );
  };

  const renderBlockEditor = (block: DynamicBlock, index: number) => {
    /* Hero */

    if (block.type === "hero") {
      const hero = block as HeroBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4">
          {renderBlockHeader(block, index, "عنوان كبير")}
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">العنوان الرئيسي</label>
              <input
                className="w-full border px-3 py-2"
                value={hero.title}
                onChange={(e) =>
                  updateBlock(index, { title: e.target.value } as HeroBlock)
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">العنوان الفرعي</label>
              <input
                className="w-full border px-3 py-2"
                value={hero.subtitle ?? ""}
                onChange={(e) =>
                  updateBlock(index, { subtitle: e.target.value } as HeroBlock)
                }
              />
            </div>
          </div>
        </div>
      );
    }

    /* Text */
    if (block.type === "text") {
      const tb = block as TextBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4">
          {renderBlockHeader(block, index, "نص")}
          <label className="block text-sm mb-1">النص</label>
          <textarea
            className="w-full border px-3 py-2 min-h-[120px]"
            value={tb.text}
            onChange={(e) =>
              updateBlock(index, { text: e.target.value } as TextBlock)
            }
          />
        </div>
      );
    }

    /* Section */
    if (block.type === "section") {
      const sec = block as SectionBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4 space-y-3">
          {renderBlockHeader(block, index, "قسم نصّي")}
          <div>
            <label className="block text-sm mb-1">العنوان</label>
            <input
              className="w-full border px-3 py-2"
              value={sec.title}
              onChange={(e) =>
                updateBlock(index, { title: e.target.value } as SectionBlock)
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">الفقرات</span>
              <button
                type="button"
                className={blueBtn}
                onClick={() =>
                  updateBlock(index, {
                    paragraphs: [...(sec.paragraphs ?? []), ""],
                  } as SectionBlock)
                }
              >
                + فقرة
              </button>
            </div>
            {(sec.paragraphs ?? []).map((p, pi) => (
              <div key={`${sec.id}-p-${pi}`} className="mb-2">
                <textarea
                  className="w-full border px-3 py-2 min-h-[80px]"
                  value={p}
                  onChange={(e) => {
                    const arr = [...(sec.paragraphs ?? [])];
                    arr[pi] = e.target.value;
                    updateBlock(index, { paragraphs: arr } as SectionBlock);
                  }}
                />
                <div className="mt-1 text-left">
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => {
                      const arr = [...(sec.paragraphs ?? [])];
                      arr.splice(pi, 1);
                      updateBlock(index, { paragraphs: arr } as SectionBlock);
                    }}
                  >
                    حذف الفقرة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    /* List */
    if (block.type === "list") {
      const lb = block as ListBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4 space-y-3">
          {renderBlockHeader(block, index, "قائمة نقاط")}
          <div>
            <label className="block text-sm mb-1">
              عنوان القائمة (اختياري)
            </label>
            <input
              className="w-full border px-3 py-2"
              value={lb.title ?? ""}
              onChange={(e) =>
                updateBlock(index, { title: e.target.value } as ListBlock)
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">العناصر</span>
              <button
                type="button"
                className={blueBtn}
                onClick={() =>
                  updateBlock(index, {
                    items: [...(lb.items ?? []), ""],
                  } as ListBlock)
                }
              >
                + عنصر
              </button>
            </div>
            {(lb.items ?? []).map((it, ii) => (
              <div key={`${lb.id}-i-${ii}`} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border px-3 py-2"
                  value={it}
                  onChange={(e) => {
                    const arr = [...(lb.items ?? [])];
                    arr[ii] = e.target.value;
                    updateBlock(index, { items: arr } as ListBlock);
                  }}
                />
                <button
                  type="button"
                  className={redBtn}
                  onClick={() => {
                    const arr = [...(lb.items ?? [])];
                    arr.splice(ii, 1);
                    updateBlock(index, { items: arr } as ListBlock);
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    /* Spacer */
    if (block.type === "spacer") {
      const sp = block as SpacerBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4">
          {renderBlockHeader(block, index, "فاصل / مسافة")}
          <label className="block text-sm mb-1">الارتفاع (بالبكسل)</label>
          <input
            type="number"
            min={0}
            className="w-32 border px-3 py-2"
            value={sp.height ?? 32}
            onChange={(e) =>
              updateBlock(index, {
                height: Number(e.target.value) || 0,
              } as SpacerBlock)
            }
          />
        </div>
      );
    }

    /* Timeline */
    if (block.type === "timeline") {
      const tl = block as TimelineBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4 space-y-3">
          {renderBlockHeader(block, index, "الخط الزمني")}
          <div>
            <label className="block text-sm mb-1">العنوان (اختياري)</label>
            <input
              className="w-full border px-3 py-2"
              value={tl.title ?? ""}
              onChange={(e) =>
                updateBlock(index, { title: e.target.value } as TimelineBlock)
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">الأحداث</span>
              <button
                type="button"
                className={blueBtn}
                onClick={() =>
                  updateBlock(index, {
                    items: [
                      ...(tl.items ?? []),
                      {
                        id: makeId("tl"),
                        label: "فترة",
                        description: "وصف مختصر",
                        color: "main",
                      },
                    ],
                  } as TimelineBlock)
                }
              >
                + حدث
              </button>
            </div>
            {(tl.items ?? []).map((item, ii) => (
              <div
                key={item.id}
                className="border border-gray-200 p-2 mb-2 space-y-2"
              >
                <div className="grid sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs mb-1">السنة / المدة</label>
                    <input
                      className="w-full border px-2 py-1 text-sm"
                      value={item.label}
                      onChange={(e) => {
                        const arr = [...(tl.items ?? [])];
                        arr[ii] = { ...arr[ii], label: e.target.value };
                        updateBlock(index, { items: arr } as TimelineBlock);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs mb-1">الوصف</label>
                    <input
                      className="w-full border px-2 py-1 text-sm"
                      value={item.description}
                      onChange={(e) => {
                        const arr = [...(tl.items ?? [])];
                        arr[ii] = { ...arr[ii], description: e.target.value };
                        updateBlock(index, { items: arr } as TimelineBlock);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span>اللون:</span>
                    <select
                      className="border px-2 py-1 text-xs"
                      value={item.color ?? "main"}
                      onChange={(e) => {
                        const arr = [...(tl.items ?? [])];
                        arr[ii] = {
                          ...arr[ii],
                          color: e.target.value as TimelineItem["color"],
                        };
                        updateBlock(index, { items: arr } as TimelineBlock);
                      }}
                    >
                      <option value="main">أزرق</option>
                      <option value="gray">رمادي</option>
                      <option value="black">أسود</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => {
                      const arr = [...(tl.items ?? [])];
                      arr.splice(ii, 1);
                      updateBlock(index, { items: arr } as TimelineBlock);
                    }}
                  >
                    حذف الحدث
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    /* Key figures */
    if (block.type === "keyFigures") {
      const kb = block as KeyFiguresBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4 space-y-3">
          {renderBlockHeader(block, index, "الشخصيات الرئيسية")}
          <div>
            <label className="block text-sm mb-1">العنوان</label>
            <input
              className="w-full border px-3 py-2"
              value={kb.title ?? ""}
              onChange={(e) =>
                updateBlock(index, { title: e.target.value } as KeyFiguresBlock)
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">الأسماء</span>
              <button
                type="button"
                className={blueBtn}
                onClick={() =>
                  updateBlock(index, {
                    figures: [
                      ...(kb.figures ?? []),
                      {
                        id: makeId("fig"),
                        name: "اسم جديد",
                        role: "الوصف / الدور",
                      },
                    ],
                  } as KeyFiguresBlock)
                }
              >
                + اسم جديد
              </button>
            </div>
            {(kb.figures ?? []).map((fig, fi) => (
              <div key={fig.id} className="grid sm:grid-cols-2 gap-2 mb-2">
                <input
                  className="border px-3 py-2"
                  value={fig.name}
                  placeholder="الاسم"
                  onChange={(e) => {
                    const arr = [...(kb.figures ?? [])];
                    arr[fi] = { ...arr[fi], name: e.target.value };
                    updateBlock(index, { figures: arr } as KeyFiguresBlock);
                  }}
                />
                <div className="flex gap-2">
                  <input
                    className="flex-1 border px-3 py-2"
                    value={fig.role}
                    placeholder="الدور / الوصف"
                    onChange={(e) => {
                      const arr = [...(kb.figures ?? [])];
                      arr[fi] = { ...arr[fi], role: e.target.value };
                      updateBlock(index, { figures: arr } as KeyFiguresBlock);
                    }}
                  />
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => {
                      const arr = [...(kb.figures ?? [])];
                      arr.splice(fi, 1);
                      updateBlock(index, { figures: arr } as KeyFiguresBlock);
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    /* Cards grid */
    if (block.type === "cards") {
      const cb = block as CardsBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4 space-y-3">
          {renderBlockHeader(block, index, "شبكة بطاقات")}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">العنوان (اختياري)</label>
              <input
                className="w-full border px-3 py-2"
                value={cb.title ?? ""}
                onChange={(e) =>
                  updateBlock(index, { title: e.target.value } as CardsBlock)
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">عدد الأعمدة</label>
              <select
                className="w-full border px-3 py-2"
                value={cb.layout ?? "3"}
                onChange={(e) =>
                  updateBlock(index, {
                    layout: e.target.value as CardsBlock["layout"],
                  } as CardsBlock)
                }
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">البطاقات</span>
              <button
                type="button"
                className={blueBtn}
                onClick={() =>
                  updateBlock(index, {
                    cards: [
                      ...(cb.cards ?? []),
                      {
                        id: makeId("card"),
                        title: "عنوان",
                        text: "نص قصير",
                      },
                    ],
                  } as CardsBlock)
                }
              >
                + بطاقة
              </button>
            </div>
            {(cb.cards ?? []).map((card, ci) => (
              <div key={card.id} className="grid sm:grid-cols-2 gap-2 mb-2">
                <input
                  className="border px-3 py-2"
                  value={card.title}
                  placeholder="عنوان البطاقة"
                  onChange={(e) => {
                    const arr = [...(cb.cards ?? [])];
                    arr[ci] = { ...arr[ci], title: e.target.value };
                    updateBlock(index, { cards: arr } as CardsBlock);
                  }}
                />
                <div className="flex gap-2">
                  <input
                    className="flex-1 border px-3 py-2"
                    value={card.text}
                    placeholder="النص"
                    onChange={(e) => {
                      const arr = [...(cb.cards ?? [])];
                      arr[ci] = { ...arr[ci], text: e.target.value };
                      updateBlock(index, { cards: arr } as CardsBlock);
                    }}
                  />
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => {
                      const arr = [...(cb.cards ?? [])];
                      arr.splice(ci, 1);
                      updateBlock(index, { cards: arr } as CardsBlock);
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    /* Single image */
    if (block.type === "image") {
      const ib = block as ImageBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4 space-y-3">
          {renderBlockHeader(block, index, "صورة واحدة")}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">رابط الصورة (src)</label>
              <input
                className="w-full border px-3 py-2"
                value={ib.src}
                onChange={(e) =>
                  updateBlock(index, { src: e.target.value } as ImageBlock)
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">alt (لتحسين الوصول)</label>
              <input
                className="w-full border px-3 py-2 text-sm"
                value={ib.alt ?? ""}
                onChange={(e) =>
                  updateBlock(index, { alt: e.target.value } as ImageBlock)
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">تعليق (اختياري)</label>
              <input
                className="w-full border px-3 py-2 text-sm"
                value={ib.caption ?? ""}
                onChange={(e) =>
                  updateBlock(index, { caption: e.target.value } as ImageBlock)
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Toggle
              on={ib.fullWidth ?? false}
              labelOn="عرض كامل"
              labelOff="بعرض المحتوى"
              onClick={() =>
                updateBlock(index, {
                  fullWidth: !(ib.fullWidth ?? false),
                } as ImageBlock)
              }
            />
          </div>
        </div>
      );
    }

    /* Gallery */
    if (block.type === "gallery") {
      const gb = block as GalleryBlock;
      return (
        <div key={block.id} className="border bg-white p-4 mb-4 space-y-3">
          {renderBlockHeader(block, index, "معرض صور")}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">العنوان (اختياري)</label>
              <input
                className="w-full border px-3 py-2"
                value={gb.title ?? ""}
                onChange={(e) =>
                  updateBlock(index, { title: e.target.value } as GalleryBlock)
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">عدد الأعمدة</label>
              <select
                className="w-full border px-3 py-2"
                value={gb.columns ?? 3}
                onChange={(e) =>
                  updateBlock(index, {
                    columns: Number(e.target.value) as GalleryBlock["columns"],
                  } as GalleryBlock)
                }
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">الصور</span>
              <button
                type="button"
                className={blueBtn}
                onClick={() =>
                  updateBlock(index, {
                    images: [
                      ...(gb.images ?? []),
                      {
                        id: makeId("img"),
                        src: "/images/example.jpg",
                        alt: "صورة",
                        caption: "",
                      },
                    ],
                  } as GalleryBlock)
                }
              >
                + صورة
              </button>
            </div>
            {(gb.images ?? []).map((img, gi) => (
              <div key={img.id} className="border border-gray-200 p-2 mb-2">
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs mb-1">src</label>
                    <input
                      className="w-full border px-2 py-1 text-sm"
                      value={img.src}
                      onChange={(e) => {
                        const arr = [...(gb.images ?? [])];
                        arr[gi] = { ...arr[gi], src: e.target.value };
                        updateBlock(index, { images: arr } as GalleryBlock);
                      }}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs mb-1">alt</label>
                      <input
                        className="w-full border px-2 py-1 text-sm"
                        value={img.alt ?? ""}
                        onChange={(e) => {
                          const arr = [...(gb.images ?? [])];
                          arr[gi] = { ...arr[gi], alt: e.target.value };
                          updateBlock(index, { images: arr } as GalleryBlock);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">تعليق</label>
                      <input
                        className="w-full border px-2 py-1 text-sm"
                        value={img.caption ?? ""}
                        onChange={(e) => {
                          const arr = [...(gb.images ?? [])];
                          arr[gi] = { ...arr[gi], caption: e.target.value };
                          updateBlock(index, { images: arr } as GalleryBlock);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <button
                      type="button"
                      className={redBtn}
                      onClick={() => {
                        const arr = [...(gb.images ?? [])];
                        arr.splice(gi, 1);
                        updateBlock(index, { images: arr } as GalleryBlock);
                      }}
                    >
                      حذف الصورة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  /* ---- render ---- */

  return (
    <div>
      <div dir="rtl" className="flex gap-4">
        {/* Sidebar */}

        <aside className="w-64 shrink-0 border bg-white p-4 space-y-4">
          <h2 className="text-base font-semibold mb-2">مكوّنات الصفحة</h2>
          <p className="text-xs text-gray-600 mb-2">
            اختر نوع المكوّن لإضافته إلى الصفحة:
          </p>
          <div className="space-y-2">
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addHero}
            >
              + عنوان كبير (Hero)
            </button>
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addSection}
            >
              + قسم نصّي
            </button>
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addText}
            >
              + نص حر
            </button>
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addList}
            >
              + قائمة نقاط
            </button>
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addSpacer}
            >
              + فاصل / مسافة
            </button>

            <hr className="my-3" />

            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addTimeline}
            >
              + خط زمني
            </button>
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addKeyFigures}
            >
              + شخصيات رئيسية
            </button>
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addCards}
            >
              + شبكة بطاقات
            </button>
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addImage}
            >
              + صورة واحدة
            </button>
            <button
              type="button"
              className={blueBtn + " w-full"}
              onClick={addGallery}
            >
              + معرض صور
            </button>
          </div>
          <hr className="my-4" />

          {/* Page header settings */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">عنوان الصفحة</label>
              <input
                className="w-full border px-3 py-2 text-sm"
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                إظهار العنوان في أعلى الصفحة
              </span>
              <Toggle
                on={data.showHeader !== false}
                labelOn="ظاهر"
                labelOff="مخفي"
                onClick={() =>
                  update("showHeader", !(data.showHeader !== false))
                }
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                العنوان الفرعي للصفحة
              </label>
              <input
                className="w-full border px-3 py-2 text-sm"
                value={data.subtitle ?? ""}
                onChange={(e) => update("subtitle", e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                إظهار العنوان الفرعي
              </span>
              <Toggle
                on={data.showSubtitle !== false}
                labelOn="ظاهر"
                labelOff="مخفي"
                onClick={() =>
                  update("showSubtitle", !(data.showSubtitle !== false))
                }
              />
            </div>
          </div>
        </aside>

        {/* Main editor */}
        <div className="flex-1 space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-medium">محتوى الصفحة</h2>
            {data.blocks.length === 0 && (
              <p className="text-sm text-gray-500">
                لا توجد مكوّنات بعد. أضف مكوّناً من القائمة الجانبية.
              </p>
            )}
            {data.blocks.map((block, index) => renderBlockEditor(block, index))}
          </section>

          {/* Save bar */}
          <section className="border bg-white p-4">
            <form
              action={(fd) =>
                startTransition(async () => {
                  await handleSave(fd);
                })
              }
              className="flex items-center justify-between gap-3"
            >
              <input
                type="hidden"
                name="payload"
                value={JSON.stringify(data)}
                readOnly
              />
              <div className="text-xs text-gray-500">
                سيتم الكتابة إلى: <code>src/data/dynamic.json</code>
              </div>
              <button type="submit" className={blueBtn} disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
            </form>
          </section>

          {toast && (
            <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 text-sm shadow-lg">
              {toast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
