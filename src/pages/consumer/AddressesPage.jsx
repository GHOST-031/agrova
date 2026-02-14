import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Briefcase,
  X,
  Save,
  CheckCircle,
  Loader,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import MapPicker from "../../components/ui/MapPicker";
import { useLocation } from "../../contexts/LocationContext";
import toast from "react-hot-toast";

const AddressesPage = () => {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    phone: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    zipcode: "",
    latitude: null,
    longitude: null,
    instructions: "",
  });

  const addressTypes = [
    { value: "Home", icon: Home, color: "text-success-600" },
    { value: "Work", icon: Briefcase, color: "text-blue-600" },
    { value: "Other", icon: MapPin, color: "text-forest-600" },
  ];

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        label: "Home",
        name: "",
        phone: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        zipcode: "",
        latitude: null,
        longitude: null,
        instructions: "",
      });
    }
    setShowMap(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setShowMap(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If zipcode is entered and has 6 digits, fetch location
    if (name === 'zipcode' && value.length === 6 && /^\d{6}$/.test(value)) {
      fetchLocationFromPincode(value);
    }
  };

  const fetchLocationFromPincode = async (pincode) => {
    setFetchingPincode(true);
    try {
      // Using OpenStreetMap Nominatim API to search for pincode in India
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&addressdetails=1&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        const address = location.address;
        
        // Extract city/town/village
        const city = address.city || 
                     address.town || 
                     address.village || 
                     address.suburb || 
                     address.municipality || 
                     address.county || '';
        
        // Extract state
        const state = address.state || '';
        
        // Get coordinates
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);
        
        // Update form with fetched data
        setFormData((prev) => ({
          ...prev,
          city: city,
          state: state,
          latitude: latitude,
          longitude: longitude,
        }));
        
        toast.success(`Location found! ${city}, ${state}`);
      } else {
        toast.error('Pincode not found. Please enter manually.');
      }
    } catch (error) {
      console.error('Error fetching pincode location:', error);
      toast.error('Failed to fetch location. Please enter manually.');
    } finally {
      setFetchingPincode(false);
    }
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      street: location.street || prev.street,
      city: location.city || prev.city,
      state: location.state || prev.state,
      zipcode: location.zipcode || prev.zipcode,
    }));
    setShowMap(false);
    toast.success("Location selected! Address fields auto-filled.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form data before validation:', formData);

    // Trim all fields first
    const trimmedData = {
      ...formData,
      name: (formData.name || '').trim(),
      phone: (formData.phone || '').trim(),
      street: (formData.street || '').trim(),
      city: (formData.city || '').trim(),
      state: (formData.state || '').trim(),
      zipcode: (formData.zipcode || '').trim(),
      landmark: (formData.landmark || '').trim(),
      instructions: (formData.instructions || '').trim()
    };

    console.log('Trimmed data:', trimmedData);

    // Validation with trimmed data
    if (!trimmedData.name || !trimmedData.phone || !trimmedData.street || 
        !trimmedData.city || !trimmedData.state || !trimmedData.zipcode) {
      console.error('Form validation failed - missing fields:', {
        name: trimmedData.name,
        phone: trimmedData.phone,
        street: trimmedData.street,
        city: trimmedData.city,
        state: trimmedData.state,
        zipcode: trimmedData.zipcode
      });
      toast.error("Please fill in all required fields (name, phone, street, city, state, pincode)");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      console.error('Location validation failed:', { latitude: formData.latitude, longitude: formData.longitude });
      toast.error("Please enter a valid pincode or select location on map");
      return;
    }

    // Map form fields to backend fields
    const addressData = {
      label: formData.label,
      name: trimmedData.name,
      phone: trimmedData.phone,
      street: trimmedData.street,
      city: trimmedData.city,
      state: trimmedData.state,
      pincode: trimmedData.zipcode, // Backend expects 'pincode', form uses 'zipcode'
      latitude: formData.latitude,
      longitude: formData.longitude,
      landmark: trimmedData.landmark,
      deliveryInstructions: trimmedData.instructions // Backend expects 'deliveryInstructions'
    };

    console.log('Submitting address data:', addressData);

    if (editingAddress) {
      updateAddress(editingAddress.id, addressData);
    } else {
      addAddress(addressData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      deleteAddress(id);
      toast.success("Address deleted!");
    }
  };

  const handleSetDefault = (id) => {
    setDefaultAddress(id);
    toast.success("Default address updated!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-forest-600" />
              My Addresses
            </h1>
            <p className="text-forest-600 dark:text-forest-400 mt-2">
              Manage your delivery addresses
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add New Address
          </Button>
        </div>
      </motion.div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <MapPin className="w-24 h-24 mx-auto text-forest-300 dark:text-forest-700 mb-4" />
          <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-2">
            No addresses yet
          </h3>
          <p className="text-forest-600 dark:text-forest-400 mb-6">
            Add your first delivery address to get started
          </p>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5 mr-2" />
            Add Address
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address, index) => {
            const AddressIcon =
              addressTypes.find((type) => type.value === address.label)?.icon || MapPin;
            const iconColor =
              addressTypes.find((type) => type.value === address.label)?.color ||
              "text-forest-600";

            return (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative h-full">
                  {/* Default Badge */}
                  {address.isDefault && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Default
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Address Type */}
                    <div className="flex items-center gap-2">
                      <AddressIcon className={`w-6 h-6 ${iconColor}`} />
                      <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-100">
                        {address.label}
                      </h3>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1">
                      <p className="font-semibold text-forest-800 dark:text-forest-100">
                        {address.name}
                      </p>
                      <p className="text-forest-600 dark:text-forest-400 text-sm">
                        {address.phone}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="text-forest-600 dark:text-forest-400 text-sm space-y-1">
                      <p>{address.street}</p>
                      {address.landmark && <p>Near: {address.landmark}</p>}
                      <p>
                        {address.city}, {address.state} - {address.zipcode}
                      </p>
                    </div>

                    {/* Delivery Instructions */}
                    {address.instructions && (
                      <div className="bg-forest-50 dark:bg-forest-800 p-3 rounded-lg">
                        <p className="text-xs text-forest-600 dark:text-forest-400">
                          <strong>Delivery Instructions:</strong> {address.instructions}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-forest-200 dark:border-forest-700">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="flex-1"
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(address)}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAddress ? "Edit Address" : "Add New Address"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Type Selection */}
          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
              Address Type <span className="text-error-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {addressTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, label: type.value }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.label === type.value
                        ? "border-forest-500 bg-forest-50 dark:bg-forest-800"
                        : "border-forest-200 dark:border-forest-700 hover:border-forest-300"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${type.color}`} />
                    <p className="text-sm font-medium text-forest-800 dark:text-forest-100">
                      {type.value}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
                Full Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-forest w-full"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
                Phone Number <span className="text-error-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-forest w-full"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
              Street Address <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="input-forest w-full"
              placeholder="House/Flat No., Building Name, Street"
              required
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
              Landmark (Optional)
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="input-forest w-full"
              placeholder="Near Park, Mall, etc."
            />
          </div>

          {/* City, State, Zipcode */}
          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
              Pincode <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                className="input-forest w-full pr-10"
                placeholder="Enter 6-digit pincode"
                maxLength="6"
                pattern="\d{6}"
                required
              />
              {fetchingPincode && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader className="w-5 h-5 text-forest-600 dark:text-forest-400 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-xs text-forest-500 dark:text-forest-400 mt-1">
              💡 Enter pincode to auto-fill city, state & location
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
                City <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input-forest w-full"
                placeholder="Auto-filled from pincode"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
                State <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="input-forest w-full"
                placeholder="Auto-filled from pincode"
                required
              />
            </div>
          </div>

          {/* Location on Map */}
          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
              Location on Map {formData.latitude && formData.longitude ? "" : <span className="text-error-500">*</span>}
            </label>
            {formData.latitude && formData.longitude && !showMap && (
              <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-3 mb-3">
                <p className="text-xs text-success-800 dark:text-success-200 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Location auto-detected from pincode: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </p>
              </div>
            )}
            {!showMap ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMap(true)}
                className="w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {formData.latitude && formData.longitude
                  ? "Verify/Update Location on Map"
                  : "Select Location on Map"}
              </Button>
            ) : (
              <div>
                <MapPicker
                  onLocationSelect={handleLocationSelect}
                  initialPosition={
                    formData.latitude && formData.longitude
                      ? { lat: formData.latitude, lng: formData.longitude }
                      : null
                  }
                  height="350px"
                />
              </div>
            )}
          </div>

          {/* Delivery Instructions */}
          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
              Delivery Instructions (Optional)
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              className="input-forest w-full"
              rows="3"
              placeholder="E.g., Ring the bell twice, Leave at the door, etc."
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-forest-200 dark:border-forest-700">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {editingAddress ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddressesPage;
