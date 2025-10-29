import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Culture from "@/components/Culture";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import ReservationPickerValue from "@/components/reservationPicker";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ReservationPickerValue />
      <Destinations />
      <Culture />
      <CallToAction />
    </div>
  );
};

export default Index;
