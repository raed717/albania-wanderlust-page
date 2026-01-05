import { Button } from "@/components/ui/button";
import { Calendar, Map, Plane } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-red-900 via-red-900 to-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Plane className="w-5 h-5" />
              <span className="font-medium">Start Your Adventure</span>
            </div>

            <h2 className="mb-6 text-white">Plan Your Albanian Journey</h2>

            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              Ready to explore Albania's stunning landscapes, rich history, and
              warm hospitality? Let us help you create the perfect itinerary.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <Map className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Explore Routes</h3>
                <p className="text-sm opacity-90">
                  Custom itineraries for every traveler
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <Calendar className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Plan Ahead</h3>
                <p className="text-sm opacity-90">
                  Book accommodations and experiences
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <Plane className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Travel Tips</h3>
                <p className="text-sm opacity-90">
                  Local insights and recommendations
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-secondary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                Get Free Itinerary
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-secondary text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
              >
                Contact Travel Expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
