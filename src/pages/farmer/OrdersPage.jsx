import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Check, Truck, Clock, XCircle, Package } from "lucide-react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

const badge = (status) => {
  switch (status) {
    case "pending":
      return "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200";
    case "confirmed":
      return "bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-200";
    case "shipped":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "cancelled":
      return "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const FarmerOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getFarmerOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching farmer orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);
      await api.updateOrderStatus(orderId, status);
      toast.success(`Order ${status}`);
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getCustomerAddress = (order) => {
    const addr = order.deliveryAddress;
    if (!addr) return 'N/A';
    return `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''}`.trim();
  };

  const getOrderTotal = (order) => {
    return order.pricing?.total || order.total || 0;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-lg text-forest-600 dark:text-forest-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-forest-800 dark:text-forest-100">
        {t("orderManagement")}
      </motion.h1>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-forest-300 dark:text-forest-700 mb-4" />
          <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-2">
            No Orders Yet
          </h3>
          <p className="text-forest-600 dark:text-forest-400">
            You haven't received any orders yet. Orders for your products will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((o) => (
            <Card key={o._id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-forest-800 dark:text-forest-100">{o.orderId}</div>
                  <div className="text-sm text-forest-600 dark:text-forest-400">
                    {o.user?.name || 'Customer'} • {getCustomerAddress(o)}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge(o.status)}`}>
                  {o.status.replace(/_/g, ' ').charAt(0).toUpperCase() + o.status.replace(/_/g, ' ').slice(1)}
                </span>
              </div>

              <div className="mt-3 text-forest-700 dark:text-forest-300 text-sm">
                {o.items.map((it, idx) => (
                  <span key={idx} className="mr-3">
                    {it.name} ({it.quantity} {it.product?.unit || 'unit'})
                  </span>
                ))}
              </div>
              <div className="mt-1 font-semibold text-forest-800 dark:text-forest-100">
                {t("total")}: ₹{getOrderTotal(o)}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {o.status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    icon={Check}
                    onClick={() => handleUpdateStatus(o._id, 'confirmed')}
                    disabled={updatingOrder === o._id}
                  >
                    {t("confirm")}
                  </Button>
                )}
                {o.status === 'confirmed' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    icon={Truck}
                    onClick={() => handleUpdateStatus(o._id, 'shipped')}
                    disabled={updatingOrder === o._id}
                  >
                    {t("markShipped")}
                  </Button>
                )}
                {['pending', 'confirmed'].includes(o.status) && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-error-600 border-error-400" 
                    icon={XCircle}
                    onClick={() => handleUpdateStatus(o._id, 'cancelled')}
                    disabled={updatingOrder === o._id}
                  >
                    {t("cancel")}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
