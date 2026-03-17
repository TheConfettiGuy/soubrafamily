import joinData from "@/data/join.json";
import Footer from "../components/footer";
import JoinFormClient from "./JoinFormClient";
import { submitJoinForm } from "./actions";

const JoinPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
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
                  <div className="shrink-0 w-10 h-10 bg-main-100 text-white flex items-center justify-center font-bold">
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
                className="p-6 border border-main-100 transition-colors"
              >
                <div className="flex gap-4 mb-3">
                  <div className="shrink-0 w-8 h-8 bg-main-100 text-white flex items-center justify-center font-bold text-sm">
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

        {/* Application Form (client component) */}
        <JoinFormClient joinData={joinData} action={submitJoinForm} />
      </div>

      <Footer />
    </div>
  );
};

export default JoinPage;
