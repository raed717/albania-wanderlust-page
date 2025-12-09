import { Car } from "@/types/car.types";
import { Link } from "react-router-dom";

interface CarPopupProps {
  car: Car;
}

export function CarPopup({ car }: CarPopupProps) {
  return (
    <div className="w-64 space-y-3">
      <div>
        <h3 className="font-semibold text-base">
          {car.brand} {car.name}
        </h3>
        <p className="text-sm text-gray-600">{car.pickUpLocation}</p>
      </div>

      <div className="space-y-1 text-sm">
        <p>
          <span className="font-medium">Type:</span> {car.type}
        </p>
        <p>
          <span className="font-medium">Price:</span> €{car.pricePerDay} / day
        </p>
        <p>
          <span className="font-medium">Year:</span> {car.year}
        </p>
        <p>
          <span className="font-medium">Transmission:</span> {car.transmission}
        </p>
        <p>
          <span className="font-medium">Fuel Type:</span> {car.fuelType}
        </p>
        <p>
          <span className="font-medium">Seats:</span> {car.seats}
        </p>
        <p>
          <span className="font-medium">Color:</span> {car.color}
        </p>
        {car.status && (
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                car.status === "available"
                  ? "bg-green-100 text-green-800"
                  : car.status === "rented"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {car.status}
            </span>
          </p>
        )}
      </div>

      {car.features && car.features.length > 0 && (
        <div>
          <p className="font-medium text-sm mb-1">Features:</p>
          <div className="flex flex-wrap gap-1">
            {car.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="text-xs text-gray-500">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <Link to={`/dashboard`}>
        <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium text-sm">
          Rent Now
        </button>
      </Link>
    </div>
  );
}
