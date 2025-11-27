"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Footer from "../components/footer";

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Admin Link Card */}
        <div className="bg-white border-main-100 p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-main-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm border  p-6 bg-white space-y-3">
                <div className="text-center text-gray-500">
                  <p>تسحيل الدخول</p>
                </div>

                {err && <p className="text-red-600 text-sm">{err}</p>}

                <input
                  className="w-full  border px-3 py-2"
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={(e) => setU(e.target.value)}
                />
                <input
                  type="password"
                  className="w-full  border px-3 py-2"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setP(e.target.value)}
                />

                <button
                  className="w-full  px-3 py-2 bg-main-100 text-white cursor-pointer"
                  onClick={async () => {
                    const res = await signIn("credentials", {
                      username,
                      password,
                      redirect: false,
                    });
                    if (res?.ok) window.location.href = "/admin";
                    else setErr("بيانات غير صحيحة");
                  }}
                >
                  دخول
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 bg-gray-50 border-r-4 border-red-900 p-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong className="text-red-900">ملاحظة:</strong> هذه الصفحة مخصصة
            للمسؤولين فقط. يجب أن يكون لديك صلاحيات الوصول المناسبة لاستخدام
            لوحة التحكم.
          </p>
        </div>
        <div className="py-10"></div>
      </div>

      <Footer />
    </main>
  );
}
