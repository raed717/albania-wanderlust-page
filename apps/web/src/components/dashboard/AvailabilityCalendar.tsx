import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { getCarUnavailabilityDates } from "@/services/api/carService";
import { getAppartmentUnavailabilityDates } from "@/services/api/appartmentService";
import { Loader2, CalendarDays } from "lucide-react";

type PropertyType = "car" | "apartment";

interface AvailabilityCalendarProps {
  propertyId: number;
  propertyType: PropertyType;
  className?: string;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  propertyId,
  propertyType,
  className,
}) => {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnavailabilityDates = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateStrings =
          propertyType === "car"
            ? await getCarUnavailabilityDates(propertyId)
            : await getAppartmentUnavailabilityDates(propertyId);
        // Convert ISO date strings to Date objects
        const dates = dateStrings.map((dateStr) => {
          const [year, month, day] = dateStr.split("-").map(Number);
          return new Date(year, month - 1, day);
        });
        setUnavailableDates(dates);
      } catch (err) {
        console.error("Error fetching unavailability dates:", err);
        setError("Failed to load availability");
      } finally {
        setLoading(false);
      }
    };

    fetchUnavailabilityDates();
  }, [propertyId, propertyType]);

  if (loading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CalendarDays size={20} className="text-blue-500" />
        Availability
      </h2>

      <div className="flex justify-center">
        <Calendar
          mode={undefined}
          modifiers={{
            booked: unavailableDates,
          }}
          modifiersClassNames={{
            booked:
              "bg-red-400 text-white hover:bg-red-400 hover:text-white rounded-md",
          }}
          disabled={unavailableDates}
          className="rounded-md border"
          showOutsideDays={false}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white border border-gray-300"></span>
          <span className="text-gray-600">Available</span>
        </div>
      </div>

      {/* Booking count info */}
      {unavailableDates.length === 0 ? (
        <p className="text-center text-sm text-emerald-600 mt-3 font-medium">
          All dates available
        </p>
      ) : (
        <p className="text-center text-sm text-gray-500 mt-3">
          {unavailableDates.length} day
          {unavailableDates.length !== 1 ? "s" : ""} booked
        </p>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
