// API Base URL - works on both local and production
// For production on Vercel, use Render backend
const isDevelopment = import.meta.env.DEV;
const productionApiUrl = "https://agrova-eoow.onrender.com/api";
const developmentApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const API_URL = isDevelopment ? developmentApiUrl : productionApiUrl;

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem("f2c_token");
};

// Helper function for authenticated API calls
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    // Support for AbortSignal from useApi hook
    signal: options.signal,
  });

  // Handle token expiration (401 Unauthorized)
  if (response.status === 401) {
    // Clear expired token and user data
    localStorage.removeItem('f2c_token');
    localStorage.removeItem('f2c_user');
    
    // Trigger storage event to notify all contexts
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'f2c_token',
      oldValue: token,
      newValue: null,
      url: window.location.href
    }));
    
    // Redirect to login page
    window.location.href = '/login';
    
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

// API Methods
export const api = {
  // Auth
  login: (credentials) =>
    authenticatedFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    authenticatedFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () =>
    authenticatedFetch("/auth/logout", {
      method: "POST",
    }),

  getCurrentUser: () => authenticatedFetch("/auth/me"),

  updateProfile: (userData) =>
    authenticatedFetch("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  // Products
  getProducts: (params = {}) => {
    const { signal, ...queryParams } = params;
    const queryString = new URLSearchParams(queryParams).toString();
    return authenticatedFetch(`/products?${queryString}`, { signal });
  },

  getProduct: (id) => authenticatedFetch(`/products/${id}`),

  createProduct: (productData) =>
    authenticatedFetch("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  updateProduct: (id, productData) =>
    authenticatedFetch(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id) =>
    authenticatedFetch(`/products/${id}`, {
      method: "DELETE",
    }),

  updateStock: (id, quantity) =>
    authenticatedFetch(`/products/${id}/stock`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  // Cart
  getCart: () => authenticatedFetch("/cart"),

  addToCart: (productId, quantity) =>
    authenticatedFetch("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  updateCartItem: (productId, quantity) =>
    authenticatedFetch(`/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  removeFromCart: (productId) =>
    authenticatedFetch(`/cart/${productId}`, {
      method: "DELETE",
    }),

  clearCart: () =>
    authenticatedFetch("/cart", {
      method: "DELETE",
    }),

  // Wishlist
  getWishlist: () => authenticatedFetch("/wishlist"),

  addToWishlist: (productId) =>
    authenticatedFetch(`/wishlist/${productId}`, {
      method: "POST",
    }),

  removeFromWishlist: (productId) =>
    authenticatedFetch(`/wishlist/${productId}`, {
      method: "DELETE",
    }),

  checkWishlist: (productId) =>
    authenticatedFetch(`/wishlist/check/${productId}`),

  // Orders
  createOrder: (orderData) =>
    authenticatedFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  getMyOrders: () => authenticatedFetch("/orders/my/orders"),

  getFarmerOrders: () => authenticatedFetch("/orders/farmer/orders"),

  getOrder: (id) => authenticatedFetch(`/orders/${id}`),

  updateOrderStatus: (id, status) =>
    authenticatedFetch(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  cancelOrder: (id) =>
    authenticatedFetch(`/orders/${id}/cancel`, {
      method: "PUT",
    }),

  // Payments
  createPaymentOrder: (amount, orderId) =>
    authenticatedFetch("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ amount, orderId }),
    }),

  verifyPayment: (paymentData) =>
    authenticatedFetch("/payments/verify", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),

  processCOD: (orderId) =>
    authenticatedFetch("/payments/cod", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),

  refundPayment: (orderId) =>
    authenticatedFetch("/payments/refund", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),

  getPaymentDetails: (paymentId) =>
    authenticatedFetch(`/payments/${paymentId}`),

  // Addresses
  getAddresses: () => authenticatedFetch("/addresses"),

  getAddress: (id) => authenticatedFetch(`/addresses/${id}`),

  createAddress: (addressData) =>
    authenticatedFetch("/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    }),

  updateAddress: (id, addressData) =>
    authenticatedFetch(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    }),

  deleteAddress: (id) =>
    authenticatedFetch(`/addresses/${id}`, {
      method: "DELETE",
    }),

  setDefaultAddress: (id) =>
    authenticatedFetch(`/addresses/${id}/default`, {
      method: "PUT",
    }),
};
