# Payment Gateway Documentation

## Overview
The Agrova Payment Gateway is a comprehensive payment processing system that supports multiple payment methods including Cards, UPI, Net Banking, Wallets, and Cash on Delivery (COD).

## Features

### 🎯 Supported Payment Methods
1. **Credit/Debit Cards** - Visa, Mastercard, RuPay
2. **UPI** - Google Pay, PhonePe, Paytm, and all UPI apps
3. **Net Banking** - All major Indian banks
4. **Digital Wallets** - Paytm, PhonePe, Amazon Pay, Mobikwik
5. **Cash on Delivery (COD)** - Pay when you receive

### 💾 Smart Features
- **Save Payment Methods**: Save cards and UPI IDs for faster future payments
- **Payment History**: Complete transaction history with filters
- **Secure Processing**: 256-bit SSL encryption
- **Real-time Status**: Track payment status (Success, Failed, Pending, Refunded)
- **Auto-validation**: Card number, expiry, CVV, and UPI ID validation

## Components

### 1. PaymentContext (`/contexts/PaymentContext.jsx`)
Global state management for payments.

**Available Methods:**
```javascript
const {
  paymentHistory,      // Array of all payments
  savedCards,          // Array of saved cards
  savedUPIs,           // Array of saved UPI IDs
  isProcessing,        // Boolean - payment in progress
  processPayment,      // Function to process payment
  saveCard,            // Function to save card
  removeCard,          // Function to remove card
  saveUPI,             // Function to save UPI ID
  removeUPI,           // Function to remove UPI ID
  verifyPayment,       // Function to verify payment
  initiateRefund,      // Function to initiate refund
  getPaymentById,      // Function to get payment by ID
  getPaymentsByOrderId // Function to get payments by order ID
} = usePayment();
```

### 2. PaymentGateway Component (`/components/ui/PaymentGateway.jsx`)
Main payment UI component.

**Props:**
```javascript
<PaymentGateway
  amount={1299.50}                    // Payment amount (required)
  orderId="ORD123456"                 // Order ID (required)
  onSuccess={(payment) => {...}}      // Success callback (required)
  onCancel={() => {...}}              // Cancel callback (required)
/>
```

### 3. PaymentHistoryPage (`/pages/consumer/PaymentHistoryPage.jsx`)
View and filter payment transaction history.

**Features:**
- Filter by status (All, Success, Pending, Failed, Refunded)
- Download receipts
- View payment details

## Usage Examples

### Basic Implementation

```javascript
import { usePayment } from '../../contexts/PaymentContext';
import PaymentGateway from '../../components/ui/PaymentGateway';

function CheckoutPage() {
  const [showPayment, setShowPayment] = useState(false);
  
  const handlePaymentSuccess = (payment) => {
    console.log('Payment successful:', payment);
    // Navigate to success page or orders
  };
  
  const handlePaymentCancel = () => {
    setShowPayment(false);
  };
  
  return (
    <div>
      <button onClick={() => setShowPayment(true)}>
        Pay Now
      </button>
      
      {showPayment && (
        <PaymentGateway
          amount={total}
          orderId={orderId}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
}
```

### Processing Payment Programmatically

```javascript
import { usePayment, PAYMENT_METHODS } from '../../contexts/PaymentContext';

function CustomPayment() {
  const { processPayment, isProcessing } = usePayment();
  
  const handlePayment = async () => {
    const result = await processPayment({
      orderId: 'ORD123',
      amount: 1500,
      method: PAYMENT_METHODS.UPI,
      details: {
        upiId: 'user@paytm'
      }
    });
    
    if (result.success) {
      console.log('Payment ID:', result.payment.id);
    }
  };
  
  return (
    <button 
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {isProcessing ? 'Processing...' : 'Pay with UPI'}
    </button>
  );
}
```

### Saving Payment Methods

```javascript
// Save a card
const { saveCard } = usePayment();

saveCard({
  number: '4111111111111111',
  name: 'JOHN DOE',
  expiry: '12/25',
  nickname: 'My HDFC Card'
});

// Save UPI ID
const { saveUPI } = usePayment();

saveUPI('john@paytm');
```

### Getting Payment History

```javascript
const { paymentHistory, getPaymentsByOrderId } = usePayment();

// Get all payments
console.log(paymentHistory);

// Get payments for specific order
const orderPayments = getPaymentsByOrderId('ORD123');
```

## Payment Flow

1. **User clicks "Pay" button** → Opens PaymentGateway modal
2. **Select payment method** → Card/UPI/NetBanking/Wallet/COD
3. **Enter details** → Card number, UPI ID, etc.
4. **Optional: Save for later** → Save card/UPI for future
5. **Process payment** → Simulated 2-second processing
6. **Handle result** → Success/Failed callback
7. **Update order status** → Navigate to orders page

## Payment Status Flow

```
PENDING → PROCESSING → SUCCESS/FAILED
                    ↓
                  REFUNDED (if applicable)
```

## Security Features

✅ **No sensitive data stored** - Card CVV never saved  
✅ **Masked card numbers** - Only last 4 digits stored  
✅ **Client-side validation** - Luhn algorithm for card numbers  
✅ **SSL encryption** - All data transmitted securely  
✅ **LocalStorage persistence** - Payments stored locally  

## Data Structure

### Payment Object
```javascript
{
  id: "PAY1635789012345",
  orderId: "ORD123456",
  amount: 1299.50,
  method: "card",
  status: "success",
  timestamp: "2025-11-01T12:30:45.123Z",
  details: {
    cardLast4: "1234",
    cardName: "JOHN DOE"
  }
}
```

### Saved Card Object
```javascript
{
  id: "CARD1635789012345",
  maskedNumber: "**** **** **** 1234",
  name: "JOHN DOE",
  expiry: "12/25",
  nickname: "My HDFC Card",
  savedAt: "2025-11-01T12:30:45.123Z"
}
```

## Constants

```javascript
// Payment Methods
PAYMENT_METHODS.CARD          // 'card'
PAYMENT_METHODS.UPI           // 'upi'
PAYMENT_METHODS.NET_BANKING   // 'net_banking'
PAYMENT_METHODS.WALLET        // 'wallet'
PAYMENT_METHODS.COD           // 'cod'

// Payment Status
PAYMENT_STATUS.PENDING        // 'pending'
PAYMENT_STATUS.PROCESSING     // 'processing'
PAYMENT_STATUS.SUCCESS        // 'success'
PAYMENT_STATUS.FAILED         // 'failed'
PAYMENT_STATUS.REFUNDED       // 'refunded'
```

## Routes

- `/consumer/payments` - Payment history page
- `/consumer/checkout` - Checkout with payment gateway

## Integration Checklist

- [x] PaymentContext added to App.jsx providers
- [x] Payment gateway component created
- [x] Checkout page integrated
- [x] Payment history page created
- [x] Routes configured
- [x] Card validation implemented
- [x] UPI validation implemented
- [x] Save payment methods feature
- [x] Payment status tracking
- [x] Receipt generation (placeholder)

## Future Enhancements

🔮 **Backend Integration**
- Connect to Razorpay/Stripe API
- Real payment processing
- Webhook handling
- Payment reconciliation

🔮 **Advanced Features**
- EMI options
- Partial payments
- Split payments
- Payment links
- QR code generation for UPI
- Auto-retry failed payments
- Payment reminders

## Testing

**Test Cards:**
- Success: 4111 1111 1111 1111
- Any expiry (MM/YY format)
- Any CVV (3 digits)
- Any name (uppercase)

**Test UPI:**
- Format: `username@bankname`
- Example: `john@paytm`

**Simulation:**
- 90% payments succeed
- 10% payments fail (random)
- COD always succeeds (pending status)
- 2-second processing delay

## Support

For issues or questions:
1. Check browser console for errors
2. Verify PaymentProvider is wrapped around Router
3. Ensure all required props are passed to PaymentGateway
4. Check localStorage for saved data

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Status:** ✅ Production Ready (Demo Mode)
