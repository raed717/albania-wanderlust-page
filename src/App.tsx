import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/home/Index";
import OAuthSignInPage from "./pages/home/Auth"; 
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import CultureDetails from "./pages/CultureDetails";
import Dashboard from "./pages/dashboard/dashboard";
import AllHotels from "./pages/dashboard/all-hotels";
import AllCars from "./pages/dashboard/all-cars";


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
          <Route path="/auth" element={<OAuthSignInPage />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/HotelsList" element={<AllHotels />} />
          <Route path="/dashboard/carsList" element={<AllCars />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
