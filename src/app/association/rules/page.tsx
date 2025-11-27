import Footer from "@/app/components/footer";
import rulesData from "@/data/rules.json";

/* ---- Types so we can use `visible` ---- */

type Article = {
  number: string;
  title: string;
  content: string;
  items?: string[];
  note?: string;
  visible?: boolean;
};

type Amendment = {
  title: string;
  content: string;
  visible?: boolean;
};

type ComparisonSide = {
  title: string;
  content: string;
};

type Comparison = {
  title: string;
  subtitle: string;
  before: ComparisonSide;
  after: ComparisonSide;
  visible?: boolean;
};

type RulesData = {
  title: string;
  subtitle: string;
  associationName: string;
  articles: Article[];
  amendment: Amendment;
  comparison: Comparison;
  // extraBlocks exist in JSON but not rendered here (future use)
};

// Cast JSON
const data = rulesData as RulesData;

const Rules = () => {
  const visibleArticles = (data.articles || []).filter(
    (article) => article.visible !== false
  );

  const amendmentVisible = data.amendment?.visible !== false;
  const comparisonVisible = data.comparison?.visible !== false;

  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{data.title}</h1>
          <p className="text-lg text-white text-right mb-1">{data.subtitle}</p>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {data.associationName}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Articles */}
        <div className="space-y-8">
          {visibleArticles.map((article) => (
            <div key={article.number} className="">
              <div className="flex items-start gap-3 mb-2">
                <div className="bg-main-100 text-white px-3 py-1 text-lg font-semibold whitespace-nowrap">
                  {article.number}
                </div>
                <h3 className="font-bold text-gray-900 text-right text-xl flex-1">
                  {article.title}
                </h3>
              </div>

              {article.content && article.content.trim() !== "" && (
                <p className="text-gray-700 text-lg leading-relaxed text-right mb-2 pr-4 whitespace-pre-line">
                  {article.content}
                </p>
              )}

              {article.items && article.items.length > 0 && (
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

              {article.note && article.note.trim() !== "" && (
                <p className="mt-4 text-gray-600 italic text-right pr-4">
                  {article.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Amendment Section (visible flag) */}
        {amendmentVisible && (
          <div className="bg-white mt-8">
            <div className="bg-gray-100 p-4  border-r-4 border-main-100">
              <h2 className="text-xl font-bold text-main-100 mb-3 text-right">
                {data.amendment.title}
              </h2>
              <p className="text-gray-700 leading-relaxed text-right">
                {data.amendment.content}
              </p>
            </div>
          </div>
        )}

        {/* Comparison Table (visible flag) */}
        {comparisonVisible && (
          <div className="bg-white mt-8">
            <h2 className="text-2xl font-bold text-main-100 mb-6 text-right border-b-2 border-main-100 pb-2">
              {data.comparison.title}
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 text-right mb-4">
                {data.comparison.subtitle}
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
                <div className="bg-gray-100 p-4  border-r-4 border-main-100">
                  <h4 className="font-bold text-black mb-2 text-right text-xl">
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
};

export default Rules;
