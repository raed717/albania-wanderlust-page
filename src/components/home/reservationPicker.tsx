// components/reservationPicker.tsx
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { Add, Remove, DirectionsCar, Hotel } from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function ReservationPickerValue() {
  const [tabValue, setTabValue] = React.useState(0); // 0 = Stay, 1 = Car
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    const searchType = tabValue === 0 ? "stay" : "car";

    if (searchType === "stay") {
      navigate("/searchResults", {
        state: {
          type: "stay",
          destination,
          checkInDate: checkInDate ? checkInDate.toISOString() : null,
          checkOutDate: checkOutDate ? checkOutDate.toISOString() : null,
          adults,
          children,
          rooms,
        },
      });
    } else {
      navigate("/searchCarResults", {
        state: {
          type: "car",
          destination,
          pickupDate: checkInDate ? checkInDate.toISOString() : null,
          returnDate: checkOutDate ? checkOutDate.toISOString() : null,
        },
      });
    }
    setLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          backgroundColor: "white",
          opacity: 0.85,
          borderRadius: { xs: 2, md: 3 },
          boxShadow: 3,
          maxWidth: { xs: "95%", sm: "90%", md: "fit-content" },
          width: { xs: "95%", sm: "auto" },
          mx: "auto",
          my: { xs: 2, md: 4 },
          overflow: "hidden",
        }}
      >
        {/* Tabs Section */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
        >
          <Tab icon={<Hotel />} iconPosition="start" label="Stay" />
          <Tab icon={<DirectionsCar />} iconPosition="start" label="Car" />
        </Tabs>

        {/* Search Fields */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.5, sm: 2 },
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <TextField
            label={tabValue === 0 ? "Destination" : "Pickup Location"}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            variant="outlined"
            sx={{ minWidth: { xs: "100%", sm: 200 } }}
          />

          <DatePicker
            label={tabValue === 0 ? "Check-in Date" : "Pickup Date"}
            value={checkInDate}
            onChange={(newValue) => {
              setCheckInDate(newValue);
              if (checkOutDate && newValue && checkOutDate.isBefore(newValue)) {
                setCheckOutDate(newValue.add(1, "day"));
                setCheckoutError("");
              }
            }}
            slotProps={{
              textField: {
                variant: "outlined",
                sx: { width: { xs: "100%", sm: "auto" } },
              },
            }}
          />

          <DatePicker
            label={tabValue === 0 ? "Check-out Date" : "Return Date"}
            value={checkOutDate}
            onChange={handleCheckOutChange}
            slotProps={{
              textField: {
                variant: "outlined",
                error: !!checkoutError,
                helperText: checkoutError,
                sx: { width: { xs: "100%", sm: "auto" } },
              },
            }}
          />

          {/* Show guest/room fields only for Stay tab */}
          {tabValue === 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "space-between", sm: "flex-start" },
                }}
              >
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Adults:
                </Typography>
                <IconButton
                  onClick={() => handleDecrement(setAdults)}
                  size="small"
                >
                  <Remove />
                </IconButton>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {adults}
                </Typography>
                <IconButton
                  onClick={() => handleIncrement(setAdults)}
                  size="small"
                >
                  <Add />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "space-between", sm: "flex-start" },
                }}
              >
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Children:
                </Typography>
                <IconButton
                  onClick={() => handleDecrement(setChildren)}
                  size="small"
                >
                  <Remove />
                </IconButton>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {children}
                </Typography>
                <IconButton
                  onClick={() => handleIncrement(setChildren)}
                  size="small"
                >
                  <Add />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "space-between", sm: "flex-start" },
                }}
              >
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Rooms:
                </Typography>
                <IconButton
                  onClick={() => handleDecrement(setRooms)}
                  size="small"
                >
                  <Remove />
                </IconButton>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {rooms}
                </Typography>
                <IconButton
                  onClick={() => handleIncrement(setRooms)}
                  size="small"
                >
                  <Add />
                </IconButton>
              </Box>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            disabled={!!checkoutError || loading}
            onClick={handleSearch}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {loading ? "Loading..." : "Search"}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
