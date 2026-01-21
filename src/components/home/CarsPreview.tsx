import { useMemo, CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCars } from "@/services/api/carService";
import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";
import { CarCard } from "./CarCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const CarsPreview = () => {
  const navigate = useNavigate();

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars"],
    queryFn: getAllCars,
  });

  const availableTopCars = useMemo(() => {
    return cars
      .filter((car) => car.status === "available")
      .slice(0, 4);
  }, [cars]);

  const handleCarClick = (carId: number) => {
    navigate(`/carReservation/${carId}`);
  };

  return (
    <div className="flex flex-col w-full mt-24 pt-24 border-t border-slate-200/60">
      <div className="mb-12 animate-fade-in">
        <h2 className="mb-3 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
          Premium Car Fleet
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Curated selection of high-quality vehicles for your road trip through Albania's stunning landscapes.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <ClipLoader color="#3b82f6" loading={isLoading} cssOverride={override} size={60} />
        </div>
      ) : availableTopCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-muted-foreground">No cars are currently available.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {availableTopCars.map((car, index) => (
              <div
                key={car.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CarCard
                  id={car.id}
                  name={car.name}
                  brand={car.brand}
                  type={car.type}
                  year={car.year}
                  transmission={car.transmission}
                  fuelType={car.fuelType}
                  seats={car.seats}
                  mileage={car.mileage}
                  pricePerDay={car.pricePerDay}
                  status={car.status}
                  color={car.color}
                  plateNumber={car.plateNumber}
                  features={car.features}
                  imageUrls={car.imageUrls}
                  pickUpLocation={car.pickUpLocation}
                  onClick={handleCarClick}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-start">
            <Link to="/searchCarResults">
              <Button
                variant="ghost"
                className="group p-0 hover:bg-transparent text-blue-600 font-semibold gap-2 text-base"
              >
                Explore All Cars
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CarsPreview;




