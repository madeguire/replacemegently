export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSection from "@/components/HeroSection";
import FeatureStrip from "@/components/FeatureStrip";
import FeaturedProducts from "@/components/FeaturedProducts";
import ReplacementScanner from "@/components/ReplacementScanner";
import EditorialSection from "@/components/EditorialSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <AnnouncementBar />
      <main className="flex-1">
        <HeroSection />
        <FeatureStrip />
        <FeaturedProducts />
        <ReplacementScanner />
        <EditorialSection />
      </main>
      <Footer />
    </>
  );
}
