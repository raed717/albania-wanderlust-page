import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Culture from "@/components/Culture";
import CallToAction from "@/components/CallToAction";
import PrimarySearchAppBar from "@/components/AppBar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PrimarySearchAppBar />
      <Hero />
      <Destinations />
      <Culture />
      <CallToAction />
    </div>
  );
};

export default Index;
