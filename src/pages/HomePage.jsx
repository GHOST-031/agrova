import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Truck,
  Shield,
  Users,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Navigation,
  BarChart3,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useTranslation } from "../hooks/useTranslation";
import { useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";

const HomePage = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [showMap, setShowMap] = React.useState(false);

  // Consumer's location data with Tamil Nadu coordinates
  const consumerLocation = {
    name: "My Delivery Address",
    city: "L.N.Samudram",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "639002",
    latitude: 10.9629,
    longitude: 78.7715,
    address: "L.N.Samudram, Karur District, Tamil Nadu, India",
  };

  // Available farms in Tamil Nadu for delivery
  const nearbyFarms = [
    { name: "Lakshmi Reddy's Farm", city: "L.N.Samudram", lat: 10.9629, lng: 78.7715, distance: "0.5 km", type: "Vegetables" },
    { name: "Ravi Kumar's Farm", city: "Tiruppur", lat: 11.3410, lng: 79.1277, distance: "35 km", type: "Dairy & Vegetables" },
    { name: "Sunita Devi's Farm", city: "Coimbatore", lat: 11.0168, lng: 76.9558, distance: "45 km", type: "Fruits" },
    { name: "Krishna Devi's Farm", city: "Chennai", lat: 13.0827, lng: 80.2707, distance: "120 km", type: "Mixed Farming" },
  ];
  const featuredProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: 45,
      unit: "kg",
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop",
      farmer: {
        name: "Ravi Kumar",
        avatar:
          "https://ui-avatars.com/api/?name=Ravi+Kumar&background=4a9a4a&color=fff",
      },
      rating: 4.8,
      isOrganic: true,
      isFreshToday: true,
      stock: 25,
      location: "2.5 km away",
    },
    {
      id: 2,
      name: "Fresh Spinach",
      price: 30,
      unit: "kg",
      image:
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
      farmer: {
        name: "Sunita Devi",
        avatar:
          "https://ui-avatars.com/api/?name=Sunita+Devi&background=4a9a4a&color=fff",
      },
      rating: 4.9,
      isOrganic: true,
      stock: 15,
      location: "1.8 km away",
    },
    {
      id: 3,
      name: "Farm Fresh Eggs",
      price: 8,
      unit: "dozen",
      image:
        "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400&h=400&fit=crop",
      farmer: {
        name: "Amit Singh",
        avatar:
          "https://ui-avatars.com/api/?name=Amit+Singh&background=4a9a4a&color=fff",
      },
      rating: 4.7,
      isFreshToday: true,
      stock: 50,
      location: "3.2 km away",
    },
    {
      id: 4,
      name: "Organic Carrots",
      price: 35,
      unit: "kg",
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
      farmer: {
        name: "Priya Sharma",
        avatar:
          "https://ui-avatars.com/api/?name=Priya+Sharma&background=4a9a4a&color=fff",
      },
      rating: 4.6,
      isOrganic: true,
      stock: 20,
      location: "1.5 km away",
    },
  ];

  const features = [
    {
      icon: Leaf,
      title: t("farmFreshQuality"),
      description: t("directFromLocalFarms"),
    },
    {
      icon: Truck,
      title: t("fastDelivery"),
      description: t("sameDayDeliveryDesc"),
    },
    {
      icon: Shield,
      title: t("qualityAssured"),
      description: t("strictQualityChecks"),
    },
    {
      icon: Users,
      title: t("supportLocalFarmers"),
      description: t("helpLocalFarming"),
    },
  ];

  const stats = [
    { label: t("happyCustomers"), value: "10,000+", icon: Users },
    { label: t("localFarmersCount"), value: "500+", icon: Leaf },
    { label: t("productsDelivered"), value: "1M+", icon: Truck },
    { label: t("customerRating"), value: "4.9★", icon: Star },
  ];

  const buyingTrends = [
    { name: "Organic Tomatoes", purchases: 342, trend: "up", change: 18, category: "Vegetables", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop" },
    { name: "Fresh Spinach", purchases: 289, trend: "up", change: 12, category: "Vegetables", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop" },
    { name: "Farm Fresh Eggs", purchases: 425, trend: "up", change: 22, category: "Dairy", image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=100&h=100&fit=crop" },
    { name: "Organic Carrots", purchases: 198, trend: "down", change: -5, category: "Vegetables", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100&h=100&fit=crop" },
    { name: "Fresh Apples", purchases: 276, trend: "up", change: 14, category: "Fruits", image: "https://images.unsplash.com/photo-1560806e614371-248b50fe630f?w=100&h=100&fit=crop" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-forest-50 to-forest-100 dark:from-forest-950 dark:to-forest-900 overflow-hidden">
        <div className="absolute inset-0 bg-nature-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold text-forest-800 dark:text-forest-100 leading-tight"
                >
                  {t("freshFromFarm")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-forest-700 dark:text-forest-300 leading-relaxed"
                >
                  {t("connectWithFarmers")}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link to="/products">
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    {t("shopNow")}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="lg">
                    {t("joinAsFarmer")}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center space-x-6 text-forest-600 dark:text-forest-400"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{t("sameDayDelivery")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{t("localFarmers")}</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop"
                  alt="Fresh vegetables from farm"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-forest-900 p-4 rounded-xl shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-forest-800 dark:text-forest-100">
                    500+ Farmers Online
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-forest-900 p-4 rounded-xl shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success-500" />
                  <span className="text-sm font-medium text-forest-800 dark:text-forest-100">
                    Fresh Stock Updated
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-2"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-forest-100 dark:bg-forest-800 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-forest-600 dark:text-forest-400" />
                </div>
                <div className="text-2xl font-bold text-forest-800 dark:text-forest-100">
                  {stat.value}
                </div>
                <div className="text-forest-600 dark:text-forest-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Delivery Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-forest-200 dark:border-forest-700 flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-2xl font-semibold text-forest-800 dark:text-forest-100 flex items-center gap-2"
              >
                <MapPin className="w-6 h-6 text-success-600" />
                {t("availableFarmsNearYou")}
              </motion.div>
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
                {/* Map Embed - Google Maps */}
                <div className="w-full h-96 rounded-lg overflow-hidden mb-5 border border-forest-200 dark:border-forest-700">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://maps.google.com/maps?q=${consumerLocation.latitude},${consumerLocation.longitude}&t=m&z=10&output=embed&hl=en`}
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Delivery Area Map"
                  />
                </div>

                {/* Delivery Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-forest-50 dark:bg-forest-900 rounded-lg border border-forest-200 dark:border-forest-700">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-forest-800 dark:text-forest-100">Your Delivery Address</h3>
                    <div className="text-sm space-y-1">
                      <p className="text-forest-900 dark:text-forest-100"><strong>{consumerLocation.name}</strong></p>
                      <p className="text-forest-600 dark:text-forest-400">{consumerLocation.address}</p>
                      <p className="text-forest-600 dark:text-forest-400">{consumerLocation.city}, {consumerLocation.state} {consumerLocation.postalCode}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-forest-800 dark:text-forest-100">{t("gpsCoordinates")}</h3>
                    <div className="text-sm space-y-1">
                      <p className="text-forest-600 dark:text-forest-400">{t("latitude")}: <strong>{consumerLocation.latitude.toFixed(4)}</strong></p>
                      <p className="text-forest-600 dark:text-forest-400">{t("longitude")}: <strong>{consumerLocation.longitude.toFixed(4)}</strong></p>
                      <a
                        href={`https://www.google.com/maps/search/${consumerLocation.latitude},${consumerLocation.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-3 py-1 bg-success-600 text-white rounded text-xs font-medium hover:bg-success-700 transition-colors"
                      >
                        {t("openInGoogleMaps")}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Nearby Farms Grid */}
                <h3 className="font-semibold text-forest-800 dark:text-forest-100 mb-4">{t("availableFarmsForDelivery")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nearbyFarms.map((farm, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-lg bg-white dark:bg-forest-800 border border-forest-200 dark:border-forest-700 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-forest-900 dark:text-forest-100">{farm.name}</p>
                          <p className="text-sm text-forest-600 dark:text-forest-400">{farm.type}</p>
                        </div>
                        <span className="text-xs bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200 px-2 py-1 rounded">
                          {farm.distance}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-forest-500 dark:text-forest-500">
                          📍 {farm.city} • {farm.lat.toFixed(4)}, {farm.lng.toFixed(4)}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/${farm.lat},${farm.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-success-600 dark:text-success-400 hover:text-success-700 text-xs font-medium"
                        >
                          View
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {!showMap && (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success-100 dark:bg-success-900 mb-4">
                  <MapPin className="w-7 h-7 text-success-600" />
                </div>
                <p className="text-forest-700 dark:text-forest-300 font-medium">{consumerLocation.name}</p>
                <p className="text-sm text-forest-600 dark:text-forest-400 mt-1">{consumerLocation.address}</p>
                <p className="text-xs text-forest-500 dark:text-forest-500 mt-2">
                  {nearbyFarms.length} farms available for delivery
                </p>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-forest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-4">
              {t("whyChooseAgrova")}
            </h2>
            <p className="text-xl text-forest-600 dark:text-forest-400 max-w-3xl mx-auto">
              {t("bridgeGap")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4 p-6 rounded-xl hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-forest-gradient rounded-xl">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-100">
                  {feature.title}
                </h3>
                <p className="text-forest-600 dark:text-forest-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-4">
                {t("featuredProducts")}
              </h2>
              <p className="text-xl text-forest-600 dark:text-forest-400">
                {t("handpickedFresh")}
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                {t("viewAll")}
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={(product) => {
                    addToCart(product, 1);
                    toast.success(`${product.name} added to cart!`);
                  }}
                  onAddToWishlist={(product) =>
                    console.log("Add to wishlist:", product)
                  }
                  onViewDetails={(product) =>
                    console.log("View details:", product)
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Buying Trends Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-forest-600 dark:text-forest-300" />
              {t("popularBuyingTrends")}
            </h2>
            <p className="text-lg text-forest-600 dark:text-forest-400">
              {t("whatCustomersLoving")}
            </p>
          </motion.div>

          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-forest-200 dark:divide-forest-700">
              {buyingTrends.map((product, idx) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 flex items-center space-x-4 hover:bg-forest-50 dark:hover:bg-forest-800/50 transition-colors"
                >
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-forest-800 dark:text-forest-100">{product.name}</div>
                    <div className="text-sm text-forest-600 dark:text-forest-400">{product.purchases} purchases • {product.category}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-forest-800 dark:text-forest-100">{product.purchases}x</div>
                    <div className={`text-sm flex items-center justify-end gap-1 font-medium ${
                      product.trend === "up" ? "text-success-600" : "text-error-600"
                    }`}>
                      {product.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {product.trend === "up" ? "+" : ""}{product.change}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-forest-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("readyToTaste")}
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {t("joinThousands")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/products">
                <Button variant="secondary" size="lg">
                  {t("startShopping")}
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-forest-600"
                >
                  {t("becomeAFarmer")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
