import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/home/Index";
import OAuthSignInPage from "./pages/home/Auth";
import NotFound from "./pages/NotFound";
import Footer from "./components/home/Footer";
import CultureDetails from "./pages/home/CultureDetails";
import HotelMapPage from "./pages/home/HotelMapPage";
import Dashboard from "./pages/dashboard/dashboard";
import AllHotels from "./pages/dashboard/Hotels/all-hotels";
import HotelDetails from "./pages/dashboard/Hotels/HotelDetails";
import AllCars from "./pages/dashboard/all-cars";
import UserManagement from "./pages/dashboard/Users/users-management";
import UserDetails from "./pages/dashboard/Users/user-details";
import MyAccount from "./pages/home/MyAccount";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/CultureDetails" element={<CultureDetails />} />
          <Route path="/hotels-map" element={<HotelMapPage />} />
          <Route path="/auth" element={<OAuthSignInPage />} />
          <Route path="/myAccount" element={<MyAccount />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/HotelsList" element={<AllHotels />} />
            <Route path="/dashboard/hotels/:id" element={<HotelDetails />} />
            <Route path="/dashboard/carsList" element={<AllCars />} />
            <Route
              path="/dashboard/userManagement"
              element={<UserManagement />}
            />
            <Route path="/dashboard/UserDetails" element={<UserDetails />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="unauthorized" element={<Unauthorized />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
