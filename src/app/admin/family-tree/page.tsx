import familyTreeData from "@/data/family-tree.json";
import FamilyTreeAdminClient from "./ui/FamilyTreeAdminClient";
import Footer from "@/app/components/footer";

export default function Page() {
  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">إدارة صفحة شجرة العائلة</h1>
        <FamilyTreeAdminClient initialData={familyTreeData as any} />
      </main>
      <Footer/>
    </div>
  );
}
