import React, { createContext, useContext, useReducer } from "react";
import { API_URL } from "../utils/api";

const AuthContext = createContext();

// User types
export const USER_TYPES = {
  CONSUMER: "consumer",
  FARMER: "farmer",
  ADMIN: "admin",
};

// Auth states
const initialState = {
  user: null,
  isAuthenticated: false,
  userType: null,
  loading: false,
  error: null,
};

// Auth actions
const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        userType: null,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function with real API
  const login = async (credentials, userType) => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("f2c_token", data.token);
      localStorage.setItem("f2c_user", JSON.stringify(data.user));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: data.user, userType: data.user.userType },
      });

      // Trigger storage event to reload all contexts with new user data
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'f2c_token',
        oldValue: null,
        newValue: data.token,
        url: window.location.href,
        storageArea: localStorage
      }));

      return { success: true };
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Register function with real API
  const register = async (userData) => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token and user data
      localStorage.setItem("f2c_token", data.token);
      localStorage.setItem("f2c_user", JSON.stringify(data.user));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: data.user, userType: data.user.userType },
      });

      // Trigger storage event to reload all contexts with new user data
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'f2c_token',
        oldValue: null,
        newValue: data.token,
        url: window.location.href,
        storageArea: localStorage
      }));

      return { success: true };
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("f2c_token");
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all app-specific data from localStorage
      const keysToRemove = [];
      const keysToKeep = ['theme', 'language']; // Preserve user preferences
      
      // Find all app-specific keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('f2c_') || key.startsWith('agrova_')) && !keysToKeep.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all found keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Also remove any pending orders or temp data
      localStorage.removeItem('pending_order');
      localStorage.removeItem('cart_backup');
      
      dispatch({ type: "LOGOUT" });
      
      // Trigger storage event manually to clear all contexts
      // (storage event doesn't fire in the same window, so we trigger it manually)
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'f2c_token',
        oldValue: localStorage.getItem("f2c_token"),
        newValue: null,
        url: window.location.href,
        storageArea: localStorage
      }));
    }
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const user = localStorage.getItem("f2c_user");
    const token = localStorage.getItem("f2c_token");

    if (user && token) {
      const userData = JSON.parse(user);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: userData, userType: userData.userType },
      });
    }
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
