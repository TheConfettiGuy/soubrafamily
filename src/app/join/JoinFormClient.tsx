"use client";

import { useRef, useState, useTransition } from "react";
import type joinDataType from "@/data/join.json";

type JoinData = typeof joinDataType;

type Props = {
  joinData: JoinData;
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
};

const JoinFormClient = ({ joinData, action }: Props) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      setMessage(null);
      setIsError(false);

      const res = await action(formData);

      if (res.ok) {
        setMessage("تم إرسال طلب الانتساب بنجاح.");
        setIsError(false);
        formRef.current?.reset();
      } else {
        setMessage(res.error || "حدث خطأ أثناء إرسال الطلب.");
        setIsError(true);
      }
    });
  };

  return (
    <div className="border-t-4 border-main-100 p-8">
      <div className="text-right mb-8 pb-6 border-b-2 border-gray-200">
        <h2 className="text-3xl font-bold text-main-100">
          {joinData.form.title}
        </h2>
      </div>

      <form ref={formRef} className="space-y-6" action={handleAction} dir="rtl">
        {/* Personal Information */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                {joinData.form.fields[0].label}
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

          {/* Father/Grandfather Name */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="fatherGrandfather"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                {joinData.form.fields[1].label}
              </label>
              <input
                type="text"
                id="fatherGrandfather"
                name="fatherGrandfather"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
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
                {joinData.form.fields[2].label}
              </label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
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
                {joinData.form.fields[3].label}
              </label>
              <input
                type="text"
                id="registryNumber"
                name="registryNumber"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
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
                {joinData.form.fields[4].label}
              </label>
              <input
                type="text"
                id="birthDate"
                name="birthDate"
                required
                placeholder="DD/MM/YYYY"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
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
                {joinData.form.fields[5].label}
              </label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
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
                {joinData.form.fields[6].label}
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                required
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
                {joinData.form.fields[7].label}
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
                {joinData.form.fields[8].label}
              </label>
              <textarea
                id="homeAddress"
                name="homeAddress"
                rows={3}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors resize-none"
              />
            </div>
          </div>

          {/* Contact Info (Fax / Work phone / Home phone) */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Fax */}
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="fax"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  {joinData.form.fields[9].label}
                </label>
                <input
                  type="text"
                  id="fax"
                  name="fax"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
                />
              </div>
            </div>

            {/* Work Phone */}
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="workPhone"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  {joinData.form.fields[10].label}
                </label>
                <input
                  type="text"
                  id="workPhone"
                  name="workPhone"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
                />
              </div>
            </div>

            {/* Home Phone */}
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="homePhone"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  {joinData.form.fields[11].label}
                </label>
                <input
                  type="text"
                  id="homePhone"
                  name="homePhone"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Children Names */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="childrenNames"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                {joinData.form.fields[12].label}
              </label>
              <input
                type="text"
                id="childrenNames"
                name="childrenNames"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Marital Status */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label className="block text-right text-gray-700 font-semibold mb-3">
                {joinData.form.fields[13].label}
              </label>
              <div className="flex gap-6">
                {joinData.form.fields[13].options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-gray-700">{option.label}</span>
                    <input
                      type="radio"
                      name="maritalStatus"
                      value={option.value}
                      required
                      className="w-4 h-4 text-main-100 focus:ring-main-100 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Level */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="academicLevel"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                {joinData.form.fields[14].label}
              </label>
              <input
                type="text"
                id="academicLevel"
                name="academicLevel"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="experience"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                {joinData.form.fields[15].label}
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors resize-none"
              />
            </div>
          </div>

          {/* Spouse info */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Spouse Profession */}
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="spouseProfession"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  {joinData.form.fields[16].label}
                </label>
                <input
                  type="text"
                  id="spouseProfession"
                  name="spouseProfession"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
                />
              </div>
            </div>

            {/* Spouse Name */}
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="flex-1">
                <label
                  htmlFor="spouseName"
                  className="block text-right text-gray-700 font-semibold mb-2"
                >
                  {joinData.form.fields[17].label}
                </label>
                <input
                  type="text"
                  id="spouseName"
                  name="spouseName"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label className="block text-right text-gray-700 font-semibold mb-3">
                {joinData.form.fields[18].label}
              </label>
              <div className="flex gap-6">
                {joinData.form.fields[18].options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-gray-700">{option.label}</span>
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      required
                      className="w-4 h-4 text-main-100 focus:ring-main-100 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Contribution */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="flex-1">
              <label
                htmlFor="contribution"
                className="block text-right text-gray-700 font-semibold mb-2"
              >
                {joinData.form.fields[19].label}
              </label>
              <input
                type="text"
                id="contribution"
                name="contribution"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-main-100 focus:ring-2 focus:ring-main-100/20 outline-none text-right transition-colors"
              />
            </div>
          </div>

          {/* Annual Fee Display */}
          <div className="bg-main-100 text-white p-6 text-center border-r-4 border-main-100">
            <p className="text-lg mb-2">بدل اشتراك سنوي</p>
            <p className="text-3xl font-bold">{joinData.form.annualFee}</p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col items-center gap-4 pt-6">
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={isPending}
              className="px-12 py-3 bg-main-100 text-white font-semibold transition-colors text-lg hover:border hover:border-main-100 hover:bg-white hover:text-main-100 disabled:opacity-60"
            >
              {isPending ? "جارٍ الإرسال..." : joinData.form.submitButton}
            </button>
            <button
              type="reset"
              className="px-12 py-3 bg-gray-100 text-black font-semibold transition-colors text-lg hover:bg-white border hover:border-main-100 hover:text-main-100"
            >
              {joinData.form.resetButton}
            </button>
          </div>

          {message && (
            <p
              className={`text-sm ${
                isError ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default JoinFormClient;
