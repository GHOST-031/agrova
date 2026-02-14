# Order Splitting by Farmer - Implementation Guide

## Overview
This implementation addresses a critical business logic issue where orders from multiple farmers were being placed as a single order. Now, when a customer purchases items from multiple farmers, the system automatically splits the order so each farmer only sees their specific items.

## What Changed

### 1. **Order Model Update** (`backend/models/Order.js`)
- Added `parentOrderId` field: Links child orders together when split by farmer
- Added `farmer` field: Identifies which farmer this specific order belongs to
- Updated indexes: Added farmer-specific and parentOrderId indexes for better query performance

### 2. **Order Creation Logic** (`backend/controllers/orderController.js` - `createOrder`)

#### Old Flow:
```
User orders 5 tomatoes (from Farmer A) + 3 carrots (from Farmer B)
→ Single order created with both items
→ Both farmers see the same order with each other's items
```

#### New Flow:
```
User orders 5 tomatoes (from Farmer A) + 3 carrots (from Farmer B)
→ Items grouped by farmer
→ Two separate orders created:
   - Order 1: 5 tomatoes (Farmer A's order)
   - Order 2: 3 carrots (Farmer B's order)
→ Linked by parentOrderId
→ Pricing split proportionally
→ Each farmer only sees their order
```

### 3. **Order Retrieval for Farmers** (`backend/controllers/orderController.js` - `getFarmerOrders`)

**New behavior:**
- Queries for orders where `farmer` field equals the farmer's ID
- Includes backward compatibility for legacy orders
- Legacy orders: Filters items to show only items belonging to this farmer

### 4. **Frontend Updates** (`src/pages/consumer/CheckoutPage.jsx` & `src/contexts/OrderContext.jsx`)

- Updated CheckoutPage to handle multi-farmer order response
- Updated OrderContext to properly add multiple orders to state
- Enhanced toast messages to indicate splitting across farmers

## Response Format

### Old Format:
```json
{
  "success": true,
  "data": {
    "_id": "order123",
    "orderId": "ORD123456",
    "items": [
      { "product": "prod1", "farmer": "farmer1_id" },
      { "product": "prod2", "farmer": "farmer2_id" }
    ]
  }
}
```

### New Format:
```json
{
  "success": true,
  "message": "Order created and split across 2 farmer(s)",
  "parentOrderId": "ORDPARENT123456",
  "summary": {
    "totalOrders": 2,
    "totalAmount": 500,
    "items": 8
  },
  "orders": [
    {
      "_id": "order123",
      "orderId": "ORDPARENT123456-F1",
      "parentOrderId": "ORDPARENT123456",
      "farmer": "farmer1_id",
      "items": [{ "product": "prod1" }],
      "pricing": { "subtotal": 250, "total": 250 }
    },
    {
      "_id": "order124",
      "orderId": "ORDPARENT123456-F2",
      "parentOrderId": "ORDPARENT123456",
      "farmer": "farmer2_id",
      "items": [{ "product": "prod2" }],
      "pricing": { "subtotal": 250, "total": 250 }
    }
  ]
}
```

## Data Migration for Existing Orders

**Existing orders are backwards compatible:**
- Legacy orders without `farmer` field continue to work
- When a farmer queries their orders, items are filtered to show only their products
- New orders automatically use the correct splitting logic

## Key Features

✅ **Automatic Order Splitting**: No manual intervention needed
✅ **Fair Pricing Distribution**: Delivery and discount costs split proportionally
✅ **Linked Orders**: All orders linked via `parentOrderId` for customer reference
✅ **Farmer Isolation**: Each farmer only sees items they fulfill
✅ **Backwards Compatible**: Existing legacy orders continue to work
✅ **Atomic Transactions**: Stock updates remain atomic across all splits

## Example Scenario

**User orders:**
- 5 kg Tomatoes @ ₹45 (from Farmer A) = ₹225
- 3 kg Carrots @ ₹35 (from Farmer B) = ₹105
- Delivery: ₹50
- Total: ₹380

**System creates:**

**Order 1 (Farmer A):**
- Items: 5 kg Tomatoes @ ₹45 = ₹225
- Delivery (proportional): ₹30 (225/330 × 50)
- Total: ₹255
- Only Farmer A sees this order

**Order 2 (Farmer B):**
- Items: 3 kg Carrots @ ₹35 = ₹105
- Delivery (proportional): ₹20 (105/330 × 50)
- Total: ₹125
- Only Farmer B sees this order

**Customer's view:**
- One parent order (ORD...) containing both split orders
- Can track both fulfillments together
- Linked by `parentOrderId`

## Testing

### Test Scenario:
1. Add items from multiple farmers to cart
2. Proceed to checkout
3. Place order
4. Check response contains multiple orders
5. Login as Farmer A → Should see only their items
6. Login as Farmer B → Should see only their items
7. Login as customer → Should see all items under one parent order

### API Endpoints to Test:
```
POST /api/orders (creates split orders)
GET /api/orders/farmer (returns farmer-specific orders)
GET /api/orders/:id (individual order details)
PUT /api/orders/:id/status (farmer updates their order)
```

## Important Notes

⚠️ **Payment Handling**: 
- Payment is captured once for the entire order
- Split into farmer orders after successful payment
- If payment fails, entire order creation fails (atomic)

⚠️ **Cancellations**:
- Parent order concept allows tracking related cancellations
- Each farmer's order can be cancelled independently
- Refunds may need adjustment if splitting occurred

⚠️ **Admin Dashboard**:
- May need updates to show split orders comprehensively
- Use `parentOrderId` to group related orders

## Future Enhancements

1. **Customer Order Grouping**: Show split orders as a single transaction in customer dashboard
2. **Consolidated Pickup**: Allow customers to pick up from one location if multiple farmers agree
3. **Bulk Shipping**: Farmers near each other could coordinate shipping
4. **Dynamic Pricing**: Split delivery cost based on farmer location proximity
