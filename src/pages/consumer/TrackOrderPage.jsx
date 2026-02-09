import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  Truck,
  CheckCircle,
  Circle,
  Package,
  Clock,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useTranslation } from "../../hooks/useTranslation";

const TrackOrderPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Mock tracking data - in real app, fetch from API using orderId
  const trackingData = {
    id: orderId || "AGR-102394",
    status: "shipped",
    currentStep: 2, // 0: Confirmed, 1: Packed, 2: Shipped, 3: Out for Delivery, 4: Delivered
    carrier: "FreshExpress Logistics",
    trackingNumber: "FXL-2025-10-089456",
    carrierPhone: "+91 98765 43220",
    estimatedDelivery: "Oct 10, 2025 • Expected between 2:00 PM - 5:00 PM",
    lastUpdate: "Oct 09, 2025 • 9:30 AM",
    currentLocation: "Ghaziabad Sorting Hub, Uttar Pradesh",
    items: [
      {
        id: 1,
        name: "Organic Tomatoes",
        quantity: 2,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop",
      },
      {
        id: 2,
        name: "Fresh Spinach",
        quantity: 1,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop",
      },
    ],
    timeline: [
      {
        step: 0,
        title: "Order Confirmed",
        description: "Your order has been confirmed by the farmers",
        timestamp: "Oct 08, 2025 • 4:15 PM",
        location: "Noida, Uttar Pradesh",
        completed: true,
      },
      {
        step: 1,
        title: "Packed",
        description: "Your order has been packed and ready for pickup",
        timestamp: "Oct 08, 2025 • 6:30 PM",
        location: "Collection Center, Noida",
        completed: true,
      },
      {
        step: 2,
        title: "Shipped",
        description: "Your order is on its way to you",
        timestamp: "Oct 09, 2025 • 8:00 AM",
        location: "Ghaziabad Sorting Hub",
        completed: true,
      },
      {
        step: 3,
        title: "Out for Delivery",
        description: "Your order is out for delivery today",
        timestamp: "Oct 10, 2025 (Expected)",
        location: "Local Delivery Hub",
        completed: false,
      },
      {
        step: 4,
        title: "Delivered",
        description: "Your order has been delivered",
        timestamp: "Oct 10, 2025 (Expected by 5:00 PM)",
        location: "Your Address",
        completed: false,
      },
    ],
  };

  const getStepIcon = (step, isCompleted, isCurrent) => {
    if (isCompleted) {
      return <CheckCircle className="w-8 h-8 text-success-600" />;
    }
    if (isCurrent) {
      return (
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Truck className="w-8 h-8 text-forest-600" />
        </motion.div>
      );
    }
    return <Circle className="w-8 h-8 text-forest-300 dark:text-forest-600" />;
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
            {t("trackOrder")}
          </h1>
          <p className="text-forest-600 dark:text-forest-400">
            {t("orderId")}: {trackingData.id}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-r from-forest-50 to-green-50 dark:from-forest-900 dark:to-forest-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Truck className="w-8 h-8 text-forest-600 dark:text-forest-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-forest-800 dark:text-forest-100">
                      {t("inTransit")}
                    </h2>
                    <p className="text-sm text-forest-600 dark:text-forest-400">
                      {trackingData.lastUpdate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-forest-900 rounded-lg p-4 mt-4">
                <p className="text-center text-forest-800 dark:text-forest-100 font-medium">
                  {trackingData.currentLocation}
                </p>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {t("estimatedDelivery")}: <strong>{trackingData.estimatedDelivery}</strong>
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-6">
                {t("shippingTimeline")}
              </h2>
              <div className="space-y-6">
                {trackingData.timeline.map((event, idx) => {
                  const isCompleted = event.step < trackingData.currentStep;
                  const isCurrent = event.step === trackingData.currentStep;
                  return (
                    <motion.div
                      key={event.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        {getStepIcon(event.step, isCompleted, isCurrent)}
                        {idx < trackingData.timeline.length - 1 && (
                          <div
                            className={`w-1 h-12 mt-2 ${
                              isCompleted || isCurrent
                                ? "bg-forest-600 dark:bg-forest-400"
                                : "bg-forest-300 dark:bg-forest-600"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3
                              className={`font-semibold ${
                                isCurrent
                                  ? "text-forest-800 dark:text-forest-100"
                                  : "text-forest-700 dark:text-forest-200"
                              }`}
                            >
                              {event.title}
                            </h3>
                            <p className="text-sm text-forest-600 dark:text-forest-400 mt-1">
                              {event.description}
                            </p>
                          </div>
                          {isCompleted && (
                            <span className="text-xs font-semibold text-success-600 bg-success-100 dark:bg-success-900/20 px-2 py-1 rounded">
                              ✓ {t("completed")}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 text-xs text-forest-600 dark:text-forest-400 space-y-1">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {event.timestamp}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-4">
                {t("orderItems")}
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {trackingData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 flex items-center gap-3 p-3 bg-forest-50 dark:bg-forest-900 rounded-lg border border-forest-200 dark:border-forest-700"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-forest-800 dark:text-forest-100">
                        {item.name}
                      </p>
                      <p className="text-forest-600 dark:text-forest-400">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Carrier Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-4">
                {t("carrierDetails")}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-forest-600 dark:text-forest-400 mb-1">
                    {t("carrier")}
                  </p>
                  <p className="font-semibold text-forest-800 dark:text-forest-100">
                    {trackingData.carrier}
                  </p>
                </div>
                <div className="pt-3 border-t border-forest-200 dark:border-forest-700">
                  <p className="text-sm text-forest-600 dark:text-forest-400 mb-1">
                    {t("trackingNumber")}
                  </p>
                  <p className="font-mono text-sm font-semibold text-forest-800 dark:text-forest-100 break-all">
                    {trackingData.trackingNumber}
                  </p>
                </div>
                <div className="pt-3 border-t border-forest-200 dark:border-forest-700">
                  <p className="text-sm text-forest-600 dark:text-forest-400 mb-2">
                    {t("contactCarrier")}
                  </p>
                  <Button size="sm" className="w-full flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    {trackingData.carrierPhone}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Delivery Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">
                    {t("deliveryInstructions")}
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                    {t("deliveryInstructionsText")}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="space-y-2">
              <Button className="w-full">{t("shareTracking")}</Button>
              <Button variant="outline" className="w-full">
                {t("needHelp")}
              </Button>
              <Button variant="outline" className="w-full">
                {t("reportIssue")}
              </Button>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-300 mb-3">
                <strong>{t("tip")}:</strong> {t("tipText")}
              </p>
              <Button size="sm" variant="outline" className="w-full text-xs">
                {t("viewFAQ")}
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
