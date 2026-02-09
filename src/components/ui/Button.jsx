import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Button variants
const buttonVariants = {
  primary: "btn-forest-primary",
  secondary: "btn-forest-secondary",
  outline:
    "border-2 border-forest-500 text-forest-500 hover:bg-forest-500 hover:text-white bg-transparent font-medium px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2",
  ghost:
    "text-forest-500 hover:bg-forest-100 dark:hover:bg-forest-800 font-medium px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2",
  danger:
    "bg-error-500 hover:bg-error-600 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-error-400 focus:ring-offset-2",
  success:
    "bg-success-500 hover:bg-success-600 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-success-400 focus:ring-offset-2",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  const baseClass = `${buttonVariants[variant]} ${sizeClasses[size]} ${className}`;
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`${baseClass} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      } flex items-center justify-center space-x-2`}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {Icon && !loading && iconPosition === "left" && (
        <Icon className="w-4 h-4" />
      )}
      {children && <span>{children}</span>}
      {Icon && !loading && iconPosition === "right" && (
        <Icon className="w-4 h-4" />
      )}
    </motion.button>
  );
};

export default Button;
