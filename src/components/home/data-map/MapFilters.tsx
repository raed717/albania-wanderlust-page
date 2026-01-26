import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MapFiltersProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

const PROPERTY_TYPES = [
  { id: "hotel", label: "Hotels" },
  { id: "apartment", label: "Apartments" },
  { id: "car", label: "Cars" },
];

export function MapFilters({
  selectedTypes,
  onTypesChange,
  priceRange,
  onPriceRangeChange,
  onReset,
}: MapFiltersProps) {
  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      onTypesChange([...selectedTypes, typeId]);
    } else {
      onTypesChange(selectedTypes.filter((t) => t !== typeId));
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filter Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Types */}
        <div>
          <h4 className="font-medium mb-2">Property Types</h4>
          <div className="flex flex-wrap gap-4">
            {PROPERTY_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={(checked) =>
                    handleTypeChange(type.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={type.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-2">
            Price Range: €{priceRange[0]} - €{priceRange[1]}
          </h4>
          <Slider
            value={priceRange}
            onValueChange={(value) =>
              onPriceRangeChange(value as [number, number])
            }
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>€0</span>
            <span>€500+</span>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
