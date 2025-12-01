import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import beratImage from "@/assets/destinations/berat.jpg";
import gjirokasterImage from "@/assets/destinations/gjirokaster.jpg";
import ksamilImage from "@/assets/destinations/ksamil.jpg";
import thethImage from "@/assets/destinations/theth.jpg";

const destinations = [
  {
    name: "Berat",
    description: "The 'City of a Thousand Windows' - a UNESCO World Heritage site with stunning Ottoman architecture",
    image: beratImage,
    tag: "Historic"
  },
  {
    name: "Gjirokastër",
    description: "Stone city perched on a mountain, home to an imposing fortress and rich cultural heritage",
    image: gjirokasterImage,
    tag: "UNESCO Site"
  },
  {
    name: "Ksamil",
    description: "Paradise beaches with crystal-clear turquoise waters and small islands just offshore",
    image: ksamilImage,
    tag: "Beach"
  },
  {
    name: "Theth",
    description: "Remote mountain village in the Albanian Alps, perfect for hiking and nature lovers",
    image: thethImage,
    tag: "Adventure"
  }
];

const Destinations = () => {
  return (
    <section id="destinations" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="mb-4 text-foreground">Top Destinations</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience Albania's most captivating locations, from ancient cities to pristine beaches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Card 
              key={destination.name}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {destination.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <h3 className="text-2xl text-foreground">{destination.name}</h3>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {destination.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
