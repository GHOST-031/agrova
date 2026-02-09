import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  Edit2,
  Save,
  X,
  Calendar,
  Users,
  Package,
  TrendingUp,
  Shield,
  AlertCircle,
  Download,
} from "lucide-react";

const FarmerProfilePage = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: "Lakshmi Reddy",
    email: "lakshmi.reddy@agrova.com",
    phone: "+91 98765 43210",
    farmName: "Lakshmi Reddy's Farm",
    location: "L.N.Samudram, Karur District, Tamil Nadu",
    postalCode: "639002",
    bio: "Dedicated farmer growing organic vegetables for the last 15 years. Passionate about sustainable farming practices.",
    image: "https://ui-avatars.com/api/?name=Lakshmi+Reddy&size=200&background=4a9a4a&color=fff",
  });

  const [tempData, setTempData] = React.useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const stats = [
    { label: t("totalSales"), value: "₹2,45,300", icon: TrendingUp, color: "text-success-600" },
    { label: t("activeProducts"), value: "12", icon: Package, color: "text-blue-600" },
    { label: t("rating"), value: "4.8★", icon: Star, color: "text-yellow-600" },
    { label: t("customers"), value: "342", icon: Users, color: "text-purple-600" },
  ];

  const certifications = [
    { name: "Organic Certification", issuer: "IFOAM", date: "2022-2025", status: "Active" },
    { name: "Fair Trade Certified", issuer: "Fair Trade USA", date: "2021-2024", status: "Active" },
    { name: "ISO 9001:2015", issuer: "Bureau Veritas", date: "2023-2026", status: "Active" },
  ];

  const recentActivity = [
    { type: "order", description: "Received order for 5kg Organic Tomatoes", time: "2 hours ago", status: "completed" },
    { type: "review", description: "New 5-star review from customer Priya Sharma", time: "4 hours ago", status: "completed" },
    { type: "payment", description: "Payment received ₹450 for order #AGR-102430", time: "6 hours ago", status: "completed" },
    { type: "product", description: "Added new product: Fresh Broccoli", time: "1 day ago", status: "completed" },
    { type: "message", description: "New customer inquiry from Neha Gupta", time: "2 days ago", status: "completed" },
  ];

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
            <p className="text-forest-600 dark:text-forest-400 text-sm mb-4">{profileData.farmName}</p>
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Rating: 4.8/5.0</span>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} icon={Edit2} variant="outline" className="w-full">
                {t("editProfile")}
              </Button>
            )}
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              {t("contactInformation")}
            </h2>
            {!isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">{t("emailAddress")}</p>
                    <p className="font-medium text-forest-800 dark:text-forest-100">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">{t("phone")}</p>
                    <p className="font-medium text-forest-800 dark:text-forest-100">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <p className="text-sm text-forest-600 dark:text-forest-400">{t("location")}</p>
                    <p className="font-medium text-forest-800 dark:text-forest-100">{profileData.location}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">{t("emailAddress")}</label>
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">{t("phone")}</label>
                  <input
                    type="tel"
                    value={tempData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">{t("location")}</label>
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

          {/* Bio & Farm Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-forest-800 dark:text-forest-100 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              {t("farmInformation")}
            </h2>
            {!isEditing ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-forest-600 dark:text-forest-400">{t("farmName")}</p>
                  <p className="font-medium text-forest-800 dark:text-forest-100">{profileData.farmName}</p>
                </div>
                <div>
                  <p className="text-sm text-forest-600 dark:text-forest-400">{t("postalCode")}</p>
                  <p className="font-medium text-forest-800 dark:text-forest-100">{profileData.postalCode}</p>
                </div>
                <div>
                  <p className="text-sm text-forest-600 dark:text-forest-400 mb-2">{t("about")}</p>
                  <p className="text-forest-700 dark:text-forest-300">{profileData.bio}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">{t("farmName")}</label>
                  <input
                    type="text"
                    value={tempData.farmName}
                    onChange={(e) => handleInputChange("farmName", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">{t("postalCode")}</label>
                  <input
                    type="text"
                    value={tempData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">{t("about")}</label>
                  <textarea
                    value={tempData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows="3"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} icon={Save} className="flex-1">
                    {t("save")}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" icon={X} className="flex-1">
                    {t("cancel")}
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
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-4">{t("yourStatistics")}</h2>
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

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            {t("certifications")}
          </h2>
          <Button variant="outline" size="sm" icon={Download}>
            {t("downloadAll")}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
            >
              <Card className="p-4 border-l-4 border-success-600">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-forest-800 dark:text-forest-100">{cert.name}</h3>
                    <p className="text-sm text-forest-600 dark:text-forest-400">{cert.issuer}</p>
                  </div>
                  <span className="px-2 py-1 bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-200 text-xs font-medium rounded">
                    {t(cert.status.toLowerCase())}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-forest-600 dark:text-forest-400">
                  <Calendar className="w-3 h-3" />
                  Valid until: {cert.date.split("-")[1]}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-4">{t("recentActivity")}</h2>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-forest-200 dark:divide-forest-700">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="p-4 flex items-start gap-4 hover:bg-forest-50 dark:hover:bg-forest-800/50 transition-colors"
              >
                <div className="w-2 h-2 bg-success-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-forest-800 dark:text-forest-100">{activity.description}</p>
                  <p className="text-xs text-forest-500 dark:text-forest-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FarmerProfilePage;
