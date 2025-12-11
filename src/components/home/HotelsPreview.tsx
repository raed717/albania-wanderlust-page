import { useMemo, CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { getAllHotels } from "@/services/api/hotelService";
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const animation = { duration: 50000, easing: (t) => t }

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const HotelsPreview = () => {

  const navigate = useNavigate();

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: false,
    slides: {
      perView: 2,
      spacing: 15,
    },
    created(s) {
      s.moveToIdx(5, true, animation)
    },
    updated(s) {
      // Add null check to prevent error on initial render
      if (s.track.details) {
        s.moveToIdx(s.track.details.abs + 5, true, animation)
      }
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
  })

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: getAllHotels,
  });

  // Filter hotels with rating > 3.5 and status "available"
  const availableTopHotels = useMemo(() => {
    return hotels.filter(
      (hotel) => hotel.rating > 0 && hotel.status === "active"
    );
  }, [hotels]);

  return (
    <section id="hotels" className="py-24 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="mb-4 text-foreground">Top Available Hotels</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the best available hotels in Albania with ratings above 3.5
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <ClipLoader
              color="#0ea5e9"
              loading={isLoading}
              cssOverride={override}
              size={60}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <p className="text-lg text-muted-foreground mt-4">
              Loading hotels...
            </p>
          </div>
        ) : availableTopHotels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No hotels available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div ref={sliderRef} className="keen-slider">
            {availableTopHotels.map((hotel, index) => (
              <div key={hotel.id} className="keen-slider__slide">
                <Card
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        {hotel.rating}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <h3 className="text-2xl text-foreground">{hotel.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {hotel.location}
                    </p>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {hotel.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-foreground">
                        ${hotel.price}/night
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        Available
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => navigate(`/hotelReservation/${hotel.id}`)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelsPreview;