import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft, Save, X, Image as ImageIcon } from "lucide-react";

const EditProductPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { productId } = useParams();

  // Mock initial product (in real app, would fetch from database)
  const initialProduct = {
    id: productId,
    name: "Organic Tomatoes",
    price: 45,
    unit: "kg",
    stock: 25,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop",
    isOrganic: true,
    isFreshToday: true,
    description: "Fresh, organic tomatoes grown without pesticides. Perfect for salads and cooking.",
    farmLocation: "L.N.Samudram, Karur District, Tamil Nadu",
  };

  const [form, setForm] = React.useState(initialProduct);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/farmer/products");
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/farmer/products");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-forest-100 dark:hover:bg-forest-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-forest-700 dark:text-forest-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100">
            {t("editProduct") || "Edit Product"}
          </h1>
          <p className="text-forest-600 dark:text-forest-400 mt-1">
            {form.name}
          </p>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 bg-success-100 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg"
        >
          <p className="text-success-800 dark:text-success-200 font-medium">
            {t("productUpdated") || "✓ Product updated successfully!"}
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-6">
              {t("basicInformation") || "Basic Information"}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">
                    {t("productName") || "Product Name"}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">
                    {t("price") || "Price"}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-forest-700 dark:text-forest-300">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleInputChange("price", Number(e.target.value))}
                      className="flex-1 px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">
                    {t("unit") || "Unit"}
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  >
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="dozen">dozen</option>
                    <option value="piece">piece</option>
                    <option value="bundle">bundle</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300">
                    {t("stock") || "Stock"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => handleInputChange("stock", Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-forest-700 dark:text-forest-300">
                  {t("description") || "Description"}
                </label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Describe your product..."
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-6">
              {t("productImage") || "Product Image"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-forest-300 dark:border-forest-600">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt={form.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-forest-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-forest-700 dark:text-forest-300 block mb-2">
                    {t("imageUrl") || "Image URL"}
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-forest-500 dark:text-forest-400 mt-2">
                    {t("pasteImageUrl") || "Paste a valid image URL"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Badges & Attributes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-6">
              {t("attributes") || "Attributes"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-forest-50 dark:bg-forest-800/50 border border-forest-200 dark:border-forest-700">
                <input
                  type="checkbox"
                  id="isOrganic"
                  checked={form.isOrganic}
                  onChange={() => handleCheckboxChange("isOrganic")}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="isOrganic" className="flex-1 cursor-pointer">
                  <p className="font-medium text-forest-800 dark:text-forest-100">
                    {t("organic") || "Organic"}
                  </p>
                  <p className="text-sm text-forest-600 dark:text-forest-400">
                    {t("organicDescription") || "Mark this product as organic/pesticide-free"}
                  </p>
                </label>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-forest-50 dark:bg-forest-800/50 border border-forest-200 dark:border-forest-700">
                <input
                  type="checkbox"
                  id="isFreshToday"
                  checked={form.isFreshToday}
                  onChange={() => handleCheckboxChange("isFreshToday")}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="isFreshToday" className="flex-1 cursor-pointer">
                  <p className="font-medium text-forest-800 dark:text-forest-100">
                    {t("freshToday") || "Fresh Today"}
                  </p>
                  <p className="text-sm text-forest-600 dark:text-forest-400">
                    {t("freshTodayDescription") || "Mark as picked/harvested today"}
                  </p>
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-6">
              {t("location") || "Farm Location"}
            </h2>
            <div className="space-y-1">
              <label className="text-sm font-medium text-forest-700 dark:text-forest-300">
                {t("farmLocation") || "Farm Location"}
              </label>
              <input
                type="text"
                value={form.farmLocation || ""}
                onChange={(e) => handleInputChange("farmLocation", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-forest-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-900 dark:text-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
                placeholder="e.g., L.N.Samudram, Karur District, Tamil Nadu"
              />
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 pt-4"
        >
          <Button
            type="button"
            variant="outline"
            icon={X}
            onClick={handleCancel}
            className="flex-1"
            disabled={isSaving}
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            type="submit"
            icon={Save}
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {t("saving") || "Saving..."}
              </span>
            ) : (
              t("saveChanges") || "Save Changes"
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default EditProductPage;
