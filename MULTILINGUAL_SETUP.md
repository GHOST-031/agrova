# Agrova Multilingual Support Documentation

## Overview
The Agrova platform now supports three languages:
- 🇬🇧 **English** (en)
- 🇮🇳 **Tamil** (ta) - தமிழ்
- 🇮🇳 **Hindi** (hi) - हिंदी

## File Structure

```
src/
├── contexts/
│   └── LanguageContext.jsx          # Language context provider
├── hooks/
│   └── useTranslation.js            # Translation hook
├── locales/
│   └── translations.js              # All translations (EN, TA, HI)
├── components/
│   └── ui/
│       └── LanguageSwitcher.jsx    # Language selector component
└── App.jsx                          # Updated with LanguageProvider
```

## How to Use

### 1. In Components

```jsx
import { useTranslation } from "../hooks/useTranslation";

const MyComponent = () => {
  const { t, language } = useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("hello")}</p>
      <p>Current Language: {language}</p>
    </div>
  );
};
```

### 2. Language Switcher

The Language Switcher is already integrated in the Navbar. Users can:
- Click the language button (🇬🇧 EN/TA/HI)
- Select from English, Tamil, or Hindi
- Language preference is saved to localStorage

### 3. Accessing Translations

All available translation keys are in `src/locales/translations.js`:

```javascript
// Usage in component
const { t } = useTranslation();

// Common translations
t("welcome")              // Greeting
t("hello")               // Salutation
t("save")                // Action button
t("cancel")              // Action button

// Page-specific
t("freshFromFarm")       // Home page headline
t("farmerDashboard")     // Farmer page title
t("consumerDashboard")   // Consumer page title

// Features
t("addToCart")           // Product action
t("addToWishlist")       // Product action
t("notifications")       // Feature name
```

## Supported Translation Keys

### Navigation
- `home`, `products`, `about`, `contact`, `profile`, `logout`, `login`, `signup`

### Common
- `welcome`, `hello`, `loading`, `save`, `cancel`, `edit`, `delete`, `add`, `view`
- `back`, `next`, `previous`, `language`, `english`, `tamil`, `hindi`

### Home Page
- `freshFromFarm`, `connectWithFarmers`, `shopNow`, `joinAsFarmer`
- `sameDayDelivery`, `localFarmers`, `whyChooseAgrova`
- `featuredProducts`, `viewAll`, `availableFarmsNearYou`, `popularBuyingTrends`

### Products
- `allProducts`, `filterByCategory`, `searchProducts`, `addToCart`
- `addToWishlist`, `viewDetails`, `price`, `organic`, `freshToday`
- `inStock`, `outOfStock`, `rating`

### Cart & Checkout
- `cart`, `cartEmpty`, `subtotal`, `tax`, `deliveryFee`, `total`
- `checkout`, `continueShopping`, `proceedToCheckout`, `quantity`

### Orders
- `orders`, `orderHistory`, `orderDetails`, `orderStatus`
- `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

### Farmer Dashboard
- `farmerDashboard`, `totalOrders`, `revenue`, `activeProducts`
- `recentOrders`, `yourFarmLocation`, `viewMap`, `productSellingTrends`

### Consumer Dashboard
- `consumerDashboard`, `yourStatistics`, `totalSpent`, `wishlistItems`
- `savedAddresses`, `orderHistory`, `preferences`

### Profile
- `profile`, `editProfile`, `contactInformation`, `email`, `phone`
- `location`, `certifications`, `recentActivity`

### Notifications
- `notifications`, `unread`, `today`, `all`, `markAllAsRead`
- `filter`, `showRead`, `noNotificationsToShow`

### Chat
- `chat`, `messages`, `typeMessage`, `sendMessage`, `attachFile`, `attachImage`

## Adding New Translations

1. Open `src/locales/translations.js`
2. Add key-value pairs in all three language objects:

```javascript
const translations = {
  en: {
    // ... existing entries
    myNewKey: "My new text in English",
  },
  ta: {
    // ... existing entries
    myNewKey: "என் புதிய உரை தமிழில்",
  },
  hi: {
    // ... existing entries
    myNewKey: "मेरा नया पाठ हिंदी में",
  },
};
```

3. Use in component:
```jsx
const { t } = useTranslation();
<h1>{t("myNewKey")}</h1>
```

## Switching Languages

### Via Language Switcher (UI)
Click the language button in the navbar and select your preferred language.

### Programmatically
```jsx
import { useLanguage } from "../contexts/LanguageContext";

const { language, changeLanguage } = useLanguage();

// Change language
changeLanguage("ta");  // Switch to Tamil
changeLanguage("hi");  // Switch to Hindi
changeLanguage("en");  // Switch to English
```

## Features

✅ **Persistent Language Preference**
- Selected language is saved to localStorage
- Preference persists across sessions

✅ **Easy to Extend**
- Simple translation key system
- Easy to add new languages

✅ **Component Integration**
- Language Switcher in Navbar
- Works with dark mode
- Responsive design

✅ **Complete Coverage**
- 150+ translation keys
- All major features covered
- Supports navigation, products, orders, profile, etc.

## Current Language Status

### English (en) ✅
- Complete translations for all keys
- Primary language

### Tamil (ta) ✅
- Complete translations for all keys
- Regional language support

### Hindi (hi) ✅
- Complete translations for all keys
- National language support

## Browser LocalStorage

Language preference is stored as:
```javascript
localStorage.setItem("preferredLanguage", "ta"); // or "en", "hi"
```

## Implementation Timeline

**Phase 1: Core Setup** ✅
- LanguageContext created
- Translations file populated
- useTranslation hook created
- LanguageSwitcher component created

**Phase 2: Integration** ✅
- Added LanguageProvider to App.jsx
- Integrated LanguageSwitcher in Navbar
- All providers properly nested

**Phase 3: Component Updates** 🔄
- HomePage translations ready
- Profile pages ready for translation
- Chat components ready for translation
- Dashboard pages ready for translation

## Best Practices

1. **Always use translations**
   ```jsx
   // ❌ Bad
   <h1>Welcome</h1>
   
   // ✅ Good
   const { t } = useTranslation();
   <h1>{t("welcome")}</h1>
   ```

2. **Fallback handling**
   The `useTranslation` hook automatically returns the key if translation not found:
   ```jsx
   t("nonexistentKey") // Returns "nonexistentKey"
   ```

3. **Language-specific formatting**
   For numbers, dates, and currency, consider using locale-specific formatting
   ```jsx
   new Intl.NumberFormat(language).format(number);
   ```

## Troubleshooting

### Translations not appearing
- Ensure component is wrapped with LanguageProvider (via App.jsx)
- Check key exists in `src/locales/translations.js`
- Verify `useTranslation` hook is imported correctly

### Language not persisting
- Clear browser localStorage
- Check browser privacy settings
- Verify localStorage is enabled

### Special characters not displaying
- Ensure file is saved as UTF-8
- Browser should support Unicode
- Check console for encoding errors

## Future Enhancements

- Add more languages (Kannada, Telugu, Malayalam, etc.)
- Implement backend language preferences
- Add RTL support for Arabic/Hebrew
- Language-specific number/date formatting
- Translation management dashboard
