import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const LocationContext = createContext();

// Initial state
const initialState = {
  addresses: [],
  selectedAddress: null,
  currentLocation: null,
};

// Location actions
const locationReducer = (state, action) => {
  switch (action.type) {
    case "SET_ADDRESSES":
      return {
        ...state,
        addresses: action.payload,
      };
    case "ADD_ADDRESS":
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      };
    case "UPDATE_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.map((addr) =>
          (addr._id || addr.id) === (action.payload._id || action.payload.id) ? action.payload : addr
        ),
      };
    case "DELETE_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.filter((addr) => (addr._id || addr.id) !== action.payload),
        selectedAddress:
          (state.selectedAddress?._id || state.selectedAddress?.id) === action.payload ? null : state.selectedAddress,
      };
    case "SET_SELECTED_ADDRESS":
      return {
        ...state,
        selectedAddress: action.payload,
      };
    case "SET_CURRENT_LOCATION":
      return {
        ...state,
        currentLocation: action.payload,
      };
    case "SET_DEFAULT_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: (addr._id || addr.id) === action.payload,
        })),
      };
    default:
      return state;
  }
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  // Load addresses from backend on mount and when user changes
  useEffect(() => {
    const loadAddresses = async () => {
      const token = localStorage.getItem("f2c_token");
      const user = localStorage.getItem("f2c_user");
      
      if (!token || !user) {
        // Clear addresses if no user is logged in
        dispatch({ type: "SET_ADDRESSES", payload: [] });
        dispatch({ type: "SET_SELECTED_ADDRESS", payload: null });
        return;
      }

      try {
        const response = await api.getAddresses();
        const addresses = (response.data || []).map(addr => ({
          ...addr,
          id: addr._id || addr.id // Normalize to ensure 'id' exists
        }));
        dispatch({ type: "SET_ADDRESSES", payload: addresses });
        
        // Set the default address as selected
        const defaultAddress = addresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
          dispatch({ type: "SET_SELECTED_ADDRESS", payload: defaultAddress });
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
        // Clear addresses on error
        dispatch({ type: "SET_ADDRESSES", payload: [] });
        dispatch({ type: "SET_SELECTED_ADDRESS", payload: null });
      }
    };

    loadAddresses();
    
    // Re-fetch addresses when storage changes (user login/logout)
    const handleStorageChange = (e) => {
      if (e.key === "f2c_token" || e.key === "f2c_user") {
        loadAddresses();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Don't save to localStorage anymore - we're using database only
  // Remove the localStorage backup effect entirely

  // Get user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };
          dispatch({ type: "SET_CURRENT_LOCATION", payload: location });
          resolve(location);
        },
        (error) => {
          let errorMessage = "Failed to get location: ";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Location access denied. Please enable location permissions.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += error.message;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const addAddress = async (address) => {
    try {
      console.log('Adding address:', address);
      const response = await api.createAddress(address);
      const newAddress = {
        ...response.data,
        id: response.data._id || response.data.id // Normalize ID
      };
      dispatch({ type: "ADD_ADDRESS", payload: newAddress });
      toast.success("Address added successfully!");
      return newAddress;
    } catch (error) {
      console.error("Error adding address:", error);
      console.error("Address data sent:", address);
      toast.error(error.message || "Failed to add address");
      throw error;
    }
  };

  const updateAddress = async (id, updates) => {
    try {
      const response = await api.updateAddress(id, updates);
      const updatedAddress = {
        ...response.data,
        id: response.data._id || response.data.id // Normalize ID
      };
      dispatch({ type: "UPDATE_ADDRESS", payload: updatedAddress });
      toast.success("Address updated successfully!");
      return updatedAddress;
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.message || "Failed to update address");
      throw error;
    }
  };

  const deleteAddress = async (id) => {
    try {
      console.log('Deleting address with ID:', id);
      await api.deleteAddress(id);
      dispatch({ type: "DELETE_ADDRESS", payload: id });
      toast.success("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      console.error("ID that was attempted:", id);
      toast.error(error.message || "Failed to delete address");
      throw error;
    }
  };

  const selectAddress = (address) => {
    dispatch({ type: "SET_SELECTED_ADDRESS", payload: address });
  };

  const setDefaultAddress = async (id) => {
    try {
      await api.setDefaultAddress(id);
      dispatch({ type: "SET_DEFAULT_ADDRESS", payload: id });
      toast.success("Default address updated!");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(error.message || "Failed to set default address");
      throw error;
    }
  };

  const getAddressById = (id) => {
    return state.addresses.find((addr) => (addr._id || addr.id) === id);
  };

  const getDefaultAddress = () => {
    return state.addresses.find((addr) => addr.isDefault);
  };

  const value = {
    addresses: state.addresses,
    selectedAddress: state.selectedAddress,
    currentLocation: state.currentLocation,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    setDefaultAddress,
    getAddressById,
    getDefaultAddress,
    getCurrentLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
