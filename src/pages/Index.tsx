import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Culture from "@/components/Culture";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Destinations />
      <Culture />
      <CallToAction />
    </div>
  );
};

export default Index;
