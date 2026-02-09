import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  // Mock data
  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Farmers",
      value: "1,247",
      change: "+8%",
      changeType: "positive",
      icon: Package,
      color: "bg-forest-500",
    },
    {
      title: "Total Orders",
      value: "8,932",
      change: "+15%",
      changeType: "positive",
      icon: ShoppingCart,
      color: "bg-warning-500",
    },
    {
      title: "Revenue",
      value: "₹2,34,567",
      change: "+23%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-success-500",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Rahul Sharma",
      farmer: "Ravi Kumar",
      amount: "₹450",
      status: "delivered",
      date: "2 hours ago",
    },
    {
      id: "#ORD-002",
      customer: "Priya Singh",
      farmer: "Sunita Devi",
      amount: "₹320",
      status: "shipping",
      date: "4 hours ago",
    },
    {
      id: "#ORD-003",
      customer: "Amit Patel",
      farmer: "Krishna Kumar",
      amount: "₹680",
      status: "confirmed",
      date: "6 hours ago",
    },
    {
      id: "#ORD-004",
      customer: "Deepika Rao",
      farmer: "Lakshmi Devi",
      amount: "₹290",
      status: "pending",
      date: "8 hours ago",
    },
  ];

  const topFarmers = [
    {
      name: "Ravi Kumar",
      location: "Punjab",
      sales: "₹45,230",
      products: 25,
      rating: 4.9,
      avatar:
        "https://ui-avatars.com/api/?name=Ravi+Kumar&background=4a9a4a&color=fff",
    },
    {
      name: "Sunita Devi",
      location: "Haryana",
      sales: "₹38,920",
      products: 18,
      rating: 4.8,
      avatar:
        "https://ui-avatars.com/api/?name=Sunita+Devi&background=4a9a4a&color=fff",
    },
    {
      name: "Krishna Kumar",
      location: "UP",
      sales: "₹34,567",
      products: 22,
      rating: 4.7,
      avatar:
        "https://ui-avatars.com/api/?name=Krishna+Kumar&background=4a9a4a&color=fff",
    },
  ];

  // Chart data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [65000, 75000, 85000, 95000, 105000, 125000],
        borderColor: "#4a9a4a",
        backgroundColor: "rgba(74, 154, 74, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const ordersData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [120, 190, 300, 500, 200, 300, 450],
        backgroundColor: "#4a9a4a",
        borderRadius: 8,
      },
    ],
  };

  const categoryData = {
    labels: ["Vegetables", "Fruits", "Dairy", "Grains"],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ["#4a9a4a", "#bb9363", "#22c55e", "#f59e0b"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200";
      case "shipping":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "confirmed":
        return "bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-200";
      case "pending":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-forest-600 dark:text-forest-400">
          Overview of Agrova marketplace performance
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-forest-600 dark:text-forest-400 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-forest-800 dark:text-forest-100 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-success-600"
                          : "text-error-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-forest-500 dark:text-forest-400 text-sm ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100">
                  Sales Overview
                </h3>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              <div className="h-64">
                <Line data={salesData} options={chartOptions} />
              </div>
            </Card>
          </motion.div>

          {/* Orders and Category Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-6">
                  Weekly Orders
                </h3>
                <div className="h-48">
                  <Bar data={ordersData} options={chartOptions} />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-6">
                  Product Categories
                </h3>
                <div className="h-48">
                  <Doughnut
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100">
                  Recent Orders
                </h3>
                <Button variant="ghost" size="sm" icon={Eye}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-forest-800 dark:text-forest-100">
                          {order.id}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-forest-600 dark:text-forest-400 mt-1">
                        {order.customer} → {order.farmer}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-forest-800 dark:text-forest-100">
                          {order.amount}
                        </span>
                        <span className="text-xs text-forest-500 dark:text-forest-400">
                          {order.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Top Farmers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-forest-800 dark:text-forest-100">
                  Top Farmers
                </h3>
                <Button variant="ghost" size="sm" icon={TrendingUp}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {topFarmers.map((farmer, index) => (
                  <div
                    key={farmer.name}
                    className="flex items-center space-x-3"
                  >
                    <img
                      src={farmer.avatar}
                      alt={farmer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-forest-800 dark:text-forest-100">
                          {farmer.name}
                        </p>
                        <span className="text-sm font-semibold text-forest-800 dark:text-forest-100">
                          {farmer.sales}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-forest-600 dark:text-forest-400">
                          {farmer.location} • {farmer.products} products
                        </span>
                        <span className="text-xs text-warning-500">
                          ★ {farmer.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
