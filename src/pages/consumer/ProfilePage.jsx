import React from "react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useOrders } from "../../contexts/OrderContext";
import { useLocation } from "../../contexts/LocationContext";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShoppingBag,
  Edit2,
  Save,
  X,
  Calendar,
  Star,
  Award,
  Clock,
  Download,
  Plus,
  Trash2,
  Home,
} from "lucide-react";

const ConsumerProfilePage = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { addresses } = useLocation();
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  
  // Initialize profile data from authenticated user
  const [profileData, setProfileData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    location: user?.location?.city || "",
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "",
    bio: user?.bio || "Passionate about fresh, local produce from trusted farmers.",
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=200&background=4a9a4a&color=fff`,
  });

  const [tempData, setTempData] = React.useState(profileData);

  // Update profile data when user changes
  React.useEffect(() => {
    if (user) {
      const newProfileData = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        location: user.location?.city || "",
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "",
        bio: user.bio || "Passionate about fresh, local produce from trusted farmers.",
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&size=200&background=4a9a4a&color=fff`,
      };
      setProfileData(newProfileData);
      setTempData(newProfileData);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update user profile via API
      const updateData = {
        name: tempData.name,
        phoneNumber: tempData.phone,
        bio: tempData.bio,
      };
      
      await api.updateProfile(updateData);
      
      setProfileData(tempData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Calculate stats from real data
  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + (order.pricing?.total || 0), 0) || 0;
  const deliveredOrders = orders?.filter(o => o.status === 'delivered')?.length || 0;

  const stats = [
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, color: "text-blue-600" },
    { label: "Amount Spent", value: `₹${totalSpent.toLocaleString()}`, icon: Award, color: "text-success-600" },
    { label: "Delivered Orders", value: deliveredOrders.toString(), icon: ShoppingBag, color: "text-green-600" },
    { label: "Saved Addresses", value: addresses?.length?.toString() || "0", icon: MapPin, color: "text-purple-600" },
  ];

  // Get recent orders (last 5)
  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-1">
          <Card className="p-6 text-center">
            <img
              src={profileData.image}
              alt={profileData.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-forest-200 dark:border-forest-700"
            />
            <h1 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-2">
              {profileData.name}
            </h1>
            <p className="text-forest-600 dark:text-forest-400 text-sm mb-2">Member since {profileData.joinDate}</p>
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-success-100 dark:bg-success-900/20 rounded-lg">
              <Heart className="w-5 h-5 text-success-600" />
              <span className="text-sm font-semibold text-success-800 dark:text-success-200">Loyal Customer</span>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} icon={Edit2} variant="outline" className="w-full">
                Edit Profile
              </Button>
            )}
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </h2>
            {!isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">Email</p>
                    <p className="font-medium text-forest-800 dark:text-forest-100">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">Phone</p>
                    <p className="font-medium text-forest-800 dark:text-forest-100">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">Location</p>
                    <p className="font-medium text-forest-800 dark:text-forest-100">{profileData.location}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">Email</label>
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">Phone</label>
                  <input
                    type="tel"
                    value={tempData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">Location</label>
                  <input
                    type="text"
                    value={tempData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Bio */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              About You
            </h2>
            {!isEditing ? (
              <p className="text-forest-700 dark:text-forest-300">{profileData.bio}</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">Bio</label>
                  <textarea
                    value={tempData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows="3"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} icon={Save} className="flex-1" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" icon={X} className="flex-1" disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-4">Your Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-forest-800 dark:text-forest-100 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Saved Addresses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 flex items-center gap-2">
            <Home className="w-6 h-6" />
            Saved Addresses
          </h2>
          <Button variant="outline" size="sm" icon={Plus} onClick={() => window.location.href = '/consumer/addresses'}>
            Manage Addresses
          </Button>
        </div>
        {addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.slice(0, 4).map((addr, idx) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
              >
                <Card className={`p-4 ${addr.isDefault ? "border-2 border-forest-600" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-forest-800 dark:text-forest-100">{addr.name || addr.addressType}</h3>
                      {addr.isDefault && (
                        <span className="text-xs bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-forest-200 px-2 py-1 rounded mt-1 inline-block">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-forest-700 dark:text-forest-300 mb-2">
                    {addr.street}, {addr.city}, {addr.state} {addr.pincode}
                  </p>
                  <p className="text-xs text-forest-600 dark:text-forest-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {addr.phone}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto text-forest-400 dark:text-forest-600 mb-3" />
            <p className="text-forest-600 dark:text-forest-400 mb-4">No saved addresses yet</p>
            <Button variant="outline" icon={Plus} onClick={() => window.location.href = '/consumer/addresses'}>
              Add Your First Address
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Order History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Recent Orders
          </h2>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/consumer/orders'}>
            View All Orders
          </Button>
        </div>
        {recentOrders.length > 0 ? (
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-forest-200 dark:divide-forest-700">
              {recentOrders.map((order, idx) => (
                <motion.div
                  key={order._id || order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + idx * 0.05 }}
                  className="p-4 flex items-center justify-between hover:bg-forest-50 dark:hover:bg-forest-800/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-forest-600" />
                      </div>
                      <div>
                        <p className="font-medium text-forest-800 dark:text-forest-100">{order.orderId}</p>
                        <p className="text-sm text-forest-600 dark:text-forest-400">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-forest-800 dark:text-forest-100">₹{order.pricing?.total || 0}</p>
                    <span className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                      order.status === 'delivered' ? 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-200' :
                      order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                      order.status === 'cancelled' ? 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-200' :
                      'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-forest-400 dark:text-forest-600 mb-3" />
            <p className="text-forest-600 dark:text-forest-400 mb-4">No orders yet</p>
            <Button variant="outline" onClick={() => window.location.href = '/products'}>
              Start Shopping
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ConsumerProfilePage;
