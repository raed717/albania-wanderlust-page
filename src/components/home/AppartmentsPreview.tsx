import { useMemo, CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAppartments } from "@/services/api/appartmentService";
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

const AppartmentsPreview = () => {
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

  const { data: appartments = [], isLoading } = useQuery({
    queryKey: ["appartments"],
    queryFn: getAllAppartments,
  });

  // Filter appartments with rating > 0 and status "available"
  const availableTopAppartments = useMemo(() => {
    return appartments.filter(
      (appartment) => appartment.rating > 0 && appartment.status === "available"
    );
  }, [appartments]);

  const handlePropertyClick = (appartmentId: string | number) => {
    navigate(`/appartmentReservation/${appartmentId}`);
  };

  return (
    <section id="appartments" className="py-24 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="mb-4 text-foreground">Check Our Appartments</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Make your stay unforgettable with our top-rated appartments
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
              Loading appartments...
            </p>
          </div>
        ) : availableTopAppartments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No appartments available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div ref={sliderRef} className="keen-slider">
            {availableTopAppartments.map((appartment, index) => (
              <div
                key={appartment.id}
                className="keen-slider__slide"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PropertyCard
                  id={appartment.id}
                  name={appartment.name}
                  image={appartment.imageUrls[0]}
                  rating={appartment.rating}
                  price={appartment.price}
                  location={appartment.location}
                  address={appartment.address}
                  rooms={appartment.rooms || 0}
                  amenities={appartment.amenities || []}
                  status={appartment.status}
                  propertyType="apartment"
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

export default AppartmentsPreview;
