"use client";

import { useState } from "react";
import { saveHeroConfig, saveWelcomeConfig } from "../actions";

/* ---------- Types that match your JSON files ---------- */

export type HeroButton = {
  text: string;
  link: string;
};

export type HeroAuthorBadge = {
  text: string;
  show?: boolean;
};

export type HeroData = {
  badge?: string;
  title: string;
  description: string;
  button: HeroButton;
  button2: HeroButton;
  authorBadge?: HeroAuthorBadge;
  backgroundImage?: string;
};

export type WelcomeSignature = {
  name: string;
  title: string;
};

export type WelcomeImage = {
  src: string;
  alt: string;
};

export type WelcomeData = {
  title: string;
  greeting: string;
  paragraphs: string[];
  signature: WelcomeSignature;
  image: WelcomeImage;
  readMoreButton: {
    text: string;
    link: string;
  };
};

type Props = {
  initialHero: HeroData;
  initialWelcome: WelcomeData;
};

/* ---------- shared button styles ---------- */

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap hover:bg-white hover:text-main-100 border border-main-100 transition-colors";
const grayBtn =
  "border border-gray-300 text-gray-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap bg-white hover:bg-gray-50";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap hover:bg-red-100";

/* ===================================================== */

export default function AdminHomeClient({
  initialHero,
  initialWelcome,
}: Props) {
  const [hero, setHero] = useState<HeroData>(initialHero);
  const [welcome, setWelcome] = useState<WelcomeData>(initialWelcome);
  const [toast, setToast] = useState<string | null>(null);

  /* ---------- helpers ---------- */

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const updateHeroField = <K extends keyof HeroData>(
    key: K,
    value: HeroData[K]
  ) => {
    setHero((prev) => ({ ...prev, [key]: value }));
  };

  const updateWelcomeField = <K extends keyof WelcomeData>(
    key: K,
    value: WelcomeData[K]
  ) => {
    setWelcome((prev) => ({ ...prev, [key]: value }));
  };

  /* ----- hero helpers ----- */

  const updateHeroButton = (
    which: "button" | "button2",
    field: keyof HeroButton,
    value: string
  ) => {
    setHero((prev) => ({
      ...prev,
      [which]: { ...prev[which], [field]: value },
    }));
  };

  const updateAuthorBadge = (
    field: keyof HeroAuthorBadge,
    value: string | boolean
  ) => {
    setHero((prev) => ({
      ...prev,
      authorBadge: {
        ...(prev.authorBadge ?? { text: "", show: true }),
        [field]: value,
      },
    }));
  };

  /* ----- welcome helpers ----- */

  const updateParagraph = (index: number, value: string) => {
    setWelcome((prev) => {
      const paragraphs = [...prev.paragraphs];
      paragraphs[index] = value;
      return { ...prev, paragraphs };
    });
  };

  const addParagraph = () => {
    setWelcome((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ""],
    }));
  };

  const removeParagraph = (index: number) => {
    setWelcome((prev) => {
      const paragraphs = [...prev.paragraphs];
      paragraphs.splice(index, 1);
      return { ...prev, paragraphs };
    });
  };

  const moveParagraph = (index: number, dir: -1 | 1) => {
    setWelcome((prev) => {
      const paragraphs = [...prev.paragraphs];
      const target = index + dir;
      if (target < 0 || target >= paragraphs.length) return prev;
      [paragraphs[index], paragraphs[target]] = [
        paragraphs[target],
        paragraphs[index],
      ];
      return { ...prev, paragraphs };
    });
  };

  /* ---------- save handlers (server actions wrappers) ---------- */

  const handleSaveHero = async (formData: FormData) => {
    formData.set("payload", JSON.stringify(hero, null, 2));
    await saveHeroConfig(formData);
    showToast("تم حفظ إعدادات قسم الهيرو بنجاح");
  };

  const handleSaveWelcome = async (formData: FormData) => {
    formData.set("payload", JSON.stringify(welcome, null, 2));
    await saveWelcomeConfig(formData);
    showToast("تم حفظ إعدادات كلمة الرئيس بنجاح");
  };

  /* ===================================================== */

  return (
    <div className="space-y-8" dir="rtl">
      {/* HERO SECTION --------------------------------------------------- */}
      <section className="border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            إعدادات قسم الهيرو (الصفحة الرئيسية)
          </h2>
          <span className="text-xs text-gray-500">
            الملف: <code>src/data/hero.json</code>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">
              شارة (badge) أعلى العنوان
            </label>
            <input
              className="w-full border px-3 py-2"
              value={hero.badge ?? ""}
              onChange={(e) => updateHeroField("badge", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">عنوان الهيرو</label>
            <input
              className="w-full border px-3 py-2"
              value={hero.title}
              onChange={(e) => updateHeroField("title", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">
              الوصف (النص داخل علامات الاقتباس)
            </label>
            <textarea
              className="w-full border px-3 py-2 min-h-[100px]"
              value={hero.description}
              onChange={(e) => updateHeroField("description", e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">الزر الرئيسي (button)</h3>
            <label className="block text-xs mb-1">نص الزر</label>
            <input
              className="w-full border px-3 py-2"
              value={hero.button.text}
              onChange={(e) =>
                updateHeroButton("button", "text", e.target.value)
              }
            />
            <label className="block text-xs mb-1 mt-2">الرابط</label>
            <input
              className="w-full border px-3 py-2"
              value={hero.button.link}
              onChange={(e) =>
                updateHeroButton("button", "link", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">زر كلمة الرئيس (button2)</h3>
            <label className="block text-xs mb-1">نص الزر</label>
            <input
              className="w-full border px-3 py-2"
              value={hero.button2.text}
              onChange={(e) =>
                updateHeroButton("button2", "text", e.target.value)
              }
            />
            <label className="block text-xs mb-1 mt-2">الرابط</label>
            <input
              className="w-full border px-3 py-2"
              value={hero.button2.link}
              onChange={(e) =>
                updateHeroButton("button2", "link", e.target.value)
              }
            />
          </div>
        </div>

        {/* Author badge & background image */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">شارة التعريف (authorBadge)</h3>
            <label className="block text-xs mb-1">النص</label>
            <input
              className="w-full border px-3 py-2"
              value={hero.authorBadge?.text ?? ""}
              onChange={(e) => updateAuthorBadge("text", e.target.value)}
            />
            <label className="inline-flex items-center gap-2 mt-2 text-sm">
              <input
                type="checkbox"
                checked={hero.authorBadge?.show ?? true}
                onChange={(e) => updateAuthorBadge("show", e.target.checked)}
              />
              إظهار الشارة؟
            </label>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">صورة الخلفية</h3>
            <label className="block text-xs mb-1">
              مسار الصورة داخل <code>public</code> (مثال:{" "}
              <code>/mainevent.jpg</code>)
            </label>
            <input
              className="w-full border px-3 py-2"
              value={hero.backgroundImage ?? ""}
              onChange={(e) =>
                updateHeroField("backgroundImage", e.target.value)
              }
            />
          </div>
        </div>

        {/* Save hero */}
        <form
          action={async (fd) => {
            await handleSaveHero(fd);
          }}
          className="flex items-center justify-between gap-3 pt-4 border-t mt-4"
        >
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify(hero)}
            readOnly
          />
          <p className="text-xs text-gray-500">
            سيتم حفظ الإعدادات في الملف <code>src/data/hero.json</code>
          </p>
          <button className={blueBtn} type="submit">
            حفظ قسم الهيرو
          </button>
        </form>
      </section>

      {/* WELCOMING LETTER SECTION -------------------------------------- */}
      <section className="border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">إعدادات كلمة الرئيس</h2>
          <span className="text-xs text-gray-500">
            الملف: <code>src/data/welcoming-letter.json</code>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">العنوان</label>
            <input
              className="w-full border px-3 py-2"
              value={welcome.title}
              onChange={(e) => updateWelcomeField("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">التحية الأولى</label>
            <input
              className="w-full border px-3 py-2"
              value={welcome.greeting}
              onChange={(e) => updateWelcomeField("greeting", e.target.value)}
            />
          </div>
        </div>

        {/* Paragraphs with reorder/add/remove */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">الفقرات</h3>
            <button type="button" className={grayBtn} onClick={addParagraph}>
              + إضافة فقرة
            </button>
          </div>

          {welcome.paragraphs.map((p, idx) => (
            <div key={idx} className="border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  الفقرة رقم {idx + 1}
                </span>
                <div className="flex items-center gap-1">
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
                    disabled={idx === welcome.paragraphs.length - 1}
                    onClick={() => moveParagraph(idx, +1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeParagraph(idx)}
                  >
                    حذف
                  </button>
                </div>
              </div>
              <textarea
                className="w-full border px-3 py-2 min-h-20 bg-white"
                value={p}
                onChange={(e) => updateParagraph(idx, e.target.value)}
              />
            </div>
          ))}

          {welcome.paragraphs.length === 0 && (
            <p className="text-xs text-gray-500">
              لا توجد فقرات حالياً. اضغط على &quot;إضافة فقرة&quot; لإضافة فقرة
              جديدة.
            </p>
          )}
        </div>

        {/* Signature & image & button */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">التوقيع</h3>
            <label className="block text-xs mb-1">الاسم</label>
            <input
              className="w-full border px-3 py-2"
              value={welcome.signature.name}
              onChange={(e) =>
                updateWelcomeField("signature", {
                  ...welcome.signature,
                  name: e.target.value,
                })
              }
            />
            <label className="block text-xs mb-1 mt-2">الصفة</label>
            <input
              className="w-full border px-3 py-2"
              value={welcome.signature.title}
              onChange={(e) =>
                updateWelcomeField("signature", {
                  ...welcome.signature,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">صورة الرئيس</h3>
            <label className="block text-xs mb-1">
              مسار الصورة داخل <code>public</code> (مثال:{" "}
              <code>/mrnabil.JPG</code>)
            </label>
            <input
              className="w-full border px-3 py-2"
              value={welcome.image.src}
              onChange={(e) =>
                updateWelcomeField("image", {
                  ...welcome.image,
                  src: e.target.value,
                })
              }
            />
            <label className="block text-xs mb-1 mt-2">وصف بديل (alt)</label>
            <input
              className="w-full border px-3 py-2"
              value={welcome.image.alt}
              onChange={(e) =>
                updateWelcomeField("image", {
                  ...welcome.image,
                  alt: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Read more button */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">
              نص زر &quot;اقرأ المزيد&quot;
            </label>
            <input
              className="w-full border px-3 py-2"
              value={welcome.readMoreButton.text}
              onChange={(e) =>
                updateWelcomeField("readMoreButton", {
                  ...welcome.readMoreButton,
                  text: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">الرابط</label>
            <input
              className="w-full border px-3 py-2"
              value={welcome.readMoreButton.link}
              onChange={(e) =>
                updateWelcomeField("readMoreButton", {
                  ...welcome.readMoreButton,
                  link: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Save welcome */}
        <form
          action={async (fd) => {
            await handleSaveWelcome(fd);
          }}
          className="flex items-center justify-between gap-3 pt-4 border-t mt-4"
        >
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify(welcome)}
            readOnly
          />
          <p className="text-xs text-gray-500">
            سيتم حفظ الإعدادات في الملف{" "}
            <code>src/data/welcoming-letter.json</code>
          </p>
          <button className={blueBtn} type="submit">
            حفظ كلمة الرئيس
          </button>
        </form>
      </section>

      {/* Toast ---------------------------------------------------------- */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
