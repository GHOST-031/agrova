import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";
import {
  Bell,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Clock,
  Trash2,
  Archive,
  Filter,
  Package,
  Truck,
  Heart,
  Star,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const mockNotifications = [
  {
    id: 1,
    type: "order",
    icon: ShoppingBag,
    title: "New Order Received",
    message: "Krishansh Verma ordered 5kg Fresh Tomatoes - ₹550",
    time: "2 minutes ago",
    unread: true,
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  },
  {
    id: 2,
    type: "payment",
    icon: TrendingUp,
    title: "Payment Received",
    message: "₹450 credited for order #AGR-102430",
    time: "15 minutes ago",
    unread: true,
    color: "bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400",
  },
  {
    id: 3,
    type: "chat",
    icon: MessageSquare,
    title: "New Customer Message",
    message: "Neha Gupta: Do you have organic certification?",
    time: "45 minutes ago",
    unread: true,
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
  },
  {
    id: 4,
    type: "alert",
    icon: AlertCircle,
    title: "Low Stock Alert",
    message: "Fresh Spinach stock is running low (5 units remaining)",
    time: "1 hour ago",
    unread: false,
    color: "bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400",
  },
  {
    id: 5,
    type: "order",
    icon: Truck,
    title: "Order Shipped",
    message: "Order #AGR-102425 has been dispatched to customer",
    time: "2 hours ago",
    unread: false,
    color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
  },
  {
    id: 6,
    type: "promotion",
    icon: TrendingUp,
    title: "Campaign Performance",
    message: "Your 'Fresh Today' promotion reached 500+ customers today",
    time: "3 hours ago",
    unread: false,
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
  },
  {
    id: 7,
    type: "chat",
    icon: Star,
    title: "Customer Review",
    message: "Priya Sharma left a 5-star review: 'Excellent quality produce!'",
    time: "4 hours ago",
    unread: false,
    color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
  },
  {
    id: 8,
    type: "alert",
    icon: CheckCircle,
    title: "Quality Check Reminder",
    message: "Don't forget: Daily quality check at 6 PM today",
    time: "Yesterday",
    unread: false,
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  },
  {
    id: 9,
    type: "order",
    icon: Package,
    title: "Bulk Order Alert",
    message: "New bulk order from Restaurant Chain - 50kg Vegetables",
    time: "Yesterday",
    unread: false,
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  },
  {
    id: 10,
    type: "payment",
    icon: TrendingUp,
    title: "Weekly Earnings",
    message: "Your weekly earnings: ₹8,500 | Total this month: ₹32,000",
    time: "2 days ago",
    unread: false,
    color: "bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400",
  },
  {
    id: 11,
    type: "chat",
    icon: Heart,
    title: "Customer Appreciation",
    message: "Rohan Kumar: Your vegetables are the best in our area!",
    time: "2 days ago",
    unread: false,
    color: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
  },
  {
    id: 12,
    type: "alert",
    icon: AlertCircle,
    title: "Weather Alert",
    message: "Heavy rain expected in your region. Secure your farm!",
    time: "3 days ago",
    unread: false,
    color: "bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400",
  },
];

const NotificationsPage = () => {
  const { t } = useTranslation();
  // Start with empty notifications - should be fetched from backend based on user
  const [notifications, setNotifications] = React.useState([]);

  const [filterType, setFilterType] = React.useState("all");
  const [showRead, setShowRead] = React.useState(true);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((notification) => {
    const typeMatch = filterType === "all" || notification.type === filterType;
    const readMatch = showRead || notification.unread;
    return typeMatch && readMatch;
  });

  const markAllRead = () => {
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const archiveNotification = (id) => {
    deleteNotification(id);
  };

  const stats = [
    {
      label: t("unread"),
      value: unreadCount,
      icon: Bell,
      color: "text-blue-600",
    },
    {
      label: t("today"),
      value: notifications.filter(
        (n) =>
          n.time.includes("minutes ago") ||
          n.time.includes("hours ago") ||
          n.time.includes("Today")
      ).length,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: t("orders"),
      value: notifications.filter((n) => n.type === "order").length,
      icon: ShoppingBag,
      color: "text-success-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-2 flex items-center gap-2">
              <Bell className="w-8 h-8 text-forest-600 dark:text-forest-300" />
              {t("notifications")}
            </h1>
            <p className="text-forest-600 dark:text-forest-400">
              {t("stayUpdatedWithOrdersPaymentsAndMessages")}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllRead} variant="outline" size="sm">
              {t("markAllAsRead")}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-forest-600 dark:text-forest-400 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-forest-800 dark:text-forest-100 mt-1">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-forest-600 dark:text-forest-400" />
          <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
            {t("filter")}:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "order", "payment", "chat", "alert"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === type
                  ? "bg-forest-600 text-white"
                  : "bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-forest-100 hover:bg-forest-200 dark:hover:bg-forest-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 ml-auto cursor-pointer">
          <input
            type="checkbox"
            checked={showRead}
            onChange={(e) => setShowRead(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-forest-700 dark:text-forest-300">
            {t("showRead")}
          </span>
        </label>
      </motion.div>

      {/* Notifications List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card
                  className={`p-4 flex items-start gap-3 ${
                    n.unread
                      ? "ring-2 ring-forest-400 dark:ring-forest-600 border-l-4 border-forest-600"
                      : ""
                  }`}
                  hover={false}
                  onClick={() => markAsRead(n.id)}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}
                  >
                    <n.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-forest-800 dark:text-forest-100 flex items-center gap-2">
                          {n.title}
                          {n.unread && (
                            <span className="w-2 h-2 bg-forest-600 rounded-full inline-block"></span>
                          )}
                        </h3>
                        <p className="text-sm text-forest-600 dark:text-forest-400 mt-1">
                          {n.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-forest-500 dark:text-forest-500">
                        {n.time}
                      </span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveNotification(n.id);
                          }}
                          className="p-1.5 text-forest-600 dark:text-forest-400 hover:bg-forest-100 dark:hover:bg-forest-800 rounded transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="p-1.5 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Bell className="w-12 h-12 text-forest-300 dark:text-forest-700 mx-auto mb-4" />
              <p className="text-forest-600 dark:text-forest-400 text-lg">
                {t("noNotificationsToShow")}
              </p>
              <p className="text-sm text-forest-500 dark:text-forest-500 mt-2">
                {filterType !== "all" || !showRead
                  ? t("tryAdjustingFilters")
                  : t("youreAllCaughtUp")}
              </p>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
