import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const WishlistContext = createContext();

// Initial state
const initialState = {
  items: [],
  loading: false,
};

// Wishlist actions
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_WISHLIST":
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case "CLEAR_WISHLIST":
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from API
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("f2c_token");
      const userStr = localStorage.getItem("f2c_user");
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        // Wishlist is only for consumers
        if (user.userType === 'consumer') {
          dispatch({ type: "SET_LOADING", payload: true });
          const data = await api.getWishlist();
          dispatch({ type: "SET_WISHLIST", payload: data.data.products || [] });
        } else {
          // Clear wishlist for non-consumer users
          dispatch({ type: "CLEAR_WISHLIST" });
        }
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (product) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem("f2c_token");
      if (!token) {
        toast.error("Please login to add items to wishlist");
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      const productId = product._id || product.id;
      const data = await api.addToWishlist(productId);
      dispatch({ type: "SET_WISHLIST", payload: data.data.products || [] });
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Wishlist error:", error);
      const errorMessage = error.message || "Failed to add to wishlist";
      
      // Provide helpful error messages
      if (errorMessage.includes("Product not found")) {
        toast.error("This product doesn't exist in the database. Please try a different product.");
      } else if (errorMessage.includes("Invalid token") || errorMessage.includes("authentication")) {
        toast.error("Please login to add items to wishlist");
      } else {
        toast.error(errorMessage);
      }
      
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.removeFromWishlist(productId);
      dispatch({ type: "SET_WISHLIST", payload: data.data.products || [] });
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error.message || "Failed to remove from wishlist");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
      return false;
    } else {
      await addToWishlist(product);
      return true;
    }
  };

  const isInWishlist = (productId) => {
    return state.items.some((item) => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const value = {
    items: state.items,
    loading: state.loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    loadWishlist: fetchWishlist, // Expose for App.jsx coordination
    count: state.items.length,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
};
