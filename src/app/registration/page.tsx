import Image from "next/image";
import Footer from "@/app/components/footer";

export const runtime = "nodejs";

export default function RegistrationPage() {
  const imagePath = "/registration/form.jpg";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">علم وخبر</h1>
        </div>
      </div>

      {/* Image */}
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="border border-main-100 p-4 bg-white">
          <Image
            src={imagePath}
            alt="استمارة الانتساب"
            width={800}
            height={1100}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
