import React from "react";
import { motion } from "framer-motion";
import { useWishlist } from "../../contexts/WishlistContext";

const Card = ({
  children,
  className = "",
  hover = true,
  onClick,
  padding = "p-6",
  ...props
}) => {
  const hoverAnimation = hover
    ? {
        whileHover: { y: -4, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <motion.div
      {...hoverAnimation}
      onClick={onClick}
      className={`card-forest ${padding} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Product Card Component
export const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onViewDetails,
}) => {
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  React.useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  return (
    <Card className="group overflow-hidden" hover={true}>
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 bg-forest-50 dark:bg-forest-800">
        <div className="aspect-square relative">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-forest-300 border-t-forest-600 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={
              product.image ||
              `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center`
            }
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => {
              setIsImageLoading(false);
              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center';
            }}
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(product);
                }}
                className="bg-white text-forest-600 p-2 rounded-full shadow-lg hover:bg-forest-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  const newState = toggleWishlist(product);
                  setIsWishlisted(newState);
                  onAddToWishlist?.(product);
                }}
                className={`p-2 rounded-full shadow-lg transition-all ${
                  isWishlisted
                    ? "bg-error-500 text-white"
                    : "bg-white text-error-500 hover:bg-error-50"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isWishlisted ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isOrganic && (
              <span className="bg-success-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Organic
              </span>
            )}
            {product.isFreshToday && (
              <span className="bg-warning-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Fresh Today
              </span>
            )}
          </div>

          {/* Farmer Badge */}
          <div className="absolute top-2 right-2">
            <div className="bg-white/90 dark:bg-forest-900/90 rounded-full p-1">
              <img
                src={
                  product.farmer?.avatar ||
                  `https://ui-avatars.com/api/?name=${product.farmer?.name}&background=4a9a4a&color=fff`
                }
                alt={product.farmer?.name}
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-forest-800 dark:text-forest-100 text-lg group-hover:text-forest-600 dark:group-hover:text-forest-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-forest-600 dark:text-forest-400 text-sm">
            by {product.farmer?.name}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-forest-800 dark:text-forest-100">
              ₹{product.price}
            </span>
            <span className="text-forest-500 dark:text-forest-400 text-sm">
              per {product.unit}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4 text-warning-500 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-forest-600 dark:text-forest-400 text-sm">
              {product.rating || "4.5"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-forest-500 dark:text-forest-400">
          <span>
            Stock: {product.stock || "25"} {product.unit}
          </span>
          <span>📍 {product.location || "2.5 km away"}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="w-full btn-forest-primary"
        >
          Add to Cart
        </motion.button>
      </div>
    </Card>
  );
};

// Order Card Component
export const OrderCard = ({ order, onViewDetails, onTrackOrder }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200";
      case "confirmed":
        return "bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200";
      case "cancelled":
        return "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Format date from ISO string or use existing date string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  // Get total from pricing object or fallback to order.total
  const orderTotal = order.pricing?.total || order.total;
  const orderDate = formatDate(order.createdAt || order.date);

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-forest-800 dark:text-forest-100">
            Order #{order.id}
          </h3>
          <p className="text-forest-600 dark:text-forest-400 text-sm">
            {orderDate}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status.replace(/_/g, ' ').charAt(0).toUpperCase() + order.status.replace(/_/g, ' ').slice(1)}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <img
          src={
            order.items[0]?.image ||
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
          }
          alt={order.items[0]?.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <p className="font-medium text-forest-800 dark:text-forest-100">
            {order.items[0]?.name}
            {order.items.length > 1 && (
              <span className="text-forest-500 dark:text-forest-400 ml-1">
                +{order.items.length - 1} more
              </span>
            )}
          </p>
          <p className="text-forest-600 dark:text-forest-400 text-sm">
            Total: ₹{orderTotal}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewDetails?.(order)}
          className="flex-1 border border-forest-300 dark:border-forest-700 text-forest-600 dark:text-forest-400 py-2 px-4 rounded-lg hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors text-sm"
        >
          View Details
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTrackOrder?.(order)}
          className="flex-1 btn-forest-primary py-2 text-sm"
        >
          Track Order
        </motion.button>
      </div>
    </Card>
  );
};

export default Card;
