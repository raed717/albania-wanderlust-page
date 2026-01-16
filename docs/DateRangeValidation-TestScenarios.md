# Date Range Validation - Test Scenarios

## Problem Fixed
Previously, users could select a date range that **spans across** unavailable dates, even though individual unavailable dates were disabled. For example, if Feb 2-4 were unavailable, a user could select Jan 31 to Feb 6.

## Solution Implemented
Added validation logic that checks if any unavailable dates fall within the selected range. If they do, the selection is rejected and an error message is shown.

## Test Scenarios

### Scenario 1: Valid Range (No Unavailable Dates)
**Unavailable Dates**: Feb 2, Feb 3, Feb 4
**User Selects**: Jan 28 to Jan 31
**Expected Result**: ✅ Selection accepted, popover closes

### Scenario 2: Invalid Range (Includes Unavailable Dates)
**Unavailable Dates**: Feb 2, Feb 3, Feb 4
**User Selects**: Jan 31 to Feb 6
**Expected Result**: ❌ Selection rejected, error message shown:
- Title: "Invalid Date Range"
- Message: "The selected date range includes unavailable dates. Please select a different range."
- Popover stays open for user to select a different range

### Scenario 3: Valid Range (After Unavailable Period)
**Unavailable Dates**: Feb 2, Feb 3, Feb 4
**User Selects**: Feb 5 to Feb 10
**Expected Result**: ✅ Selection accepted, popover closes

### Scenario 4: Invalid Range (Starts on Unavailable Date)
**Unavailable Dates**: Feb 2, Feb 3, Feb 4
**User Selects**: Feb 2 to Feb 8
**Expected Result**: ❌ Selection rejected (Feb 2 is disabled, so user can't click it)

### Scenario 5: Invalid Range (Ends on Unavailable Date)
**Unavailable Dates**: Feb 2, Feb 3, Feb 4
**User Selects**: Jan 30 to Feb 3
**Expected Result**: ❌ Selection rejected, error message shown

### Scenario 6: Multiple Unavailable Periods
**Unavailable Dates**: Feb 2-4, Feb 10-12
**User Selects**: Feb 1 to Feb 15
**Expected Result**: ❌ Selection rejected (includes both unavailable periods)

### Scenario 7: Valid Range Between Unavailable Periods
**Unavailable Dates**: Feb 2-4, Feb 10-12
**User Selects**: Feb 5 to Feb 9
**Expected Result**: ✅ Selection accepted, popover closes

## How to Test

1. Navigate to the car billing page (e.g., `/car-billing/:id`)
2. Click on the "Pick-up & Drop-off Dates" field
3. Try selecting different date ranges based on the scenarios above
4. Verify that:
   - Unavailable dates are visually disabled (grayed out)
   - Clicking on an unavailable date doesn't select it
   - Selecting a range that includes unavailable dates shows an error
   - Valid ranges are accepted and the popover closes

## Technical Details

### Validation Function
```typescript
const rangeContainsDisabledDate = (from: Date, to: Date): boolean => {
    // Normalize dates to midnight for accurate comparison
    const normalizeDate = (date: Date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized.getTime();
    };

    const fromTime = normalizeDate(from);
    const toTime = normalizeDate(to);

    return disabledDates.some((disabledDate) => {
        const disabledTime = normalizeDate(disabledDate);
        // Check if the disabled date falls within the range (inclusive)
        return disabledTime >= fromTime && disabledTime <= toTime;
    });
};
```

### Key Points
- Dates are normalized to midnight to avoid time-based comparison issues
- The check is inclusive (both start and end dates are included in the range)
- The validation only runs when both dates are selected
- If validation fails, the date range is not updated (user must select again)
