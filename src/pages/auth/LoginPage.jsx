import React from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Leaf } from "lucide-react";
import { useAuth, USER_TYPES } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated, userType, loading } = useAuth();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    userType: USER_TYPES.CONSUMER,
  });
  const [showPassword, setShowPassword] = React.useState(false);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(formData, formData.userType);
      if (result.success) {
        toast.success("Login successful!");
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleLogin = () => {
    // For now, show a helpful message about Google OAuth setup
    toast.info(
      "Google OAuth is ready to integrate! Add your Google Client ID to enable sign-in.",
      { duration: 4000 }
    );
    
    // Uncomment and configure when you have Google OAuth credentials:
    /*
    const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'email profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
    */
  };

  // Demo credentials for testing
  const demoCredentials = [
    {
      type: "Consumer",
      email: "consumer@demo.com",
      userType: USER_TYPES.CONSUMER,
    },
    { type: "Farmer", email: "farmer@demo.com", userType: USER_TYPES.FARMER },
    { type: "Admin", email: "admin@demo.com", userType: USER_TYPES.ADMIN },
  ];

  const fillDemoCredentials = (demo) => {
    setFormData({
      email: demo.email,
      password: "demo123",
      userType: demo.userType,
    });
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
            {t("welcomeBack")}
          </h2>
          <p className="mt-2 text-forest-600 dark:text-forest-400">
            {t("signInToAgrova")}
          </p>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-forest-50 dark:bg-forest-900 p-4 rounded-lg"
        >
          <h3 className="text-sm font-medium text-forest-800 dark:text-forest-200 mb-3">
            Demo Credentials (Click to fill):
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {demoCredentials.map((demo) => (
              <button
                key={demo.type}
                onClick={() => fillDemoCredentials(demo)}
                className="text-xs bg-white dark:bg-forest-800 p-2 rounded border border-forest-200 dark:border-forest-700 hover:bg-forest-100 dark:hover:bg-forest-700 transition-colors"
              >
                {demo.type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">
              Login as
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(USER_TYPES).map((type) => (
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

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
            >
              Email address
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
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-forest-500 dark:text-forest-400" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-forest pl-10 pr-10"
                placeholder="Enter your password"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-forest-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-forest-700 dark:text-forest-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-forest-600 hover:text-forest-500 dark:text-forest-400 dark:hover:text-forest-300"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign in
          </Button>
        </motion.form>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-forest-600 dark:text-forest-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-forest-600 hover:text-forest-500 dark:text-forest-400 dark:hover:text-forest-300"
            >
              Sign up here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
