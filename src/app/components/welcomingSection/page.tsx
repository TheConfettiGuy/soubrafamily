import welcomeData from "@/data/welcoming-letter.json";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const Welcoming = () => {
  return (
    <section className="bg-white py-16 lg:px-25 px-10">
      <div className="mx-auto">
        <div className="  ">
          <h2 className="text-3xl md:text-3xl font-bold text-main-100 mb-8">
            {welcomeData.title}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="border-r-4 border-main-100 pr-8">
              <p className="text-xl text-gray-800 leading-relaxed mb-4 font-semibold">
                {welcomeData.greeting}
              </p>

              <div className="space-y-6 text-gray-700 leading-relaxed text-lg pb-9 ">
                {welcomeData.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="">
                <p className="font-bold text-main-100 text-lg mb-2">
                  {welcomeData.signature.name} - {welcomeData.signature.title}
                </p>
              </div>
            </div>
            <Link
              href={welcomeData.readMoreButton.link}
              className="inline-flex items-center gap-2 bg-main-100 text-white px-8 py-4 hover:bg-white border hover:border-main-100 hover:text-main-100 transition-colors duration-200 font-medium mt-8 text-lg"
            >
              {welcomeData.readMoreButton.text}
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="relative h-96 mb-6 overflow-hidden">
                <Image
                  src={welcomeData.image.src || "/placeholder.svg"}
                  alt={welcomeData.image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcoming;
