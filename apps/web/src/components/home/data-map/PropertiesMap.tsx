import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { getAllHotels } from "@/services/api/hotelService";
import { getAllAppartments } from "@/services/api/appartmentService";
import { getAllDestinations } from "@/services/api/destinationService";
import { Appartment } from "@/types/appartment.type";
import { Hotel } from "@/types/hotel.types";
import { Destination } from "@/types/destination.types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import hotelIcon from "@/assets/map/hotel_icon.png";
import apartmentIcon from "@/assets/map/home.png";
import { HotelPopup } from "./HotelPopup";
import { ApartmentPopup } from "./ApartmentPopup";
import { DestinationPopup } from "./DestinationPopup";
import { MapFilters } from "./MapFilters";

const HotelIcon = new L.Icon({
  iconUrl: hotelIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
});

const ApartmentIcon = new L.Icon({
  iconUrl: apartmentIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
});

// Destination icon using a colored marker
const DestinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Center of Albania (Tirana)
const ALBANIA_CENTER: [number, number] = [41.3275, 19.8187];

export default function PropertiesMap() {
  const [hotelsData, setHotelsData] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [apartmentsData, setApartmentsData] = useState<Appartment[]>([]);
  const [destinationsData, setDestinationsData] = useState<Destination[]>([]);
  const [selected, setSelected] = useState<{
    type: "hotel" | "apartment" | "destination";
    data: Hotel | Appartment | Destination;
  } | null>(null);

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
        const data = await getAllAppartments();
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
    <div className="w-full h-full flex">
      {/* Sidebar Filters */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 p-4 overflow-y-auto">
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

      {/* Map Container */}
      <div className="flex-1 relative">
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
            icon={HotelIcon}
            eventHandlers={{
              click: () => setSelected({ type: "hotel", data: hotel }),
            }}
          >
            {hotel.price && (
              <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                {typeof hotel.price === "number"
                  ? `$${hotel.price}`
                  : hotel.price}
              </Tooltip>
            )}
          </Marker>
        ))}

        {filteredApartments?.map((apartment: Appartment) => (
          <Marker
            key={`apartment-${apartment.id}`}
            position={[apartment.lat, apartment.lng]}
            icon={ApartmentIcon}
            eventHandlers={{
              click: () => setSelected({ type: "apartment", data: apartment }),
            }}
          >
            {apartment.price && (
              <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                {typeof apartment.price === "number"
                  ? `$${apartment.price}`
                  : apartment.price}
              </Tooltip>
            )}
          </Marker>
        ))}

        {filteredDestinations?.map((destination: Destination) => (
          <Marker
            key={`destination-${destination.id}`}
            position={[destination.lat || 0, destination.lng || 0]}
            icon={DestinationIcon}
            eventHandlers={{
              click: () =>
                setSelected({ type: "destination", data: destination }),
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
              {destination.category}
            </Tooltip>
          </Marker>
        ))}

        {/* Popup */}
        {selected && (
          <Popup position={[selected.data.lat || 0, selected.data.lng || 0]}>
            {selected.type === "hotel" && (
              <HotelPopup hotel={selected.data as Hotel} />
            )}
            {selected.type === "apartment" && (
              <ApartmentPopup apartment={selected.data as Appartment} />
            )}
            {selected.type === "destination" && (
              <DestinationPopup destination={selected.data as Destination} />
            )}
          </Popup>
        )}
      </MapContainer>
      </div>
    </div>
  );
}
