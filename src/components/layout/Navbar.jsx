import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  Bell,
  User,
  ShoppingCart,
  Heart,
  Search,
  MapPin,
  Plus,
  Home,
  Briefcase,
  X,
  Save,
  Navigation,
  Loader,
  Settings,
  Globe,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth, USER_TYPES } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useLocation } from "../../contexts/LocationContext";
import { useTranslation } from "../../hooks/useTranslation";
import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Simple inline map for navbar form
function SimpleMapMarker({ position, setPosition }) {
  const [markerPosition, setMarkerPosition] = useState(position);
  const markerRef = useRef(null);

  useEffect(() => {
    if (position) {
      setMarkerPosition(position);
    }
  }, [position]);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        const newPosArray = [newPos.lat, newPos.lng];
        setMarkerPosition(newPosArray);
        setPosition(newPosArray);
      }
    },
  };

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(newPos);
      setPosition(newPos);
    },
  });

  return markerPosition ? (
    <Marker 
      position={markerPosition} 
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  ) : null;
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 18, {
        animate: true,
        duration: 1
      });
    }
  }, [center, map]);
  return null;
}

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, userType, logout } = useAuth();
  const { cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { addresses, selectedAddress, addAddress, getCurrentLocation } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = React.useState(false);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);
  
  // Form state - Initialize with default location (Delhi, India)
  const [formData, setFormData] = React.useState({
    label: "Home",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    latitude: 28.6139, // Default to Delhi
    longitude: 77.2090,
    deliveryInstructions: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fetch location from pincode
    if (name === "pincode" && value.length === 6) {
      fetchLocationFromPincode(value);
    }
  };

  const resetForm = () => {
    setFormData({
      label: "Home",
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      latitude: 28.6139, // Reset to default Delhi coordinates
      longitude: 77.2090,
      deliveryInstructions: "",
    });
  };

  const handleCloseAddForm = () => {
    resetForm();
    setShowAddForm(false);
  };

  const fetchLocationFromPincode = async (pincode) => {
    try {
      // First, try to get location from pincode
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        // Get the most detailed result
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lng = parseFloat(location.lon);
        
        // Now do a detailed reverse geocode to get building information
        const reverseResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`
        );
        const reverseData = await reverseResponse.json();
        
        // Extract detailed address components
        const addr = reverseData.address || location.address || {};
        
        // Build detailed street address
        let detailedStreet = '';
        const streetParts = [];
        if (addr.building) streetParts.push(addr.building);
        if (addr.house_number) streetParts.push(addr.house_number);
        if (addr.road) streetParts.push(addr.road);
        if (addr.neighbourhood) streetParts.push(addr.neighbourhood);
        detailedStreet = streetParts.join(', ') || addr.suburb || '';
        
        // Get city - try multiple fields
        const city = addr.city || addr.town || addr.village || addr.municipality || 
                     addr.county || addr.state_district || '';
        
        setFormData((prev) => ({
          ...prev,
          city: city,
          state: addr.state || '',
          street: detailedStreet || prev.street,
          latitude: lat,
          longitude: lng,
        }));
        
        toast.success(`Location set to ${city}, ${addr.state || 'India'}`);
      } else {
        toast.error("Could not find location for this pincode");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Failed to fetch location from pincode");
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    try {
      // First attempt: Try with high accuracy
      let position;
      try {
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        });
      } catch (highAccuracyError) {
        // If high accuracy fails, try with lower accuracy (fallback)
        console.log("High accuracy failed, trying with lower accuracy...");
        toast("Trying alternative location method...", { icon: "🔄" });
        
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: false, // Allow less accurate location
              timeout: 15000, // Longer timeout
              maximumAge: 300000 // Accept cached position up to 5 minutes old
            }
          );
        });
      }

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      // Update form with coordinates immediately
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      
      // Reverse geocode to get address details
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        const addr = data.address || {};
        
        // Build detailed street address including building/society
        let detailedStreet = '';
        if (addr.building || addr.house_number || addr.road || addr.neighbourhood) {
          const parts = [];
          if (addr.building) parts.push(addr.building);
          if (addr.house_number) parts.push(addr.house_number);
          if (addr.road) parts.push(addr.road);
          if (addr.neighbourhood) parts.push(addr.neighbourhood);
          detailedStreet = parts.join(', ');
        }
        
        // Get city - try multiple fields for better accuracy
        const city = addr.city || addr.town || addr.village || addr.municipality || 
                     addr.county || addr.state_district || '';
        
        setFormData((prev) => ({
          ...prev,
          city: city,
          state: addr.state || prev.state,
          street: detailedStreet || addr.suburb || prev.street,
          pincode: addr.postcode || prev.pincode,
        }));
        
        toast.success(`Location: ${city || 'Area'}, ${addr.state || 'India'}`);
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        // Continue even if reverse geocoding fails - we still have coordinates
        toast.success("Location captured! Please fill in address details.");
      }
      
    } catch (error) {
      let errorMessage = "Could not get your location. ";
      let showAsError = true;
      
      if (error.code) {
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location access denied. Please enable location permissions in your browser settings, or enter your address manually.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Location unavailable. You can enter your pincode or address manually instead.";
            showAsError = false; // Show as warning, not error
            break;
          case 3: // TIMEOUT
            errorMessage = "Location detection timed out. No problem - you can enter your pincode to auto-fill the address.";
            showAsError = false; // Show as info, not error
            break;
          default:
            errorMessage += error.message;
        }
      } else {
        errorMessage = "Could not get your location. You can enter your pincode or address manually.";
        showAsError = false;
      }
      
      if (showAsError) {
        toast.error(errorMessage, { duration: 5000 });
      } else {
        toast(errorMessage, { icon: "📍", duration: 4000 });
      }
      
      // Only log for debugging - error codes: 1=DENIED, 2=UNAVAILABLE, 3=TIMEOUT
      console.log("Location detection:", error.code === 2 ? "Position unavailable (GPS issue)" : error.code === 3 ? "Timeout (user can enter manually)" : `Code ${error.code}`);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapLocationSelect = (position) => {
    if (!position || position.length !== 2) return;
    
    const [lat, lng] = position;
    
    // Update form data immediately with coordinates
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    
    // Reverse geocode in background with detailed zoom
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`)
      .then(res => res.json())
      .then(data => {
        const addr = data.address || {};
        
        // Build detailed street address including building/society
        let detailedStreet = '';
        if (addr.building || addr.house_number || addr.road || addr.neighbourhood) {
          const parts = [];
          if (addr.building) parts.push(addr.building);
          if (addr.house_number) parts.push(addr.house_number);
          if (addr.road) parts.push(addr.road);
          if (addr.neighbourhood) parts.push(addr.neighbourhood);
          detailedStreet = parts.join(', ');
        }
        
        // Get city - try multiple fields for better accuracy
        const city = addr.city || addr.town || addr.village || addr.municipality || 
                     addr.county || addr.state_district || '';
        
        setFormData((prev) => ({
          ...prev,
          city: city,
          state: addr.state || prev.state,
          street: detailedStreet || addr.suburb || prev.street,
          pincode: addr.postcode || prev.pincode,
        }));
      })
      .catch(error => console.error("Error fetching address:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    if (!formData.phone || !formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    
    if (!formData.street || !formData.street.trim()) {
      toast.error("Please enter street address");
      return;
    }
    
    if (!formData.city || !formData.city.trim()) {
      toast.error("Please enter city");
      return;
    }
    
    if (!formData.state || !formData.state.trim()) {
      toast.error("Please enter state");
      return;
    }
    
    if (!formData.pincode || !formData.pincode.trim()) {
      toast.error("Please enter pincode");
      return;
    }
    
    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select a location on the map or enter a valid pincode");
      return;
    }

    try {
      console.log('Navbar submitting address:', formData);
      addAddress(formData);
      
      // Reset form and close
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding address from navbar:', error);
      toast.error("Failed to add address");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowProfileMenu(false);
  };

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { name: t("home"), path: "/" },
        { name: t("products"), path: "/products" },
        { name: t("about"), path: "/about" },
        { name: t("contact"), path: "/contact" },
      ];
    }

    switch (userType) {
      case USER_TYPES.FARMER:
        return [
          { name: t("dashboard"), path: "/farmer/dashboard" },
          { name: t("products"), path: "/farmer/products" },
          { name: t("orders"), path: "/farmer/orders" },
          { name: t("earnings"), path: "/farmer/earnings" },
          { name: t("chat"), path: "/farmer/chat" },
        ];
      case USER_TYPES.ADMIN:
        return [
          { name: t("dashboard"), path: "/admin/dashboard" },
          { name: t("users"), path: "/admin/users" },
          { name: t("products"), path: "/admin/products" },
          { name: t("orders"), path: "/admin/orders" },
        ];
      default: // CONSUMER
        return [
          { name: t("home"), path: "/" },
          { name: t("products"), path: "/products" },
          { name: t("orders"), path: "/consumer/orders" },
          { name: t("chat"), path: "/consumer/chat" },
        ];
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/90 dark:bg-forest-900/90 backdrop-blur-md border-b border-forest-200 dark:border-forest-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-forest-gradient rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">A</span>
            </motion.div>
            <span className="text-xl font-bold text-forest-800 dark:text-forest-100">
              Agrova
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-forest-700 dark:text-forest-300 hover:text-forest-500 dark:hover:text-forest-100 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            {userType === USER_TYPES.CONSUMER && (
              <button className="p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors hidden sm:block">
                <Search className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              </button>
            )}

            {/* Cart and Wishlist for consumers */}
            {userType === USER_TYPES.CONSUMER && (
              <>
                {/* Address Dropdown Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                    className="p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors relative"
                    title="Manage Addresses"
                  >
                    <MapPin className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                    {addresses.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-forest-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {addresses.length}
                      </span>
                    )}
                  </button>

                  {/* Address Dropdown */}
                  <AnimatePresence>
                    {showAddressDropdown && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => {
                            resetForm();
                            setShowAddressDropdown(false);
                            setShowAddForm(false);
                          }}
                        />
                        
                        {/* Dropdown Content */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-96 bg-white dark:bg-forest-800 rounded-lg shadow-2xl border border-forest-200 dark:border-forest-700 z-50 max-h-[600px] overflow-y-auto"
                        >
                          {!showAddForm ? (
                            <>
                              <div className="p-4 border-b border-forest-200 dark:border-forest-700 flex items-center justify-between">
                                <h3 className="font-semibold text-forest-800 dark:text-forest-100 flex items-center gap-2">
                                  <MapPin className="w-5 h-5" />
                                  My Addresses
                                </h3>
                                <button
                                  onClick={() => setShowAddForm(true)}
                                  className="flex items-center gap-1 text-sm text-forest-600 dark:text-forest-300 hover:text-forest-800 dark:hover:text-forest-100 font-medium"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add New
                                </button>
                              </div>

                              {addresses.length === 0 ? (
                                <div className="p-6 text-center">
                                  <MapPin className="w-12 h-12 mx-auto text-forest-300 dark:text-forest-700 mb-3" />
                                  <p className="text-sm text-forest-600 dark:text-forest-400 mb-4">
                                    No saved addresses yet
                                  </p>
                                  <button
                                    onClick={() => setShowAddForm(true)}
                                    className="text-forest-600 dark:text-forest-300 hover:text-forest-800 dark:hover:text-forest-100 text-sm font-medium flex items-center gap-1 mx-auto"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Your First Address
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="max-h-64 overflow-y-auto">
                                    {addresses.slice(0, 3).map((addr) => {
                                      const Icon = addr.label === 'Home' ? Home : addr.label === 'Work' ? Briefcase : MapPin;
                                      return (
                                        <div
                                          key={addr.id}
                                          className={`p-3 border-b border-forest-100 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-700/50 transition-colors ${
                                            selectedAddress?.id === addr.id ? 'bg-forest-50 dark:bg-forest-700/50' : ''
                                          }`}
                                        >
                                          <div className="flex items-start gap-2">
                                            <Icon className="w-4 h-4 text-forest-600 dark:text-forest-400 mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-forest-800 dark:text-forest-100">
                                                  {addr.label}
                                                </span>
                                                {addr.isDefault && (
                                                  <span className="text-xs bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200 px-2 py-0.5 rounded-full">
                                                    Default
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-xs text-forest-600 dark:text-forest-400 truncate">
                                                {addr.street}
                                              </p>
                                              <p className="text-xs text-forest-500 dark:text-forest-500">
                                                {addr.city}, {addr.state}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="p-3 bg-forest-50 dark:bg-forest-900/50">
                                    <button
                                      onClick={() => {
                                        setShowAddressDropdown(false);
                                        navigate('/consumer/addresses');
                                      }}
                                      className="w-full text-center text-sm font-medium text-forest-600 dark:text-forest-300 hover:text-forest-800 dark:hover:text-forest-100 py-2"
                                    >
                                      Manage All Addresses →
                                    </button>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            // Add Address Form
                            <div>
                              <div className="p-4 border-b border-forest-200 dark:border-forest-700 flex items-center justify-between">
                                <h3 className="font-semibold text-forest-800 dark:text-forest-100">
                                  Add New Address
                                </h3>
                                <button
                                  onClick={handleCloseAddForm}
                                  className="p-1 hover:bg-forest-100 dark:hover:bg-forest-700 rounded"
                                  title="Close and reset form"
                                >
                                  <X className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                                </button>
                              </div>

                              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                                {/* Address Type */}
                                <div>
                                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                                    Address Type
                                  </label>
                                  <div className="flex gap-2">
                                    {["Home", "Work", "Other"].map((type) => (
                                      <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, label: type })}
                                        className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                                          formData.label === type
                                            ? "border-forest-500 bg-forest-50 dark:bg-forest-700 text-forest-700 dark:text-forest-200"
                                            : "border-forest-200 dark:border-forest-600 text-forest-600 dark:text-forest-400"
                                        }`}
                                      >
                                        {type}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Name and Phone */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                                      Full Name <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleInputChange}
                                      className="w-full px-3 py-2 border border-forest-300 dark:border-forest-600 rounded-lg focus:ring-2 focus:ring-forest-500 dark:bg-forest-700 dark:text-forest-100 text-sm"
                                      placeholder="Your name"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                                      Phone Number <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                      type="tel"
                                      name="phone"
                                      value={formData.phone}
                                      onChange={handleInputChange}
                                      className="w-full px-3 py-2 border border-forest-300 dark:border-forest-600 rounded-lg focus:ring-2 focus:ring-forest-500 dark:bg-forest-700 dark:text-forest-100 text-sm"
                                      placeholder="+91 98765 43210"
                                      required
                                    />
                                  </div>
                                </div>

                                {/* Map Preview - Always visible */}
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-300">
                                      Select Location on Map
                                    </label>
                                    <button
                                      type="button"
                                      onClick={handleGetCurrentLocation}
                                      disabled={isLoadingLocation}
                                      className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-forest-500 text-white hover:bg-forest-600 disabled:bg-forest-300 font-medium"
                                    >
                                      {isLoadingLocation ? (
                                        <>
                                          <Loader className="w-3 h-3 animate-spin" />
                                          Loading...
                                        </>
                                      ) : (
                                        <>
                                          <Navigation className="w-3 h-3" />
                                          Use Current Location
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <div className="h-64 rounded-lg overflow-hidden border-2 border-forest-300 dark:border-forest-600 relative">
                                    {formData.latitude && formData.longitude ? (
                                      <MapContainer
                                        center={[formData.latitude, formData.longitude]}
                                        zoom={18}
                                        style={{ height: "100%", width: "100%" }}
                                        scrollWheelZoom={true}
                                        zoomControl={true}
                                      >
                                        <TileLayer
                                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                          maxZoom={19}
                                        />
                                        <RecenterMap center={[formData.latitude, formData.longitude]} />
                                        <SimpleMapMarker 
                                          position={[formData.latitude, formData.longitude]}
                                          setPosition={handleMapLocationSelect}
                                        />
                                      </MapContainer>
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center bg-forest-100 dark:bg-forest-800">
                                        <div className="text-center px-4">
                                          <MapPin className="w-8 h-8 mx-auto text-forest-400 mb-2" />
                                          <p className="text-sm text-forest-600 dark:text-forest-400">
                                            Click "Use Current Location" or enter pincode
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {formData.latitude && formData.longitude && (
                                    <div className="mt-2 space-y-1">
                                      <p className="text-xs text-forest-600 dark:text-forest-400">
                                        📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                      </p>
                                      <p className="text-xs text-blue-600 dark:text-blue-400">
                                        💡 Zoom in/out or drag the marker for pinpoint accuracy
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Pincode */}
                                <div>
                                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                                    Pincode
                                  </label>
                                  <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    maxLength={6}
                                    className="w-full px-3 py-2 border border-forest-300 dark:border-forest-600 rounded-lg focus:ring-2 focus:ring-forest-500 dark:bg-forest-700 dark:text-forest-100 text-sm"
                                    placeholder="Enter 6-digit pincode"
                                    required
                                  />
                                </div>

                                {/* Street */}
                                <div>
                                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                                    Street Address
                                  </label>
                                  <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-forest-300 dark:border-forest-600 rounded-lg focus:ring-2 focus:ring-forest-500 dark:bg-forest-700 dark:text-forest-100 text-sm"
                                    placeholder="House/Flat no, Building name"
                                    required
                                  />
                                </div>

                                {/* City & State */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                                      City
                                    </label>
                                    <input
                                      type="text"
                                      name="city"
                                      value={formData.city}
                                      onChange={handleInputChange}
                                      className="w-full px-3 py-2 border border-forest-300 dark:border-forest-600 rounded-lg focus:ring-2 focus:ring-forest-500 dark:bg-forest-700 dark:text-forest-100 text-sm"
                                      placeholder="City"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                                      State
                                    </label>
                                    <input
                                      type="text"
                                      name="state"
                                      value={formData.state}
                                      onChange={handleInputChange}
                                      className="w-full px-3 py-2 border border-forest-300 dark:border-forest-600 rounded-lg focus:ring-2 focus:ring-forest-500 dark:bg-forest-700 dark:text-forest-100 text-sm"
                                      placeholder="State"
                                      required
                                    />
                                  </div>
                                </div>

                                {/* Delivery Instructions */}
                                <div>
                                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                                    Delivery Instructions (Optional)
                                  </label>
                                  <textarea
                                    name="deliveryInstructions"
                                    value={formData.deliveryInstructions}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-forest-300 dark:border-forest-600 rounded-lg focus:ring-2 focus:ring-forest-500 dark:bg-forest-700 dark:text-forest-100 text-sm resize-none"
                                    placeholder="Landmarks, special instructions..."
                                  />
                                </div>

                                {/* Submit Button */}
                                <button
                                  type="submit"
                                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-forest-gradient text-white rounded-lg hover:opacity-90 text-sm font-medium"
                                >
                                  <Save className="w-4 h-4" />
                                  Save Address
                                </button>
                              </form>
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/consumer/wishlist"
                  className="p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors relative"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/consumer/cart"
                  className="p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors relative"
                  title="Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <Link 
                to={`/${userType}/notifications`} 
                className="p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors relative hidden md:flex"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                {/* Notification badge removed - will be implemented when notification system is ready */}
              </Link>
            )}

            {/* Settings Dropdown - Theme, Language, Notifications (mobile) */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              </button>

              {/* Settings Dropdown Menu */}
              <AnimatePresence>
                {showSettingsMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSettingsMenu(false)}
                    />
                    
                    {/* Dropdown Content */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-forest-800 rounded-lg shadow-2xl border border-forest-200 dark:border-forest-700 z-50 max-h-[80vh] overflow-y-auto scrollbar-forest"
                    >
                      {/* Notifications Link (mobile only) */}
                      {isAuthenticated && (
                        <Link
                          to={`/${userType}/notifications`}
                          onClick={() => setShowSettingsMenu(false)}
                          className="md:hidden flex items-center justify-between px-4 py-3 hover:bg-forest-50 dark:hover:bg-forest-700/50 transition-colors border-b border-forest-100 dark:border-forest-700"
                        >
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                            <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
                              Notifications
                            </span>
                          </div>
                          <span className="bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            5
                          </span>
                        </Link>
                      )}

                      {/* Theme Toggle */}
                      <button
                        onClick={() => {
                          toggleTheme();
                          setShowSettingsMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-forest-50 dark:hover:bg-forest-700/50 transition-colors border-b border-forest-100 dark:border-forest-700"
                      >
                        {isDark ? (
                          <>
                            <Sun className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                            <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
                              Light Mode
                            </span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                            <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
                              Dark Mode
                            </span>
                          </>
                        )}
                      </button>

                      {/* Language Section */}
                      <div className="px-4 py-3">
                        <div className="flex items-center gap-3 mb-2">
                          <Globe className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                          <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
                            Language
                          </span>
                        </div>
                        <div className="pl-8">
                          <LanguageSwitcher />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:block text-forest-700 dark:text-forest-300 font-medium">
                    {user?.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 card-forest shadow-lg rounded-lg overflow-hidden"
                  >
                    <Link
                      to={`/${userType}/profile`}
                      className="block px-4 py-2 hover-forest text-forest-700 dark:text-forest-300"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      {t("profile")}
                    </Link>
                    <Link
                      to={`/${userType}/settings`}
                      className="block px-4 py-2 hover-forest text-forest-700 dark:text-forest-300"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      {t("settings")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover-forest text-error-600 dark:text-error-400"
                    >
                      {t("logout")}
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-forest-700 dark:text-forest-300 hover:text-forest-500 dark:hover:text-forest-100 font-medium transition-colors"
                >
                  {t("login")}
                </Link>
                <Link to="/signup" className="btn-forest-primary">
                  {t("signup")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
            >
              <Menu className="w-5 h-5 text-forest-600 dark:text-forest-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="md:hidden bg-white dark:bg-forest-900 border-t border-forest-200 dark:border-forest-700"
        >
          <div className="px-4 py-2 space-y-1">
            {getNavItems().map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 rounded-lg text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
