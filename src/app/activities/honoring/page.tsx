"use client";

import Footer from "@/app/components/footer";
import honoringData from "@/data/honoring.json";
import { Award, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type HonoringEvent = {
  id: string;
  year: string;
  date?: string;
  name: string;
  occasion?: string;
  location?: string;
  image?: string;
  visible?: boolean; // false = hidden
};

type HonoringJSON = {
  title: string;
  subtitle?: string;
  events: HonoringEvent[];
};

const blueChip =
  "inline-flex items-center gap-2 bg-main-100 text-white px-3 py-1 text-xs";

export default function HonoringPage() {
  const data = (honoringData as HonoringJSON) ?? { title: "", events: [] };

  // Only visible events, newest year first
  const events = [...(data.events || [])]
    .filter((ev) => ev.visible !== false)
    .sort((a, b) => Number(b.year) - Number(a.year));

  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!events.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-main-100 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4 text-right">
              {data.title || "التكريم"}
            </h1>
            {data.subtitle && (
              <p className="text-xl text-gray-300 mt-4 text-right italic">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-600">
          لا توجد تكريمات معروضة حالياً.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{data.title}</h1>
          {data.subtitle && (
            <p className="text-xl text-gray-300 mt-4 text-right italic">
              {data.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <article
              key={ev.id}
              className="bg-white border border-main-100/40 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              {/* Image */}
              {ev.image && (
                <button
                  type="button"
                  className="relative h-56 w-full overflow-hidden cursor-pointer"
                  onClick={() => setActiveImage(ev.image!)}
                  aria-label={`عرض صورة التكريم لـ ${ev.name}`}
                >
                  <Image
                    src={ev.image}
                    alt={ev.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </button>
              )}

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col" dir="rtl">
                <div className="flex items-center justify-between mb-3 text-xl">
                  <span className={blueChip + `text-7xl`}>
                    <Award className="w-4 h-4" />
                    تكريم {ev.year}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-main-100 mb-2">
                  {ev.name}
                </h2>

                {ev.occasion && (
                  <p className="text-gray-700 text-xl leading-relaxed mb-3">
                    {ev.occasion}
                  </p>
                )}

                <div className="mt-auto space-y-1 text-sm text-gray-600">
                  {ev.date && (
                    <div className="flex items-center gap-2 justify-start">
                      <CalendarDays className="w-4 h-4 text-main-100" />
                      <span>{ev.date}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-2 justify-start">
                      <MapPin className="w-4 h-4 text-main-100" />
                      <span>{ev.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />

      {/* Simple image lightbox */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative w-[95vw] h-[85vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt="honoring image"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 text-sm"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
