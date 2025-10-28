"use client";

import joinData from "@/data/join.json";
import Footer from "../components/footer/page";

const Join = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {joinData.title}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {joinData.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Requirements Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-main-100 text-right mb-4">
            {joinData.requirements.title}
          </h2>
          <p className="text-gray-700 text-right text-xl mb-6 leading-relaxed">
            {joinData.requirements.description}
          </p>
          <div className="space-y-4">
            {joinData.requirements.items.map((item) => (
              <div
                key={item.number}
                className="bg-gray-100 p-6 border-r-4 border-main-10"
              >
                <div className="flex items-start gap-4 flex-row-reverse">
                  <div className="flex-shrink-0 w-10 h-10 bg-main-100 text-white  flex items-center justify-center font-bold">
                    {item.number}
                  </div>
                  <p className="text-gray-700 text-right text-base flex-1 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-main-100 text-right mb-4">
            {joinData.process.title}
          </h2>
          <p className="bg-gray-100 text-gray-700 text-right mb-8 leading-relaxed text-base p-6 border-r-4 border-main-100">
            {joinData.process.description}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {joinData.process.steps.map((step) => (
              <div
                key={step.number}
                className=" p-6 border border-main-100 transition-colors"
              >
                <div className="flex gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-main-100 text-white  flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-main-100 text-right">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-right text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className=" border-t-4 border-main-100 p-8">
          <div className="text-right mb-8 pb-6 border-b-2 border-gray-200">
            <h2 className="text-3xl font-bold text-main-100">
              {joinData.form.title}
            </h2>
          </div>

          <form className="space-y-6">
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

              {/* Contact Information */}
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
                  <div className="flex gap-6 justify-end">
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
                          className="w-5 h-5 text-main-100 border-gray-300 focus:ring-main-100 cursor-pointer"
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

              {/* Spouse Information */}
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
                  <div className="flex gap-6 justify-end">
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
                          className="w-5 h-5 text-main-100 border-gray-300 focus:ring-main-100 cursor-pointer"
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
            <div className="flex gap-4 justify-center pt-6">
              <button
                type="submit"
                className="px-12 py-3 bg-main-100 text-white font-semibold transition-colors text-lg hover:border hover:border-main-100 hover:bg-white hover:text-main-100"
              >
                {joinData.form.submitButton}
              </button>
              <button
                type="reset"
                className="px-12 py-3 bg-gray-100 text-black font-semibold transition-colors text-lg hover:bg-white border hover:border-main-100 hover:text-main-100"
              >
                {joinData.form.resetButton}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Join;
