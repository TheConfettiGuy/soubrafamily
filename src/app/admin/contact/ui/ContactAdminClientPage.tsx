"use client";

import { useState } from "react";
import { saveContactData } from "../actions";

/* ---------- Types ---------- */

export type LeadershipMember = {
  id: string;
  title: string;
  name: string;
  visible?: boolean; // show/hide on public page (default true)
};

export type ContactData = {
  pageTitle: string;
  description: string;
  organization: {
    name: string;
    address: string;
    phone: string;
    fax?: string;
    poBox: string;
    email: string;
  };
  leadership: LeadershipMember[];
};

type Props = {
  initialData: ContactData;
};

/* ---------- Button styles (same pattern as other admin pages) ---------- */

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const grayBtn =
  "border border-gray-300 text-gray-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap bg-white";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";

/* ============================================================= */
/*                        MAIN COMPONENT                         */
/* ============================================================= */

export default function ContactAdminClientPage({ initialData }: Props) {
  const [data, setData] = useState<ContactData>({
    ...initialData,
    leadership: (initialData.leadership ?? []).map((member, index) => ({
      ...member,
      id: member.id || `leader-${index}-${member.name || "member"}`,
      visible:
        typeof member.visible === "undefined" ? true : Boolean(member.visible),
    })),
  });

  const [toast, setToast] = useState<string | null>(null);

  /* ---------- helpers ---------- */

  const updateRoot = <K extends keyof ContactData>(
    key: K,
    value: ContactData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateOrg = <K extends keyof ContactData["organization"]>(
    key: K,
    value: ContactData["organization"][K]
  ) => {
    setData((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        [key]: value,
      },
    }));
  };

  const updateLeader = (index: number, patch: Partial<LeadershipMember>) => {
    setData((prev) => {
      const leadership = [...prev.leadership];
      leadership[index] = { ...leadership[index], ...patch };
      return { ...prev, leadership };
    });
  };

  const addLeader = () => {
    setData((prev) => {
      const newId = `leader-${Date.now()}-${prev.leadership.length + 1}`;
      return {
        ...prev,
        leadership: [
          ...prev.leadership,
          {
            id: newId,
            title: "عضو جديد",
            name: "",
            visible: true,
          },
        ],
      };
    });
  };

  const removeLeader = (index: number) => {
    setData((prev) => {
      const leadership = [...prev.leadership];
      leadership.splice(index, 1);
      return { ...prev, leadership };
    });
  };

  const moveLeader = (index: number, dir: -1 | 1) => {
    setData((prev) => {
      const leadership = [...prev.leadership];
      const target = index + dir;
      if (target < 0 || target >= leadership.length) return prev;
      [leadership[index], leadership[target]] = [
        leadership[target],
        leadership[index],
      ];
      return { ...prev, leadership };
    });
  };

  const toggleLeaderVisibility = (index: number) => {
    setData((prev) => {
      const leadership = [...prev.leadership];
      const current = leadership[index];
      leadership[index] = {
        ...current,
        visible: current.visible === false ? true : false,
      };
      return { ...prev, leadership };
    });
  };

  /* ---------- save ---------- */

  const handleSave = async (formData: FormData) => {
    formData.set("payload", JSON.stringify(data));
    await saveContactData(formData);
    setToast("تم حفظ بيانات صفحة التواصل بنجاح");
    setTimeout(() => setToast(null), 2500);
  };

  /* ============================================================= */

  return (
    <div className="space-y-8" dir="rtl">
      {/* Page header settings */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">إعدادات صفحة تواصل معنا</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">العنوان الرئيسي للصفحة</label>
            <input
              className="w-full border px-3 py-2"
              value={data.pageTitle}
              onChange={(e) => updateRoot("pageTitle", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">وصف قصير أسفل العنوان</label>
            <textarea
              className="w-full border px-3 py-2 min-h-[70px]"
              value={data.description}
              onChange={(e) => updateRoot("description", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Organization info */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">معلومات الجمعية</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">اسم الجمعية</label>
            <input
              className="w-full border px-3 py-2"
              value={data.organization.name}
              onChange={(e) => updateOrg("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">الهاتف</label>
            <input
              className="w-full border px-3 py-2"
              value={data.organization.phone}
              onChange={(e) => updateOrg("phone", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">الفاكس (اختياري)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.organization.fax ?? ""}
              onChange={(e) => updateOrg("fax", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">صندوق البريد</label>
            <input
              className="w-full border px-3 py-2"
              value={data.organization.poBox}
              onChange={(e) => updateOrg("poBox", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">عنوان المقر</label>
            <input
              className="w-full border px-3 py-2"
              value={data.organization.address}
              onChange={(e) => updateOrg("address", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">
              البريد الإلكتروني الرسمي
            </label>
            <input
              className="w-full border px-3 py-2"
              value={data.organization.email}
              onChange={(e) => updateOrg("email", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Leadership controls header */}
      <section className="border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">أعضاء الإدارة</h2>
          <button type="button" className={blueBtn} onClick={addLeader}>
            + إضافة عضو جديد
          </button>
        </div>
      </section>

      {/* Leadership list */}
      <section className="space-y-6">
        {data.leadership.map((leader, index) => {
          const visible = leader.visible !== false;
          return (
            <div
              key={leader.id || index}
              className="border bg-white p-4 space-y-4 "
            >
              {/* top row: status + controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-sm text-gray-600">المنصب:</span>{" "}
                    <span className="font-bold">
                      {leader.title || "عضو إدارة"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    الحالة:{" "}
                    <span
                      className={visible ? "text-green-600" : "text-red-600"}
                    >
                      {visible ? "ظاهر" : "مخفي"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={visible ? grayBtn : blueBtn}
                    onClick={() => toggleLeaderVisibility(index)}
                  >
                    {visible ? "إخفاء هذا العضو" : "إظهار هذا العضو"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={index === 0}
                    onClick={() => moveLeader(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={index === data.leadership.length - 1}
                    onClick={() => moveLeader(index, +1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeLeader(index)}
                  >
                    حذف
                  </button>
                </div>
              </div>

              {/* fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">الصفة / المنصب</label>
                  <input
                    className="w-full border px-3 py-2"
                    value={leader.title}
                    onChange={(e) =>
                      updateLeader(index, { title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">اسم الشخص</label>
                  <input
                    className="w-full border px-3 py-2"
                    value={leader.name}
                    onChange={(e) =>
                      updateLeader(index, { name: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}

        {data.leadership.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            لا يوجد أي أعضاء مسجّلين حالياً. اضغط على زر &quot;إضافة عضو
            جديد&quot;.
          </p>
        )}
      </section>

      {/* Save section */}
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
            سيتم الكتابة إلى: <code>src/data/contact.json</code>
          </div>
          <button type="submit" className={blueBtn}>
            حفظ
          </button>
        </form>
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
