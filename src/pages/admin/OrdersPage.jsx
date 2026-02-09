import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Truck, Package, DollarSign, MapPin, Calendar, MessageSquare } from "lucide-react";
import Card from "../../components/ui/Card";

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const orders = [
    {
      id: "ORD-001",
      customer: "John Consumer",
      products: ["Fresh Tomatoes (2kg)", "Organic Spinach (1 bunch)"],
      total: "₹245",
      status: "delivered",
      date: "2025-03-15",
      location: "Delhi, IN",
      items: 2,
      farmer: "Ravi Kumar",
    },
    {
      id: "ORD-002",
      customer: "Priya Sharma",
      products: ["Farm Fresh Eggs (30 pieces)", "Fresh Milk (2L)"],
      total: "₹540",
      status: "in_transit",
      date: "2025-03-18",
      location: "Mumbai, IN",
      items: 2,
      farmer: "Rajesh Gupta",
    },
    {
      id: "ORD-003",
      customer: "Sarah Johnson",
      products: ["Red Apples (3kg)", "Fresh Banana (2 bunch)"],
      total: "₹380",
      status: "processing",
      date: "2025-03-19",
      location: "Bangalore, IN",
      items: 2,
      farmer: "Sunita Devi",
    },
    {
      id: "ORD-004",
      customer: "Raj Patel",
      products: ["Fresh Carrots (5kg)", "Broccoli (2kg)"],
      total: "₹310",
      status: "pending",
      date: "2025-03-20",
      location: "Pune, IN",
      items: 2,
      farmer: "Krishna Devi",
    },
    {
      id: "ORD-005",
      customer: "Neha Singh",
      products: ["Wheat Flour (10kg)", "Brown Rice (5kg)"],
      total: "₹625",
      status: "delivered",
      date: "2025-03-14",
      location: "Hyderabad, IN",
      items: 2,
      farmer: "Rajesh Gupta",
    },
    {
      id: "ORD-006",
      customer: "Amit Verma",
      products: ["Strawberries (2 boxes)", "Lemons (2kg)"],
      total: "₹450",
      status: "in_transit",
      date: "2025-03-17",
      location: "Chennai, IN",
      items: 2,
      farmer: "Ravi Kumar",
    },
    {
      id: "ORD-007",
      customer: "Maya Desai",
      products: ["Farm Fresh Eggs (30 pieces)"],
      total: "₹240",
      status: "processing",
      date: "2025-03-19",
      location: "Ahmedabad, IN",
      items: 1,
      farmer: "Rajesh Gupta",
    },
    {
      id: "ORD-008",
      customer: "Vikram Patel",
      products: ["Fresh Tomatoes (3kg)", "Organic Spinach (2 bunch)", "Fresh Milk (1L)"],
      total: "₹425",
      status: "pending",
      date: "2025-03-20",
      location: "Jaipur, IN",
      items: 3,
      farmer: "Ravi Kumar",
    },
  ];

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package, color: "text-blue-600" },
    { label: "Pending", value: orders.filter(o => o.status === "pending").length, icon: Calendar, color: "text-yellow-600" },
    { label: "In Transit", value: orders.filter(o => o.status === "in_transit").length, icon: Truck, color: "text-orange-600" },
    { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, icon: Package, color: "text-green-600" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200";
      case "in_transit":
        return "bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-200";
      case "processing":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200";
      case "pending":
        return "bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-200";
      case "cancelled":
        return "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200";
      default:
        return "bg-forest-100 text-forest-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Calendar className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "in_transit":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const totalRevenue = orders.reduce((sum, order) => {
    const amount = parseInt(order.total.replace("₹", "").replace(",", ""));
    return sum + amount;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-2">
          Order Management
        </h1>
        <p className="text-forest-600 dark:text-forest-400">
          Track and manage all customer orders
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className="text-forest-600 dark:text-forest-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-forest-800 dark:text-forest-100 mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 bg-gradient-to-r from-forest-50 to-forest-100 dark:from-forest-900 dark:to-forest-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-forest-600 dark:text-forest-400 text-sm font-medium">Total Revenue</p>
              <p className="text-4xl font-bold text-forest-800 dark:text-forest-100 mt-2">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-16 h-16 text-success-600 opacity-10" />
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-forest-700 dark:text-forest-300 block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-forest-50 dark:bg-forest-800 border-b border-forest-200 dark:border-forest-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-forest-700 dark:text-forest-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-200 dark:divide-forest-700">
                {filteredOrders.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-forest-900 dark:text-forest-100">{order.id}</td>
                    <td className="px-6 py-4 text-forest-900 dark:text-forest-100">{order.customer}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1 text-forest-600 dark:text-forest-400">
                        <MapPin className="w-4 h-4" />
                        {order.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-forest-600 dark:text-forest-400">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-forest-900 dark:text-forest-100">{order.items}</td>
                    <td className="px-6 py-4 font-bold text-forest-900 dark:text-forest-100">{order.total}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-forest-600 dark:text-forest-400 hover:bg-forest-100 dark:hover:bg-forest-700 rounded transition-colors mx-auto"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 border border-forest-200 dark:border-forest-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-forest-900 dark:text-forest-100">{order.id}</p>
                    <p className="text-sm text-forest-600 dark:text-forest-400">{order.customer}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-forest-600 dark:text-forest-400">Location:</span>
                    <span className="text-forest-900 dark:text-forest-100">{order.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-600 dark:text-forest-400">Total:</span>
                    <span className="font-bold text-forest-900 dark:text-forest-100">{order.total}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-forest-600 dark:text-forest-400">No orders found matching your filters.</p>
          </div>
        )}
      </motion.div>

      {/* Results Summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-forest-600 dark:text-forest-400">
        Showing {filteredOrders.length} of {orders.length} orders
      </motion.div>
    </div>
  );
};

export default AdminOrders;
