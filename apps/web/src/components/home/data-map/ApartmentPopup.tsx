import { Apartment } from "@/types/apartment.type";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

interface ApartmentPopupProps {
  apartment: Apartment;
}

export function ApartmentPopup({ apartment }: ApartmentPopupProps) {
  const { isDark } = useTheme();

  const popupBg = isDark ? '#1a1a1e' : '#ffffff';
  const popupText = isDark ? '#f5f5f5' : '#111115';
  const mutedText = isDark ? 'rgba(255,255,255,0.5)' : '#6b6663';
  const statBg = isDark ? 'rgba(255,255,255,0.06)' : '#f5f2ee';

  return (
    <div style={{ width: '16rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: popupBg, color: popupText }}>
      <div>
        <h3 style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>{apartment.name}</h3>
        <p style={{ fontSize: '0.875rem', color: mutedText, margin: '0.25rem 0 0' }}>{apartment.location}</p>
      </div>
      <img
        src={apartment.imageUrls[0]}
        style={{ width: '100%', height: '8rem', objectFit: 'cover', borderRadius: '0.375rem' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
        {apartment.price && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.5rem', background: statBg, borderRadius: '0.375rem' }}>
            <span style={{ fontWeight: 500 }}>Price:</span>
            <span style={{ color: '#E8192C', fontWeight: 700 }}>€{apartment.price} / night</span>
          </div>
        )}
        {apartment.rooms && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 500 }}>Rooms:</span>
            <span>{apartment.rooms}</span>
          </div>
        )}
        {apartment.rating && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 500 }}>Rating:</span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>★ {apartment.rating}</span>
          </div>
        )}
        {apartment.status && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>Status:</span>
            <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', background: apartment.status === 'available' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)', color: apartment.status === 'available' ? '#10b981' : mutedText }}>
              {apartment.status}
            </span>
          </div>
        )}
      </div>

      <Link to={`/apartmentReservation/${apartment.id}`}>
        <button style={{ width: '100%', background: '#E8192C', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'opacity 0.15s' }}>
          View Details
        </button>
      </Link>
    </div>
  );
}
