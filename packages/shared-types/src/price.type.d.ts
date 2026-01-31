export type Month = "JAN" | "FEB" | "MAR" | "APR" | "MAY" | "JUN" | "JUL" | "AUG" | "SEP" | "OCT" | "NOV" | "DEC";
export declare const MONTHS: Month[];
export declare const MONTH_NAMES: Record<Month, string>;
export type PropertyType = "car" | "apartment" | "hotel";
export interface MonthlyPrice {
    id?: number;
    propertyId: number;
    propertyType: PropertyType;
    month: Month;
    pricePerDay: number;
    createdAt?: string;
    updatedAt?: string;
}
export interface MonthlyPriceInput {
    month: Month;
    pricePerDay: number;
}
export interface Price {
    month: Month;
    pricePerDay: number;
}
//# sourceMappingURL=price.type.d.ts.map