# Order Splitting Implementation - Testing Guide

## Overview
This document provides step-by-step testing procedures to verify that the new multi-farmer order splitting logic works correctly.

## Test Environment Setup

### Prerequisites
- Backend running on http://localhost:5001
- Frontend running on http://localhost:5173
- MongoDB running locally with test data
- Demo users created:
  - Consumer: `consumer@demo.com` / `demo123`
  - Farmer 1: `farmer@demo.com` / `demo123`
  - Farmer 2: (Need to create for this test)

### Create Second Farmer Account (if needed)

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrova');
    
    // Create second farmer
    const farmer2 = await User.create({
      name: 'Demo Farmer 2',
      email: 'farmer2@demo.com',
      password: 'demo123',
      userType: 'farmer',
      phone: '9876543210',
      farmDetails: {
        farmName: 'Demo Farm 2',
        farmSize: '15 acres'
      }
    });
    
    console.log('Farmer 2 created:', farmer2._id);
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
"
```

### Create Products for Farmer 2

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrova');
    
    // Get Farmer 2's ID (from previous step or existing)
    const farmer2Id = 'PASTE_FARMER2_ID_HERE';
    
    const products = [
      {
        name: 'Fresh Milk',
        price: 60,
        unit: 'liter',
        stock: 50,
        farmer: farmer2Id,
        status: 'active',
        description: 'Fresh milk from Farmer 2',
        images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' }]
      },
      {
        name: 'Farm Butter',
        price: 200,
        unit: 'kg',
        stock: 30,
        farmer: farmer2Id,
        status: 'active',
        description: 'Homemade butter from Farmer 2',
        images: [{ url: 'https://images.unsplash.com/photo-1589985643453-49b6854df3c8?w=400' }]
      }
    ];
    
    await Product.insertMany(products);
    console.log('Products created for Farmer 2');
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
"
```

## Test Scenarios

### Test 1: Single Farmer Order (Baseline)

**Objective**: Verify that orders from a single farmer work as expected

**Steps**:
1. Login as `consumer@demo.com`
2. Add 2 Tomatoes from Farmer A to cart
3. Go to checkout
4. Place order with COD payment

**Expected Behavior**:
- Order created successfully
- Response should have `orders` array with 1 order
- Order's `farmer` field = Farmer A's ID
- Farmer A can see the order in their order list
- Farmer B cannot see the order

**Verification**:
```bash
# Check response structure
curl http://localhost:5001/api/orders/LAST_ORDER_ID \
  -H "Authorization: Bearer FARM_TOKEN"
```

---

### Test 2: Multi-Farmer Order (Split)

**Objective**: Verify that orders are properly split when items come from multiple farmers

**Steps**:
1. Login as `consumer@demo.com`
2. Add:
   - 5 kg Tomatoes @ ₹45 (from Farmer A)
   - 2 liters Fresh Milk @ ₹60 (from Farmer 2)
   - 3 kg Carrots @ ₹35 (from Farmer A)
3. Go to checkout
4. Place order with COD payment

**Expected Response Format**:
```json
{
  "success": true,
  "message": "Order created and split across 2 farmer(s)",
  "parentOrderId": "ORDPARENT123456",
  "summary": {
    "totalOrders": 2,
    "totalAmount": 500,
    "items": 4
  },
  "orders": [
    {
      "orderId": "ORDPARENT123456-F1",
      "parentOrderId": "ORDPARENT123456",
      "farmer": "FARMER_A_ID",
      "items": [
        { "name": "Tomatoes", "quantity": 5 },
        { "name": "Carrots", "quantity": 3 }
      ],
      "pricing": {
        "subtotal": 240,
        "delivery": 30,
        "total": 270
      }
    },
    {
      "orderId": "ORDPARENT123456-F2",
      "parentOrderId": "ORDPARENT123456",
      "farmer": "FARMER_2_ID",
      "items": [
        { "name": "Fresh Milk", "quantity": 2 }
      ],
      "pricing": {
        "subtotal": 120,
        "delivery": 20,
        "total": 140
      }
    }
  ]
}
```

**Verification Steps**:
```bash
# 1. Verify split (should create 2 orders)
curl http://localhost:5001/api/orders/farmer/orders \
  -H "Authorization: Bearer FARMER_A_TOKEN" | jq '.count'

# 2. Farmer A should see only their items
curl http://localhost:5001/api/orders/farmer/orders \
  -H "Authorization: Bearer FARMER_A_TOKEN" | jq '.data[0].items'

# 3. Farmer 2 should see only their items
curl http://localhost:5001/api/orders/farmer/orders \
  -H "Authorization: Bearer FARMER_2_TOKEN" | jq '.data[0].items'
```

**Expected Results**:
- Farmer A sees 2 items (Tomatoes + Carrots)
- Farmer 2 sees 1 item (Fresh Milk)
- Each farmer only sees their products
- Prices are split proportionally

---

### Test 3: Farmer Sees Order

**Objective**: Verify farmers can only see orders containing their products

**Setup**: Create an order as in Test 2

**Steps**:
1. Login as Farmer A
2. Go to Orders page
3. Verify:
   - Can see the order for their items
   - Only their items are shown
   - Cannot see Farmer 2's items

**Verification**:
```bash
# Farmer A's token
FARMER_A_TOKEN="..."

# Get farmer's orders
curl http://localhost:5001/api/orders/farmer/orders \
  -H "Authorization: Bearer $FARMER_A_TOKEN" \
  -H "Content-Type: application/json" | jq '.data[0]'

# Should show:
# - farmer: Farmer A's ID
# - items: Only Tomatoes and Carrots
# - No Farmer 2's products
```

---

### Test 4: Update Farmer-Specific Order

**Objective**: Verify farmers can update only their orders

**Setup**: Create multi-farmer order

**Steps**:
1. Get Farmer A's order ID from their order list
2. Farmer A updates status to "processing"
3. Verify Farmer 2's order status remains "confirmed"

**Verification**:
```bash
FARMER_A_ORDER_ID="ORDER_ID_FROM_STEP_1"
FARMER_A_TOKEN="..."

# Update Farmer A's order status
curl -X PUT http://localhost:5001/api/orders/$FARMER_A_ORDER_ID/status \
  -H "Authorization: Bearer $FARMER_A_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'

# Should return success with updated order
```

---

### Test 5: Cannot Update Other Farmer's Order

**Objective**: Verify farmers cannot update other farmers' orders

**Setup**: Create multi-farmer order with orders for both farmers

**Steps**:
1. Get Farmer B's order ID
2. Try to update it as Farmer A
3. Should receive 401 Unauthorized

**Verification**:
```bash
FARMER_B_ORDER_ID="..."
FARMER_A_TOKEN="..."

curl -X PUT http://localhost:5001/api/orders/$FARMER_B_ORDER_ID/status \
  -H "Authorization: Bearer $FARMER_A_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'

# Should return: 
# {
#   "success": false,
#   "message": "Not authorized to update this order"
# }
```

---

### Test 6: Customer Sees All Orders via Parent ID

**Objective**: Verify customers can track all parts of their split order

**API Enhancement** (future): Add endpoint to get all orders by parentOrderId

```bash
# Get all orders by parent order ID
curl "http://localhost:5001/api/orders?parentOrderId=ORDPARENT123456" \
  -H "Authorization: Bearer $CONSUMER_TOKEN"
```

---

### Test 7: Pricing Distribution Accuracy

**Objective**: Verify delivery costs and discounts are split fairly

**Sample Calculation**:
- Total cart: 8 items
- Subtotal: ₹500
- Delivery: ₹50
- Discount: ₹10

**Items**:
- Farmer A items: ₹300 (60%)
- Farmer B items: ₹200 (40%)

**Expected Split**:
- Farmer A: ₹300 + ₹30 delivery - ₹6 discount = ₹324
- Farmer B: ₹200 + ₹20 delivery - ₹4 discount = ₹216

**Verification**:
```javascript
// In order response, check:
orders[0].pricing.total // Should be ₹324
orders[1].pricing.total // Should be ₹216
// Total: ₹540 (matches ₹500 + ₹50 - ₹10)
```

---

## Database Verification

### Check Split Orders Were Created

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrova');
    
    // Get the latest order
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('farmer', 'name')
      .populate('user', 'name');
    
    console.table(orders.map(o => ({
      orderId: o.orderId,
      parentOrderId: o.parentOrderId,
      farmer: o.farmer?.name || 'N/A',
      user: o.user?.name,
      itemCount: o.items.length,
      total: o.pricing.total
    })));
    
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
"
```

---

## Regression Testing

### Verify Legacy Orders Still Work

**Objective**: Ensure backward compatibility with existing orders

**Steps**:
1. Query database for old orders without `farmer` field
2. Verify farmer can still see and update them
3. Verify stock restoration on cancellation still works

**Verification**:
```bash
# Query for legacy orders
curl http://localhost:5001/api/orders/farmer/orders \
  -H "Authorization: Bearer $FARMER_TOKEN" | jq '.data | map(select(.farmer == null)) | length'
```

---

## Performance Testing

### Check Query Performance

**Expected Indexes**:
```bash
db.orders.getIndexes()
# Should include:
# - { farmer: 1, createdAt: -1 }
# - { parentOrderId: 1 }
# - { user: 1, createdAt: -1 }
```

### Monitor Query Times

```bash
# This should complete in <100ms even with many orders
curl http://localhost:5001/api/orders/farmer/orders \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -w "\n%{time_total}s"
```

---

## Troubleshooting

### Issue: Order not split as expected

**Debug Steps**:
1. Check if items have `farmer` populated
2. Verify `Product.farmer` field is set for all items
3. Check database for missing farmer references

**Fix**:
```bash
# Populate missing farmer references on products
cd backend
node -e "
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrova');
  
  const productsWithoutFarmer = await Product.find({ farmer: { \$exists: false } });
  console.log('Products without farmer:', productsWithoutFarmer.length);
  
  process.exit(0);
})();
"
```

### Issue: Farmer sees items from other farmers

**Debug Steps**:
1. Check if `farmer` field is properly populated in Order
2. Verify getFarmerOrders query filters correctly
3. Check legacy order handling

---

## Success Criteria

✅ Single farmer orders work as before
✅ Multi-farmer orders create separate orders
✅ Each farmer only sees their items
✅ Pricing is split proportionally
✅ Customer can track all parts via parenting
✅ Backward compatibility maintained
✅ Stock management remains atomic
✅ Authorization checks prevent unauthorized access
