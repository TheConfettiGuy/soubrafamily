"use client";

import { useState } from "react";
import { saveNotificationsConfig } from "../actions";

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const grayBtn =
  "border border-gray-300 text-gray-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap bg-white";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";

export type NotificationItem = {
  id: number;
  type: "important" | "job" | "normal";
  title: string;
  message: string;
  date: string;
  isNew?: boolean;
};

export type NotificationsConfig = {
  title: string;
  emptyMessage: string;
  enabled?: boolean;
  notifications: NotificationItem[];
};

type Props = {
  initialData: NotificationsConfig;
};

export default function NotificationsAdminClient({ initialData }: Props) {
  const [data, setData] = useState<NotificationsConfig>({
    ...initialData,
    enabled: initialData.enabled ?? true,
    notifications: initialData.notifications ?? [],
  });

  const [toast, setToast] = useState<string | null>(null);

  const updateRoot = <K extends keyof NotificationsConfig>(
    key: K,
    value: NotificationsConfig[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateNotification = (
    index: number,
    patch: Partial<NotificationItem>
  ) => {
    setData((prev) => {
      const notifications = [...prev.notifications];
      notifications[index] = { ...notifications[index], ...patch };
      return { ...prev, notifications };
    });
  };

  const addNotification = () => {
    setData((prev) => {
      const nextId =
        prev.notifications.reduce((max, n) => Math.max(max, n.id), 0) + 1;
      return {
        ...prev,
        notifications: [
          {
            id: nextId,
            type: "normal",
            title: "عنوان جديد",
            message: "نص الإشعار...",
            date: new Date().toISOString().slice(0, 10),
            isNew: true,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const removeNotification = (index: number) => {
    setData((prev) => {
      const notifications = [...prev.notifications];
      notifications.splice(index, 1);
      return { ...prev, notifications };
    });
  };

  const moveNotification = (index: number, dir: -1 | 1) => {
    setData((prev) => {
      const notifications = [...prev.notifications];
      const target = index + dir;
      if (target < 0 || target >= notifications.length) return prev;
      [notifications[index], notifications[target]] = [
        notifications[target],
        notifications[index],
      ];
      return { ...prev, notifications };
    });
  };

  const handleSave = async (fd: FormData) => {
    fd.set("payload", JSON.stringify(data));
    await saveNotificationsConfig(fd);
    setToast("تم حفظ إعدادات الإشعارات بنجاح");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* General settings */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">إعدادات مركز الإشعارات</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">عنوان المركز</label>
            <input
              className="w-full border px-3 py-2"
              value={data.title}
              onChange={(e) => updateRoot("title", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              رسالة في حال عدم وجود إشعارات
            </label>
            <input
              className="w-full border px-3 py-2"
              value={data.emptyMessage}
              onChange={(e) => updateRoot("emptyMessage", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm">
              <span className="text-gray-700">حالة مركز الإشعارات: </span>
              <span
                className={data.enabled ? "text-green-600" : "text-red-600"}
              >
                {data.enabled ? "ظاهر على الموقع" : "مخفي بالكامل"}
              </span>
            </div>
            <button
              type="button"
              className={data.enabled ? grayBtn : blueBtn}
              onClick={() => updateRoot("enabled", !data.enabled)}
            >
              {data.enabled ? "إخفاء مركز الإشعارات" : "إظهار مركز الإشعارات"}
            </button>
          </div>
        </div>
      </section>

      {/* Add notification */}
      <section className="border bg-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">الإشعارات</h2>
        <button type="button" className={blueBtn} onClick={addNotification}>
          + إضافة إشعار جديد
        </button>
      </section>

      {/* Notifications list */}
      <section className="space-y-6">
        {data.notifications.map((n, index) => (
          <div key={n.id} className="border bg-white p-4 space-y-4 ">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-gray-600">
                  <span>نوع الإشعار: </span>
                  <select
                    className="border px-2 py-1 text-sm bg-white"
                    value={n.type}
                    onChange={(e) =>
                      updateNotification(index, {
                        type: e.target.value as NotificationItem["type"],
                      })
                    }
                  >
                    <option value="important">هام</option>
                    <option value="job">فرصة عمل</option>
                    <option value="normal">إشعار عادي</option>
                  </select>
                </div>

                <div className="text-sm text-gray-600">
                  جديد؟{" "}
                  <button
                    type="button"
                    className={n.isNew ? grayBtn : blueBtn}
                    onClick={() =>
                      updateNotification(index, { isNew: !n.isNew })
                    }
                  >
                    {n.isNew ? "إلغاء تمييز جديد" : "تمييز كإشعار جديد"}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={grayBtn}
                  disabled={index === 0}
                  onClick={() => moveNotification(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={grayBtn}
                  disabled={index === data.notifications.length - 1}
                  onClick={() => moveNotification(index, +1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={redBtn}
                  onClick={() => removeNotification(index)}
                >
                  حذف
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">العنوان</label>
                <input
                  className="w-full border px-3 py-2"
                  value={n.title}
                  onChange={(e) =>
                    updateNotification(index, { title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  التاريخ (YYYY-MM-DD)
                </label>
                <input
                  className="w-full border px-3 py-2"
                  value={n.date}
                  onChange={(e) =>
                    updateNotification(index, { date: e.target.value })
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">نص الإشعار</label>
                <textarea
                  className="w-full border px-3 py-2 min-h-20"
                  value={n.message}
                  onChange={(e) =>
                    updateNotification(index, { message: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Save section */}
      <section className="border bg-white p-4">
        <form
          action={async (fd) => {
            await handleSave(fd);
          }}
          className="flex items-center justify-between gap-3 flex-wrap"
        >
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify(data)}
            readOnly
          />
          <div className="text-xs text-gray-500">
            سيتم الكتابة إلى: <code>src/data/notifications.json</code>
          </div>
          <button className={blueBtn} type="submit">
            حفظ
          </button>
        </form>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3  z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
