import donateData from "@/data/donate.json";
import { Heart, Building2, CreditCard, MapPin, Send } from "lucide-react";
import Footer from "../components/footer";

export default function DonatePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}

      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {donateData.pageTitle}
          </h1>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {donateData.verse.bismillah}
          </p>
          <p className="text-xl md:text-3xl font-bold text-gray-300 mb-4 leading-relaxed">
            ﴿{donateData.verse.text}﴾
          </p>
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {donateData.verse.footer}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Appeal Letter */}
        <div className="bg-white border-r-4 border-main-100 p-8 mb-8">
          <div className="space-y-6">
            {donateData.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-loose text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Donation Methods */}
        <div className="bg-white border-t-4 border-main-100 p-8">
          <h2 className="text-2xl font-bold text-main-100 mb-6 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-main-100" />
            {donateData.donationInfo.title}
          </h2>

          {/* Check Method */}
          <div className="mb-8">
            <p className="text-gray-700 text-lg mb-3">
              {donateData.donationInfo.arabic.label}
            </p>
            <div className="bg-gray-50 p-4  border-r-4 border-main-100">
              <div className="flex items-start gap-3">
                <Send className="w-5 h-5 text-main-100 mt-1 shrink-0" />
                <div>
                  <p className="text-gray-700">
                    {donateData.donationInfo.arabic.methods[0]}
                  </p>
                  <p className="text-main-100 font-semibold flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4" />
                    {donateData.donationInfo.arabic.methods[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="mb-8">
            <p className="text-gray-700 text-lg mb-3">
              {donateData.donationInfo.arabic.bankTransfer}
            </p>
            <div className="bg-main-100 text-white p-6 ">
              <div className="flex items-start gap-3 mb-4">
                <Building2 className="w-6 h-6 text-main-100 shrink-0" />
                <div className="space-y-3 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-300 text-sm">اسم الحساب:</p>
                      <p className="font-semibold">
                        {donateData.donationInfo.bankDetails.accountName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">رقم الحساب:</p>
                      <p className="font-semibold font-mono text-main-100">
                        {donateData.donationInfo.bankDetails.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">البنك:</p>
                      <p className="font-semibold">
                        {donateData.donationInfo.bankDetails.bank}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">الفرع:</p>
                      <p className="font-semibold">
                        {donateData.donationInfo.bankDetails.branch}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <p className="text-gray-300 text-sm">:SWIFT Code</p>
                    <p className="font-bold font-mono text-xl">
                      {donateData.donationInfo.bankDetails.swift}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* English Section */}
          <div className="bg-gray-100 p-6 " dir="ltr">
            <h3 className="text-lg font-semibold text-main-100 mb-3">
              For International Donations:
            </h3>
            <p className="text-gray-700">{donateData.donationInfo.english}</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Account Name:</p>
                <p className="font-semibold text-main-100">
                  {donateData.donationInfo.bankDetails.accountNameEn}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Account No:</p>
                <p className="font-semibold text-main-100 font-mono">
                  {donateData.donationInfo.bankDetails.accountNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Bank:</p>
                <p className="font-semibold text-main-100">
                  {donateData.donationInfo.bankDetails.bankEn}
                </p>
              </div>
              <div>
                <p className="text-gray-500">SWIFT:</p>
                <p className="font-semibold text-main-100 font-mono">
                  {donateData.donationInfo.bankDetails.swift}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}
