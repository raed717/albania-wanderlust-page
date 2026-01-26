import { useMemo, CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllHotels } from "@/services/api/hotelService";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";
import { PropertyCard } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const animation = { duration: 50000, easing: (t: number) => t };

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const HotelsPreview = () => {
  const navigate = useNavigate();

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: true,
    slides: {
      perView: 1.2,
      spacing: 20,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 1.5, spacing: 20 },
      },
    },
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      if (s.track.details) {
        s.moveToIdx(s.track.details.abs + 5, true, animation);
      }
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: getAllHotels,
  });

  const availableTopHotels = useMemo(() => {
    return hotels.filter(
      (hotel) => hotel.rating > 0 && hotel.status === "active"
    ).sort((a, b) => b.rating - a.rating);
  }, [hotels]);

  const handlePropertyClick = (hotelId: string | number) => {
    navigate(`/hotelReservation/${hotelId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-10 animate-fade-in">
        <h2 className="mb-3 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
          Premier Hotels
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The finest selection of high-quality hotels across Albania's most
          iconic cities.
        </p>
      </div>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center py-20">
          <ClipLoader
            color="#3b82f6"
            loading={isLoading}
            cssOverride={override}
            size={60}
          />
        </div>
      ) : availableTopHotels.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 bg-white/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-muted-foreground">No hotels available.</p>
        </div>
      ) : (
        <>
          <div ref={sliderRef} className="keen-slider flex-grow">
            {availableTopHotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="keen-slider__slide"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PropertyCard
                  id={hotel.id}
                  name={hotel.name}
                  image={hotel.imageUrls?.[0]}
                  rating={hotel.rating}
                  price={hotel.price}
                  location={hotel.location}
                  address={hotel.address}
                  rooms={hotel.rooms || 0}
                  amenities={hotel.amenities || []}
                  status={hotel.status}
                  propertyType="hotel"
                  onClick={handlePropertyClick}
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/searchResults">
              <Button
                variant="ghost"
                className="group p-0 hover:bg-transparent text-blue-600 font-semibold gap-2"
              >
                Explore More Hotels
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default HotelsPreview;

