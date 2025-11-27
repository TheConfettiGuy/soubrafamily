import Footer from "@/app/components/footer";
import academicData from "@/data/academic-activities.json";

const academicActivities = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {academicData.title}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {academicData.description}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Required Documents Section */}
        <div className="mb-12 bg-white  p-8 border-r-4 border-main-100">
          <h2 className="text-3xl font-bold text-main-100 mb-6 text-right">
            {academicData.requiredDocuments.title}
          </h2>
          <ul className="space-y-3">
            {academicData.requiredDocuments.documents.map((doc, index) => (
              <li key={index} className="flex items-start gap-3 text-right">
                <span className="text-gray-700 flex-1 text-lg">{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Info */}
        <div className="mb-12 bg-main-100 text-white  p-6">
          <p className="text-right leading-relaxed text-base">
            {academicData.additionalInfo}
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-white  p-8 border-r-4 border-main-100">
          <h2 className="text-3xl font-bold text-main-100 mb-2 text-right">
            {academicData.formTitle}
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-right">
            {academicData.formSubtitle}
          </p>

          <form className="space-y-6">
            {academicData.fields.map((field) => {
              return (
                <div key={field.id} className="space-y-2">
                  <label
                    htmlFor={field.id}
                    className="flex items-center gap-2 text-main-100 font-medium "
                  >
                    <span>{field.label}</span>
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.id}
                      name={field.id}
                      required={field.required}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-main-100 focus:border-transparent transition-all text-right"
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-main-100 focus:border-transparent transition-all text-right"
                    />
                  )}
                </div>
              );
            })}

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700  hover:bg-gray-50 transition-colors font-medium"
              >
                {academicData.resetButton}
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-main-100 text-white  hover:bg-[#2d5a8f] transition-colors font-medium"
              >
                {academicData.submitButton}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default academicActivities;
