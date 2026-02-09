import React from "react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useTranslation } from "../../hooks/useTranslation";
import { Package, IndianRupee, ShoppingBag, Star, Plus, MapPin, Navigation, TrendingUp, BarChart3 } from "lucide-react";

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const [showMap, setShowMap] = React.useState(false);

  // Farmer's location data with random coordinates
  const farmerLocation = {
    name: "Lakshmi Reddy's Farm",
    city: "L.N.Samudram",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "639002",
    latitude: 10.9629,
    longitude: 78.7715,
    address: "Village L.N.Samudram, Karur District, Tamil Nadu, India",
  };

  // Random farm locations for reference
  const farmLocations = [
    { name: "Lakshmi Reddy's Farm", city: "Tamil Nadu", lat: 10.9629, lng: 78.7715, type: "Vegetables" },
    { name: "Ravi Kumar's Farm", city: "Tamil Nadu", lat: 11.3410, lng: 79.1277, type: "Dairy & Vegetables" },
    { name: "Sunita Devi's Farm", city: "Tamil Nadu", lat: 11.0168, lng: 76.9558, type: "Fruits" },
    { name: "Krishna Devi's Farm", city: "Tamil Nadu", lat: 13.0827, lng: 80.2707, type: "Mixed Farming" },
  ];

  // Mock statistics cards
  const statCards = [
    { label: t("totalOrders") || "Total Orders", value: "128", icon: ShoppingBag },
    { label: t("revenue") || "Revenue", value: "₹24,560", icon: IndianRupee },
    { label: t("activeProducts") || "Active Products", value: "42", icon: Package },
    { label: t("avgRatingGiven") || "Avg Rating", value: "4.8", icon: Star },
  ];

  // Mock selling trends data
  const sellingTrends = [
    {
      name: "Organic Tomatoes",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop&crop=faces",
      sales: 320,
      units: "kg",
      trend: "up",
      change: 18,
    },
    {
      name: "Fresh Spinach",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop&crop=faces",
      sales: 210,
      units: "kg",
      trend: "down",
      change: 6,
    },
    {
      name: "Farm Fresh Eggs",
      image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=200&h=200&fit=crop&crop=faces",
      sales: 180,
      units: "dozen",
      trend: "up",
      change: 12,
    },
  ];

  // Mock recent orders
  const recentOrders = [
    { id: "ORD-1023", item: "Organic Tomatoes", qty: "2 kg", time: "Oct 28, 2025 • 3:12 PM", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop&crop=faces", total: 180, status: "shipped" },
    { id: "ORD-1019", item: "Farm Fresh Eggs", qty: "1 dozen", time: "Oct 27, 2025 • 11:05 AM", image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=200&h=200&fit=crop&crop=faces", total: 72, status: "delivered" },
    { id: "ORD-1005", item: "Fresh Spinach", qty: "1 kg", time: "Oct 25, 2025 • 6:40 PM", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop&crop=faces", total: 30, status: "processing" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-forest-800 dark:text-forest-100">
          {t("farmerDashboard")}
        </motion.h1>
        <Button icon={Plus}>{t("addProduct")}</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, idx) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card className="p-5 flex items-center justify-between">
              <div>
                <div className="text-forest-600 dark:text-forest-400 text-sm">{s.label}</div>
                <div className="text-2xl font-semibold text-forest-800 dark:text-forest-100">{s.value}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-forest-600 dark:text-forest-300" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Farm Location Map Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-forest-200 dark:border-forest-700 flex items-center justify-between">
            <div className="text-xl font-semibold text-forest-800 dark:text-forest-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-success-600" />
              {t("yourFarmLocation")}
            </div>
            <Button onClick={() => setShowMap(!showMap)} className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              {showMap ? t("hideMap") : t("viewMap")}
            </Button>
          </div>

          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5"
            >
              {/* Map Embed - OpenStreetMap */}
              <div className="w-full h-96 rounded-lg overflow-hidden mb-5 border border-forest-200 dark:border-forest-700">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${farmerLocation.latitude},${farmerLocation.longitude}&t=m&z=13&output=embed&hl=en`}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Farm Location Map"
                />
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-forest-800 dark:text-forest-100">Current Location</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-forest-600 dark:text-forest-400">Farm Name:</span>
                      <span className="font-medium text-forest-900 dark:text-forest-100">{farmerLocation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600 dark:text-forest-400">Address:</span>
                      <span className="font-medium text-forest-900 dark:text-forest-100">{farmerLocation.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600 dark:text-forest-400">City:</span>
                      <span className="font-medium text-forest-900 dark:text-forest-100">{farmerLocation.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600 dark:text-forest-400">Postal Code:</span>
                      <span className="font-medium text-forest-900 dark:text-forest-100">{farmerLocation.postalCode}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-forest-800 dark:text-forest-100">GPS Coordinates</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-forest-600 dark:text-forest-400">Latitude:</span>
                      <span className="font-medium text-forest-900 dark:text-forest-100">{farmerLocation.latitude.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600 dark:text-forest-400">Longitude:</span>
                      <span className="font-medium text-forest-900 dark:text-forest-100">{farmerLocation.longitude.toFixed(4)}</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/${farmerLocation.latitude},${farmerLocation.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-4 py-2 bg-success-600 text-white rounded-lg text-sm font-medium hover:bg-success-700 transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Nearby Farms */}
              <div className="mt-6 pt-6 border-t border-forest-200 dark:border-forest-700">
                <h3 className="font-semibold text-forest-800 dark:text-forest-100 mb-4">Nearby Farms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {farmLocations.map((farm, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-lg bg-forest-50 dark:bg-forest-900 border border-forest-200 dark:border-forest-700"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-forest-900 dark:text-forest-100">{farm.name}</p>
                          <p className="text-sm text-forest-600 dark:text-forest-400">{farm.type}</p>
                          <p className="text-xs text-forest-500 dark:text-forest-500 mt-1">
                            📍 {farm.lat.toFixed(4)}, {farm.lng.toFixed(4)}
                          </p>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/${farm.lat},${farm.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-success-600 hover:text-success-700 text-sm font-medium"
                        >
                          View
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!showMap && (
            <div className="p-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-100 dark:bg-success-900 mb-3">
                <MapPin className="w-6 h-6 text-success-600" />
              </div>
              <p className="text-forest-700 dark:text-forest-300 font-medium">{farmerLocation.name}</p>
              <p className="text-sm text-forest-600 dark:text-forest-400">{farmerLocation.address}</p>
              <p className="text-xs text-forest-500 dark:text-forest-500 mt-2">
                Coordinates: {farmerLocation.latitude.toFixed(4)}, {farmerLocation.longitude.toFixed(4)}
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Selling Trends Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-forest-200 dark:border-forest-700 flex items-center justify-between">
            <div className="text-xl font-semibold text-forest-800 dark:text-forest-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-forest-600 dark:text-forest-300" />
              {t("productSellingTrends")}
            </div>
            <Button variant="outline" size="sm">{t("viewAnalytics")}</Button>
          </div>
          <div className="divide-y divide-forest-200 dark:divide-forest-700">
            {sellingTrends.map((product, idx) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 flex items-center space-x-4 hover:bg-forest-50 dark:hover:bg-forest-800/50 transition-colors"
              >
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-forest-800 dark:text-forest-100">{product.name}</div>
                  <div className="text-sm text-forest-600 dark:text-forest-400">{product.sales} units sold this month</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-forest-800 dark:text-forest-100">{product.sales} {product.units}</div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${
                    product.trend === "up" ? "text-success-600" : "text-error-600"
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${product.trend === "down" ? "rotate-180" : ""}`} />
                    {product.trend === "up" ? "+" : ""}{product.change}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-forest-200 dark:border-forest-700 flex items-center justify-between">
            <div className="text-xl font-semibold text-forest-800 dark:text-forest-100">{t("recentOrders")}</div>
            <Button variant="outline" size="sm">{t("viewAll")}</Button>
          </div>
          <div className="divide-y divide-forest-200 dark:divide-forest-700">
            {recentOrders.map((o) => (
              <div key={o.id} className="p-4 flex items-center space-x-3">
                <img src={o.image} alt={o.item} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-forest-800 dark:text-forest-100">{o.item} • {o.qty}</div>
                  <div className="text-sm text-forest-500 dark:text-forest-400">{o.id} • {o.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-forest-800 dark:text-forest-100">₹{o.total}</div>
                  <div className="text-xs text-forest-500 dark:text-forest-400 capitalize">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-forest-200 dark:border-forest-700 flex items-center justify-between">
            <div className="text-xl font-semibold text-forest-800 dark:text-forest-100">Quick Actions</div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            <Button>Add New Product</Button>
            <Button variant="outline">Create Offer</Button>
            <Button variant="outline">Message Customers</Button>
            <Button variant="outline">View Earnings</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;
