import React from "react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import { Package, CheckCircle2, MessageSquare, Bell, Trash2, Archive, Filter, Clock, Truck, AlertCircle, Heart, TrendingUp } from "lucide-react";
import Button from "../../components/ui/Button";

const mockNotifications = [
  {
    id: "n1",
    type: "order",
    icon: Truck,
    title: "Order Shipped",
    message: "Your order AGR-102394 is on the way! Estimated delivery: Today by 5 PM",
    time: "2 minutes ago",
    unread: true,
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  },
  {
    id: "n2",
    type: "chat",
    icon: MessageSquare,
    title: "New message from Ravi Kumar",
    message: "Your tomatoes will be delivered by 5 PM. Fresh batch just picked!",
    time: "15 minutes ago",
    unread: true,
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
  },
  {
    id: "n3",
    type: "alert",
    icon: AlertCircle,
    title: "Price Drop Alert",
    message: "Fresh Spinach price reduced to ₹55/kg (was ₹65)",
    time: "45 minutes ago",
    unread: true,
    color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
  },
  {
    id: "n4",
    type: "order",
    icon: CheckCircle2,
    title: "Order Delivered",
    message: "Your order AGR-102380 was delivered successfully. Thanks for shopping!",
    time: "2 hours ago",
    unread: false,
    color: "bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400",
  },
  {
    id: "n5",
    type: "wishlist",
    icon: Heart,
    title: "Wishlist Item Back in Stock",
    message: "Organic Apples from Sunita Devi are now available",
    time: "3 hours ago",
    unread: false,
    color: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
  },
  {
    id: "n6",
    type: "promotion",
    icon: TrendingUp,
    title: "Special Offer",
    message: "Get 20% off on all vegetables today! Use code FRESH20",
    time: "4 hours ago",
    unread: false,
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
  },
  {
    id: "n7",
    type: "chat",
    icon: MessageSquare,
    title: "Review Reply from Farmer",
    message: "Rajesh Gupta replied to your review: Thank you for the 5 stars!",
    time: "5 hours ago",
    unread: false,
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
  },
  {
    id: "n8",
    type: "order",
    icon: Package,
    title: "Order Confirmed",
    message: "Order AGR-102393 confirmed. Your farmer is preparing the items.",
    time: "1 day ago",
    unread: false,
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  },
  {
    id: "n9",
    type: "alert",
    icon: AlertCircle,
    title: "Limited Time Offer",
    message: "Farm Fresh Eggs at ₹7/piece for next 24 hours only",
    time: "1 day ago",
    unread: false,
    color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
  },
  {
    id: "n10",
    type: "general",
    icon: Bell,
    title: "Welcome to Agrova!",
    message: "Enjoy 10% off on your first order. Start shopping now!",
    time: "2 days ago",
    unread: false,
    color: "bg-forest-100 dark:bg-forest-900 text-forest-600 dark:text-forest-400",
  },
  {
    id: "n11",
    type: "chat",
    icon: MessageSquare,
    title: "Farmer Response",
    message: "Sunita Devi: Yes, I can pack spinach without stems for you",
    time: "2 days ago",
    unread: false,
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
  },
  {
    id: "n12",
    type: "promotion",
    icon: TrendingUp,
    title: "Referral Bonus Available",
    message: "Invite a friend and get ₹100 credit on your account",
    time: "3 days ago",
    unread: false,
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
  },
];

const NotificationsPage = () => {
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
      label: "Unread",
      value: unreadCount,
      icon: Bell,
      color: "text-blue-600",
    },
    {
      label: "Today",
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
      label: "All",
      value: notifications.length,
      icon: Package,
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
              Notifications
            </h1>
            <p className="text-forest-600 dark:text-forest-400">
              Stay updated with your orders and messages
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllRead} variant="outline" size="sm">
              Mark all as read
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
            Filter:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "order", "chat", "alert", "promotion"].map((type) => (
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
            Show read
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
                No notifications to show
              </p>
              <p className="text-sm text-forest-500 dark:text-forest-500 mt-2">
                {filterType !== "all" || !showRead
                  ? "Try adjusting your filters"
                  : "You're all caught up!"}
              </p>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;


