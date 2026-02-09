import React from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useCart } from "../../contexts/CartContext";
import { useTranslation } from "../../hooks/useTranslation";

const CartPage = () => {
  const { t } = useTranslation();
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-forest-400 dark:text-forest-600 mb-6">
            <ShoppingBag className="w-24 h-24 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-4">
            {t("cartEmpty")}
          </h2>
          <p className="text-forest-600 dark:text-forest-400 mb-8">
            {t("noItemsInCart")}
          </p>
          <Link to="/products">
            <Button size="lg" icon={ArrowRight} iconPosition="right">
              {t("startShopping")}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-2">
          {t("shoppingCart")}
        </h1>
        <p className="text-forest-600 dark:text-forest-400">
          {items.length} {items.length === 1 ? t("item") : t("items")} {t("inYourCart")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    {/* Tags */}
                    <div className="absolute -top-2 -right-2 flex flex-col space-y-1">
                      {item.isOrganic && (
                        <span className="bg-success-500 text-white text-xs px-1 py-0.5 rounded font-medium">
                          Organic
                        </span>
                      )}
                      {item.isFreshToday && (
                        <span className="bg-warning-500 text-white text-xs px-1 py-0.5 rounded font-medium">
                          Fresh
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-forest-800 dark:text-forest-100 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-forest-600 dark:text-forest-400 text-sm">
                      by {item.farmer?.name} • {item.location || "Local farm"}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xl font-bold text-forest-800 dark:text-forest-100">
                        ₹{item.price}
                      </span>
                      <span className="text-forest-500 dark:text-forest-400 text-sm">
                        per {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-forest-300 dark:border-forest-700 rounded-lg">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors rounded-l-lg"
                      >
                        <Minus className="w-4 h-4 text-forest-600 dark:text-forest-400" />
                      </motion.button>
                      <span className="px-4 py-2 text-forest-800 dark:text-forest-100 font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors rounded-r-lg"
                      >
                        <Plus className="w-4 h-4 text-forest-600 dark:text-forest-400" />
                      </motion.button>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-forest-800 dark:text-forest-100">
                      ₹{item.price * item.quantity}
                    </div>
                    <div className="text-forest-500 dark:text-forest-400 text-sm">
                      {item.quantity} {item.unit}
                      {item.quantity > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Continue Shopping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <Link to="/products">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-forest-600 dark:text-forest-400">
                    Subtotal ({items.length} items)
                  </span>
                  <span className="font-medium text-forest-800 dark:text-forest-100">
                    ₹{total - (total > 200 ? 0 : 30)}
                  </span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between">
                  <span className="text-forest-600 dark:text-forest-400">
                    Delivery Fee
                  </span>
                  <span className="font-medium text-forest-800 dark:text-forest-100">
                    {total > 200 ? (
                      <span className="text-success-500">Free</span>
                    ) : (
                      `₹${30}`
                    )}
                  </span>
                </div>

                {total < 200 && (
                  <div className="text-sm text-forest-500 dark:text-forest-400">
                    Add ₹{Math.ceil(200 - (total - 30))} more for free delivery
                  </div>
                )}

                <hr className="border-forest-200 dark:border-forest-700" />

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-forest-800 dark:text-forest-100">
                    Total
                  </span>
                  <span className="text-forest-800 dark:text-forest-100">
                    ₹{total}
                  </span>
                </div>

                {/* Savings */}
                <div className="bg-success-50 dark:bg-success-900/20 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-success-700 dark:text-success-300">
                      You're saving ₹{Math.round(total * 0.15)} compared to
                      retail!
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/consumer/checkout" className="block w-full">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Estimated Delivery */}
                <div className="text-center text-sm text-forest-500 dark:text-forest-400">
                  🚚 Estimated delivery: Tomorrow before 6 PM
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
