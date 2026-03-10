import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { getAllHotels } from "@/services/api/hotelService";
import { getAllApartments } from "@/services/api/apartmentService";
import { getAllDestinations } from "@/services/api/destinationService";
import { Apartment } from "@/types/apartment.type";
import { Hotel } from "@/types/hotel.types";
import { Destination } from "@/types/destination.types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import { MapFilters } from "./MapFilters";
import { Filter, X } from "lucide-react";
import { useLocalized } from "@/hooks/useLocalized";

type Selected =
  | { type: "hotel"; data: Hotel }
  | { type: "apartment"; data: Apartment }
  | { type: "destination"; data: Destination }
  | null;

interface PropertiesMapProps {
  onSelect?: (selected: Selected) => void;
}

/**
 * Creates a speech-bubble DivIcon that combines the type emoji + price/label
 * into one element — eliminates the overlap caused by L.Icon + Tooltip permanent.
 * The transform translate(-50%, -100%) anchors the bubble's bottom-center on the
 * map coordinate regardless of text width, so iconAnchor can stay [0, 0].
 */
function createPriceMarker(
  type: "hotel" | "apartment" | "destination",
  label: string
): L.DivIcon {
  const emoji = type === "hotel" ? "🏨" : type === "apartment" ? "🏠" : "📍";
  const borderColor = type === "destination" ? "#374151" : "#dc2626";
  const bgHover = type === "destination" ? "#374151" : "#dc2626";

  const html = `
    <div style="
      transform:translate(-50%,-100%);
      display:inline-flex;
      flex-direction:column;
      align-items:center;
      cursor:pointer;
    ">
      <div style="
        background:white;
        border:2.5px solid ${borderColor};
        border-radius:20px;
        padding:4px 10px;
        font-size:12px;
        font-weight:700;
        white-space:nowrap;
        color:#111111;
        display:flex;
        align-items:center;
        gap:5px;
        box-shadow:0 2px 8px rgba(0,0,0,0.28);
        font-family:system-ui,-apple-system,sans-serif;
        line-height:1.4;
        transition:background 0.15s,color 0.15s;
      "
        onmouseover="this.style.background='${bgHover}';this.style.color='white';"
        onmouseout="this.style.background='white';this.style.color='#111111';"
      >
        <span>${emoji}</span>
        <span>${label}</span>
      </div>
      <div style="
        width:0;
        height:0;
        border-left:7px solid transparent;
        border-right:7px solid transparent;
        border-top:8px solid ${borderColor};
        margin-top:-1px;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconAnchor: [0, 0],
  });
}

// Center of Albania (Tirana)
const ALBANIA_CENTER: [number, number] = [41.3275, 19.8187];

export default function PropertiesMap({ onSelect }: PropertiesMapProps) {
  const { localize } = useLocalized();
  const [hotelsData, setHotelsData] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [apartmentsData, setApartmentsData] = useState<Apartment[]>([]);
  const [destinationsData, setDestinationsData] = useState<Destination[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "hotel",
    "apartment",
    "destination",
  ]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Adventure",
    "Historic",
    "Beach",
  ]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels();
        setHotelsData(data || []);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setHotelsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await getAllApartments();
        setApartmentsData(data || []);
      } catch (error) {
        console.error("Failed to fetch apartments:", error);
        setApartmentsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getAllDestinations();
        setDestinationsData(data || []);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        setDestinationsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter data based on selected types and price range
  const filteredHotels = hotelsData.filter(
    (hotel) =>
      selectedTypes.includes("hotel") &&
      hotel.price >= priceRange[0] &&
      hotel.price <= priceRange[1],
  );

  const filteredApartments = apartmentsData.filter(
    (apartment) =>
      selectedTypes.includes("apartment") &&
      apartment.price >= priceRange[0] &&
      apartment.price <= priceRange[1],
  );

  const filteredDestinations = destinationsData.filter(
    (destination) =>
      selectedTypes.includes("destination") &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(destination.category)),
  );

  const handleResetFilters = () => {
    setSelectedTypes(["hotel", "apartment", "destination"]);
    setPriceRange([0, 500]);
    setSelectedCategories(["Adventure", "Historic", "Beach"]);
  };

  return (
    <div className="w-full h-full flex relative">
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="lg:hidden absolute top-4 left-4 z-[1000] bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Toggle filters"
      >
        <Filter size={20} className="text-gray-700" />
      </button>

      {/* Sidebar Filters */}
      <div
        className={`
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          fixed lg:relative
          top-0 left-0
          w-80 h-full
          bg-white shadow-lg border-r border-gray-200 p-4 overflow-y-auto
          transition-transform duration-300 ease-in-out
          z-[999]
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end mb-2">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close filters"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <MapFilters
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onReset={handleResetFilters}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isFilterOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[998]"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Map Container */}
      <div className="flex-1 relative w-full h-full">
        <MapContainer
          center={ALBANIA_CENTER}
          zoom={8}
          className="w-full h-full"
          attributionControl={false}
        >
          {/* Base map */}
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markers */}
          {filteredHotels?.map((hotel: Hotel) => (
            <Marker
              key={`hotel-${hotel.id}`}
              position={[hotel.lat || 0, hotel.lng || 0]}
              icon={createPriceMarker(
                "hotel",
                hotel.price ? `$${hotel.price}` : "Hotel"
              )}
              eventHandlers={{
                click: () => onSelect?.({ type: "hotel", data: hotel }),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.92}>
                {hotel.name}
              </Tooltip>
            </Marker>
          ))}

          {filteredApartments?.map((apartment: Apartment) => (
            <Marker
              key={`apartment-${apartment.id}`}
              position={[apartment.lat, apartment.lng]}
              icon={createPriceMarker(
                "apartment",
                apartment.price ? `$${apartment.price}` : "Apartment"
              )}
              eventHandlers={{
                click: () => onSelect?.({ type: "apartment", data: apartment }),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.92}>
                {apartment.name}
              </Tooltip>
            </Marker>
          ))}

          {filteredDestinations?.map((destination: Destination) => (
            <Marker
              key={`destination-${destination.id}`}
              position={[destination.lat || 0, destination.lng || 0]}
              icon={createPriceMarker("destination", destination.category)}
              eventHandlers={{
                click: () =>
                  onSelect?.({ type: "destination", data: destination }),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.92}>
                {localize(destination.name)}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
