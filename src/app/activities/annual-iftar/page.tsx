import Footer from "@/app/components/footer";
import { getAnnualIftar } from "@/app/admin/annual-iftar/actions";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Always read fresh JSON on each request (nice for admin edits in dev)
export const dynamic = "force-dynamic";

export default async function AnnualIftarPage() {
  const data = await getAnnualIftar();

  // Optional: guard if file is empty or something goes wrong
  const events = data?.events ?? [];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{data.title}</h1>
          {data.description && (
            <p className="text-xl text-gray-300 mt-4 text-right italic">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events
            .filter((ev) => ev.visible !== false) // respect the toggle
            .map((event) => (
              <div
                key={event.id}
                className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={
                      event.image
                        ? `/${event.image}` // e.g. annual-iftar/2024/cover.jpg
                        : "/placeholder.svg"
                    }
                    alt={`إفطار ${event.year}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 bg-main-100 text-white px-6 py-2 font-bold text-xl shadow-lg">
                    {event.year}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  {event.date && (
                    <div className="flex items-start gap-3 mb-4 text-gray-700">
                      <Calendar className="w-5 h-5 mt-1 flex-shrink-0 text-main-100" />
                      <p className="text-right leading-relaxed">{event.date}</p>
                    </div>
                  )}

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start gap-3 mb-4 text-gray-700">
                      <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-main-100" />
                      <p className="text-right">{event.location}</p>
                    </div>
                  )}

                  <div className="mt-5 flex items-center gap-3 justify-end">
                    <Link
                      href={`/activities/annual-iftar/${event.id}`}
                      className="inline-block bg-main-100 px-4 py-2 text-white hover:border hover:border-main-100 hover:text-main-100 hover:bg-white"
                    >
                      عرض الفعالية
                    </Link>
                  </div>
                </div>

                {/* Bottom Border Accent */}
                <div className="h-1 bg-main-100"></div>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
