import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const CartContext = createContext();

// Initial state
const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
};

// Cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CART":
      // Transform cart items to have flattened structure
      const items = (action.payload.items || []).map(item => ({
        ...item,
        id: item.product?._id || item.product?.id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        image: item.product?.images?.[0]?.url || item.image,
        stock: item.product?.stock || item.stock,
        status: item.product?.status || item.status,
      }));
      
      return {
        ...state,
        items,
        totalAmount: action.payload.totalAmount || 0,
        loading: false,
      };
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        totalAmount: 0,
      };
    default:
      return state;
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from API
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("f2c_token");
      const user = localStorage.getItem("f2c_user");
      
      if (token && user) {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await api.getCart();
        dispatch({ type: "SET_CART", payload: data.data });
      } else {
        // Clear cart if no user is logged in
        dispatch({ type: "CLEAR_CART" });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Load cart on mount and when user changes
  useEffect(() => {
    fetchCart();
    
    // Re-fetch cart when storage changes (user login/logout)
    const handleStorageChange = (e) => {
      if (e.key === "f2c_token" || e.key === "f2c_user") {
        fetchCart();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem("f2c_token");
      if (!token) {
        toast.error("Please login to add items to cart");
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      const productId = product._id || product.id;
      
      const data = await api.addToCart(productId, quantity);
      dispatch({ type: "SET_CART", payload: data.data });
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Cart error:", error);
      const errorMessage = error.message || "Failed to add to cart";
      
      // Provide helpful error messages
      if (errorMessage.includes("Product not found")) {
        toast.error("This product doesn't exist in the database. Please try a different product.");
      } else if (errorMessage.includes("Invalid token") || errorMessage.includes("authentication")) {
        toast.error("Please login to add items to cart");
      } else if (errorMessage.includes("out of stock")) {
        toast.error("This product is out of stock");
      } else {
        toast.error(errorMessage);
      }
      
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.removeFromCart(productId);
      dispatch({ type: "SET_CART", payload: data.data });
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(error.message || "Failed to remove from cart");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.updateCartItem(productId, quantity);
      dispatch({ type: "SET_CART", payload: data.data });
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await api.clearCart();
      dispatch({ type: "CLEAR_CART" });
      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error.message || "Failed to clear cart");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getCartTotal = () => {
    return state.totalAmount || state.items.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const getItemCount = () => {
    return state.items.length;
  };

  const value = {
    items: state.items,
    loading: state.loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart: fetchCart, // Expose for App.jsx coordination
    cartCount: getCartCount(),
    itemCount: getItemCount(),
    total: getCartTotal(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
