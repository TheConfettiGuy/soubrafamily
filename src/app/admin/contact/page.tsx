import Footer from "@/app/components/footer";
import fs from "fs/promises";
import path from "path";
import ContactAdminClientPage, {
  type ContactData,
} from "./ui/ContactAdminClientPage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CONTACT_JSON_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "contact.json",
);

async function loadContactData(): Promise<ContactData> {
  try {
    const raw = await fs.readFile(CONTACT_JSON_PATH, "utf8");
    const parsed = JSON.parse(raw);

    return {
      pageTitle: parsed.pageTitle ?? "تواصل معنا",
      description:
        parsed.description ??
        "يسعدنا تواصلكم معنا للاستفسار أو تقديم الاقتراحات",
      organization: {
        name: parsed.organization?.name ?? "",
        address: parsed.organization?.address ?? "",
        phone: parsed.organization?.phone ?? "",
        fax: parsed.organization?.fax ?? "",
        poBox: parsed.organization?.poBox ?? "",
        email: parsed.organization?.email ?? "",
      },
      leadership: parsed.leadership ?? [],
    };
  } catch (err) {
    console.error("Failed to read contact.json:", err);
    return {
      pageTitle: "تواصل معنا",
      description: "يسعدنا تواصلكم معنا للاستفسار أو تقديم الاقتراحات",
      organization: {
        name: "",
        address: "",
        phone: "",
        fax: "",
        poBox: "",
        email: "",
      },
      leadership: [],
    };
  }
}

export default async function ContactAdminPage() {
  const initialData = await loadContactData();

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">إدارة صفحة اتصل بنا</h1>
        <ContactAdminClientPage initialData={initialData} />
      </main>
      <Footer />
    </div>
  );
}
