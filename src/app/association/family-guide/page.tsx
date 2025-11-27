import Footer from "@/app/components/footer";
import familyGuideData from "@/data/family-guide.json";
import { FileText, Globe, Pill, Stethoscope, Users } from "lucide-react";

const iconMap = {
  book: FileText,
  medical: Stethoscope,
  pharmacy: Pill,
  users: Users,
  globe: Globe,
};

const Page = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {familyGuideData.title}
          </h1>
          <p className="text-lg text-white text-right mb-1">
            {familyGuideData.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyGuideData.documents
            .filter((doc) => doc.visible !== false)
            .map((doc) => {
              const Icon =
                iconMap[doc.icon as keyof typeof iconMap] ?? FileText;

              return (
                <div
                  key={doc.id}
                  className="bg-gray-100 border-r-4 border-main-100 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-main-100 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-main-100 text-right flex-1">
                        {doc.title}
                      </h2>
                    </div>

                    <p className="text-gray-600 text-right mb-6 leading-relaxed">
                      {doc.description}
                    </p>

                    <a
                      href={doc.fileUrl}
                      download
                      className="flex items-center justify-center gap-2 w-full bg-main-100 hover:bg-white text-white hover:text-main-100 border hover:border-main-100 font-semibold py-3 px-6 transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>تحميل {doc.fileName}</span>
                    </a>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-gray-100 border-r-4 border-main-100 px-6 py-4">
            <p className="text-black text-right">
              <span className="font-semibold text-main-100">ملاحظة:</span> جميع
              الملفات بصيغة PDF. في حال واجهتكم أي مشكلة في التحميل، يرجى
              التواصل مع إدارة الجمعية.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
