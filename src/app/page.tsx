import Footer from "./components/footer";
import Hero from "./components/hero";
import Welcoming from "./components/welcomingSection";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen">
      <main className="">
        <Hero />
        <Welcoming />
        {/* <LatestUpdates /> */}
        <Footer />
      </main>
    </div>
  );
}
