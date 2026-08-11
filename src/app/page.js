import Banner from "@/components/Banner";
import MarqueeSection from "@/components/MarqueeSection";
import FeaturedTiles from "@/components/FeaturedTiles";
import ExtraSections from "@/components/ExtraSections";
export default function Home() {
  return (
    <main>
      <Banner />
      <MarqueeSection />
      <FeaturedTiles />
      <ExtraSections />
    </main>
  );
}