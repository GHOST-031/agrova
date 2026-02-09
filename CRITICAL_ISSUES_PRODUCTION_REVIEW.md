# 🚨 CRITICAL ISSUES - PRODUCTION READINESS REVIEW
## Agrova Marketplace - Complete Code Audit

**Review Date:** February 9, 2026  
**Severity Levels:** 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🔵 LOW

---

## 🔴 CRITICAL ISSUES (MUST FIX BEFORE PRODUCTION)

### 1. **RACE CONDITION: Stock Deduction Without Transaction**
**Location:** `backend/controllers/orderController.js:64`  
**Severity:** 🔴 CRITICAL  
**Impact:** Multiple simultaneous orders can oversell products

```javascript
// CURRENT (BROKEN):
for (const item of items) {
  const product = await Product.findById(item.product);
  if (product.stock < item.quantity) { /* check */ }
  await product.updateStock(-item.quantity); // ❌ NOT ATOMIC
}
```

**Problem:**
- User A checks stock: 10 available ✓
- User B checks stock: 10 available ✓
- User A buys 10 items → stock = 0
- User B buys 10 items → stock = -10 ❌ OVERSOLD

**Fix Required:**
```javascript
// Use MongoDB atomic operations with session
const session = await mongoose.startSession();
session.startTransaction();

try {
  for (const item of items) {
    const product = await Product.findOneAndUpdate(
      { 
        _id: item.product, 
        stock: { $gte: item.quantity },
        status: 'active'
      },
      { 
        $inc: { stock: -item.quantity, soldCount: item.quantity }
      },
      { session, new: true }
    );
    
    if (!product) {
      throw new Error(`${item.product} is out of stock`);
    }
    processedItems.push({ /* item data */ });
  }
  
  const order = await Order.create([orderData], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

### 2. **SECURITY: JWT Secret Exposed in Repository**
**Location:** `backend/.env`  
**Severity:** 🔴 CRITICAL  
**Impact:** Anyone with repo access can forge authentication tokens

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**Problems:**
1. Weak, predictable secret
2. **.env file is committed to Git** ❌
3. No secret rotation mechanism
4. Same secret in dev/prod

**Fix Required:**
1. Generate strong secret: `openssl rand -base64 32`
2. Add `.env` to `.gitignore` immediately
3. Use environment-specific secrets
4. For production: Use secret management (AWS Secrets Manager, HashiCorp Vault)
5. Remove `.env` from git history:
```bash
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch backend/.env' \
--prune-empty --tag-name-filter cat -- --all
```

---

### 3. **SECURITY: Razorpay Secrets Exposed Publicly**
**Location:** `backend/.env:24-25`  
**Severity:** 🔴 CRITICAL  
**Impact:** Anyone can create fake payments in your account

```env
RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
RAZORPAY_KEY_SECRET=thisissecretkey
```

**Fix Required:**
1. **IMMEDIATELY** regenerate Razorpay keys
2. Remove from git history
3. Use environment-specific keys
4. Never commit payment gateway credentials

---

### 4. **DATA INTEGRITY: Order Creation Fails Without Rollback**
**Location:** `backend/controllers/orderController.js:64`  
**Severity:** 🔴 CRITICAL  
**Impact:** Stock deducted but order fails → inventory loss

**Scenario:**
1. Stock reduced for 5 products ✓
2. Order creation fails on payment processing ❌
3. **Stock never restored** → Money lost

**Fix:** Use transactions (see Issue #1)

---

### 5. **SECURITY: No Input Validation/Sanitization**
**Location:** All controllers  
**Severity:** 🔴 CRITICAL  
**Impact:** NoSQL Injection, XSS attacks

**Example Attack:**
```javascript
// Attacker sends:
{
  "email": { "$ne": null },  // NoSQL injection
  "password": { "$regex": ".*" }
}
// This bypasses authentication!
```

**Fix Required:**
```javascript
const { body, param, query, validationResult } = require('express-validator');

// Add validation middleware
exports.createOrder = [
  body('items').isArray({ min: 1 }).withMessage('Items array required'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1, max: 1000 }),
  body('deliveryAddress.name').trim().escape().notEmpty(),
  body('deliveryAddress.phone').matches(/^[0-9]{10}$/),
  body('deliveryAddress.pincode').matches(/^[0-9]{6}$/),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of controller
  }
];
```

---

### 6. **AUTHENTICATION: Token Never Expires Functionally**
**Location:** `backend/middleware/auth.js`  
**Severity:** 🔴 CRITICAL  
**Impact:** Stolen tokens work for 30 days

```javascript
expiresIn: process.env.JWT_EXPIRE || '30d'  // ❌ TOO LONG
```

**Problems:**
1. No refresh token mechanism
2. No token blacklisting on logout
3. Compromised tokens valid for a month

**Fix Required:**
```javascript
// Short-lived access tokens + refresh tokens
accessToken: jwt.sign({ id }, SECRET, { expiresIn: '15m' });
refreshToken: jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '7d' });

// Store refresh tokens in database
// Implement token rotation on refresh
// Blacklist on logout
```

---

### 7. **SECURITY: CORS Allows All Origins in Production**
**Location:** `backend/server.js:56`  
**Severity:** 🔴 CRITICAL  
**Impact:** Any website can make requests to your API

```javascript
} else {
  callback(null, true); // ❌ Allow all origins in development
}
```

**Problem:** This runs in PRODUCTION too if `NODE_ENV` is set wrong

**Fix:**
```javascript
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(new Error('No origin header'));
    
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL]  // Only production domain
      : ['http://localhost:5173', 'http://localhost:5174'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### 8. **DATABASE: No Indexes on Critical Queries**
**Location:** `backend/models/`  
**Severity:** 🔴 CRITICAL  
**Impact:** Slow queries → Timeouts at scale

**Missing Indexes:**
```javascript
// User.js - MISSING
userSchema.index({ email: 1 }, { unique: true });

// Product.js - PARTIAL (has text index only)
productSchema.index({ farmer: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Order.js - MISSING ALL
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ 'items.farmer': 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Cart.js - HAS UNIQUE BUT NO COMPOUND
cartSchema.index({ user: 1, 'items.product': 1 });
```

---

### 9. **SCALABILITY: N+1 Query Problem**
**Location:** `backend/controllers/orderController.js:34`  
**Severity:** 🔴 CRITICAL  
**Impact:** 100 item order = 101 database queries

```javascript
for (const item of items) {
  const product = await Product.findById(item.product); // ❌ N queries
  // ...
}
```

**At 1000 orders/minute:**
- Average 5 items/order = 5000 queries/minute
- MongoDB crashes under load

**Fix:**
```javascript
// Bulk fetch all products at once
const productIds = items.map(item => item.product);
const products = await Product.find({ 
  _id: { $in: productIds },
  status: 'active'
});

const productMap = new Map(products.map(p => [p._id.toString(), p]));

for (const item of items) {
  const product = productMap.get(item.product.toString());
  if (!product) {
    throw new Error(`Product ${item.product} not found`);
  }
  // Validate stock...
}
```

---

### 10. **API: No Rate Limiting on Critical Endpoints**
**Location:** `backend/server.js:33-37`  
**Severity:** 🔴 CRITICAL  
**Impact:** DDoS, brute force attacks, resource exhaustion

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000  // ❌ WAY TOO HIGH for production
});
app.use('/api/', limiter); // ❌ Same limit for ALL endpoints
```

**Problems:**
1. Login attempts: 1000/15min = Easy brute force
2. Order creation: 1000/15min = Can bankrupt you
3. No per-user limits

**Fix:**
```javascript
// Strict limits for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 attempts per 15 minutes
  skipSuccessfulRequests: true
});
app.use('/api/auth/login', authLimiter);

// Moderate limits for mutations
const mutationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30  // 30 requests per minute
});
app.use('/api/orders', mutationLimiter);
app.use('/api/cart', mutationLimiter);

// Generous limits for reads
const readLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
});
app.use('/api/products', readLimiter);
```

---

## 🟠 HIGH PRIORITY ISSUES

### 11. **Error Handling: Stack Traces Leak in Production**
**Location:** `backend/server.js:112`

```javascript
...(process.env.NODE_ENV === 'development' && { stack: err.stack })
```

**Problem:** If `NODE_ENV` is misconfigured, stack traces leak to client

**Fix:**
```javascript
res.status(err.status || 500).json({
  success: false,
  message: process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message,
  ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
});
```

---

### 12. **Frontend: Hardcoded API URL**
**Location:** `src/utils/api.js:2`

```javascript
export const API_URL = "http://localhost:5001/api";  // ❌ Hardcoded
```

**Problem:** Won't work in production/staging

**Fix:**
```javascript
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Create .env files:
// .env.development
VITE_API_URL=http://localhost:5001/api

// .env.production
VITE_API_URL=https://api.agrova.com/api

// .env.staging
VITE_API_URL=https://staging-api.agrova.com/api
```

---

### 13. **Authentication: No XSS Protection for Tokens**
**Location:** Frontend stores token in `localStorage`

**Problem:** XSS attacks can steal tokens from localStorage

**Current:**
```javascript
localStorage.setItem("f2c_token", data.token);  // ❌ Vulnerable to XSS
```

**Better (but not perfect):**
```javascript
// Use httpOnly cookies instead
// Backend sends:
res.cookie('token', token, {
  httpOnly: true,  // JavaScript can't access
  secure: true,    // HTTPS only
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000  // 15 minutes
});
```

---

### 14. **Cart: Race Condition on Simultaneous Updates**
**Location:** `backend/models/Cart.js:46`

```javascript
cartSchema.methods.addItem = async function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString()
  );
  
  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;  // ❌ Not atomic
  }
  // ...
}
```

**Problem:** Two add-to-cart requests → one update lost

**Fix:** Use atomic operations
```javascript
await Cart.findOneAndUpdate(
  { user: userId, 'items.product': productId },
  { $inc: { 'items.$.quantity': quantity } },
  { new: true }
);
```

---

### 15. **No Pagination Limits Enforced**
**Location:** `backend/controllers/productController.js:16`

```javascript
limit = 20  // ❌ Default, but user can override
// ...
.limit(Number(limit))  // ❌ No max cap
```

**Attack:**
```javascript
fetch('/api/products?limit=999999')  // ❌ Load entire database
```

**Fix:**
```javascript
const limit = Math.min(Number(req.query.limit) || 20, 100);  // Cap at 100
```

---

### 16. **Password Validation Too Weak**
**Location:** `backend/models/User.js:18`

```javascript
minlength: [6, 'Password must be at least 6 characters']  // ❌ Too weak
```

**Fix:**
```javascript
// In authController validation
body('password')
  .isLength({ min: 8 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage('Password must contain uppercase, lowercase, number, special char')
```

---

### 17. **Email Not Verified Before Critical Actions**
**Location:** All controllers

**Problem:** Users can order without verifying email

**Fix:**
```javascript
// In protect middleware
if (!req.user.isVerified) {
  return res.status(403).json({
    message: 'Please verify your email before placing orders'
  });
}
```

---

### 18. **No Webhook Signature Verification**
**Location:** `backend/controllers/paymentController.js`

**Problem:** Anyone can fake payment success webhooks

**Current:** ✅ Has signature verification (good!)  
**But missing:** Idempotency checks

**Fix:**
```javascript
// Store processed webhook IDs
const processedWebhooks = new Set();  // Use Redis in production

if (processedWebhooks.has(webhookId)) {
  return res.status(200).json({ message: 'Already processed' });
}
processedWebhooks.add(webhookId);
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 19. **No Logging/Monitoring**
**Severity:** 🟡 MEDIUM  
**Impact:** Can't debug production issues

**Missing:**
- Structured logging (Winston, Pino)
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, DataDog)
- Request tracing

**Fix:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log every request
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    user: req.user?._id,
    timestamp: new Date()
  });
  next();
});
```

---

### 20. **No Database Backup Strategy**
**Severity:** 🟡 MEDIUM  
**Impact:** Data loss on failure

**Required:**
- Automated daily backups
- Point-in-time recovery
- Backup testing
- Disaster recovery plan

---

### 21. **No Health Check Endpoints**
**Location:** `backend/server.js:90`

**Current:** Basic health check ✓  
**Missing:** 
- Database connectivity check
- External service checks (payment gateways)
- Memory/CPU metrics

**Fix:**
```javascript
app.get('/health/detailed', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    mongodb: 'unknown',
    memory: process.memoryUsage()
  };
  
  try {
    await mongoose.connection.db.admin().ping();
    health.mongodb = 'connected';
  } catch (err) {
    health.mongodb = 'disconnected';
    health.status = 'degraded';
  }
  
  res.json(health);
});
```

---

### 22. **Frontend: No Error Boundary**
**Location:** `src/App.jsx`

**Problem:** Single error crashes entire app

**Fix:** Already has `ErrorBoundary.jsx` ✓ Just ensure it's used:
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

### 23. **No Request Timeout**
**Severity:** 🟡 MEDIUM

**Problem:** Hanging database queries never timeout

**Fix:**
```javascript
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Request timeout middleware
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(408).json({ message: 'Request timeout' });
  });
  next();
});
```

---

### 24. **No Image Upload Size Limits**
**Severity:** 🟡 MEDIUM  
**Impact:** Users upload 10GB images → disk full

**Fix:**
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In image upload handler
if (file.size > 5 * 1024 * 1024) {  // 5MB
  throw new Error('Image too large');
}
```

---

### 25. **Frontend: No Request Cancellation**
**Location:** `src/contexts/CartContext.jsx`

**Problem:** Switching pages leaves requests running

**Partial Fix:** `useApi` hook has AbortSignal support ✓  
**But:** Not used consistently

---

## 🔵 LOW PRIORITY (Code Quality)

### 26. **Inconsistent Error Messages**
Some return `{ success: false, message: '...' }`  
Others return `{ error: '...' }`

**Fix:** Standardize all responses

---

### 27. **No API Versioning**
**Current:** `/api/products`  
**Should be:** `/api/v1/products`

Prevents breaking changes when updating API

---

### 28. **Phone Number Validation Inconsistent**
User model: `/^[0-9]{10}$/`  
Address: No validation

**Fix:** Use shared validator

---

### 29. **No Unit Tests**
**Impact:** Regressions, bugs in production

**Required:**
- Jest for backend
- Vitest for frontend
- Coverage > 70%

---

### 30. **No CI/CD Pipeline**
**Required:**
- GitHub Actions / GitLab CI
- Automated tests on PR
- Automated deployments
- Staging environment

---

## 📊 SCALABILITY CONCERNS (Blinkit/Flipkart Scale)

### At 10,000 Concurrent Users:

**Current Architecture Will Fail:**

1. **Database Connection Pool**
   - Default: 5 connections ❌
   - Need: 100+ connections
   ```javascript
   mongoose.connect(URI, {
     maxPoolSize: 100,
     minPoolSize: 10
   });
   ```

2. **No Caching Layer**
   - Every request hits database ❌
   - Need: Redis for hot data
   ```javascript
   // Cache product listings, user sessions
   const redis = require('redis');
   const cache = redis.createClient();
   ```

3. **No CDN for Images**
   - Images served from backend ❌
   - Need: Cloudinary/S3 + CDN

4. **No Load Balancer**
   - Single server instance ❌
   - Need: Multiple instances behind LB

5. **No Background Jobs**
   - Email, notifications block requests ❌
   - Need: Bull queue / RabbitMQ

6. **No Search Engine**
   - MongoDB text search is slow ❌
   - Need: Elasticsearch / Algolia

7. **No Database Sharding**
   - Single MongoDB instance ❌
   - Need: Replica set + sharding

---

## 🎯 IMMEDIATE ACTION PLAN

### Before Pushing to Git:
1. ✅ Remove `.env` from repository
2. ✅ Change all secrets/passwords
3. ✅ Add `.env` to `.gitignore`
4. ✅ Remove secrets from git history

### Before Staging Deployment:
1. 🔴 Fix race condition in order creation (Issue #1)
2. 🔴 Add input validation to all endpoints (Issue #5)
3. 🔴 Implement transactions for order flow (Issue #4)
4. 🟠 Add database indexes (Issue #8)
5. 🟠 Fix N+1 queries (Issue #9)

### Before Production:
1. All CRITICAL issues fixed
2. All HIGH issues fixed
3. Load testing (1000 concurrent users)
4. Security audit
5. Penetration testing
6. Backup/restore tested
7. Monitoring/alerting setup
8. Incident response plan

---

## 📈 RECOMMENDED ARCHITECTURE FOR SCALE

```
┌─────────────┐
│   Cloudflare│  ← DDoS protection, CDN
└──────┬──────┘
       │
┌──────▼──────┐
│  Load Balancer │  ← Distribute traffic
└──────┬──────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
┌──▼───┐ ┌─▼────┐ ┌─▼────┐ ┌─▼────┐
│Node 1│ │Node 2│ │Node 3│ │Node 4│  ← Auto-scaling
└───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘
    │        │        │        │
    └────────┴────┬───┴────────┘
                  │
         ┌────────▼─────────┐
         │      Redis       │  ← Cache, sessions
         └────────┬─────────┘
                  │
         ┌────────▼─────────┐
         │  MongoDB Cluster │  ← Replica set
         └──────────────────┘
```

---

## ✅ WHAT'S ACTUALLY GOOD

1. ✅ JWT authentication implemented
2. ✅ Password hashing with bcrypt
3. ✅ CORS configuration (needs tightening)
4. ✅ Helmet for security headers
5. ✅ Some input validation on models
6. ✅ Error handling middleware
7. ✅ Pagination support
8. ✅ Proper HTTP status codes
9. ✅ Clean code structure
10. ✅ Razorpay signature verification

---

## 🎓 LEARNING RESOURCES

1. OWASP Top 10: https://owasp.org/www-project-top-ten/
2. MongoDB Transactions: https://www.mongodb.com/docs/manual/core/transactions/
3. Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/
4. Scalability Patterns: https://github.com/binhnguyennus/awesome-scalability

---

**CONCLUSION:**

This is a **solid MVP** with good foundations, but has **CRITICAL issues that WILL cause data loss, security breaches, and downtime in production**. 

**DO NOT deploy until at least all CRITICAL issues are fixed.**

The good news: Most issues are fixable in 2-3 days of focused work. The architecture is sound, just needs hardening.

**Recommendation:** Fix critical issues → Deploy to staging → Load test → Fix bottlenecks → Deploy to production with monitoring.
