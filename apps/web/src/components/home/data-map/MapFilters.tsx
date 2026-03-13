import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface MapFiltersProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
}

const PROPERTY_TYPES = [
  { id: "hotel", label: "Hotels" },
  { id: "apartment", label: "Apartments" },
  { id: "destination", label: "Destinations" },
];

const DESTINATION_CATEGORIES = [
  { id: "Adventure", label: "Adventure" },
  { id: "Historic", label: "Historic" },
  { id: "Beach", label: "Beach" },
];

export function MapFilters({
  selectedTypes,
  onTypesChange,
  priceRange,
  onPriceRangeChange,
  onReset,
  selectedCategories = [],
  onCategoriesChange,
}: MapFiltersProps) {
  const { isDark } = useTheme();
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const tk = {
    headerText: isDark ? "#ffffff" : "#111115",
    mutedText: isDark ? "rgba(255,255,255,0.45)" : "#6b6663",
    labelText: isDark ? "rgba(255,255,255,0.80)" : "#111115",
    border: isDark ? "rgba(255,255,255,0.08)" : "#e5e2de",
    subBorder: isDark ? "rgba(232,25,44,0.35)" : "#fca5a5",
    catText: isDark ? "#f87171" : "#dc2626",
    catHover: isDark ? "#fca5a5" : "#991b1b",
    checkBg: isDark ? "rgba(255,255,255,0.06)" : "#faf8f5",
    checkBorder: isDark ? "rgba(255,255,255,0.15)" : "#d1cdc9",
    checkAccent: "#E8192C",
    rangeText: isDark ? "rgba(255,255,255,0.50)" : "#9e9994",
    btnBg: isDark ? "rgba(255,255,255,0.06)" : "#f5f2ee",
    btnBorder: isDark ? "rgba(255,255,255,0.12)" : "#ddd9d5",
    btnText: isDark ? "rgba(255,255,255,0.80)" : "#44403c",
    btnHoverBg: isDark ? "rgba(255,255,255,0.12)" : "#ebe7e3",
  };

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      onTypesChange([...selectedTypes, typeId]);
    } else {
      onTypesChange(selectedTypes.filter((t) => t !== typeId));
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (!onCategoriesChange) return;
    if (checked) {
      onCategoriesChange([...selectedCategories, categoryId]);
    } else {
      onCategoriesChange(selectedCategories.filter((c) => c !== categoryId));
    }
  };

  const isDestinationSelected = selectedTypes.includes("destination");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${tk.border}`, paddingBottom: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: tk.headerText, margin: 0 }}>
          Filter Properties
        </h2>
        <p style={{ fontSize: "13px", color: tk.mutedText, marginTop: "4px" }}>
          Customize your map view
        </p>
      </div>

      {/* Property Types */}
      <div>
        <h4 style={{ fontWeight: 600, fontSize: "13px", color: tk.labelText, marginBottom: "10px" }}>
          Property Types
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {PROPERTY_TYPES.map((type) => {
            const checked = selectedTypes.includes(type.id);
            return (
              <label
                key={type.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: tk.labelText,
                }}
              >
                <span
                  onClick={() => handleTypeChange(type.id, !checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "4px",
                    border: `2px solid ${checked ? tk.checkAccent : tk.checkBorder}`,
                    background: checked ? tk.checkAccent : tk.checkBg,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {checked && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {type.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Destination Categories Sub-filter */}
      {isDestinationSelected && onCategoriesChange && (
        <div style={{ paddingLeft: "12px", borderLeft: `2px solid ${tk.subBorder}` }}>
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "13px",
              fontWeight: 600,
              color: tk.catText,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginBottom: "8px",
            }}
          >
            {showCategoryFilter ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Destination Categories
          </button>
          {showCategoryFilter && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginLeft: "4px" }}>
              {DESTINATION_CATEGORIES.map((category) => {
                const checked = selectedCategories.includes(category.id);
                return (
                  <label
                    key={category.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: tk.labelText,
                    }}
                  >
                    <span
                      onClick={() => handleCategoryChange(category.id, !checked)}
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "4px",
                        border: `2px solid ${checked ? tk.checkAccent : tk.checkBorder}`,
                        background: checked ? tk.checkAccent : tk.checkBg,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "all 0.15s",
                      }}
                    >
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {category.label}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 style={{ fontWeight: 600, fontSize: "13px", color: tk.labelText, marginBottom: "10px" }}>
          Price Range: €{priceRange[0]} – €{priceRange[1]}
        </h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => onPriceRangeChange(value as [number, number])}
          max={500}
          min={0}
          step={10}
          className="w-full"
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ fontSize: "11px", color: tk.rangeText }}>€0</span>
          <span style={{ fontSize: "11px", color: tk.rangeText }}>€500+</span>
        </div>
      </div>

      {/* Reset Button */}
      <div>
        <button
          onClick={onReset}
          style={{
            width: "100%",
            padding: "8px 0",
            background: tk.btnBg,
            border: `1px solid ${tk.btnBorder}`,
            borderRadius: "8px",
            color: tk.btnText,
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = tk.btnHoverBg;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = tk.btnBg;
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
