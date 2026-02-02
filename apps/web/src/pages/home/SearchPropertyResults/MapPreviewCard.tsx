import { Compass } from "lucide-react";

const MapPreviewCard = () => {
  const handleOpenMap = () => {
    window.open("/properties-map", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-25 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="relative h-48 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_rgba(255,255,255,0.4)_1px,_transparent_1px)] bg-[length:28px_28px]" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-5 gap-3 text-white">
          <Compass className="w-10 h-10 text-cyan-300" aria-hidden="true" />
          <div>
            <p className="text-lg font-semibold">Preview on the map</p>
            <p className="text-sm text-white/80">
              See where every result sits across Albania
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenMap}
            className="inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
            aria-label="Open properties map in a new tab"
          >
            Show on map
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPreviewCard;
