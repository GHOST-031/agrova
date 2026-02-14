# Order Splitting - Real-World Scenarios

## Scenario 1: Single Farmer Order (No Splitting)

### Situation
Customer orders only from one farmer.

**Order Details**:
- 5 kg Tomatoes @ ₹45/kg = ₹225 (from Farmer A)
- Delivery: ₹30
- Total: ₹255

**Backend Processing**:
```javascript
itemsByFarmer = {
  "farmer_a_id": [
    { product: "tomato_id", quantity: 5, farmer: "farmer_a_id", price: 45 }
  ]
}

// Only 1 farmer, so creates 1 order
orders = [
  {
    orderId: "ORD123-F1",
    parentOrderId: "ORD123",
    farmer: "farmer_a_id",
    items: [{ name: "Tomatoes", quantity: 5, price: 45 }],
    pricing: {
      subtotal: 225,
      delivery: 30,
      total: 255
    }
  }
]
```

### API Response
```json
{
  "success": true,
  "message": "Order created and split across 1 farmer(s)",
  "parentOrderId": "ORD123",
  "orders": [
    {
      "orderId": "ORD123-F1",
      "farmer": "farmer_a_id",
      "items": [{ "name": "Tomatoes", "quantity": 5 }],
      "pricing": { "total": 255 }
    }
  ]
}
```

### What Farmers See
- **Farmer A**: ✅ Sees their order (5 kg Tomatoes)
- **Farmer B**: ❌ Sees nothing (no orders for them)

---

## Scenario 2: Two Farmers Order (Split)

### Situation
Customer orders vegetables from Farmer A and dairy from Farmer B.

**Order Details**:
- 5 kg Tomatoes @ ₹45/kg = ₹225 (from Farmer A)
- 3 kg Carrots @ ₹35/kg = ₹105 (from Farmer A)
- 2 liters Milk @ ₹60/liter = ₹120 (from Farmer B)
- **Total Subtotal**: ₹450
- **Delivery**: ₹50
- **Total**: ₹500

### Backend Processing

**Step 1: Group by Farmer**
```javascript
itemsByFarmer = {
  "farmer_a_id": [
    { product: "tomato_id", quantity: 5, farmer: "farmer_a_id", price: 45 },
    { product: "carrot_id", quantity: 3, farmer: "farmer_a_id", price: 35 }
  ],
  "farmer_b_id": [
    { product: "milk_id", quantity: 2, farmer: "farmer_b_id", price: 60 }
  ]
}
```

**Step 2: Calculate Proportional Pricing**

For **Farmer A**:
```
Items subtotal: 225 + 105 = 330
Proportion: 330 / 450 = 73.3%
Delivery (proportional): 50 * 0.733 = 36.65 ≈ 37 (rounded)
Total: 330 + 37 = 367
```

For **Farmer B**:
```
Items subtotal: 120
Proportion: 120 / 450 = 26.7%
Delivery (proportional): 50 * 0.267 = 13.35 ≈ 13 (rounded)
Total: 120 + 13 = 133
```

**Step 3: Create Separate Orders**
```javascript
orders = [
  {
    orderId: "ORD500-F1",
    parentOrderId: "ORD500",
    farmer: "farmer_a_id",
    items: [
      { name: "Tomatoes", quantity: 5, price: 45 },
      { name: "Carrots", quantity: 3, price: 35 }
    ],
    pricing: {
      subtotal: 330,
      delivery: 37,
      total: 367
    }
  },
  {
    orderId: "ORD500-F2",
    parentOrderId: "ORD500",
    farmer: "farmer_b_id",
    items: [
      { name: "Milk", quantity: 2, price: 60 }
    ],
    pricing: {
      subtotal: 120,
      delivery: 13,
      total: 133
    }
  }
]
```

### API Response
```json
{
  "success": true,
  "message": "Order created and split across 2 farmer(s)",
  "parentOrderId": "ORD500",
  "summary": {
    "totalOrders": 2,
    "totalAmount": 500,
    "items": 4
  },
  "orders": [
    {
      "orderId": "ORD500-F1",
      "parentOrderId": "ORD500",
      "farmer": "farmer_a_id",
      "items": [
        { "name": "Tomatoes", "quantity": 5, "price": 45 },
        { "name": "Carrots", "quantity": 3, "price": 35 }
      ],
      "pricing": {
        "subtotal": 330,
        "delivery": 37,
        "total": 367
      }
    },
    {
      "orderId": "ORD500-F2",
      "parentOrderId": "ORD500",
      "farmer": "farmer_b_id",
      "items": [
        { "name": "Milk", "quantity": 2, "price": 60 }
      ],
      "pricing": {
        "subtotal": 120,
        "delivery": 13,
        "total": 133
      }
    }
  ]
}
```

### What Each Actor Sees

**Frontend (Customer)**:
```
Order Placed Successfully!
Order split across 2 farmers

Parent Order ID: ORD500
├─ Order 1 (ORD500-F1)
│  ├─ 5 kg Tomatoes
│  ├─ 3 kg Carrots
│  └─ Total: ₹367
│
└─ Order 2 (ORD500-F2)
   ├─ 2 liters Milk
   └─ Total: ₹133

Grand Total: ₹500
```

**Farmer A's Dashboard**:
```
✅ New Order: ORD500-F1
Status: Confirmed
Items:
- Tomatoes (5 kg) @ ₹45 = ₹225
- Carrots (3 kg) @ ₹35 = ₹105
Subtotal: ₹330
Delivery: ₹37
Total to Collect: ₹367

Delivery Address:
[Customer's address from form]
```

**Farmer B's Dashboard**:
```
✅ New Order: ORD500-F2
Status: Confirmed
Items:
- Milk (2 liters) @ ₹60 = ₹120
Subtotal: ₹120
Delivery: ₹13
Total to Collect: ₹133

Delivery Address:
[Customer's address from form]
```

**Admin Dashboard**:
```
Order Group: ORD500 (Split)
├─ Sub-order: ORD500-F1 (Farmer A) - ₹367
├─ Sub-order: ORD500-F2 (Farmer B) - ₹133
└─ Total: ₹500
```

---

## Scenario 3: Three Farmers Order

### Situation
Customer orders from three different farmers in one transaction.

**Items**:
- 4 kg Tomatoes @ ₹45 (Farmer A) = ₹180
- 1 kg Ghee @ ₹500 (Farmer C) = ₹500
- 2 kg Potatoes @ ₹25 (Farmer B) = ₹50
- **Subtotal**: ₹730
- **Delivery**: ₹50
- **Total**: ₹780

### Proportional Split Calculation

| Farmer | Items | % | Delivery | Total |
|--------|-------|---|----------|-------|
| A | ₹180 | 24.7% | ₹12.35 | ₹192.35 |
| B | ₹50 | 6.8% | ₹3.40 | ₹53.40 |
| C | ₹500 | 68.5% | ₹34.25 | ₹534.25 |
| **Total** | **₹730** | **100%** | **₹50** | **₹780** |

### Three Orders Created
```javascript
[
  {
    orderId: "ORD780-F1",
    farmer: "farmer_a_id",
    items: [{ name: "Tomatoes", quantity: 4 }],
    pricing: { total: 192.35 }
  },
  {
    orderId: "ORD780-F2",
    farmer: "farmer_b_id",
    items: [{ name: "Potatoes", quantity: 2 }],
    pricing: { total: 53.40 }
  },
  {
    orderId: "ORD780-F3",
    farmer: "farmer_c_id",
    items: [{ name: "Ghee", quantity: 1 }],
    pricing: { total: 534.25 }
  }
]
```

### What Each Farmer Sees
- **Farmer A**: Only sees ORD780-F1 (4 kg Tomatoes)
- **Farmer B**: Only sees ORD780-F2 (2 kg Potatoes)
- **Farmer C**: Only sees ORD780-F3 (1 kg Ghee worth ₹534.25)

---

## Scenario 4: Order Update (Farmer Perspective)

### Initial State
- Customer placed multi-farmer order
- Three separate orders created
- All in "confirmed" status

### Farmer A Updates Order Status

**API Call**:
```bash
PUT /api/orders/ORD780-F1/status
Body: { "status": "processing" }
Auth: Farmer A's token
```

**Result**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD780-F1",
    "status": "processing",
    "statusHistory": [
      { "status": "confirmed", "timestamp": "2025-02-14T10:00:00Z" },
      { "status": "processing", "timestamp": "2025-02-14T10:05:00Z" }
    ]
  }
}
```

**What Happens**:
- ✅ Farmer A's order (ORD780-F1) changes to "processing"
- ✅ Farmer B's order (ORD780-F2) remains "confirmed"
- ✅ Farmer C's order (ORD780-F3) remains "confirmed"
- ✅ Customer sees partial fulfillment status

### Farmer B Tries to Update Farmer C's Order

**API Call**:
```bash
PUT /api/orders/ORD780-F3/status
Body: { "status": "processing" }
Auth: Farmer B's token
```

**Result** (Unauthorized):
```json
{
  "success": false,
  "message": "Not authorized to update this order"
}
```

**Why**: 
- Order ORD780-F3 has `farmer` = Farmer C's ID
- Current user (Farmer B) is not Farmer C
- Authorization check rejects the request

---

## Scenario 5: Cancellation (Partial vs Full)

### Situation
- Customer ordered items from 3 farmers
- Wants to cancel Farmer B's portion only

**Current Orders**:
- ORD780-F1: Tomatoes (₹192)
- ORD780-F2: Potatoes (₹53) ← Cancel this
- ORD780-F3: Ghee (₹534)

### API Call
```bash
PUT /api/orders/ORD780-F2/cancel
Auth: Customer token
```

**Result**:
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "ORD780-F2",
    "status": "cancelled",
    "items": [{ "name": "Potatoes", "quantity": 2 }]
  }
}
```

**Stock Restoration**:
```javascript
// For each item in ORD780-F2
// Restore product stock
Potatoes.stock += 2; // Back to original stock
```

**What Happens**:
- ✅ ORD780-F2 status becomes "cancelled"
- ✅ Farmer B doesn't need to prepare Potatoes
- ✅ Stock returned to Potatoes inventory
- ✅ ORD780-F1 and ORD780-F3 remain active
- ✅ Customer refunded ₹53 for this item
- ⚠️ Other orders continue processing

---

## Key Takeaways

| Aspect | Behavior |
|--------|----------|
| **Order Creation** | Items automatically grouped by farmer |
| **Separate Orders** | Each farmer gets only their order |
| **Pricing** | Split proportionally by item value |
| **Visibility** | Farmers only see orders with their items |
| **Updates** | Each order can be updated independently |
| **Cancellation** | Can cancel one farmer's portion without affecting others |
| **Stock** | Each item's stock managed separately |
| **Authorization** | Farmers can't see/update other farmers' orders |

---

## Testing Checklist

- [ ] Scenario 1: Single farmer order works
- [ ] Scenario 2: Two farmers split correctly
- [ ] Scenario 3: Three farmers split correctly
- [ ] Pricing split is accurate
- [ ] Each farmer sees only their items
- [ ] Order status updates work independently
- [ ] Unauthorized access is blocked
- [ ] Partial cancellation works
- [ ] Stock restoration is correct
- [ ] Customer can view all parts of their order
