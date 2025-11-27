import Footer from "@/app/components/footer";
import familyTreeData from "@/data/family-tree.json";

// Optional typing to make TS happy
type StorySection = {
  id: string;
  type: "introduction" | "section" | "conclusion";
  title: string;
  content: string[];
  visible?: boolean;
};

type KeyFigure = {
  name: string;
  role: string;
};

type TimelineStyle = "main" | "muted" | "end";

type TimelineItem = {
  year: string;
  description: string;
  style?: TimelineStyle;
};

type FamilyStoryData = {
  title: string;
  subtitle?: string;
  author?: string;
  sections: StorySection[];
  keyFigures: KeyFigure[];
  showKeyFigures?: boolean;
  timeline?: TimelineItem[]; // 👈 NEW
  showTimeline?: boolean;
};

const FamilyTree = () => {
  const data = familyTreeData as FamilyStoryData;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{data.title}</h1>

          {data.subtitle && (
            <p className="text-xl text-gray-100 text-right mb-2">
              {data.subtitle}
            </p>
          )}

          {data.author && (
            <p className="text-xl text-gray-300 mt-2 text-right italic">
              {data.author}
            </p>
          )}
        </div>
      </div>

      {/* Key Figures */}
      {data.showKeyFigures !== false && ( // 👈 respect toggle (default = true)
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-right text-main-100">
              الشخصيات الرئيسية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.keyFigures
                .filter((f) => f.name.trim() || f.role.trim())
                .map((figure, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 border-r-4 border-main-100"
                  >
                    <h3 className="font-bold text-right text-main-100 mb-2">
                      {figure.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-right">
                      {figure.role}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto space-y-12">
          {data.sections
            .filter((section) => section.visible !== false) // 👈 احترم التبديل من لوحة التحكم
            .map((section, index) => (
              <div
                key={index}
                className={
                  section.type === "introduction"
                    ? "bg-gray-100 border-r-4 border-main-100 p-8"
                    : section.type === "conclusion"
                      ? "bg-blue-50 border-r-4 border-main-100 p-8"
                      : "border-r-4 border-gray-300 pr-8"
                }
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-right text-main-100">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-lg leading-relaxed text-gray-700 text-right"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Timeline Visual */}
      {/* Timeline Visual */}
      {data.showTimeline !== false &&
        data.timeline &&
        data.timeline.length > 0 && (
          <div className="bg-white border-t py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center text-main-100">
                الخط الزمني للمشروع
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  {data.timeline.map((item, index) => {
                    let dotClass = "bg-main-100";
                    switch (item.style) {
                      case "muted":
                        dotClass = "bg-gray-400";
                        break;
                      case "end":
                        dotClass = "bg-black";
                        break;
                      case "main":
                      default:
                        dotClass = "bg-main-100";
                    }

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 text-right"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-main-100">
                            {item.year}
                          </h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full ${dotClass}`}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      <Footer />
    </div>
  );
};

export default FamilyTree;
