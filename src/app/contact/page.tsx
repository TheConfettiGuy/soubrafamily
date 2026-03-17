"use client";

import type React from "react";
import { useState } from "react";

import contactData from "@/data/contact.json";
import { Mail, MapPin, Phone, Send, User } from "lucide-react";
import Footer from "../components/footer";
import { sendContactEmail } from "./action";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    fd.append("subject", formData.subject);
    fd.append("message", formData.message);

    try {
      await sendContactEmail(fd);

      setSuccess("تم إرسال رسالتك بنجاح");
      setTimeout(() => setSuccess(""), 3000);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);

      setSuccess("حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
      setTimeout(() => setSuccess(""), 3000);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {contactData.pageTitle}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {contactData.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Information */}
          <div className="space-y-6">
            {/* Organization Info */}
            <div className="bg-white p-6 border-t-4 border-main-100">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-main-100">
                  {contactData.organization.name}
                </h2>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-main-100/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-main-100" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="text-gray-800">
                      {contactData.organization.address}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-main-100/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-main-100" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">هاتف/فاكس</p>
                    <p className="text-gray-800 font-medium" dir="ltr">
                      {contactData.organization.phone}
                    </p>
                  </div>
                </div>

                {/* PO Box */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-main-100/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-main-100" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">صندوق بريد بيروت</p>
                    <p className="text-gray-800 font-medium">
                      {contactData.organization.poBox}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-main-100/10 flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-main-100" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <a
                      href={`mailto:${contactData.organization.email}`}
                      className="text-main-100 font-medium"
                    >
                      {contactData.organization.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership */}
            <div className="bg-white p-6 border-t-4 border-main-100">
              <h2 className="text-xl font-bold text-main-100 mb-6">
                الإدارة الحالية
              </h2>
              <div className="space-y-4">
                {contactData.leadership.map((leader, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-main-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-main-100 font-medium">
                        {leader.title}
                      </p>
                      <p className="text-gray-800 font-bold">{leader.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="bg-white p-6 border-t-4 border-main-100">
            <h2 className="text-xl font-bold text-main-100 mb-6">
              أرسل لنا رسالة
            </h2>

            {success && (
              <p className="text-green-600 text-center mb-4 font-medium">
                {success}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              onReset={handleReset}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label className="block text-sm mb-1">الاسم</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-main-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-main-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-main-100"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm mb-1">الموضوع</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-main-100"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm mb-1">الرسالة</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-main-100 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-12 py-3 bg-main-100 text-white font-semibold hover:bg-white hover:text-main-100 border hover:border-main-100 transition"
                >
                  {loading ? "جارٍ الإرسال..." : "إرسال"}
                </button>

                <button
                  type="reset"
                  className="px-12 py-3 bg-gray-100 text-black font-semibold hover:bg-white border hover:border-main-100 hover:text-main-100 transition"
                >
                  إعادة تعيين
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
