import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Calendar, DollarSign, Package, CheckCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useTranslation } from "../../hooks/useTranslation";
import { useOrders } from "../../contexts/OrderContext";

const OrderDetailsPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();

  // Get order from context or use mock data
  const contextOrder = getOrderById(orderId);
  
  // Mock order details - fallback if order not found
  const mockOrderDetails = {
    id: orderId || "AGR-102394",
    date: "Oct 08, 2025 • 4:15 PM",
    status: "shipped",
    estimatedDelivery: "Oct 10, 2025",
    items: [
      {
        id: 1,
        name: "Organic Tomatoes",
        quantity: 2,
        unit: "kg",
        price: 45,
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop",
        farmer: "Lakshmi Reddy",
      },
      {
        id: 2,
        name: "Fresh Spinach",
        quantity: 1,
        unit: "kg",
        price: 30,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop",
        farmer: "Raj Kumar",
      },
    ],
    deliveryAddress: {
      name: "Priya Sharma",
      street: "123 Green Valley Apartments",
      city: "Noida",
      state: "Uttar Pradesh",
      zipcode: "201301",
      phone: "+91 98765 43210",
      email: "priya.sharma@email.com",
    },
    farmers: [
      {
        id: 1,
        name: "Lakshmi Reddy",
        location: "L.N.Samudram, Karur District, Tamil Nadu",
        rating: 4.8,
        phone: "+91 98765 43210",
      },
      {
        id: 2,
        name: "Raj Kumar",
        location: "Nashik, Maharashtra",
        rating: 4.6,
        phone: "+91 98765 43211",
      },
    ],
    pricing: {
      subtotal: 180,
      tax: 18,
      delivery: 12,
      total: 210,
    },
  };

  // Use context order if available, otherwise use mock
  const orderDetails = contextOrder ? {
    ...mockOrderDetails,
    ...contextOrder,
    date: contextOrder.createdAt ? new Date(contextOrder.createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : mockOrderDetails.date,
    deliveryAddress: contextOrder.deliveryAddress || mockOrderDetails.deliveryAddress,
    pricing: contextOrder.pricing || mockOrderDetails.pricing,
  } : mockOrderDetails;

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
              <div className="space-y-4">
                {orderDetails.items.map((item, idx) => (
                  <div key={item.id} className={`flex gap-4 pb-4 ${idx < orderDetails.items.length - 1 ? "border-b border-forest-200 dark:border-forest-700" : ""}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
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
                        ₹{item.price * item.quantity}
                      </p>
                      <p className="text-sm text-forest-600 dark:text-forest-400">
                        ₹{item.price}/{item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Farmers Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-4">
                {t("sellers")}
              </h2>
              <div className="space-y-4">
                {orderDetails.farmers.map((farmer, idx) => (
                  <div
                    key={farmer.id}
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
                  {orderDetails.deliveryAddress.zipcode}
                </p>
                <div className="pt-3 border-t border-forest-200 dark:border-forest-700 space-y-2">
                  <p className="flex items-center gap-2 text-forest-600 dark:text-forest-400">
                    <Phone className="w-4 h-4" />
                    {orderDetails.deliveryAddress.phone}
                  </p>
                  <p className="flex items-center gap-2 text-forest-600 dark:text-forest-400">
                    <Mail className="w-4 h-4" />
                    {orderDetails.deliveryAddress.email}
                  </p>
                </div>
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
                  <span className="text-forest-800 dark:text-forest-100">₹{orderDetails.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-600 dark:text-forest-400">{t("tax")}</span>
                  <span className="text-forest-800 dark:text-forest-100">₹{orderDetails.pricing.tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-600 dark:text-forest-400">{t("delivery")}</span>
                  <span className="text-forest-800 dark:text-forest-100">₹{orderDetails.pricing.delivery}</span>
                </div>
                <div className="pt-3 border-t border-forest-200 dark:border-forest-700 flex justify-between">
                  <span className="font-semibold text-forest-800 dark:text-forest-100">{t("total")}</span>
                  <span className="font-bold text-lg text-forest-800 dark:text-forest-100">
                    ₹{orderDetails.pricing.total}
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
