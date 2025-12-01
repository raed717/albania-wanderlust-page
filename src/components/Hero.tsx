import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import slide1 from "@/assets/home/slide1.jpg";
import slide2 from "@/assets/home/slide2.jpg";
import slide3 from "@/assets/home/slide3.jpg";
import ReservationPickerValue from "./reservationPicker";
import { Link } from "react-router";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const slideImages = [
    {
      image: slide1,
    },
    {
      image: slide2,
    },
    {
      image: slide3,
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Slide duration={2000}>
          {slideImages.map((slideImage, index) => (
            <div key={index}>
              <img src={slideImage.image} />
            </div>
          ))}
        </Slide>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="w-6 h-6 text-primary" />
            <span className="text-lg font-medium">
              Southeast Europe's Hidden Gem
            </span>
          </div>

          <h1 className="mb-6 text-balance">Discover Albania</h1>

          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-balance opacity-90">
            From the Alps to the Adriatic — a land of wonder, ancient history,
            and breathtaking beauty
          </p>

          <div>
            <ReservationPickerValue />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              onClick={() => scrollToSection("destinations")}
            >
              Explore Destinations
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-foreground text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
              onClick={() => scrollToSection("culture")}
            >
              Discover Culture
            </Button>
          </div>
          <div className="flex justify-center mt-6">
            <Link
              to="/hotels-map"
              className="px-6 py-3 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90 transition inline-block text-center"
            >
              Explore Map
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
