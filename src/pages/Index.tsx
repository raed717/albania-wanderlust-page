import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Culture from "@/components/Culture";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Destinations />
      <Culture />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
