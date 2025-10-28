import Footer from "@/app/components/footer/page";
import rulesData from "@/data/rules.json";

const Rules = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {rulesData.title}
          </h1>
          <p className="text-lg text-white text-right mb-1">
            {rulesData.subtitle}
          </p>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {rulesData.associationName}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Articles */}
        <div className="space-y-8">
          {rulesData.articles.map((article) => (
            <div key={article.number} className="">
              <div className="flex items-start gap-3 mb-2">
                <div className="bg-main-100 text-white px-3 py-1 text-lg font-semibold whitespace-nowrap">
                  {article.number}
                </div>
                <h3 className="font-bold text-gray-900 text-right text-xl flex-1">
                  {article.title}
                </h3>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed text-right mb-2 pr-4 whitespace-pre-line">
                {article.content}
              </p>

              {article.items && (
                <ul className="space-y-2 pr-6">
                  {article.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-gray-700 leading-relaxed text-right flex items-start gap-2"
                    >
                      <span className="text-black font-bold">{idx + 1}.</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {article.note && (
                <p className="mt-4 text-gray-600 italic text-right pr-4">
                  {article.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Amendment Section */}
        <div className="bg-white mt-8">
          <div className="bg-gray-100 p-4  border-r-4 border-main-100">
            <h2 className="text-xl font-bold text-main-100 mb-3 text-right">
              {rulesData.amendment.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-right">
              {rulesData.amendment.content}
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white mt-8">
          <h2 className="text-2xl font-bold text-main-100 mb-6 text-right border-b-2 border-main-100 pb-2">
            {rulesData.comparison.title}
          </h2>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 text-right mb-4">
              {rulesData.comparison.subtitle}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4  border-r-4 border-main-100">
                <h4 className="font-bold text-red-700 mb-2 text-right text-xl">
                  {rulesData.comparison.before.title}
                </h4>
                <p className="text-gray-700 text-right">
                  {rulesData.comparison.before.content}
                </p>
              </div>
              <div className="bg-gray-100 p-4  border-r-4 border-main-100">
                <h4 className="font-bold text-black mb-2 text-right text-xl">
                  {rulesData.comparison.after.title}
                </h4>
                <p className="text-gray-700 text-right ">
                  {rulesData.comparison.after.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Rules;
