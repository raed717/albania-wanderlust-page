import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getAllHotels } from "@/services/api/hotelService";
import { useApartmentData } from "./useStaticData";
import { Apartment } from "./types";
import { Hotel } from "@/types/hotel.types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import hotelIcon from "@/assets/map/hotel_icon.png";
import apartmentIcon from "@/assets/map/home.png";
import { Link } from "react-router-dom";

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

// Center of Albania (Tirana)
const ALBANIA_CENTER: [number, number] = [41.3275, 19.8187];

export default function HotelMap() {
  const [hotelsData, setHotelsData] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: apartments } = useApartmentData();
  const [selected, setSelected] = useState<Hotel | Apartment | null>(null);

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

  return (
    <div className="w-full h-full">
      <MapContainer
        center={ALBANIA_CENTER}
        zoom={8}
        className="w-full h-[600px] rounded-xl shadow-lg"
        attributionControl={false}
      >
        {/* Base map */}
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers */}
        {hotelsData?.map((hotel: Hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.lat, hotel.lng]}
            icon={HotelIcon}
            eventHandlers={{
              click: () => setSelected(hotel),
            }}
          />
        ))}

        {apartments?.map((apartment: Apartment) => (
          <Marker
            key={apartment.id}
            position={[apartment.lat, apartment.lng]}
            icon={ApartmentIcon}
            eventHandlers={{
              click: () => setSelected(apartment),
            }}
          />
        ))}

        {/* Popup */}
        {selected && (
          <Popup position={[selected.lat, selected.lng]}>
            <div className="space-y-1">
              <h2 className="font-semibold text-base">{selected.name}</h2>
              <p className="text-sm">{selected.location}</p>
              {selected.price && (
                <p className="text-sm font-medium">€{selected.price} / night</p>
              )}
              {"rating" in selected && selected.rating && (
                <p className="text-xs text-yellow-600">★ {selected.rating}</p>
              )}
            </div>
            <div className="space-y-2">
              <Link to={`/hotel/${selected.id}`}>
                <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition">
                  View Details
                </button>
              </Link>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
