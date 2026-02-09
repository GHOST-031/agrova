import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart, MapPin, Star, Truck, Shield, Check } from "lucide-react";
import Button from "./Button";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCart } from "../../contexts/CartContext";
import toast from "react-hot-toast";

const ProductDetailsModal = ({ product, isOpen, onClose, onAddToCart, onAddToWishlist }) => {
  const [quantity, setQuantity] = React.useState(1);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [showAddedNotification, setShowAddedNotification] = React.useState(false);

  // Update wishlisted state when modal opens or product changes
  React.useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product.id));
      setShowAddedNotification(false);
      setQuantity(1);
    }
  }, [product, isInWishlist]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-20 bg-white dark:bg-forest-900 rounded-2xl shadow-2xl z-50 overflow-y-auto"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-forest-100 dark:hover:bg-forest-800 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-forest-600 dark:text-forest-400" />
            </motion.button>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center"
              >
                <div className="relative w-full max-w-md">
                  <div className="relative bg-forest-50 dark:bg-forest-800 rounded-2xl overflow-hidden aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {product.isOrganic && (
                        <span className="bg-success-500 text-white text-sm px-4 py-2 rounded-full font-semibold">
                          ✓ Organic
                        </span>
                      )}
                      {product.isFreshToday && (
                        <span className="bg-warning-500 text-white text-sm px-4 py-2 rounded-full font-semibold">
                          🔥 Fresh Today
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-forest-800/95 rounded-lg px-4 py-2">
                      <p className="text-sm font-semibold text-forest-800 dark:text-forest-100">
                        {product.stock > 0 ? (
                          <span className="text-success-600">✓ In Stock ({product.stock})</span>
                        ) : (
                          <span className="text-error-600">Out of Stock</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Farmer Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 bg-gradient-to-r from-forest-50 to-green-50 dark:from-forest-800 dark:to-forest-700 rounded-xl p-4 flex items-center space-x-3"
                  >
                    <img
                      src={product.farmer?.avatar}
                      alt={product.farmer?.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-forest-600 dark:text-forest-400">Sold by</p>
                      <p className="font-semibold text-forest-800 dark:text-forest-100">
                        {product.farmer?.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 bg-white dark:bg-forest-900 px-3 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-warning-500 fill-current" />
                      <span className="font-semibold text-forest-800 dark:text-forest-100">
                        {product.rating}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Details Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col space-y-6"
              >
                {/* Title and Rating */}
                <div>
                  <h1 className="text-4xl font-bold text-forest-800 dark:text-forest-100 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? "text-warning-500 fill-current"
                              : "text-forest-300 dark:text-forest-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-forest-600 dark:text-forest-400">
                      {product.rating} out of 5
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="border-t border-b border-forest-200 dark:border-forest-700 py-4">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-5xl font-bold text-forest-800 dark:text-forest-100">
                      ₹{product.price}
                    </span>
                    <span className="text-lg text-forest-600 dark:text-forest-400">
                      per {product.unit}
                    </span>
                  </div>
                  <p className="text-forest-600 dark:text-forest-400">
                    Free delivery on orders above ₹500
                  </p>
                </div>

                {/* Location and Delivery */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-forest-700 dark:text-forest-300">
                    <MapPin className="w-5 h-5 text-forest-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-forest-600 dark:text-forest-400">{product.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-forest-700 dark:text-forest-300">
                    <Truck className="w-5 h-5 text-forest-500" />
                    <div>
                      <p className="text-sm font-medium">Delivery</p>
                      <p className="text-forest-600 dark:text-forest-400">Same-day delivery available</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-forest-700 dark:text-forest-300">
                    <Shield className="w-5 h-5 text-forest-500" />
                    <div>
                      <p className="text-sm font-medium">Quality Guarantee</p>
                      <p className="text-forest-600 dark:text-forest-400">100% fresh or money back</p>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <p className="text-sm font-semibold text-forest-800 dark:text-forest-100 mb-3">
                    Quantity
                  </p>
                  <div className="flex items-center space-x-4 bg-forest-100 dark:bg-forest-800 rounded-lg w-fit p-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors"
                    >
                      −
                    </motion.button>
                    <span className="w-8 text-center font-semibold text-forest-800 dark:text-forest-100">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors"
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      addToCart(product, quantity);
                      setShowAddedNotification(true);
                      toast.success(`${product.name} added to cart!`, {
                        icon: <ShoppingCart className="w-5 h-5" />,
                      });
                      setTimeout(() => {
                        onClose();
                      }, 1000);
                    }}
                    className="flex-1 btn-forest-primary flex items-center justify-center space-x-2 relative overflow-hidden"
                  >
                    {showAddedNotification && (
                      <motion.div
                        layoutId="addedCheckmark"
                        className="absolute inset-0 bg-success-500 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                    <ShoppingCart className={`w-5 h-5 ${showAddedNotification ? 'opacity-0' : ''}`} />
                    <span className={showAddedNotification ? 'opacity-0' : ''}>Add to Cart</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const newState = toggleWishlist(product);
                      setIsWishlisted(newState);
                      onAddToWishlist?.(product);
                      toast.success(newState ? "Added to wishlist!" : "Removed from wishlist!", {
                        icon: <Heart className="w-5 h-5" />,
                      });
                    }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      isWishlisted
                        ? "bg-error-500 dark:bg-error-600 text-white shadow-lg"
                        : "bg-forest-100 dark:bg-forest-800 text-forest-600 dark:text-forest-400 hover:bg-forest-200 dark:hover:bg-forest-700"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        isWishlisted ? "fill-current" : ""
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Product Description */}
                <div className="bg-forest-50 dark:bg-forest-800 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-forest-800 dark:text-forest-100">
                    About This Product
                  </h3>
                  <ul className="text-forest-600 dark:text-forest-400 space-y-1 text-sm">
                    <li>✓ Sourced directly from verified farmers</li>
                    <li>✓ No pesticides or harmful chemicals</li>
                    <li>✓ Picked fresh and delivered within 24 hours</li>
                    <li>✓ Quality checked before dispatch</li>
                    <li>✓ Eco-friendly, sustainable packaging</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;
