import PropertiesMap from "../../components/home/data-map/PropertiesMap";
import PrimarySearchAppBar from "@/components/home/AppBar";
import { useTranslation } from "react-i18next";

const PropertiesMapPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {<PrimarySearchAppBar />}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t("propertiesMap.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("propertiesMap.description")}
          </p>
        </div>

        {/* Map Container */}
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ height: "700px" }}
        >
          <PropertiesMap />
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              {t("propertiesMap.interactiveMap")}
            </h3>
            <p className="text-gray-600">
              {t("propertiesMap.interactiveMapDescription")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-green-600">
              {t("propertiesMap.wideSelection")}
            </h3>
            <p className="text-gray-600">
              {t("propertiesMap.wideSelectionDescription")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">
              {t("propertiesMap.bestPrices")}
            </h3>
            <p className="text-gray-600">
              {t("propertiesMap.bestPricesDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesMapPage;
