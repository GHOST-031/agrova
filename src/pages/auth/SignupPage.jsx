import React from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { useAuth, USER_TYPES } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const SignupPage = () => {
  const { t } = useTranslation();
  const { register, isAuthenticated, userType } = useAuth();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userType: USER_TYPES.CONSUMER,
    location: "",
    farmSize: "", // For farmers
    experience: "", // For farmers
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const redirectPath =
      userType === "admin"
        ? "/admin/dashboard"
        : userType === "farmer"
        ? "/farmer/dashboard"
        : "/";
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare user data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        userType: formData.userType,
      };

      // Add farmer-specific data if user is a farmer
      if (formData.userType === USER_TYPES.FARMER) {
        userData.farmDetails = {
          farmLocation: {
            address: formData.location,
          },
          farmSize: formData.farmSize,
        };
      }

      const result = await register(userData);
      
      if (result.success) {
        toast.success("Account created successfully!");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-forest-gradient rounded-xl flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-forest-800 dark:text-forest-100">
            {t("joinAgrova")}
          </h2>
          <p className="mt-2 text-forest-600 dark:text-forest-400">
            {t("createAccountAndStartYourFreshJourney")}
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
              {t("iWantToJoinAs")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[USER_TYPES.CONSUMER, USER_TYPES.FARMER].map((type) => (
                <label
                  key={type}
                  className={`relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userType === type
                      ? "border-forest-500 bg-forest-50 dark:bg-forest-800"
                      : "border-forest-200 dark:border-forest-700 hover:border-forest-300 dark:hover:border-forest-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={formData.userType === type}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-forest-700 dark:text-forest-300 capitalize">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
            >
              {t("fullName")}
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-forest pl-10"
                placeholder={t("enterYourFullName")}
              />
              <User className="absolute left-3 top-3.5 h-4 w-4 text-forest-500 dark:text-forest-400" />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
            >
              {t("emailAddress")}
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-forest pl-10"
                placeholder={t("enterYourEmail")}
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-forest-500 dark:text-forest-400" />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
            >
              {t("phoneNumber")}
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="input-forest pl-10"
                placeholder={t("enterYourPhoneNumber")}
              />
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-forest-500 dark:text-forest-400" />
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
            >
              {t("location")}
            </label>
            <div className="relative">
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                className="input-forest pl-10"
                placeholder={t("enterYourCityArea")}
              />
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-forest-500 dark:text-forest-400" />
            </div>
          </div>

          {/* Farmer-specific fields */}
          {formData.userType === USER_TYPES.FARMER && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="farmSize"
                    className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
                  >
                    {t("farmSizeAcres")}
                  </label>
                  <input
                    id="farmSize"
                    name="farmSize"
                    type="number"
                    value={formData.farmSize}
                    onChange={handleChange}
                    className="input-forest"
                    placeholder={t("eg5")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
                  >
                    {t("experienceYears")}
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    className="input-forest"
                    placeholder={t("eg10")}
                  />
                </div>
              </div>
            </>
          )}

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
            >
              {t("password")}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-forest pl-10 pr-10"
                placeholder={t("createAStrongPassword")}
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-forest-500 dark:text-forest-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-forest-500 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
            >
              {t("confirmPassword")}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-forest pl-10 pr-10"
                placeholder={t("confirmYourPassword")}
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-forest-500 dark:text-forest-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-forest-500 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-forest-300 rounded"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 block text-sm text-forest-700 dark:text-forest-300"
            >
              {t("iAgreeToThe")}{" "}
              <Link
                to="/terms"
                className="text-forest-600 hover:text-forest-500 dark:text-forest-400 dark:hover:text-forest-300"
              >
                {t("termsAndConditions")}
              </Link>{" "}
              {t("and")}{" "}
              <Link
                to="/privacy"
                className="text-forest-600 hover:text-forest-500 dark:text-forest-400 dark:hover:text-forest-300"
              >
                {t("privacyPolicy")}
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {t("createAccount")}
          </Button>
        </motion.form>

        {/* Sign In Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-forest-600 dark:text-forest-400">
            {t("alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="font-medium text-forest-600 hover:text-forest-500 dark:text-forest-400 dark:hover:text-forest-300"
            >
              {t("signInHere")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
