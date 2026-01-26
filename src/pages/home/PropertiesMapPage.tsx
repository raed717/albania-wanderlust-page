import PropertiesMap from "../../components/home/data-map/PropertiesMap";
import PrimarySearchAppBar from "@/components/home/AppBar";

const PropertiesMapPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {<PrimarySearchAppBar />}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available Hotels & Apartments
          </h1>
          <p className="text-lg text-gray-600">
            Explore our selection of hotels and apartments across Albania
          </p>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-4">
          <PropertiesMap />
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              📍 Interactive Map
            </h3>
            <p className="text-gray-600">
              Click on any marker to see more details about the hotel or
              apartment
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-green-600">
              🏨 Wide Selection
            </h3>
            <p className="text-gray-600">
              From luxury hotels to budget-friendly hostels across Albania
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">
              💰 Best Prices
            </h3>
            <p className="text-gray-600">
              Competitive pricing with transparent rates per night
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesMapPage;
