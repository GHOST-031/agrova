import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WishlistProvider, useWishlist } from "./contexts/WishlistContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LocationProvider, useLocation as useLocationContext } from "./contexts/LocationContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import { OrderProvider, useOrders } from "./contexts/OrderContext";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LoadingScreen from "./components/LoadingScreen";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ProductsPage from "./pages/products/ProductsPage";
import ProductDetailsPage from "./pages/products/ProductDetailsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ConsumerChatPage from "./pages/consumer/ChatPage";
import FarmerChatPage from "./pages/farmer/ChatPage";

// Consumer Pages
import ConsumerCart from "./pages/consumer/CartPage";
import ConsumerWishlist from "./pages/consumer/WishlistPage";
import ConsumerOrders from "./pages/consumer/OrdersPage";
import ConsumerOrderDetails from "./pages/consumer/OrderDetailsPage";
import ConsumerTrackOrder from "./pages/consumer/TrackOrderPage";
import CheckoutPage from "./pages/consumer/CheckoutPage";
import ConsumerNotifications from "./pages/consumer/NotificationsPage";
import AddressesPage from "./pages/consumer/AddressesPage";
import PaymentHistoryPage from "./pages/consumer/PaymentHistoryPage";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/DashboardPage";
import FarmerProducts from "./pages/farmer/ProductsPage";
import EditProductPage from "./pages/farmer/EditProductPage";
import FarmerOrders from "./pages/farmer/OrdersPage";
import FarmerEarnings from "./pages/farmer/EarningsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/DashboardPage";
import AdminUsers from "./pages/admin/UsersPage";
import AdminProducts from "./pages/admin/ProductsPage";
import AdminOrders from "./pages/admin/OrdersPage";

// Protected Route Component
import ProtectedRoute from "./components/auth/ProtectedRoute";

// App Content Component (needs to be inside providers to access contexts)
function AppContent() {
  const { user, token } = useAuth();
  const { loadCart } = useCart();
  const { loadWishlist } = useWishlist();
  const { loadAddresses } = useLocationContext();
  const { loadOrders } = useOrders();
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (user && token) {
        setIsInitializing(true);
        
        try {
          // Load all user data in parallel
          await Promise.all([
            loadCart(),
            loadWishlist(),
            loadAddresses(),
            loadOrders()
          ]);
        } catch (error) {
          console.error('Failed to load user data:', error);
          // Don't block the app, just log the error
        } finally {
          setIsInitializing(false);
        }
      }
    };
    
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]); // Only run when user/token changes

  // Show loading screen while initializing user data
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-forest-50 dark:bg-forest-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Consumer Routes */}
          <Route
            path="/consumer/cart"
            element={
              <ProtectedRoute userType="consumer">
                <ConsumerCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/wishlist"
            element={
              <ProtectedRoute userType="consumer">
                <ConsumerWishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/orders"
            element={
              <ProtectedRoute userType="consumer">
                <ConsumerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/orders/:orderId/details"
            element={
              <ProtectedRoute userType="consumer">
                <ConsumerOrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/orders/:orderId/track"
            element={
              <ProtectedRoute userType="consumer">
                <ConsumerTrackOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/notifications"
            element={
              <ProtectedRoute userType="consumer">
                <ConsumerNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/chat"
            element={
              <ProtectedRoute userType="consumer">
                <ConsumerChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/checkout"
            element={
              <ProtectedRoute userType="consumer">
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/addresses"
            element={
              <ProtectedRoute userType="consumer">
                <AddressesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer/payments"
            element={
              <ProtectedRoute userType="consumer">
                <PaymentHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Farmer Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute userType="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <ProtectedRoute userType="farmer">
                <FarmerProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products/:productId/edit"
            element={
              <ProtectedRoute userType="farmer">
                <EditProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <ProtectedRoute userType="farmer">
                <FarmerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/earnings"
            element={
              <ProtectedRoute userType="farmer">
                <FarmerEarnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/chat"
            element={
              <ProtectedRoute userType="farmer">
                <FarmerChatPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute userType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute userType="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute userType="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute userType="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--forest-800)",
            color: "var(--forest-100)",
          },
          success: {
            style: {
              background: "var(--success-500)",
            },
          },
          error: {
            style: {
              background: "var(--error-500)",
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <LocationProvider>
                <PaymentProvider>
                  <OrderProvider>
                    <Router>
                      <AppContent />
                    </Router>
                  </OrderProvider>
                </PaymentProvider>
              </LocationProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
