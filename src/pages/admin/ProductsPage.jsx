import React from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, Package } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");

  const products = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      farmer: "Ravi Kumar",
      category: "vegetables",
      price: "₹45/kg",
      stock: 125,
      status: "active",
      sales: 342,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop",
    },
    {
      id: 2,
      name: "Organic Spinach",
      farmer: "Krishna Devi",
      category: "vegetables",
      price: "₹60/bunch",
      stock: 89,
      status: "active",
      sales: 218,
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop",
    },
    {
      id: 3,
      name: "Farm Fresh Eggs",
      farmer: "Rajesh Gupta",
      category: "dairy",
      price: "₹8/piece",
      stock: 50,
      status: "active",
      sales: 512,
      image: "https://media.istockphoto.com/id/2222296828/photo/fresh-brown-eggs-displayed-for-sale-at-a-local-poultry-market-in-bangladesh-poultry-eggs.webp?a=1&b=1&s=612x612&w=0&k=20&c=z-QPFaNn2nrEJQEpPhqV32c3Ev7-XmxY3l4MMZa3WwY=",
    },
    {
      id: 4,
      name: "Fresh Carrots",
      farmer: "Ravi Kumar",
      category: "vegetables",
      price: "₹35/kg",
      stock: 156,
      status: "active",
      sales: 287,
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop",
    },
    {
      id: 5,
      name: "Red Peppers",
      farmer: "Sunita Devi",
      category: "vegetables",
      price: "₹90/kg",
      stock: 78,
      status: "active",
      sales: 195,
      image: "https://media.istockphoto.com/id/137350104/photo/green-peppers.webp?a=1&b=1&s=612x612&w=0&k=20&c=7u2DZpZoSZIWkSDyvAbxkvNU09BrvPdQCPzM4LcsxvU=",
    },
    {
      id: 6,
      name: "Fresh Milk",
      farmer: "Rajesh Gupta",
      category: "dairy",
      price: "₹55/liter",
      stock: 42,
      status: "active",
      sales: 428,
      image: "https://images.unsplash.com/photo-1550583724-b2692b25a968?w=500&h=500&fit=crop",
    },
    {
      id: 7,
      name: "Broccoli",
      farmer: "Krishna Devi",
      category: "vegetables",
      price: "₹50/kg",
      stock: 0,
      status: "out_of_stock",
      sales: 156,
      image: "https://media.istockphoto.com/id/518951178/photo/fresh-raw-green-broccoli-in-bowl.webp?a=1&b=1&s=612x612&w=0&k=20&c=bKY-ggS9Dt0GjenJTH8p4dKAx8e8BG3CBrq4Ji36ccw=",
    },
    {
      id: 8,
      name: "Green Beans",
      farmer: "Sunita Devi",
      category: "vegetables",
      price: "₹40/kg",
      stock: 201,
      status: "active",
      sales: 389,
      image: "https://images.unsplash.com/photo-1574963835594-61eede2070dc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    },
    {
      id: 9,
      name: "Organic Potatoes",
      farmer: "Ravi Kumar",
      category: "vegetables",
      price: "₹120/kg",
      stock: 45,
      status: "inactive",
      sales: 98,
      image: "https://images.unsplash.com/photo-1686544303141-cc0bd819d400?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    },
    {
      id: 10,
      name: "Cucumber",
      farmer: "Rajesh Gupta",
      category: "vegetables",
      price: "₹35/kg",
      stock: 234,
      status: "active",
      sales: 567,
      image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    },
  ];

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || product.category === filterCategory;
      const matchesStatus = filterStatus === "all" || product.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, filterCategory, filterStatus]);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-blue-600" },
    { label: "Active Products", value: products.filter(p => p.status === "active").length, icon: Eye, color: "text-green-600" },
    { label: "Out of Stock", value: products.filter(p => p.status === "out_of_stock").length, icon: EyeOff, color: "text-red-600" },
    { label: "Total Sales", value: products.reduce((sum, p) => sum + p.sales, 0), icon: TrendingUp, color: "text-purple-600" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200";
      case "out_of_stock":
        return "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200";
      case "inactive":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200";
      default:
        return "bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-200";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      vegetables: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      fruits: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      dairy: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      grains: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return colors[category] || "bg-forest-100 text-forest-800";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-2">
            Product Management
          </h1>
          <p className="text-forest-600 dark:text-forest-400">
            Manage all products listed on Agrova
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
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
              placeholder="Search by product name or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-2 flex-wrap">
            <div>
              <label className="text-sm font-medium text-forest-700 dark:text-forest-300 block mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
              >
                <option value="all">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="dairy">Dairy</option>
                <option value="grains">Grains</option>
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
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-forest-50 dark:bg-forest-800 border-b border-forest-200 dark:border-forest-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Farmer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Sales</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-forest-700 dark:text-forest-300">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-forest-700 dark:text-forest-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-200 dark:divide-forest-700">
                {filteredProducts.map((product, idx) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        <span className="font-medium text-forest-900 dark:text-forest-100">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-forest-600 dark:text-forest-400">{product.farmer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-forest-900 dark:text-forest-100">{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock === 0 ? "text-error-600 dark:text-error-400" : "text-success-600 dark:text-success-400"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-forest-600 dark:text-forest-400">{product.sales}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(product.status)}`}>
                        {product.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-forest-600 dark:text-forest-400 hover:bg-forest-100 dark:hover:bg-forest-700 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
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
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 border border-forest-200 dark:border-forest-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className="font-medium text-forest-900 dark:text-forest-100">{product.name}</p>
                      <p className="text-xs text-forest-500 dark:text-forest-400">{product.farmer}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(product.category)}`}>{product.category}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(product.status)}`}>{product.status.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-forest-600 dark:text-forest-400">Stock: {product.stock}</span>
                    <span className="font-medium text-forest-900 dark:text-forest-100">{product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-forest-600 dark:text-forest-400">No products found matching your filters.</p>
          </div>
        )}
      </motion.div>

      {/* Results Summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-forest-600 dark:text-forest-400">
        Showing {filteredProducts.length} of {products.length} products
      </motion.div>
    </div>
  );
};

export default AdminProducts;
