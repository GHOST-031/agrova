# 📍 Location Features Documentation

## Overview
Complete location management system with interactive maps, address management, and GPS pinpointing.

## Features Implemented

### 1. **LocationContext** (`src/contexts/LocationContext.jsx`)
Global state management for addresses and location data:
- ✅ Add, update, delete addresses
- ✅ Set default address
- ✅ Select address for delivery
- ✅ Get current GPS location
- ✅ LocalStorage persistence

### 2. **Interactive Map Component** (`src/components/ui/MapPicker.jsx`)
Leaflet-based map with full interactivity:
- ✅ Click to select location
- ✅ Drag marker to adjust position
- ✅ Get current location button
- ✅ Reverse geocoding (coordinates → address)
- ✅ Real-time coordinate display
- ✅ OpenStreetMap integration

### 3. **Address Management Page** (`src/pages/consumer/AddressesPage.jsx`)
Complete CRUD interface for addresses:
- ✅ View all saved addresses
- ✅ Add new address with map picker
- ✅ Edit existing addresses
- ✅ Delete addresses
- ✅ Set default address
- ✅ Address types: Home, Work, Other
- ✅ Delivery instructions
- ✅ GPS coordinates storage

### 4. **Enhanced Checkout** (`src/pages/consumer/CheckoutPage.jsx`)
Integrated with location system:
- ✅ Select from saved addresses
- ✅ Change delivery address
- ✅ Quick access to manage addresses
- ✅ Display GPS coordinates
- ✅ Default address auto-selection

## How to Use

### For Users

#### 1. **Add a New Address**
1. Navigate to "Addresses" in the navbar
2. Click "Add New Address"
3. Fill in contact details (name, phone)
4. Enter street address, landmark, city, state, zipcode
5. Click "Select Location on Map"
6. Either:
   - Click anywhere on the map to set location
   - Click the navigation button to use current GPS
   - Drag the marker to fine-tune
7. Add delivery instructions (optional)
8. Click "Save Address"

#### 2. **Managing Addresses**
- **Edit**: Click the edit button on any address card
- **Delete**: Click the trash icon to remove
- **Set Default**: Click "Set as Default" for preferred address
- **View on Map**: Coordinates are displayed for each address

#### 3. **Using Address in Checkout**
1. Go to checkout page
2. Selected address shows automatically (default if set)
3. Click "Change" to select a different address
4. Click "Manage Addresses" to add/edit addresses
5. Proceed with payment

### For Developers

#### Import LocationContext
```jsx
import { useLocation } from '../contexts/LocationContext';

const MyComponent = () => {
  const {
    addresses,
    selectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    getCurrentLocation
  } = useLocation();
  
  // Use location features...
};
```

#### Use MapPicker Component
```jsx
import MapPicker from '../components/ui/MapPicker';

<MapPicker
  onLocationSelect={(location) => {
    console.log(location.latitude, location.longitude, location.address);
  }}
  initialPosition={{ lat: 28.6139, lng: 77.209 }}
  height="400px"
  zoom={13}
  showCurrentLocation={true}
/>
```

#### Add New Address
```jsx
const newAddress = {
  label: 'Home', // or 'Work', 'Other'
  name: 'John Doe',
  phone: '+91 98765 43210',
  street: '123 Main St',
  landmark: 'Near Park',
  city: 'Mumbai',
  state: 'Maharashtra',
  zipcode: '400001',
  latitude: 19.0760,
  longitude: 72.8777,
  instructions: 'Ring the bell twice'
};

addAddress(newAddress);
```

## Technical Details

### Libraries Used
- **leaflet**: ^4.2.1 - Open-source mapping library
- **react-leaflet**: ^4.2.1 - React components for Leaflet
- **OpenStreetMap**: Tile provider (free, no API key needed)
- **Nominatim**: Reverse geocoding service

### Data Structure

```typescript
interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  instructions?: string;
  isDefault: boolean;
  createdAt: string;
}
```

### Storage
- Addresses are stored in `localStorage` under key: `agrova_addresses`
- Automatically synced on changes
- Persists across sessions

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/consumer/addresses` | AddressesPage | Manage all addresses |
| `/consumer/checkout` | CheckoutPage | Select address for order |

## Features in Action

### 1. GPS Location
- Uses browser's Geolocation API
- Requires user permission
- Falls back to manual selection if denied

### 2. Map Interactions
- **Click**: Set marker at clicked position
- **Drag**: Move marker to new position
- **Navigation Button**: Jump to current GPS location
- **Zoom**: Scroll wheel or +/- buttons

### 3. Address Validation
- Required fields: Name, phone, street, city, state, zipcode, GPS location
- Optional fields: Landmark, instructions
- Form validation with error messages

### 4. Address Types
- **Home**: 🏠 Green icon
- **Work**: 💼 Blue icon
- **Other**: 📍 Forest icon

## Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (iOS location may require HTTPS)
- ✅ Mobile browsers (responsive design)

## Future Enhancements
- [ ] Address autocomplete with Google Places API
- [ ] Distance calculation to farms
- [ ] Delivery zone validation
- [ ] Multiple delivery time slots
- [ ] Address sharing via link
- [ ] Export addresses to file

## Troubleshooting

### Map not loading?
- Check internet connection
- Disable ad blockers
- Clear browser cache

### Can't get current location?
- Grant browser location permissions
- Enable location services on device
- Use manual map selection as fallback

### Addresses not persisting?
- Check if localStorage is enabled
- Check browser privacy settings
- Try incognito/private mode to test

## Demo Credentials
For testing, use any of the following:
- **Consumer**: consumer@test.com / password123
- Navigate to Addresses page
- Add sample addresses with GPS pins

---

**Built with ❤️ for Agrova Marketplace**
