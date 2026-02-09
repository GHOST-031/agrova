import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "../../hooks/useTranslation";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  ];

  const currentLang = languages.find((lang) => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-forest-100 hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors"
        title={t("selectLanguage")}
      >
        <Globe className="w-5 h-5" />
        <span className="font-medium text-sm">{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-forest-900 rounded-lg shadow-lg border border-forest-200 dark:border-forest-700 z-50"
        >
          <div className="py-2">
            <p className="px-4 py-2 text-sm font-semibold text-forest-600 dark:text-forest-400">
              {t("language")}
            </p>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  language === lang.code
                    ? "bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-forest-100 font-semibold"
                    : "text-forest-700 dark:text-forest-300 hover:bg-forest-50 dark:hover:bg-forest-800/50"
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
