import Footer from "@/app/components/footer";
import Link from "next/link";
// Adjust path if your JSON is elsewhere:
import rawData from "@/data/social-activities.json";

// Minimal type that matches your JSON shape (no "header" key)
type SocialActivitiesData = {
  title: string;
  subtitle?: string;
  description?: string;
  formTitle?: string;
  fields?: unknown[]; // keep loose unless you want to model each field
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
};

const data = rawData as unknown as SocialActivitiesData;

export default function SocialActivitiesPage() {
  const subtitle = data.subtitle ?? "";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Social Activities</h1>
          {subtitle && <p className="opacity-80">{subtitle}</p>}
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto px-4 py-10 space-y-6">
        {data.description && (
          <p className="text-lg leading-8">{data.description}</p>
        )}

        {/* If you later want to render a form, you can iterate fields safely */}
        {/* {Array.isArray(data.fields) && data.fields.length > 0 && (...) } */}

        {data.contactInfo && (
          <div className="mt-8 border border-main-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-main-100">
              Contact
            </h2>
            <ul className="space-y-1">
              {data.contactInfo.phone && <li>📞 {data.contactInfo.phone}</li>}
              {data.contactInfo.email && <li>✉️ {data.contactInfo.email}</li>}
              {data.contactInfo.address && (
                <li>📍 {data.contactInfo.address}</li>
              )}
            </ul>
          </div>
        )}
      </section>

      <div className="container mx-auto px-4 pb-10">
        <Link
          href="/activities"
          className="inline-block px-4 py-2 border border-main-100 text-main-100 hover:bg-main-100 hover:text-white transition-colors rounded"
        >
          Back to Activities
        </Link>
      </div>

      <Footer />
    </div>
  );
}
