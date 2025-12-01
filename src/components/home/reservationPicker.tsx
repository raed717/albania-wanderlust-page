// components/reservationPicker.tsx
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, TextField, Typography, IconButton, Button } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export default function ReservationPickerValue() {
  const [destination, setDestination] = React.useState("");
  const [checkInDate, setCheckInDate] = React.useState<Dayjs | null>(dayjs());
  const [checkOutDate, setCheckOutDate] = React.useState<Dayjs | null>(
    dayjs().add(1, "day")
  );
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [rooms, setRooms] = React.useState(1);
  const [checkoutError, setCheckoutError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [responseData, setResponseData] = React.useState<any>(null);

  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => setter((prev) => prev + 1);

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => setter((prev) => Math.max(0, prev - 1));

  const handleCheckOutChange = (newValue: Dayjs | null) => {
    if (newValue && checkInDate && newValue.isBefore(checkInDate, "day")) {
      setCheckoutError("Check-out date cannot be before check-in date.");
    } else {
      setCheckoutError("");
      setCheckOutDate(newValue);
    }
  };

  const handleSearch = async () => {
    if (checkoutError) return;

    const url = "https://api.makcorps.com/city";
    const params = {
      cityid: "60763",
      //hotelid: destination || "Hotel Deluxe", // fallback if no destination
      checkin: checkInDate?.format("YYYY-MM-DD"),
      checkout: checkOutDate?.format("YYYY-MM-DD"),
      currency: "USD",
      kids: children,
      adults: adults,
      rooms: 1,
      api_key: "6901d8fcc1c36084a1345b4c", // ⚠️ Don't expose in production!
    };

    try {
      setLoading(true);
      console.log("🔍 Sending booking request with params:", params);

      const response = await axios.get(url, { params });
      setResponseData(response.data);
      console.log("✅ API Response:", { responseData });
    } catch (error: any) {
      console.error(
        `❌ Request failed with status code ${
          error?.response?.status || "unknown"
        }`,
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          p: 3,
          backgroundColor: "white",
          opacity: 0.85,
          borderRadius: 3,
          boxShadow: 3,
          width: "fit-content",
          mx: "auto",
          my: 4,
        }}
      >
        <TextField
          label="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 200 }}
        />

        <DatePicker
          label="Check-in Date"
          value={checkInDate}
          onChange={(newValue) => {
            setCheckInDate(newValue);
            if (checkOutDate && newValue && checkOutDate.isBefore(newValue)) {
              setCheckOutDate(newValue.add(1, "day"));
              setCheckoutError("");
            }
          }}
          slotProps={{ textField: { variant: "outlined" } }}
        />

        <DatePicker
          label="Check-out Date"
          value={checkOutDate}
          onChange={handleCheckOutChange}
          slotProps={{
            textField: {
              variant: "outlined",
              error: !!checkoutError,
              helperText: checkoutError,
            },
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
            Adults:
          </Typography>
          <IconButton onClick={() => handleDecrement(setAdults)}>
            <Remove />
          </IconButton>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
            {adults}
          </Typography>
          <IconButton onClick={() => handleIncrement(setAdults)}>
            <Add />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
            Children:
          </Typography>
          <IconButton onClick={() => handleDecrement(setChildren)}>
            <Remove />
          </IconButton>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
            {children}
          </Typography>
          <IconButton onClick={() => handleIncrement(setChildren)}>
            <Add />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
            Rooms:
          </Typography>
          <IconButton onClick={() => handleDecrement(setRooms)}>
            <Remove />
          </IconButton>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
            {rooms}
          </Typography>
          <IconButton onClick={() => handleIncrement(setRooms)}>
            <Add />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          color="primary"
          disabled={!!checkoutError || loading}
          onClick={handleSearch}
          sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
        >
          {loading ? "Loading..." : "Search"}
        </Button>
        <p>{responseData}</p>
      </Box>
    </LocalizationProvider>
  );
}
