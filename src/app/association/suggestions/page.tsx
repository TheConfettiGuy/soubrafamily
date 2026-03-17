"use client";

import Footer from "@/app/components/footer";
import suggestionsData from "@/data/suggestions.json";
import { FormEvent, useState, useTransition } from "react";
import { sendSuggestionsEmail } from "./actions";

const Page = () => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus(null);
    setMessage("");

    startTransition(async () => {
      try {
        const res = await sendSuggestionsEmail(formData);
        if (res?.ok) {
          setStatus("success");
          setMessage("تم إرسال الاقتراح بنجاح، شكرًا لملاحظاتكم.");
          form.reset();
        } else {
          setStatus("error");
          setMessage("حدث خطأ أثناء إرسال الاقتراح، يرجى المحاولة مجددًا.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("حدث خطأ أثناء إرسال الاقتراح، يرجى المحاولة مجددًا.");
      }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {suggestionsData.title}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            نرحب بآرائكم واقتراحاتكم لتطوير خدمات الجمعية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Application Form */}
        <div className="bg-white border-t-4 border-main-100 p-8">
          <div className="text-right mb-8 pb-6 border-b-2 border-gray-200">
            <h2 className="text-3xl font-bold text-main-100">
              {suggestionsData.title}
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
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
                />
              </div>
            </div>

            {/* Profession */}
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="profession"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  المهنة:
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
                />
              </div>
            </div>

            {/* Work Address */}
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="workAddress"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  عنوان العمل:
                </label>
                <textarea
                  id="workAddress"
                  name="workAddress"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors resize-none"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors resize-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="phone"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  هاتف:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
                />
              </div>
            </div>

            {/* Suggestions */}
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="suggestions"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  اقتراحات:
                </label>
                <textarea
                  id="suggestions"
                  name="suggestions"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors resize-none"
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
                {isPending ? "جارٍ الإرسال..." : suggestionsData.buttons.submit}
              </button>
              <button
                type="reset"
                className="px-12 py-3 bg-gray-100 text-black font-semibold transition-colors text-lg hover:bg-white border hover:border-main-100 hover:text-main-100"
              >
                {suggestionsData.buttons.reset}
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
        <div className="mt-8 bg-main-100 text-white p-6">
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="text-right">
              <p className="font-medium mb-2">
                {suggestionsData.contactInfo.text}
              </p>
              <p className="text-gray-200">
                {suggestionsData.contactInfo.address}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
