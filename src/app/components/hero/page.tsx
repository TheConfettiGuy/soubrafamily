import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, LetterText, Quote } from "lucide-react";
import heroData from "@/data/hero.json";

export default function NewsHeader() {
  return (
    <section
      className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
      dir="rtl"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroData.backgroundImage || "/placeholder.svg"}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          {/* Badge */}
          {/* <span className="inline-block bg-main-100 text-white px-4 py-2 text-sm md:text-base font-bold mb-4 md:mb-6">
            {heroData.badge}
          </span> */}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            {heroData.title}
          </h1>

          {/* Description as Quote */}
          <div className="relative border-r-4 border-main-100 pr-4 md:pr-6 mb-6 md:mb-8">
            <p className="text-lg md:text-lg lg:text-xl text-gray-100 leading-relaxed italic">
              "{heroData.description}"
            </p>
          </div>

          {/* CTA and Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Button */}

            <Link
              href={heroData.button2.link}
              className="inline-flex items-center gap-2 bg-main-100 hover:bg-white hover:text-main-100 text-white px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-bold transition-colors group"
            >
              {heroData.button2 .text}
              <LetterText className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
            </Link>

            <Link
              href={heroData.button.link}
              className="inline-flex items-center gap-2 bg-main-100 hover:bg-white hover:text-main-100 text-white px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-bold transition-colors group"
            >
              {heroData.button.text}
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
            </Link>

            {/* Author Badge */}
          </div>
        </div>
      </div>
    </section>
  );
}
