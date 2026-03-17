import GradCommencementsAdminClient from "./ui/grad-commencements-client";
import { getGraduationData } from "./actions";
import Footer from "@/app/components/footer";

export const dynamic = "force-dynamic";

export default async function GradCommencementsAdminPage() {
  const data = await getGraduationData();

  return (
<div>
      <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">إدارة التخريج (الدفعات)</h1>
      <p className="text-gray-600 mb-6">
        تعديل بيانات صفحة{" "}
        <span className="font-semibold">
          تخريج الدفعات – grad-commencements
        </span>
        . تعتمد الصور على المجلد{" "}
        <code className="bg-gray-100 px-1 rounded">
          public/graduation/&lt;السنة&gt;
        </code>
        .
      </p>

      <GradCommencementsAdminClient initialData={data} />
    </main>
    <Footer/>
    </div>

    
  );
}
