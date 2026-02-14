import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const initialProducts = [
  {
    id: 1,
    name: "Organic Tomatoes",
    price: 45,
    unit: "kg",
    stock: 25,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop",
    isOrganic: true,
    isFreshToday: true,
  },
  {
    id: 2,
    name: "Fresh Spinach",
    price: 30,
    unit: "kg",
    stock: 15,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop",
    isOrganic: true,
  },
  {
    id: 3,
    name: "Farm Fresh Eggs",
    price: 8,
    unit: "dozen",
    stock: 50,
    image: "https://media.istockphoto.com/id/2222296828/photo/fresh-brown-eggs-displayed-for-sale-at-a-local-poultry-market-in-bangladesh-poultry-eggs.webp?a=1&b=1&s=612x612&w=0&k=20&c=z-QPFaNn2nrEJQEpPhqV32c3Ev7-XmxY3l4MMZa3WwY=",
    isFreshToday: true,
  },
  {
    id: 4,
    name: "Organic Carrots",
    price: 35,
    unit: "kg",
    stock: 40,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop",
    isOrganic: true,
    isFreshToday: true,
  },
  {
    id: 5,
    name: "Bell Peppers",
    price: 50,
    unit: "kg",
    stock: 20,
    image: "https://media.istockphoto.com/id/137350104/photo/green-peppers.webp?a=1&b=1&s=612x612&w=0&k=20&c=7u2DZpZoSZIWkSDyvAbxkvNU09BrvPdQCPzM4LcsxvU=",
    isOrganic: false,
    isFreshToday: true,
  },
  {
    id: 6,
    name: "Broccoli",
    price: 40,
    unit: "kg",
    stock: 18,
    image: "https://media.istockphoto.com/id/518951178/photo/fresh-raw-green-broccoli-in-bowl.webp?a=1&b=1&s=612x612&w=0&k=20&c=bKY-ggS9Dt0GjenJTH8p4dKAx8e8BG3CBrq4Ji36ccw=",
    isOrganic: true,
    isFreshToday: false,
  },
  {
    id: 7,
    name: "Green Beans",
    price: 55,
    unit: "kg",
    stock: 22,
    image: "https://images.unsplash.com/photo-1574963835594-61eede2070dc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    isOrganic: true,
    isFreshToday: true,
  },
  {
    id: 8,
    name: "Organic Potatoes",
    price: 25,
    unit: "kg",
    stock: 60,
    image: "https://images.unsplash.com/photo-1686544303141-cc0bd819d400?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    isOrganic: true,
    isFreshToday: false,
  },
  {
    id: 9,
    name: "Cucumber",
    price: 28,
    unit: "kg",
    stock: 35,
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    isOrganic: false,
    isFreshToday: true,
  },
  {
    id: 10,
    name: "Onions",
    price: 22,
    unit: "kg",
    stock: 70,
    image: "https://plus.unsplash.com/premium_photo-1668076517573-fa01307d87ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b25pb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    isOrganic: false,
    isFreshToday: false,
  },
  {
    id: 11,
    name: "Garlic",
    price: 80,
    unit: "kg",
    stock: 15,
    image: "https://images.unsplash.com/photo-1579705744772-f26014b5e084?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z2FybGljfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    isOrganic: true,
    isFreshToday: false,
  },
  {
    id: 12,
    name: "Fresh Milk",
    price: 60,
    unit: "liter",
    stock: 30,
    image: "https://media.istockphoto.com/id/1222018207/photo/pouring-milk-into-a-drinking-glass.webp?a=1&b=1&s=612x612&w=0&k=20&c=bmxPDO6cZ2RPHXhopZtuhAMLu6qv9aAHEQIV6GBZ2R0=",
    isOrganic: true,
    isFreshToday: true,
  },
];

const FarmerProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState(null);
  const [form, setForm] = React.useState({
    name: "",
    price: "",
    unit: "kg",
    stock: "",
    description: "",
    category: "",
    images: [],
    imageUrl: "",
    isOrganic: false,
    isFresh: false,
  });

  // Fetch farmer's products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const farmerId = user?.id || user?._id;
      if (!farmerId) {
        toast.error("User ID not found");
        setLoading(false);
        return;
      }
      const response = await api.getProducts({ farmer: farmerId });
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () =>
    setForm({
      name: "",
      price: "",
      unit: "kg",
      stock: "",
      description: "",
      category: "",
      images: [],
      imageUrl: "",
      isOrganic: false,
      isFresh: false,
    });

  const openAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const priceNum = Number(form.price);
    const stockNum = Number(form.stock);
    if (!form.name || !priceNum || !stockNum) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const productData = {
        name: form.name,
        price: priceNum,
        unit: form.unit,
        stock: stockNum,
        description: form.description || `Fresh ${form.name}`,
        images: form.imageUrl ? [{ url: form.imageUrl }] : [],
        isOrganic: !!form.isOrganic,
        isFresh: !!form.isFresh,
        status: "active",
      };

      // If category is provided, you'll need to handle category lookup
      // For now, we'll skip category to make it optional

      const response = await api.createProduct(productData);
      toast.success("Product added successfully!");
      setProducts((prev) => [response.data, ...prev]);
      setIsAddOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.message || "Failed to add product");
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/farmer/products/${productId}/edit`);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.deleteProduct(productId);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-forest-800 dark:text-forest-100">
          {t("myProducts")}
        </motion.h1>
        <Button icon={Plus} onClick={openAdd}>{t("addProduct")}</Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-lg text-forest-600 dark:text-forest-400">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-forest-600 dark:text-forest-400">No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="p-0 overflow-hidden">
                <div className="w-full h-56 bg-forest-100 dark:bg-forest-800 flex items-center justify-center overflow-hidden">
                  <img 
                    src={p.images?.[0]?.url || "https://images.unsplash.com/photo-1488459716781-6918f33fc897?w=500&h=500&fit=crop"} 
                    alt={p.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1488459716781-6918f33fc897?w=500&h=500&fit=crop"; }} 
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-forest-800 dark:text-forest-100">{p.name}</div>
                    <div className="text-forest-700 dark:text-forest-300">₹{p.price} / {p.unit}</div>
                  </div>
                  <div className="text-sm text-forest-600 dark:text-forest-400">{t("stock")}: {p.stock} {p.unit}</div>
                  <div className="flex items-center gap-2 text-xs">
                    {p.isOrganic && <span className="px-2 py-0.5 rounded-full bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">{t("organic")}</span>}
                    {p.isFresh && <span className="px-2 py-0.5 rounded-full bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200">{t("fresh")}</span>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Edit2}
                      onClick={() => handleEditProduct(p._id)}
                    >
                      {t("edit")}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Trash2} 
                      className="text-error-600 border-error-400"
                      onClick={() => setDeleteConfirmId(p._id)}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={t("addNewProduct")} size="lg">
        <form onSubmit={addProduct} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-forest-600 dark:text-forest-400">{t("productName")}</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Organic Tomatoes"
                className="w-full bg-transparent border border-forest-300 dark:border-forest-700 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-forest-600 dark:text-forest-400">{t("price")}</label>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g., 45"
                className="w-full bg-transparent border border-forest-300 dark:border-forest-700 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-forest-600 dark:text-forest-400">{t("unit")}</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full bg-transparent border border-forest-300 dark:border-forest-700 rounded-lg px-3 py-2"
              >
                <option value="kg">kg</option>
                <option value="dozen">dozen</option>
                <option value="piece">piece</option>
                <option value="bundle">bundle</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-forest-600 dark:text-forest-400">{t("stock")}</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="e.g., 25"
                className="w-full bg-transparent border border-forest-300 dark:border-forest-700 rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-forest-600 dark:text-forest-400">{t("imageUrl")}</label>
            <div className="flex items-center gap-2">
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="flex-1 bg-transparent border border-forest-300 dark:border-forest-700 rounded-lg px-3 py-2"
              />
              <div className="w-12 h-12 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center overflow-hidden">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                ) : (
                  <ImageIcon className="w-5 h-5 text-forest-500" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-forest-700 dark:text-forest-300">
              <input
                type="checkbox"
                checked={form.isOrganic}
                onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })}
              />
              {t("organic")}
            </label>
            <label className="inline-flex items-center gap-2 text-forest-700 dark:text-forest-300">
              <input
                type="checkbox"
                checked={form.isFresh}
                onChange={(e) => setForm({ ...form, isFresh: e.target.checked })}
              />
              {t("freshToday")}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>{t("cancel")}</Button>
            <Button type="submit">{t("addProduct")}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deleteConfirmId} 
        onClose={() => setDeleteConfirmId(null)} 
        title={t("confirmDelete") || "Delete Product"}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-forest-700 dark:text-forest-300">
            {t("deleteProductConfirm") || "Are you sure you want to delete this product? This action cannot be undone."}
          </p>
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDeleteConfirmId(null)}
            >
              {t("cancel")}
            </Button>
            <Button 
              type="button" 
              className="bg-error-600 hover:bg-error-700"
              onClick={() => handleDeleteProduct(deleteConfirmId)}
            >
              {t("delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FarmerProducts;
