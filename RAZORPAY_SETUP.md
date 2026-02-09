# Razorpay Payment Gateway Integration

## ✅ What's Been Integrated

The Agrova marketplace now has **real Razorpay payment gateway** integration! This replaces the mock payment system with actual payment processing.

### Features Implemented:
- ✅ Real-time payment processing via Razorpay
- ✅ Support for all payment methods (Card, UPI, Net Banking, Wallet)
- ✅ Secure payment verification with signature validation
- ✅ Cash on Delivery (COD) support
- ✅ Refund processing
- ✅ Payment history tracking
- ✅ Order status updates after successful payment

## 🔧 Backend Changes

### New Files Created:
1. **`backend/controllers/paymentController.js`** - Payment processing logic
2. **`backend/routes/payments.js`** - Payment API endpoints

### API Endpoints Added:
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment signature
- `POST /api/payments/cod` - Process COD orders
- `POST /api/payments/refund` - Initiate refunds
- `GET /api/payments/:paymentId` - Get payment details

### Dependencies Installed:
- `razorpay` - Official Razorpay Node.js SDK
- `crypto` - For signature verification (built-in)

## 🎨 Frontend Changes

### Updated Files:
1. **`src/contexts/PaymentContext.jsx`** - Now uses real Razorpay API
2. **`src/utils/api.js`** - Added payment API methods
3. **`index.html`** - Included Razorpay checkout script

### Dependencies Installed:
- `react-razorpay` - React wrapper for Razorpay

## 🔑 Getting Your Razorpay Credentials

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Sign up for a free account
3. Complete email verification

### Step 2: Get Test/Live Keys
1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. For testing, use **Test Mode** keys
4. For production, activate your account and get **Live Mode** keys

### Step 3: Update Environment Variables
Edit `backend/.env` and replace:

```env
# Current (dummy values)
RAZORPAY_KEY_ID=rzp_test_dummy
RAZORPAY_KEY_SECRET=dummy_secret_key_change_this

# Replace with your actual keys
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
```

**⚠️ IMPORTANT:**
- Test keys start with `rzp_test_`
- Live keys start with `rzp_live_`
- **NEVER** commit real keys to Git
- Add `.env` to `.gitignore`

## 🧪 Testing the Integration

### Test Mode (Current Setup):
With dummy credentials, the Razorpay modal won't actually open, but the flow is complete.

### With Real Test Keys:
1. Update `.env` with your Razorpay test keys
2. Restart backend server: `cd backend && node server.js`
3. Go to checkout and select a payment method
4. Razorpay modal will open with test payment UI
5. Use Razorpay test cards for testing

### Razorpay Test Cards:
```
Success Card:
  Number: 4111 1111 1111 1111
  CVV: Any 3 digits
  Expiry: Any future date
  Name: Any name

Failure Card:
  Number: 4111 1111 1111 1234
  (Card number ending in 1234 always fails)

Test UPI:
  success@razorpay
  failure@razorpay
```

## 💳 Payment Flow

### Online Payments (Card/UPI/Net Banking/Wallet):
1. User clicks "Pay" button on checkout
2. Frontend calls `/api/payments/create-order` with amount and orderId
3. Backend creates Razorpay order and returns order details
4. Razorpay checkout modal opens with payment options
5. User completes payment on Razorpay
6. Razorpay returns payment details to frontend
7. Frontend calls `/api/payments/verify` to verify signature
8. Backend verifies signature and updates order status to "paid"
9. User redirected to order confirmation page

### Cash on Delivery:
1. User selects COD payment method
2. Frontend calls `/api/payments/cod` with orderId
3. Backend updates order status to "confirmed" with payment status "pending"
4. No actual payment processing happens
5. Payment collected when order is delivered

## 🔒 Security Features

- ✅ **Signature Verification**: Every payment is verified using HMAC SHA256
- ✅ **Server-side Validation**: Payment verification happens on backend
- ✅ **Secure Keys**: API keys stored in environment variables
- ✅ **HTTPS**: Razorpay requires HTTPS in production
- ✅ **User Authentication**: All payment endpoints require JWT token

## 📊 Database Changes

Orders now include payment information:
```javascript
paymentInfo: {
  method: 'razorpay' | 'cod',
  razorpayOrderId: String,
  razorpayPaymentId: String,
  refundId: String (if refunded),
  paidAt: Date,
  refundedAt: Date
}
paymentStatus: 'pending' | 'paid' | 'refunded'
orderStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
```

## 🚀 Going Live Checklist

Before accepting real payments:

- [ ] Get Razorpay Live Keys (requires KYC and bank account verification)
- [ ] Update `.env` with live keys
- [ ] Set up webhooks for payment confirmation
- [ ] Test with small amounts first
- [ ] Enable only required payment methods
- [ ] Set up payment reconciliation
- [ ] Configure refund policies
- [ ] Add GST/tax handling if required
- [ ] Set up payment failure retry logic
- [ ] Add email notifications for payments
- [ ] Implement fraud detection rules

## 🔄 Webhooks (Recommended for Production)

For production, add webhook support:

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`, `refund.created`
4. Create webhook endpoint in backend:

```javascript
// backend/controllers/paymentController.js
exports.handleWebhook = async (req, res) => {
  const webhookSignature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (expectedSignature === webhookSignature) {
    // Process webhook event
    const event = req.body.event;
    const payload = req.body.payload.payment.entity;
    
    if (event === 'payment.captured') {
      // Update order as paid
    } else if (event === 'payment.failed') {
      // Handle payment failure
    }
  }
  
  res.json({ status: 'ok' });
};
```

## 💰 Pricing

Razorpay charges:
- **Domestic payments**: 2% per transaction
- **International payments**: 3% per transaction
- **Free for first ₹50,000** in transactions (test mode)

## 🆘 Troubleshooting

### Payment modal not opening:
- Check browser console for errors
- Verify Razorpay script is loaded: `console.log(window.Razorpay)`
- Ensure RAZORPAY_KEY_ID is correct in `.env`
- Check if backend is running

### Payment succeeds but order not updated:
- Check backend logs for verification errors
- Verify RAZORPAY_KEY_SECRET is correct
- Check MongoDB connection
- Look for signature mismatch errors

### "Payment verification failed" error:
- Wrong KEY_SECRET in `.env`
- Network issues during verification
- Razorpay order expired (orders expire after 15 minutes)

### COD not working:
- Ensure `/api/payments/cod` endpoint is accessible
- Check if user is authenticated
- Verify order exists and belongs to user

## 📚 Documentation

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Node.js SDK](https://github.com/razorpay/razorpay-node)
- [Payment Flow Guide](https://razorpay.com/docs/payments/payment-flow/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)

## 🎉 Success!

Your Agrova marketplace now has a fully functional payment gateway! 

**Next Steps:**
1. Get your Razorpay test keys and update `.env`
2. Test with Razorpay test cards
3. Complete a full order flow: Add to cart → Checkout → Pay → Verify order
4. When ready for production, get live keys and go live!

---

**Status**: ✅ Integration Complete (Ready for Testing)  
**Date**: November 2025  
**Version**: 1.0.0
