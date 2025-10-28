import Footer from "@/app/components/footer/page";
import internalRulesData from "@/data/internal-rules.json";

export default function InternalRules() {
  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {internalRulesData.title}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {internalRulesData.associationName}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Sections */}
        <div className="space-y-8">
          {internalRulesData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white  border-gray-200">
              <h2 className="text-3xl font-bold text-main-100 mb-6 text-right pr-6 border-r-4 border-main-100 pb-2">
                {section.title}
              </h2>

              {/* Articles */}
              {section.articles && (
                <div className="space-y-6 ">
                  {section.articles.map((article, articleIndex) => (
                    <div key={articleIndex}>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="bg-main-100 text-white px-3 py-1 text-lg font-semibold whitespace-nowrap">
                          {article.number}
                        </div>
                        {article.title && (
                          <h3 className="text-xl font-bold text-gray-900 text-right flex-1">
                            « {article.title} »
                          </h3>
                        )}
                      </div>

                      {article.content && (
                        <p className="text-gray-700 leading-relaxed text-right mb-2 pr-4 text-lg">
                          {article.content}
                        </p>
                      )}

                      {article.items && (
                        <ul className="space-y-2 pr-6">
                          {article.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="text-gray-700 leading-relaxed text-right text-lg flex items-start gap-2"
                            >
                              <span className="text-main-100 font-bold">
                                {itemIndex + 1}.
                              </span>
                              <span className="flex-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Positions */}
              {section.positions && (
                <div className="space-y-6">
                  {section.positions.map((position, positionIndex) => (
                    <div key={positionIndex} className="bg-gray-100 p-4 ">
                      <h3 className="text-lg font-bold text-main-100 mb-3 text-right">
                        {position.title}
                      </h3>
                      <ul className="space-y-2 pr-4">
                        {position.responsibilities.map(
                          (responsibility, respIndex) => (
                            <li
                              key={respIndex}
                              className="text-gray-700 leading-relaxed text-right flex items-start gap-2"
                            >
                              <span className="text-main-100 font-bold">
                                {respIndex + 1}.
                              </span>
                              <span className="flex-1">{responsibility}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white mt-8">
          <h2 className="text-2xl font-bold text-main-100 mb-6 text-right border-b-2 border-main-100 pb-2">
            {internalRulesData.comparison.title}
          </h2>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 text-right mb-4">
              {internalRulesData.comparison.article}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4  border-r-4 border-main-100">
                <h4 className="font-bold text-red-700 mb-2 text-right text-xl">
                  {internalRulesData.comparison.before.title}
                </h4>
                <p className="text-gray-700 text-right">
                  {internalRulesData.comparison.before.content}
                </p>
              </div>
              <div className="bg-blue-50 p-4  border-r-4 border-main-100">
                <h4 className="font-bold  mb-2 text-right text-xl">
                  {internalRulesData.comparison.after.title}
                </h4>
                <p className="text-gray-700 text-right ">
                  {internalRulesData.comparison.after.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
