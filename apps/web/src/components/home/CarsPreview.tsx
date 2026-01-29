import { useMemo, useState, useEffect, CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCars } from "@/services/api/carService";
import { getMonthlyPrices } from "@/services/api/monthlyPriceService";
import { Month, MONTHS } from "@/types/price.type";
import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";
import { CarCard } from "./CarCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car } from "lucide-react";

// Helper to get current month as Month type
const getCurrentMonth = (): Month => {
  const monthIndex = new Date().getMonth();
  return MONTHS[monthIndex];
};

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const CarsPreview = () => {
  const navigate = useNavigate();
  const currentMonth = getCurrentMonth();
  const [carMonthlyPrices, setCarMonthlyPrices] = useState<
    Record<number, number | null>
  >({});

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars"],
    queryFn: getAllCars,
  });

  const availableTopCars = useMemo(() => {
    return cars.filter((car) => car.status === "available").slice(0, 4);
  }, [cars]);

  // Fetch monthly prices for displayed cars
  useEffect(() => {
    const fetchMonthlyPrices = async () => {
      if (availableTopCars.length === 0) return;

      const pricesMap: Record<number, number | null> = {};
      await Promise.all(
        availableTopCars.map(async (car) => {
          try {
            const prices = await getMonthlyPrices(car.id, "car");
            const currentMonthPrice = prices.find(
              (p) => p.month === currentMonth,
            );
            pricesMap[car.id] = currentMonthPrice?.pricePerDay ?? null;
          } catch (err) {
            console.error(
              `Error fetching monthly prices for car ${car.id}:`,
              err,
            );
            pricesMap[car.id] = null;
          }
        }),
      );
      setCarMonthlyPrices(pricesMap);
    };

    fetchMonthlyPrices();
  }, [availableTopCars, currentMonth]);

  const handleCarClick = (carId: number) => {
    navigate(`/carReservation/${carId}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Section Header */}
      <div className="text-center mb-8 md:mb-10 animate-fade-in">
        <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 font-semibold tracking-wider uppercase text-xs rounded-full mb-3">
          Explore On Your Terms
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
          Premium Car Rentals
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Curated selection of quality vehicles for your road trip through
          Albania's stunning landscapes
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <ClipLoader
            color="#dc2626"
            loading={isLoading}
            cssOverride={override}
            size={50}
          />
        </div>
      ) : availableTopCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Car className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-muted-foreground text-base">
            No cars are currently available.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {availableTopCars.map((car, index) => (
              <div
                key={car.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
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
                  currentMonthPrice={carMonthlyPrices[car.id] ?? undefined}
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

          <div className="mt-8 flex justify-center">
            <Link to="/searchCarResults">
              <Button
                size="lg"
                className="px-6 py-3 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90 transition inline-block text-center"
              >
                Explore All Vehicles
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CarsPreview;
