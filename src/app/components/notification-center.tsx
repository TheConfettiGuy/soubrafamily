"use client";

import notificationsData from "@/data/notifications.json";
import { AlertTriangle, Bell, Briefcase, Info, X } from "lucide-react";
import { useState } from "react";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);

  // 🔒 Global show / hide
  if (notificationsData.enabled === false) {
    return null;
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "important":
        return {
          bg: "bg-red-50",
          border: "border-red-500",
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          badge: "bg-red-500",
          label: "هام",
        };
      case "job":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-500",
          icon: <Briefcase className="w-5 h-5 text-yellow-600" />,
          badge: "bg-yellow-500",
          label: "فرصة عمل",
        };
      default:
        return {
          bg: "bg-white",
          border: "border-main-100",
          icon: <Info className="w-5 h-5 text-main-100" />,
          badge: "bg-main-100",
          label: "إشعار",
        };
    }
  };

  const newNotificationsCount = notificationsData.notifications.filter(
    (n) => n.isNew
  ).length;

  return (
    <>
      {/* Sticky Notification Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/3 -translate-y-1/2 z-50 w-18 h-18 bg-red-900 cursor-pointer flex items-center justify-center group"
        aria-label="فتح مركز الإشعارات"
      >
        <Bell className="w-12 h-12 text-white animate-[ring_2s_ease-in-out_infinite]" />
        {newNotificationsCount > 0 && (
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-white text-red-500 text-sm rounded-full flex items-center justify-center font-bold">
            {newNotificationsCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-4xl bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-main-100 text-white p-4 flex items-center justify-between">
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            {notificationsData.title}
          </h2>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
          {notificationsData.notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {notificationsData.emptyMessage}
            </p>
          ) : (
            <div className="space-y-3">
              {notificationsData.notifications.map((notification) => {
                const styles = getTypeStyles(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`${styles.bg} border-r-4 ${styles.border} p-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <h1 className="font-bold text-xl text-gray-800">
                            {notification.title}
                          </h1>
                        </div>
                        <p className="text-xl text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <span className="text-lg text-gray-400">
                          {notification.date}
                        </span>
                      </div>
                      <div className="mt-1">{styles.icon}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Ringing Animation Keyframes */}
      <style jsx global>{`
        @keyframes ring {
          0%,
          100% {
            transform: rotate(0deg);
          }
          10%,
          30% {
            transform: rotate(10deg);
          }
          20%,
          40% {
            transform: rotate(-10deg);
          }
          50%,
          100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </>
  );
}
