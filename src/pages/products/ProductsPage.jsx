import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ProductCard } from "../../components/ui/Card";
import ProductDetailsModal from "../../components/ui/ProductDetailsModal";
import { useCart } from "../../contexts/CartContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useApi } from "../../hooks/useApi";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const { t } = useTranslation();
  const { fetchWithCancel, isMounted } = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWithCancel(async (signal) => {
      try {
        setLoading(true);
        const res = await api.getProducts({ signal });
        const list = (res.data || []).map((p) => ({
          ...p,
          id: p._id,
          image: p.images?.[0]?.url || "https://via.placeholder.com/400",
          rating: p.ratings?.average || 0,
        }));
        if (isMounted()) {
          setProducts(list);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Products fetch error:", err);
          if (isMounted()) {
            toast.error("Failed to load products");
          }
        }
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = useMemo(() => {
    let res = products.slice();
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      res = res.filter((p) => (p.name || "").toLowerCase().includes(q) || (p.farmer?.name || "").toLowerCase().includes(q));
    }
    if (selectedCategory !== "all") {
      res = res.filter((p) => (p.category?.slug || p.category || "").toString().toLowerCase() === selectedCategory.toString().toLowerCase());
    }
    switch (sortBy) {
      case "price-low":
        res.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        res.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        res.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        res.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return res;
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-lg text-forest-600 dark:text-forest-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-2">{t("freshProducts")}</h1>
        <p className="text-forest-600 dark:text-forest-400">{t("discoverFresh")}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 dark:text-forest-400 w-5 h-5" />
          <input
            className="w-full input-forest pl-10"
            placeholder={t("searchProducts")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <h4 className="font-semibold text-forest-800 dark:text-forest-100">{t("filters")}</h4>
            <div>
              <select className="w-full input-forest" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">All</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="dairy">Dairy</option>
                <option value="grains">Grains</option>
              </select>
            </div>
            <div>
              <select className="w-full input-forest" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => addToCart(p)}
                onViewDetails={(p) => {
                  setSelectedProduct(p);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductDetailsModal product={selectedProduct} onClose={() => setIsModalOpen(false)} onAddToCart={(p) => addToCart(p)} />
      )}
    </div>
  );
};

export default ProductsPage;
