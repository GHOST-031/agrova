import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Edit, Trash2, Ban, CheckCircle, Users, Shield } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterRole, setFilterRole] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [selectedUser, setSelectedUser] = React.useState(null);

  const users = [
    {
      id: 1,
      name: "Ravi Kumar",
      email: "ravi.kumar@email.com",
      role: "farmer",
      status: "active",
      joinDate: "2025-01-15",
      products: 12,
      orders: 45,
      avatar: "https://ui-avatars.com/api/?name=Ravi+Kumar&background=4a9a4a&color=fff",
      earnings: "₹45,230",
    },
    {
      id: 2,
      name: "Sunita Devi",
      email: "sunita.devi@email.com",
      role: "farmer",
      status: "active",
      joinDate: "2025-02-20",
      products: 8,
      orders: 32,
      avatar: "https://ui-avatars.com/api/?name=Sunita+Devi&background=4a9a4a&color=fff",
      earnings: "₹32,150",
    },
    {
      id: 3,
      name: "John Consumer",
      email: "john.consumer@email.com",
      role: "consumer",
      status: "active",
      joinDate: "2025-03-10",
      products: 0,
      orders: 12,
      avatar: "https://ui-avatars.com/api/?name=John+Consumer&background=4a9a4a&color=fff",
      spent: "₹8,450",
    },
    {
      id: 4,
      name: "Amit Singh",
      email: "amit.singh@email.com",
      role: "farmer",
      status: "inactive",
      joinDate: "2024-12-05",
      products: 0,
      orders: 0,
      avatar: "https://ui-avatars.com/api/?name=Amit+Singh&background=4a9a4a&color=fff",
      earnings: "₹0",
    },
    {
      id: 5,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      role: "consumer",
      status: "active",
      joinDate: "2025-01-25",
      products: 0,
      orders: 25,
      avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=4a9a4a&color=fff",
      spent: "₹15,320",
    },
    {
      id: 6,
      name: "Rajesh Gupta",
      email: "rajesh.gupta@email.com",
      role: "farmer",
      status: "active",
      joinDate: "2025-02-01",
      products: 15,
      orders: 52,
      avatar: "https://ui-avatars.com/api/?name=Rajesh+Gupta&background=4a9a4a&color=fff",
      earnings: "₹58,900",
    },
    {
      id: 7,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "consumer",
      status: "banned",
      joinDate: "2024-11-15",
      products: 0,
      orders: 3,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=4a9a4a&color=fff",
      spent: "₹1,200",
    },
    {
      id: 8,
      name: "Krishna Devi",
      email: "krishna.devi@email.com",
      role: "farmer",
      status: "active",
      joinDate: "2025-01-08",
      products: 10,
      orders: 38,
      avatar: "https://ui-avatars.com/api/?name=Krishna+Devi&background=4a9a4a&color=fff",
      earnings: "₹42,100",
    },
    {
      id: 9,
      name: "Lakshmi Reddy",
      email: "lakshmi.reddy@email.com",
      role: "farmer",
      status: "active",
      joinDate: "2025-02-15",
      products: 14,
      orders: 48,
      avatar: "https://ui-avatars.com/api/?name=Lakshmi+Reddy&background=4a9a4a&color=fff",
      earnings: "₹51,420",
      geolocation: {
        postalCode: "639002",
        city: "L.N.Samudram",
        region3: "Karur",
        region4: "Karur",
        state: "Tamil Nadu",
        country: "India",
        latitude: "10.9629",
        longitude: "78.7715",
      },
    },
  ];

  // Filter users
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus = filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, filterRole, filterStatus]);

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600" },
    { label: "Active Farmers", value: users.filter(u => u.role === "farmer" && u.status === "active").length, icon: Shield, color: "text-green-600" },
    { label: "Active Consumers", value: users.filter(u => u.role === "consumer" && u.status === "active").length, icon: Users, color: "text-purple-600" },
    { label: "Banned Users", value: users.filter(u => u.status === "banned").length, icon: Ban, color: "text-red-600" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200";
      case "inactive":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200";
      case "banned":
        return "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200";
      default:
        return "bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-200";
    }
  };

  const getRoleColor = (role) => {
    return role === "farmer"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-2">
          User Management
        </h1>
        <p className="text-forest-600 dark:text-forest-400">
          Manage and monitor all users on the platform
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <div>
              <label className="text-sm font-medium text-forest-700 dark:text-forest-300 block mb-1">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="consumer">Consumers</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-forest-700 dark:text-forest-300 block mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-forest-50 dark:bg-forest-800 border-b border-forest-200 dark:border-forest-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Activity</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-forest-700 dark:text-forest-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-200 dark:divide-forest-700">
                {filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium text-forest-900 dark:text-forest-100">{user.name}</p>
                          <p className="text-sm text-forest-500 dark:text-forest-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.geolocation ? (
                        <div className="text-forest-900 dark:text-forest-100">
                          <p className="font-medium">{user.geolocation.city}</p>
                          <p className="text-forest-600 dark:text-forest-400 text-xs">
                            {user.geolocation.state} {user.geolocation.postalCode}
                          </p>
                          <p className="text-forest-500 dark:text-forest-500 text-xs">
                            Lat: {user.geolocation.latitude} | Lng: {user.geolocation.longitude}
                          </p>
                        </div>
                      ) : (
                        <span className="text-forest-500 dark:text-forest-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-forest-600 dark:text-forest-400">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.role === "farmer" ? (
                        <div className="text-forest-900 dark:text-forest-100">
                          <p className="font-medium">{user.products} products</p>
                          <p className="text-forest-500 dark:text-forest-400 text-xs">{user.orders} orders</p>
                        </div>
                      ) : (
                        <div className="text-forest-900 dark:text-forest-100">
                          <p className="font-medium">{user.orders} orders</p>
                          <p className="text-forest-500 dark:text-forest-400 text-xs">Spent: {user.spent}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-forest-600 dark:text-forest-400 hover:bg-forest-100 dark:hover:bg-forest-700 rounded transition-colors"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {filteredUsers.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 border border-forest-200 dark:border-forest-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-forest-900 dark:text-forest-100">{user.name}</p>
                      <p className="text-xs text-forest-500 dark:text-forest-400">{user.email}</p>
                    </div>
                  </div>
                  <MoreVertical className="w-5 h-5 text-forest-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleColor(user.role)}`}>{user.role}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(user.status)}`}>{user.status}</span>
                  </div>
                  <p className="text-xs text-forest-600 dark:text-forest-400">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-forest-600 dark:text-forest-400">No users found matching your filters.</p>
          </div>
        )}
      </motion.div>

      {/* Results Summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-forest-600 dark:text-forest-400">
        Showing {filteredUsers.length} of {users.length} users
      </motion.div>
    </div>
  );
};

export default AdminUsers;
