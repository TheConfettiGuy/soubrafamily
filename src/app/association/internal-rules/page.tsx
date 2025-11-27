import Footer from "@/app/components/footer";
import internalRulesData from "@/data/internal-rules.json";

/* ---- Types so we can use `visible` safely ---- */

type Article = {
  number: string;
  title?: string;
  content?: string;
  items?: string[];
  visible?: boolean;
};

type Position = {
  title: string;
  responsibilities: string[];
  visible?: boolean;
};

type Section = {
  title: string;
  articles?: Article[];
  positions?: Position[];
  visible?: boolean;
};

type ComparisonSide = {
  title: string;
  content: string;
};

type Comparison = {
  title: string;
  article: string;
  before: ComparisonSide;
  after: ComparisonSide;
  visible?: boolean;
};

type InternalRulesData = {
  title: string;
  subtitle?: string;
  associationName?: string;
  sections: Section[];
  comparison: Comparison;
};

// Cast JSON to our type
const data = internalRulesData as InternalRulesData;

export default function InternalRules() {
  // Only sections that are not explicitly hidden
  const visibleSections = (data.sections || []).filter(
    (section) => section.visible !== false
  );

  const comparisonVisible = data.comparison?.visible !== false;

  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{data.title}</h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {data.associationName}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Sections */}
        <div className="space-y-8">
          {visibleSections.map((section, sectionIndex) => {
            const visibleArticles = (section.articles || []).filter(
              (article) => article.visible !== false
            );
            const visiblePositions = (section.positions || []).filter(
              (pos) => pos.visible !== false
            );

            const hasArticles = visibleArticles.length > 0;
            const hasPositions = visiblePositions.length > 0;

            if (!hasArticles && !hasPositions) return null;

            return (
              <div key={sectionIndex} className="bg-white  border-gray-200">
                <h2 className="text-3xl font-bold text-main-100 mb-6 text-right pr-6 border-r-4 border-main-100 pb-2">
                  {section.title}
                </h2>

                {/* Articles */}
                {hasArticles && (
                  <div className="space-y-6 ">
                    {visibleArticles.map((article, articleIndex) => (
                      <div key={articleIndex}>
                        <div className="flex items-start gap-3 mb-2">
                          <div className="bg-main-100 text-white px-3 py-1 text-lg font-semibold whitespace-nowrap">
                            {article.number}
                          </div>
                          {article.title && article.title.trim() !== "" && (
                            <h3 className="text-xl font-bold text-gray-900 text-right flex-1">
                              « {article.title} »
                            </h3>
                          )}
                        </div>

                        {article.content && article.content.trim() !== "" && (
                          <p className="text-gray-700 leading-relaxed text-right mb-2 pr-4 text-lg">
                            {article.content}
                          </p>
                        )}

                        {article.items && article.items.length > 0 && (
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
                {hasPositions && (
                  <div className="space-y-6">
                    {visiblePositions.map((position, positionIndex) => (
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
            );
          })}
        </div>

        {/* Comparison Table (respect visible) */}
        {comparisonVisible && (
          <div className="bg-white mt-8">
            <h2 className="text-2xl font-bold text-main-100 mb-6 text-right border-b-2 border-main-100 pb-2">
              {data.comparison.title}
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 text-right mb-4">
                {data.comparison.article}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4  border-r-4 border-main-100">
                  <h4 className="font-bold text-red-700 mb-2 text-right text-xl">
                    {data.comparison.before.title}
                  </h4>
                  <p className="text-gray-700 text-right">
                    {data.comparison.before.content}
                  </p>
                </div>
                <div className="bg-blue-50 p-4  border-r-4 border-main-100">
                  <h4 className="font-bold  mb-2 text-right text-xl">
                    {data.comparison.after.title}
                  </h4>
                  <p className="text-gray-700 text-right ">
                    {data.comparison.after.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
