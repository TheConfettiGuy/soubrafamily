import Footer from "@/app/components/footer/page";
import LightboxGallery from "@/app/components/LightboxGallery/page";
import data from "@/data/annual-iftar.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs"; // ensure FS is allowed (not Edge)

type Event = {
  id: number;
  year: string;
  date: string;
  location: string;
  image: string; // cover (can be remote)
  attendees: string;
  album: string; // e.g. "/images/albums/annual-iftar/2024"
};

function getEventById(id: number): Event | undefined {
  return (data.events as Event[]).find((e) => e.id === id);
}

function listAlbumImages(albumPath: string): string[] {
  // Map "/images/..." -> "<project>/public/images/..."
  const rel = albumPath.replace(/^\//, "");
  const abs = path.join(process.cwd(), "public", rel);

  try {
    const entries = fs.readdirSync(abs, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && /\.(jpe?g|png|webp|avif|gif)$/i.test(e.name))
      .map((e) => path.posix.join(albumPath, e.name)) // web path
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); // natural order: 1,2,10
  } catch {
    return [];
  }
}

const Single = ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return notFound();

  const event = getEventById(id);
  if (!event) return notFound();

  const images = listAlbumImages(event.album);
  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{event.year}</h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {event.date} &nbsp; - &nbsp; " {event.location} "
          </p>
        </div>
      </div>

      <div className="bg-white border border-main-100 text-white py-10">
        <div className="container mx-auto px-4">
          <Link
            href="/activities/annual-iftar"
            className="bg-main-100 text-white p-4 hover:border hover:border-main-100 hover:text-main-100 hover:bg-white transition-colors"
          >
            مشاهدة صور سنوات اخرى
          </Link>
        </div>
      </div>

      <div></div>

      <div className="container mx-auto px-4 py-8">
        {/* Album grid */}
        <section>
          <section>
            <LightboxGallery images={images} yearLabel={event.year} />
          </section>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Single;
