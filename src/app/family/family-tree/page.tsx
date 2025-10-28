import Footer from "@/app/components/footer/page";
import familyTreeData from "@/data/family-tree.json";
const FamilyTree = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {familyTreeData.title}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {familyTreeData.author}
          </p>
        </div>
      </div>

      {/* Key Figures */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-right text-main-100">
            الشخصيات الرئيسية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {familyTreeData.keyFigures.map((figure, index) => (
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

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <div className=" mx-auto space-y-12">
          {familyTreeData.sections.map((section, index) => (
            <div
              key={index}
              className={`${
                section.type === "introduction"
                  ? "bg-gray-100 border-r-4 border-main-100 p-8"
                  : section.type === "conclusion"
                    ? "bg-blue-50 border-r-4 border-main-100 p-8"
                    : "border-r-4 border-gray-300 pr-8"
              }`}
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
      <div className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-main-100">
            الخط الزمني للمشروع
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-right">
                <div className="flex-1">
                  <h3 className="font-bold text-main-100">1988</h3>
                  <p className="text-gray-600">
                    بداية المشروع مع المهندس عفيف محمد سوبره
                  </p>
                </div>
                <div className="w-4 h-4 bg-main-100 rounded-full"></div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="flex-1">
                  <h3 className="font-bold text-main-100">1988-1990</h3>
                  <p className="text-gray-600">
                    جمع المعلومات وزيارة المدافن للتوثيق
                  </p>
                </div>
                <div className="w-4 h-4 bg-main-100 rounded-full"></div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="flex-1">
                  <h3 className="font-bold text-main-100">1990-1993</h3>
                  <p className="text-gray-600">فترة توقف وتحديات</p>
                </div>
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="flex-1">
                  <h3 className="font-bold text-main-100">1993</h3>
                  <p className="text-gray-600">
                    إحياء المشروع مع الأستاذ نبيل محمود سوبره
                  </p>
                </div>
                <div className="w-4 h-4 bg-main-100 rounded-full"></div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="flex-1">
                  <h3 className="font-bold text-main-100">1997</h3>
                  <p className="text-gray-600">
                    إتمام شجرة العائلة وإصدار الكتاب
                  </p>
                </div>
                <div className="w-4 h-4 bg-black rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FamilyTree;
