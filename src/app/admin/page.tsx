import Footer from "../components/footer";

const Admin = () => {
  return (
    <div>
      <main className="py-16 container mx-auto px-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">لوحة التحكم</h1>
        </header>

        {/* Put your admin shortcuts / sections here */}
        <section className="border bg-white p-4">
          <p className="text-gray-700">مرحباً بك في لوحة الإدارة.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
