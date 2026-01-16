# DateRangePicker Component

A reusable date range picker component built with `react-day-picker` and Radix UI.

## Location
`src/components/ui/date-range-picker.tsx`

## Features
- Select a date range (start and end dates)
- Disable specific dates (e.g., unavailable dates)
- **Smart validation**: Prevents selecting ranges that include unavailable dates
- Set minimum date constraint
- Auto-close on complete selection
- Beautiful popover interface with dual-month calendar
- Fully styled with Tailwind CSS
- User-friendly error messages

## Usage

### Basic Example

```tsx
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <DateRangePicker
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      placeholder="Select dates"
    />
  );
}
```

### With Constraints

```tsx
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

function BookingForm() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  // Example: Disable specific dates
  const unavailableDates = [
    new Date(2026, 0, 15),
    new Date(2026, 0, 16),
  ];

  return (
    <DateRangePicker
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      placeholder="Select rental dates"
      minDate={new Date()} // Disable past dates
      disabledDates={unavailableDates}
    />
  );
}
```

### Accessing Selected Dates

```tsx
function handleSubmit() {
  if (dateRange?.from && dateRange?.to) {
    const startDate = dateRange.from.toISOString().split("T")[0];
    const endDate = dateRange.to.toISOString().split("T")[0];
    
    console.log("Start:", startDate); // e.g., "2026-01-15"
    console.log("End:", endDate);     // e.g., "2026-01-20"
  }
}
```

## Validation

The component includes smart validation to prevent invalid date ranges:

- **Individual dates**: Disabled dates cannot be clicked
- **Range validation**: If a user selects a range that includes any unavailable dates, the selection is rejected and an error message is shown
- **Example**: If Feb 2-4 are unavailable, users cannot select Jan 31 to Feb 6 (which would include the blocked dates)

This ensures that all bookings are valid and don't conflict with existing reservations.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dateRange` | `DateRange \| undefined` | - | The selected date range |
| `onDateRangeChange` | `(range: DateRange \| undefined) => void` | - | Callback when date range changes |
| `placeholder` | `string` | `"Pick a date range"` | Placeholder text |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable the picker |
| `disabledDates` | `Date[]` | `[]` | Array of dates to disable |
| `minDate` | `Date` | - | Minimum selectable date |

## Example: Car Booking

See `src/pages/home/booking/CarBilling.tsx` for a complete implementation example.

## Dependencies

- `react-day-picker` - Date picker library
- `date-fns` - Date formatting
- `@radix-ui/react-popover` - Popover component
- `lucide-react` - Icons
