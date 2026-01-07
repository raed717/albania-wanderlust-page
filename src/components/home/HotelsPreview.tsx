import { useMemo, CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllHotels } from "@/services/api/hotelService";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { PropertyCard } from "./PropertyCard";

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
      perView: 2,
      spacing: 15,
    },
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      // Add null check to prevent error on initial render
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

  // Filter hotels with rating > 0 and status "active"
  const availableTopHotels = useMemo(() => {
    return hotels.filter(
      (hotel) => hotel.rating > 0 && hotel.status === "active"
    );
  }, [hotels]);

  const handlePropertyClick = (hotelId: string | number) => {
    navigate(`/hotelReservation/${hotelId}`);
  };

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
        )}
      </div>
    </section>
  );
};

export default HotelsPreview;
