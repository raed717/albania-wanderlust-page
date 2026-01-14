import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getAllHotels } from "@/services/api/hotelService";
import { getAllCars } from "@/services/api/carService";
import { getAllAppartments } from "@/services/api/appartmentService";
import { Appartment } from "@/types/appartment.type";
import { Hotel } from "@/types/hotel.types";
import { Car } from "@/types/car.types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import hotelIcon from "@/assets/map/hotel_icon.png";
import apartmentIcon from "@/assets/map/home.png";
import carIcon from "@/assets/map/car_icon.png";
import { HotelPopup } from "./HotelPopup";
import { ApartmentPopup } from "./ApartmentPopup";
import { CarPopup } from "./CarPopup";

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

const CarIcon = new L.Icon({
  iconUrl: carIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
});

// Center of Albania (Tirana)
const ALBANIA_CENTER: [number, number] = [41.3275, 19.8187];

export default function HotelMap() {
  const [hotelsData, setHotelsData] = useState<Hotel[]>([]);
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [apartmentsData, setApartmentsData] = useState<Appartment[]>([]);
  const [selected, setSelected] = useState<{
    type: "hotel" | "apartment" | "car";
    data: Hotel | Appartment | Car;
  } | null>(null);

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
    const fetchCars = async () => {
      try {
        const data = await getAllCars();
        setCarsData(data || []);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
        setCarsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
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
            key={`hotel-${hotel.id}`}
            position={[hotel.lat || 0, hotel.lng || 0]}
            icon={HotelIcon}
            eventHandlers={{
              click: () => setSelected({ type: "hotel", data: hotel }),
            }}
          />
        ))}

        {apartmentsData?.map((apartment: Appartment) => (
          <Marker
            key={`apartment-${apartment.id}`}
            position={[apartment.lat, apartment.lng]}
            icon={ApartmentIcon}
            eventHandlers={{
              click: () => setSelected({ type: "apartment", data: apartment }),
            }}
          />
        ))}

        {carsData?.map((car: Car) => (
          <Marker
            key={`car-${car.id}`}
            position={[car.lat || 0, car.lng || 0]}
            icon={CarIcon}
            eventHandlers={{
              click: () => setSelected({ type: "car", data: car }),
            }}
          />
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
            {selected.type === "car" && <CarPopup car={selected.data as Car} />}
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
