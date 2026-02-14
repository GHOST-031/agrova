import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Calendar, DollarSign, Package, CheckCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useTranslation } from "../../hooks/useTranslation";
import { useOrders } from "../../contexts/OrderContext";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

const OrderDetailsPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch order details from API
  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get from API first
        const response = await api.getOrder(orderId);
        if (response.success) {
          setOrder(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch order');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message);
        
        // Fallback to local context
        const contextOrder = getOrderById(orderId);
        if (contextOrder) {
          setOrder(contextOrder);
        } else {
          toast.error('Order not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, getOrderById]);

  // Construct display data from API response or context
  const orderDetails = order ? {
    id: order.orderId || order._id,
    date: order.createdAt ? new Date(order.createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : "N/A",
    status: order.status || "pending",
    estimatedDelivery: order.tracking?.estimatedDelivery 
      ? new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : "TBD",
    items: order.items?.map(item => ({
      id: item.product?._id || item._id,
      name: item.name || item.product?.name,
      quantity: item.quantity,
      unit: item.unit || 'unit',
      price: item.price,
      image: item.image || item.product?.images?.[0]?.url || "https://images.unsplash.com/photo-1488459716781-6918f33fc897?w=200&h=200&fit=crop",
      farmer: typeof item.farmer === 'string' ? item.farmer : item.farmer?.name || 'Unknown Farmer',
      farmerId: typeof item.farmer === 'object' ? item.farmer?._id : item.farmer,
    })) || [],
    deliveryAddress: order.deliveryAddress || {
      name: "N/A",
      street: "N/A",
      city: "N/A",
      state: "N/A",
      pincode: "N/A",
      phone: "N/A",
      email: "N/A",
    },
    farmers: order.items 
      ? [...new Map(order.items.map(item => {
          const farmer = item.farmer;
          const farmerId = typeof farmer === 'object' ? farmer?._id : farmer;
          return [farmerId, {
            id: farmerId,
            name: typeof farmer === 'object' ? farmer?.name : farmer || 'Unknown',
            location: typeof farmer === 'object' ? farmer?.farmDetails?.location || 'Location not available' : 'Location not available',
            rating: 4.5,
            phone: typeof farmer === 'object' ? farmer?.phoneNumber || 'N/A' : 'N/A',
          }];
        })).values()] 
      : [],
    pricing: order.pricing || {
      subtotal: 0,
      tax: 0,
      delivery: 0,
      total: 0,
    },
    parentOrderId: order.parentOrderId,
  } : null;

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning-100 text-warning-800";
      case "confirmed":
        return "bg-forest-100 text-forest-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-success-100 text-success-800";
      case "cancelled":
        return "bg-error-100 text-error-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-forest-600 dark:text-forest-400">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !orderDetails) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-screen gap-4"
        >
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100">
            Unable to Load Order
          </h2>
          <p className="text-forest-600 dark:text-forest-400">{error}</p>
          <Button onClick={() => navigate('/consumer/orders')}>
            Back to Orders
          </Button>
        </motion.div>
      </div>
    );
  }

  // Show no data state
  if (!orderDetails) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-screen gap-4"
        >
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100">
            Order Not Found
          </h2>
          <Button onClick={() => navigate('/consumer/orders')}>
            Back to Orders
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-forest-100 dark:hover:bg-forest-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-forest-600 dark:text-forest-400" />
        </motion.button>
        <div>
          <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100">
            {t("orderDetails")}
          </h1>
          <p className="text-forest-600 dark:text-forest-400">
            {t("orderId")}: {orderDetails.id}
            {orderDetails.parentOrderId && (
              <span className="ml-2 text-sm">
                (Parent: {orderDetails.parentOrderId})
              </span>
            )}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100">
                  {t("orderStatus")}
                </h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(orderDetails.status)}`}>
                  {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-forest-600" />
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">{t("orderDate")}</p>
                    <p className="font-medium text-forest-800 dark:text-forest-100">{orderDetails.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-forest-600" />
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">{t("estimatedDelivery")}</p>
                    <p className="font-medium text-forest-800 dark:text-forest-100">{orderDetails.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-4">
                {t("orderItems")}
              </h2>
              {orderDetails.items && orderDetails.items.length > 0 ? (
                <div className="space-y-4">
                  {orderDetails.items.map((item, idx) => (
                    <div key={item.id || idx} className={`flex gap-4 pb-4 ${idx < orderDetails.items.length - 1 ? "border-b border-forest-200 dark:border-forest-700" : ""}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1488459716781-6918f33fc897?w=200&h=200&fit=crop"; }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-forest-800 dark:text-forest-100">{item.name}</h3>
                        <p className="text-sm text-forest-600 dark:text-forest-400">
                          {t("from")}: {item.farmer}
                        </p>
                        <p className="text-sm text-forest-600 dark:text-forest-400 mt-1">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-forest-800 dark:text-forest-100">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-forest-600 dark:text-forest-400">
                          ₹{item.price}/{item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-forest-600 dark:text-forest-400">No items in this order</p>
              )}
            </Card>
          </motion.div>

          {/* Farmers Information */}
          {orderDetails.farmers && orderDetails.farmers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-4">
                  {t("sellers")}
                </h2>
                <div className="space-y-4">
                  {orderDetails.farmers.map((farmer, idx) => (
                    <div
                      key={farmer.id || idx}
                      className={`p-4 border border-forest-200 dark:border-forest-700 rounded-lg ${
                        idx < orderDetails.farmers.length - 1 ? "mb-2" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-forest-800 dark:text-forest-100">{farmer.name}</h3>
                          <p className="text-sm text-forest-600 dark:text-forest-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {farmer.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-forest-800 dark:text-forest-100">⭐ {farmer.rating}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          {t("contactFarmer")}
                        </Button>
                        <Button size="sm" className="flex-1">
                          {t("viewProfile")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-4">
                {t("deliveryAddress")}
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-forest-800 dark:text-forest-100">
                  {orderDetails.deliveryAddress.name}
                </p>
                <p className="text-forest-600 dark:text-forest-400">
                  {orderDetails.deliveryAddress.street}
                </p>
                <p className="text-forest-600 dark:text-forest-400">
                  {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.state}{" "}
                  {orderDetails.deliveryAddress.pincode}
                </p>
                {(orderDetails.deliveryAddress.phone || orderDetails.deliveryAddress.email) && (
                  <div className="pt-3 border-t border-forest-200 dark:border-forest-700 space-y-2">
                    {orderDetails.deliveryAddress.phone && (
                      <p className="flex items-center gap-2 text-forest-600 dark:text-forest-400">
                        <Phone className="w-4 h-4" />
                        {orderDetails.deliveryAddress.phone}
                      </p>
                    )}
                    {orderDetails.deliveryAddress.email && (
                      <p className="flex items-center gap-2 text-forest-600 dark:text-forest-400">
                        <Mail className="w-4 h-4" />
                        {orderDetails.deliveryAddress.email}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-4">
                {t("orderSummary")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-forest-600 dark:text-forest-400">{t("subtotal")}</span>
                  <span className="text-forest-800 dark:text-forest-100">₹{(orderDetails.pricing.subtotal || 0).toFixed(2)}</span>
                </div>
                {orderDetails.pricing.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-forest-600 dark:text-forest-400">{t("tax")}</span>
                    <span className="text-forest-800 dark:text-forest-100">₹{(orderDetails.pricing.tax || 0).toFixed(2)}</span>
                  </div>
                )}
                {orderDetails.pricing.delivery > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-forest-600 dark:text-forest-400">{t("delivery")}</span>
                    <span className="text-forest-800 dark:text-forest-100">₹{(orderDetails.pricing.delivery || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-forest-200 dark:border-forest-700 flex justify-between">
                  <span className="font-semibold text-forest-800 dark:text-forest-100">{t("total")}</span>
                  <span className="font-bold text-lg text-forest-800 dark:text-forest-100">
                    ₹{(orderDetails.pricing.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-6">{t("downloadInvoice")}</Button>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="space-y-2">
              <Button className="w-full">{t("trackOrder")}</Button>
              <Button variant="outline" className="w-full">
                {t("needHelp")}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
