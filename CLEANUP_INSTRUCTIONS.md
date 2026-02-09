# Data Cleanup Instructions

## Issue Fixed
The cart and addresses were being shared across users because of old localStorage data. This has been fixed.

## What Changed

1. **Cart Context**: Now properly resets when users login/logout
2. **Location Context**: Removed localStorage backup, now uses database only
3. **Order Context**: Properly resets on user change
4. **Auth Context**: Triggers events to reload all contexts on login/logout

## To Clean Up Old Data

Run this in your browser console (F12 -> Console tab):

```javascript
// Clear old localStorage data
localStorage.removeItem('agrova_addresses');
console.log('Old address data cleared!');
```

Or simply logout and login again - the system will now properly isolate data per user.

## Testing

1. Login as user1@example.com
2. Add items to cart, add addresses
3. Logout
4. Login as user2@example.com
5. Verify cart and addresses are empty (user2's own data)
6. Add different items/addresses
7. Logout and login back as user1@example.com
8. Verify user1's original cart and addresses are still there

## Database Storage

All user data is now stored in MongoDB:
- **Cart**: `/api/cart` - user-specific cart items
- **Addresses**: `/api/addresses` - user-specific delivery addresses
- **Orders**: `/api/orders/my/orders` - user-specific orders

Each user's data is completely isolated in the database.
