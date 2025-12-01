import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useHotelData } from "./useHotelData";
import { Hotel } from "./types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import hotelIcon from "@/assets/map/hotel_icon.png";
import { Link } from "react-router-dom";

const defaultIcon = new L.Icon({
  iconUrl: hotelIcon,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
});

// Center of Albania (Tirana)
const ALBANIA_CENTER: [number, number] = [41.3275, 19.8187];

export default function HotelMap() {
  const { data: hotels } = useHotelData();
  const [selected, setSelected] = useState<Hotel | null>(null);

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
        {hotels?.map((hotel: Hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.lat, hotel.lon]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => setSelected(hotel),
            }}
          />
        ))}

        {/* Popup */}
        {selected && (
          <Popup position={[selected.lat, selected.lon]}>
            <div className="space-y-1">
              <h2 className="font-semibold text-base">{selected.name}</h2>
              <p className="text-sm">{selected.location}</p>
              {selected.price && (
                <p className="text-sm font-medium">€{selected.price} / night</p>
              )}
              {selected.type && (
                <p className="text-xs text-gray-500">{selected.type}</p>
              )}
              {selected.rating && (
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
