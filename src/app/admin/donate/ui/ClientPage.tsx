// src/app/admin/donate/ui/DonateAdminClient.tsx
"use client";

import { useState } from "react";
import { saveDonate } from "../actions";
import type { DonateData } from "../actions";

/* ---------- Button styles (same as Annual Iftar) ---------- */

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const grayBtn =
  "border border-gray-300 text-gray-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap bg-white";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";

/* ---------- Props ---------- */

type Props = {
  initialData: DonateData;
};

/* ============================================================= */
/*                         MAIN COMPONENT                        */
/* ============================================================= */

export default function DonateAdminClient({ initialData }: Props) {
  const [data, setData] = useState<DonateData>(initialData);
  const [toast, setToast] = useState<string | null>(null);

  /* ---------- helpers to update nested data ---------- */

  const updateRoot = <K extends keyof DonateData>(
    key: K,
    value: DonateData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateVerse = (field: keyof DonateData["verse"], value: string) => {
    setData((prev) => ({
      ...prev,
      verse: {
        ...prev.verse,
        [field]: value,
      },
    }));
  };

  const updateArInfo = (
    field: keyof DonateData["donationInfo"]["arabic"],
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      donationInfo: {
        ...prev.donationInfo,
        arabic: {
          ...prev.donationInfo.arabic,
          [field]: value,
        },
      },
    }));
  };

  const updateBankDetails = (
    field: keyof DonateData["donationInfo"]["bankDetails"],
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      donationInfo: {
        ...prev.donationInfo,
        bankDetails: {
          ...prev.donationInfo.bankDetails,
          [field]: value,
        },
      },
    }));
  };

  const updateEnglishInfo = (value: string) => {
    setData((prev) => ({
      ...prev,
      donationInfo: {
        ...prev.donationInfo,
        english: value,
      },
    }));
  };

  /* ---------- paragraphs helpers ---------- */

  const addParagraph = () => {
    setData((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ""],
    }));
  };

  const removeParagraph = (index: number) => {
    setData((prev) => {
      const paragraphs = [...prev.paragraphs];
      paragraphs.splice(index, 1);
      return { ...prev, paragraphs };
    });
  };

  const moveParagraph = (index: number, dir: -1 | 1) => {
    setData((prev) => {
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

  const updateParagraph = (index: number, value: string) => {
    setData((prev) => {
      const paragraphs = [...prev.paragraphs];
      paragraphs[index] = value;
      return { ...prev, paragraphs };
    });
  };

  /* ---------- Arabic methods helpers ---------- */

  const addMethod = () => {
    setData((prev) => ({
      ...prev,
      donationInfo: {
        ...prev.donationInfo,
        arabic: {
          ...prev.donationInfo.arabic,
          methods: [...prev.donationInfo.arabic.methods, ""],
        },
      },
    }));
  };

  const removeMethod = (index: number) => {
    setData((prev) => {
      const methods = [...prev.donationInfo.arabic.methods];
      methods.splice(index, 1);
      return {
        ...prev,
        donationInfo: {
          ...prev.donationInfo,
          arabic: { ...prev.donationInfo.arabic, methods },
        },
      };
    });
  };

  const moveMethod = (index: number, dir: -1 | 1) => {
    setData((prev) => {
      const methods = [...prev.donationInfo.arabic.methods];
      const target = index + dir;
      if (target < 0 || target >= methods.length) return prev;
      [methods[index], methods[target]] = [methods[target], methods[index]];
      return {
        ...prev,
        donationInfo: {
          ...prev.donationInfo,
          arabic: { ...prev.donationInfo.arabic, methods },
        },
      };
    });
  };

  const updateMethod = (index: number, value: string) => {
    setData((prev) => {
      const methods = [...prev.donationInfo.arabic.methods];
      methods[index] = value;
      return {
        ...prev,
        donationInfo: {
          ...prev.donationInfo,
          arabic: { ...prev.donationInfo.arabic, methods },
        },
      };
    });
  };

  /* ---------- save handler (server action wrapper) ---------- */

  const handleSave = async (formData: FormData) => {
    formData.set("payload", JSON.stringify(data));
    await saveDonate(formData);
    setToast("تم الحفظ وتحديث بيانات صفحة التبرع بنجاح");
    setTimeout(() => setToast(null), 2500);
  };

  /* ========================================================= */

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header info */}
      <section className="border bg-white p-4 space-y-2">
        <h1 className="text-xl font-semibold text-main-100">
          إدارة صفحة التبرع
        </h1>
        <p className="text-sm text-gray-600">
          تعديل نص الآية، رسالة التبرع، وبيانات الحساب البنكي كما تظهر في
          الموقع.
        </p>
        <p className="text-xs text-gray-500">
          سيتم الكتابة إلى:{" "}
          <code className="font-mono">src/data/donate.json</code>
        </p>
      </section>

      {/* Section: title + verse */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">العنوان والآية</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">عنوان الصفحة</label>
            <input
              className="w-full border px-3 py-2"
              value={data.pageTitle}
              onChange={(e) => updateRoot("pageTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">البسملة</label>
            <input
              className="w-full border px-3 py-2"
              value={data.verse.bismillah}
              onChange={(e) => updateVerse("bismillah", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">نص الآية</label>
            <input
              className="w-full border px-3 py-2"
              value={data.verse.text}
              onChange={(e) => updateVerse("text", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">خاتمة الآية</label>
            <input
              className="w-full border px-3 py-2"
              value={data.verse.footer}
              onChange={(e) => updateVerse("footer", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Section: paragraphs (list like events) */}
      <section className="border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">نص الرسالة</h2>
          <button type="button" className={blueBtn} onClick={addParagraph}>
            + إضافة فقرة
          </button>
        </div>
        <p className="text-xs text-gray-500">
          كل عنصر هنا يمثل فقرة مستقلة تظهر في صفحة التبرع بالترتيب.
        </p>

        <div className="space-y-4">
          {data.paragraphs.map((p, index) => (
            <div
              key={index}
              className="border p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  الفقرة رقم {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={index === 0}
                    onClick={() => moveParagraph(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={index === data.paragraphs.length - 1}
                    onClick={() => moveParagraph(index, +1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeParagraph(index)}
                  >
                    حذف
                  </button>
                </div>
              </div>
              <textarea
                className="w-full border px-3 py-2 min-h-20"
                value={p}
                onChange={(e) => updateParagraph(index, e.target.value)}
              />
            </div>
          ))}

          {data.paragraphs.length === 0 && (
            <p className="text-center text-sm text-gray-400">
              لا توجد فقرات حالياً. اضغط على &quot;إضافة فقرة&quot; لبدء
              الكتابة.
            </p>
          )}
        </div>
      </section>

      {/* Section: Arabic donation info */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">معلومات التبرع (العربية)</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">عنوان قسم التبرع</label>
            <input
              className="w-full border px-3 py-2"
              value={data.donationInfo.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  donationInfo: {
                    ...prev.donationInfo,
                    title: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">
              سطر التعريف (مثال: للتبرع يمكنكم)
            </label>
            <input
              className="w-full border px-3 py-2"
              value={data.donationInfo.arabic.label}
              onChange={(e) => updateArInfo("label", e.target.value)}
            />
          </div>
        </div>

        {/* Arabic methods list */}
        <div className="flex items-center justify-between mt-4">
          <h3 className="text-sm font-medium">طرق التبرع (العربية)</h3>
          <button type="button" className={blueBtn} onClick={addMethod}>
            + إضافة طريقة
          </button>
        </div>
        <div className="space-y-3">
          {data.donationInfo.arabic.methods.map((m, index) => (
            <div
              key={index}
              className="border  p-2 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-600">
                  طريقة رقم {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={index === 0}
                    onClick={() => moveMethod(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={
                      index === data.donationInfo.arabic.methods.length - 1
                    }
                    onClick={() => moveMethod(index, +1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeMethod(index)}
                  >
                    حذف
                  </button>
                </div>
              </div>
              <textarea
                className="w-full border px-3 py-2 min-h-[60px]"
                value={m}
                onChange={(e) => updateMethod(index, e.target.value)}
              />
            </div>
          ))}

          {data.donationInfo.arabic.methods.length === 0 && (
            <p className="text-center text-sm text-gray-400">
              لا توجد طرق حالياً. اضغط على &quot;إضافة طريقة&quot;.
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">
            نص التحويل على الحساب (سطر قبل تفاصيل البنك)
          </label>
          <input
            className="w-full border px-3 py-2"
            value={data.donationInfo.arabic.bankTransfer}
            onChange={(e) => updateArInfo("bankTransfer", e.target.value)}
          />
        </div>
      </section>

      {/* Section: bank details */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">تفاصيل الحساب البنكي</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">اسم الحساب (عربي)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.donationInfo.bankDetails.accountName}
              onChange={(e) => updateBankDetails("accountName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">اسم الحساب (إنجليزي)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.donationInfo.bankDetails.accountNameEn}
              onChange={(e) =>
                updateBankDetails("accountNameEn", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">رقم الحساب</label>
            <input
              className="w-full border px-3 py-2 font-mono"
              value={data.donationInfo.bankDetails.accountNumber}
              onChange={(e) =>
                updateBankDetails("accountNumber", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">اسم البنك (عربي)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.donationInfo.bankDetails.bank}
              onChange={(e) => updateBankDetails("bank", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">اسم البنك (إنجليزي)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.donationInfo.bankDetails.bankEn}
              onChange={(e) => updateBankDetails("bankEn", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">الفرع (عربي)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.donationInfo.bankDetails.branch}
              onChange={(e) => updateBankDetails("branch", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">الفرع (إنجليزي)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.donationInfo.bankDetails.branchEn}
              onChange={(e) => updateBankDetails("branchEn", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">SWIFT Code</label>
            <input
              className="w-full border px-3 py-2 font-mono"
              value={data.donationInfo.bankDetails.swift}
              onChange={(e) => updateBankDetails("swift", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Section: English text */}
      <section className="border bg-white p-4 space-y-3">
        <h2 className="text-lg font-medium">نص التبرع (إنجليزي)</h2>
        <textarea
          className="w-full border px-3 py-2 min-h-20 text-left"
          value={data.donationInfo.english}
          onChange={(e) => updateEnglishInfo(e.target.value)}
        />
      </section>

      {/* Save section (same pattern as Annual Iftar) */}
      <section className="border bg-white p-4">
        <form
          action={async (fd) => {
            await handleSave(fd);
          }}
          className="flex items-center justify-between gap-3"
        >
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify(data)}
            readOnly
          />
          <div className="text-xs text-gray-500">
            سيتم الكتابة إلى:{" "}
            <code className="font-mono">src/data/donate.json</code>
          </div>
          <button className={blueBtn} type="submit">
            حفظ
          </button>
        </form>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
