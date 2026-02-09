import React from "react";
import { motion } from "framer-motion";
import { Trash2, Heart, ShoppingCart } from "lucide-react";
import { ProductCard } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ProductDetailsModal from "../../components/ui/ProductDetailsModal";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCart } from "../../contexts/CartContext";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 flex items-center gap-2">
              <Heart className="w-8 h-8 text-error-500 fill-current" />
              My Wishlist
            </h1>
            <p className="text-forest-600 dark:text-forest-400 mt-2">
              {items.length} item{items.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {items.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
                  items.forEach(item => removeFromWishlist(item.id));
                }
              }}
              className="px-4 py-2 bg-error-100 dark:bg-error-900 text-error-600 dark:text-error-400 rounded-lg hover:bg-error-200 dark:hover:bg-error-800 transition-colors font-medium"
            >
              Clear All
            </motion.button>
          )}
        </div>
      </motion.div>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <ProductCard
                  product={product}
                  onAddToCart={() => {
                    addToCart(product, 1);
                    toast.success(`${product.name} added to cart!`);
                  }}
                  onAddToWishlist={() => removeFromWishlist(product.id)}
                  onViewDetails={(product) => {
                    setSelectedProduct(product);
                    setIsModalOpen(true);
                  }}
                />
                {/* Remove from Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-error-500 text-white rounded-full shadow-lg hover:bg-error-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Continue Shopping Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Button variant="outline" size="lg" onClick={() => window.location.href = "/products"}>
              Continue Shopping
            </Button>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-forest p-12 text-center space-y-6"
        >
          <div className="flex justify-center">
            <Heart className="w-16 h-16 text-forest-300 dark:text-forest-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-forest-600 dark:text-forest-400 mb-6">
              Start adding items to your wishlist by clicking the heart icon on products!
            </p>
          </div>
          <Button
            onClick={() => window.location.href = "/products"}
            className="inline-flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Browse Products
          </Button>
        </motion.div>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={(product, quantity) => {
          addToCart(product, quantity);
          toast.success(`${quantity} ${product.name} added to cart!`);
          setIsModalOpen(false);
        }}
        onAddToWishlist={(product) => {
          console.log("Add to wishlist:", product);
        }}
      />
    </div>
  );
};

export default WishlistPage;
