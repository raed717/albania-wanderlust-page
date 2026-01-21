import { useMemo, CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAppartments } from "@/services/api/appartmentService";
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

const AppartmentsPreview = () => {
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

  const { data: appartments = [], isLoading } = useQuery({
    queryKey: ["appartments"],
    queryFn: getAllAppartments,
  });

  const availableTopAppartments = useMemo(() => {
    return appartments
      .filter((appartment) => appartment.rating > 0 && appartment.status === "available")
      .sort((a, b) => b.rating - a.rating);
  }, [appartments]);


  const handlePropertyClick = (appartmentId: string | number) => {
    navigate(`/appartmentReservation/${appartmentId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-10 animate-fade-in">
        <h2 className="mb-3 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
          Luxury Apartments
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Experience authentic Albanian hospitality in our handpicked private residences.
        </p>
      </div>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center py-20">
          <ClipLoader color="#0ea5e9" loading={isLoading} cssOverride={override} size={60} />
        </div>
      ) : availableTopAppartments.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 bg-white/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-muted-foreground">No apartments available.</p>
        </div>
      ) : (
        <>
          <div ref={sliderRef} className="keen-slider flex-grow">
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

          <div className="mt-8">
            <Link to="/searchResults">
              <Button
                variant="ghost"
                className="group p-0 hover:bg-transparent text-blue-600 font-semibold gap-2"
              >
                View More Apartments
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default AppartmentsPreview;

