import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSection from "@/components/HeroSection";
import FeatureStrip from "@/components/FeatureStrip";
import FeaturedProducts from "@/components/FeaturedProducts";
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
        <EditorialSection />
      </main>
      <Footer />
    </>
  );
}
