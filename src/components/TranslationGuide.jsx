import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * Example of how to use translations in your components
 * 
 * Usage:
 * 1. Import useTranslation hook:
 *    import { useTranslation } from "../hooks/useTranslation";
 * 
 * 2. Use it in your component:
 *    const { t } = useTranslation();
 * 
 * 3. Access translations:
 *    <h1>{t("welcome")}</h1>
 *    <p>{t("hello")}</p>
 * 
 * Available keys (see src/locales/translations.js):
 * - Navigation: home, products, about, contact, profile, logout, login, signup
 * - Common: welcome, hello, loading, save, cancel, edit, delete, language, etc.
 * - Home Page: freshFromFarm, connectWithFarmers, shopNow, joinAsFarmer, etc.
 * - Products: allProducts, filterByCategory, searchProducts, addToCart, etc.
 * - Orders: orders, orderHistory, orderDetails, orderStatus, pending, etc.
 * - Farmer Dashboard: farmerDashboard, totalOrders, revenue, activeProducts, etc.
 * - Consumer Dashboard: consumerDashboard, yourStatistics, totalSpent, etc.
 * - Profile: profile, editProfile, contactInformation, certifications, etc.
 * - Notifications: notifications, unread, today, all, markAllAsRead, etc.
 */

const TranslationGuide = () => {
  const { t, language } = useTranslation();
  const { changeLanguage } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{t("selectLanguage")}</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Current Language:</strong> {language === "en" ? "English" : language === "ta" ? "Tamil" : "Hindi"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { code: "en", name: "English" },
          { code: "ta", name: "Tamil (தமிழ்)" },
          { code: "hi", name: "Hindi (हिंदी)" },
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`p-4 rounded-lg border-2 transition ${
              language === lang.code
                ? "border-forest-600 bg-forest-100 dark:bg-forest-800"
                : "border-forest-300 dark:border-forest-700 hover:border-forest-500"
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">{t("welcome")}!</h2>
        <p className="text-lg">{t("hello")} - {t("selectLanguage")}</p>
      </div>
    </div>
  );
};

export default TranslationGuide;
