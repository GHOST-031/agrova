import { useLanguage } from "../contexts/LanguageContext";
import translations from "../locales/translations";

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key; // Return key if translation not found
  };

  return { t, language };
};

export default useTranslation;
