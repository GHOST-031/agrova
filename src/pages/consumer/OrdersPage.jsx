import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card, { OrderCard } from "../../components/ui/Card";
import { useTranslation } from "../../hooks/useTranslation";
import { useOrders } from "../../contexts/OrderContext";
import { Package } from "lucide-react";

const OrdersPage = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleViewDetails = (order) => {
    navigate(`/consumer/orders/${order.id}/details`);
  };

  const handleTrackOrder = (order) => {
    navigate(`/consumer/orders/${order.id}/track`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100">
          {t("myOrders")}
        </h1>
        <p className="text-forest-600 dark:text-forest-400">
          {t("trackManageOrders")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order, index) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <OrderCard
              order={order}
              onViewDetails={handleViewDetails}
              onTrackOrder={handleTrackOrder}
            />
          </motion.div>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-forest-300 dark:text-forest-700 mb-4" />
          <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-2">
            No Orders Yet
          </h3>
          <p className="text-forest-600 dark:text-forest-400 mb-4">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-forest-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse Products
          </button>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;
