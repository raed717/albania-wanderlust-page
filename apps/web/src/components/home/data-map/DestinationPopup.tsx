import { Destination } from "@/types/destination.types";
import { MapPin, Compass } from "lucide-react";
import { useLocalized } from "@/hooks/useLocalized";
import { useTheme } from "@/context/ThemeContext";

interface DestinationPopupProps {
  destination: Destination;
}

const categoryInlineColors: Record<string, { bg: string; text: string }> = {
  Adventure: { bg: '#fff7ed', text: '#c2410c' },
  Historic:  { bg: '#fffbeb', text: '#b45309' },
  Beach:     { bg: '#ecfeff', text: '#0e7490' },
};

export function DestinationPopup({ destination }: DestinationPopupProps) {
  const { localize } = useLocalized();
  const { isDark } = useTheme();

  const popupBg = isDark ? '#1a1a1e' : '#ffffff';
  const popupText = isDark ? '#f5f5f5' : '#111115';
  const mutedText = isDark ? 'rgba(255,255,255,0.5)' : '#6b6663';
  const divider = isDark ? 'rgba(255,255,255,0.08)' : '#e5e2de';
  const infoBg = isDark ? 'rgba(232,25,44,0.08)' : '#fef2f2';
  const infoText = isDark ? '#f87171' : '#b91c1c';

  const defaultCat = isDark
    ? { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.6)' }
    : { bg: '#f3f4f6', text: '#374151' };
  const categoryStyle = isDark
    ? { bg: 'rgba(232,25,44,0.12)', text: '#f87171' }
    : (categoryInlineColors[destination.category] || defaultCat);

  return (
    <div style={{ width: '16rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: popupBg, color: popupText }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>
            {localize(destination.name)}
          </h3>
          <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 500, background: categoryStyle.bg, color: categoryStyle.text }}>
            {destination.category}
          </span>
        </div>
        {destination.imageUrls && destination.imageUrls.length > 0 && (
          <img
            src={destination.imageUrls[0]}
            alt={localize(destination.name)}
            style={{ width: '100%', height: '8rem', objectFit: 'cover', borderRadius: '0.375rem', margin: '0.5rem 0' }}
          />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
        {localize(destination.description) && (
          <p style={{ color: mutedText, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {localize(destination.description)}
          </p>
        )}

        {destination.lat && destination.lng && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: mutedText, fontSize: '0.75rem', margin: 0 }}>
            <MapPin className="w-3 h-3" />
            {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${divider}` }}>
        <Compass className="w-4 h-4" style={{ color: '#E8192C' }} />
        <span style={{ fontSize: '0.75rem', color: mutedText }}>
          Explore this {destination.category.toLowerCase()} destination
        </span>
      </div>
    </div>
  );
}
