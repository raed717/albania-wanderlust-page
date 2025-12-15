import { useMemo, CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { getAllAppartments } from "@/services/api/appartmentService";
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const animation = { duration: 50000, easing: (t) => t }

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

  const { data: appartments = [], isLoading } = useQuery({
    queryKey: ["appartments"],
    queryFn: getAllAppartments,
  });

  // Filter appartments with rating > 3.5 and status "available"
  const availableTopAppartments = useMemo(() => {
    return appartments.filter(
      (appartment) => appartment.rating > 0 && appartment.status === "available"
    );
  }, [appartments]);

  return (
    <section id="appartments" className="py-24 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="mb-4 text-foreground">Check Our Available Appartments</h2>
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
              <div key={appartment.id} className="keen-slider__slide">
                <Card
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={appartment.image}
                      alt={appartment.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        {appartment.rating}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <h3 className="text-2xl text-foreground">
                        {appartment.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {appartment.address}
                    </p>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {appartment.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-foreground">
                        ${appartment.pricePerDay}/night
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        Available
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() =>
                        navigate(`/appartmentReservation/${appartment.id}`)
                      }
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

export default AppartmentsPreview;