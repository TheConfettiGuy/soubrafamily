"use client";

import { FormEvent, useState, useTransition } from "react";
import Footer from "@/app/components/footer";
import socialActivitiesData from "@/data/social-activities.json";
import { sendSocialActivitiesEmail } from "./actions";

export default function SocialActivitiesPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus(null);
    setMessage("");

    startTransition(async () => {
      try {
        const res = await sendSocialActivitiesEmail(formData);
        if (res?.ok) {
          setStatus("success");
          setMessage("تم إرسال الطلب بنجاح، شكرًا لتواصلكم مع الجمعية.");
          form.reset();
        } else {
          setStatus("error");
          setMessage("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجددًا.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجددًا.");
      }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {socialActivitiesData.title}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {socialActivitiesData.description}
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-right mb-8 pb-6 border-b-2 border-gray-200">
          <h2 className="text-3xl font-bold text-[#1e3a5f]">
            {socialActivitiesData.formTitle}
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                الاسم:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Father Name */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="fatherName"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                اسم الأب:
              </label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Mother Name */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="motherName"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                اسم الأم:
              </label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Registry Number */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="registryNumber"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                رقم السجل:
              </label>
              <input
                type="text"
                id="registryNumber"
                name="registryNumber"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Birth Date */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="birthDate"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                تاريخ الولادة (اليوم/الشهر/السنة):
              </label>
              <input
                type="text"
                id="birthDate"
                name="birthDate"
                required
                placeholder="DD/MM/YYYY"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Birth Place */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="birthPlace"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                مكان الولادة:
              </label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Spouse Name */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="spouseName"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                اسم الزوج/الزوجة:
              </label>
              <input
                type="text"
                id="spouseName"
                name="spouseName"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Home Address */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="homeAddress"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                عنوان السكن:
              </label>
              <textarea
                id="homeAddress"
                name="homeAddress"
                rows={3}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors resize-none"
              />
            </div>
          </div>

          {/* Home Phone */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="homePhone"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                هاتف المنزل:
              </label>
              <input
                type="tel"
                id="homePhone"
                name="homePhone"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Marital Status */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label className="block text-right text-gray-700 font-semibold mb-3">
                الوضع العائلي:
              </label>
              <div className="flex gap-6 justify-start">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-gray-700">أعزب</span>
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="single"
                    required
                    className="w-5 h-5 text-[#1e3a5f] border-gray-300 focus:ring-[#1e3a5f] cursor-pointer"
                  />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-gray-700">متأهل</span>
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="married"
                    className="w-5 h-5 text-[#1e3a5f] border-gray-300 focus:ring-[#1e3a5f] cursor-pointer"
                  />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-gray-700">مطلق</span>
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="divorced"
                    className="w-5 h-5 text-[#1e3a5f] border-gray-300 focus:ring-[#1e3a5f] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="explanation"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                يرجى شرح الموضوع بخمسة أسطر:
              </label>
              <textarea
                id="explanation"
                name="explanation"
                rows={5}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none text-right transition-colors resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={isPending}
              className="px-12 py-3 bg-main-100 text-white font-semibold transition-colors text-lg hover:border hover:border-main-100 hover:bg-white hover:text-main-100 disabled:opacity-60"
            >
              {isPending ? "جارٍ الإرسال..." : "إرسال"}
            </button>
            <button
              type="reset"
              className="px-12 py-3 bg-gray-100 text-black font-semibold transition-colors text-lg hover:bg-white border hover:border-main-100 hover:text-main-100"
            >
              إعادة تعيين
            </button>
          </div>

          {/* Status message */}
          {message && (
            <p
              className={`text-center mt-4 text-sm ${
                status === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Contact Information */}
      <div className="mt-8 text-black p-6">
        <div className="flex items-start gap-3">
          <div className="text-right">
            <p className="font-medium mb-2">
              {socialActivitiesData.contactInfo.text}
            </p>
            <p className="text-black">
              {socialActivitiesData.contactInfo.address}
            </p>
            <p className="text-black flex items-center gap-2 justify-start mt-2">
              تلفاكس: {socialActivitiesData.contactInfo.phone}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
