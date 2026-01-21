import Hero from "@/components/home/Hero";
import Destinations from "@/components/home/Destinations";
import Culture from "@/components/home/Culture";
import CallToAction from "@/components/home/CallToAction";
import PrimarySearchAppBar from "@/components/home/AppBar";
import HotelsPreview from "@/components/home/HotelsPreview";
import AppartmentsPreview from "@/components/home/AppartmentsPreview";
import AlbaniaHeroScroll from "@/components/home/AlbaniaHeroScroll";
import CarsPreview from "@/components/home/CarsPreview";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PrimarySearchAppBar />
      <Hero />
      <AlbaniaHeroScroll />
      <Destinations />
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Our Recommendations</span>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-slate-900">Discover Best Places to Stay</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0">
            <div id="hotels" className="lg:pr-16 lg:border-r lg:border-slate-200">
              <HotelsPreview />
            </div>
            <div id="appartments" className="lg:pl-16">
              <AppartmentsPreview />
            </div>
          </div>
          <CarsPreview />
        </div>
      </section>
      <Culture />
      <CallToAction />
    </div>
  );
};


export default Index;
