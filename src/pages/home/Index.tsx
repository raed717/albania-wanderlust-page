import Hero from "@/components/home/Hero";
import Destinations from "@/components/home/Destinations";
import Culture from "@/components/home/Culture";
import CallToAction from "@/components/home/CallToAction";
import PrimarySearchAppBar from "@/components/home/AppBar";
import HotelsPreview from "@/components/home/HotelsPreview";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PrimarySearchAppBar />
      <Hero />
      <HotelsPreview />
      <Destinations />
      <Culture />
      <CallToAction />
    </div>
  );
};

export default Index;
