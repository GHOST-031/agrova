import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import PaymentGateway from "../../components/ui/PaymentGateway";
import { CreditCard, CheckCircle2, Loader2, MapPin, Plus, Smartphone, Banknote } from "lucide-react";
import { useLocation } from "../../contexts/LocationContext";
import { useCart } from "../../contexts/CartContext";
import { useOrders } from "../../contexts/OrderContext";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { selectedAddress, addresses, selectAddress } = useLocation();
  const { items, total: cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  
  // Redirect if cart is empty
  React.useEffect(() => {
    if (!items || items.length === 0) {
      toast.error("Your cart is empty");
      navigate('/consumer/cart');
    }
  }, [items, navigate]);
  
  const [address, setAddress] = React.useState(selectedAddress || {
    name: "Krishansh Verma",
    phone: "+91 98765 43210",
    line1: "123, Green Valley Apartments",
    line2: "Sector 21, Near City Park",
    city: "Noida",
    state: "UP",
    pincode: "201301",
  });
  
  const [orderSummary] = React.useState({
    items: items.length,
    subtotal: cartTotal || 0,
    delivery: items.length > 0 ? 30 : 0,
    discount: 0,
  });
  const total = orderSummary.subtotal + orderSummary.delivery - orderSummary.discount;

  const [isPaymentOpen, setPaymentOpen] = React.useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [completedPayment, setCompletedPayment] = React.useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('card');
  const [tempOrderId, setTempOrderId] = React.useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = React.useState(false);

  // Update address when selectedAddress changes
  React.useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress);
    }
  }, [selectedAddress]);

  const handleAddressSelect = (addr) => {
    selectAddress(addr);
    setAddress(addr);
    setAddressModalOpen(false);
    toast.success("Delivery address updated!");
  };

  const startPayment = () => {
    // Validate cart items first
    if (!items || items.length === 0) {
      toast.error("Your cart is empty");
      navigate('/consumer/cart');
      return;
    }

    // Check if user has any addresses
    if (addresses.length === 0) {
      toast.error("Please add a delivery address first");
      navigate('/consumer/addresses');
      return;
    }

    // Check if user has selected an address
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      setAddressModalOpen(true);
      return;
    }

    // Generate a temporary orderId for payment processing
    // The actual order will be created after payment confirmation
    const tempId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTempOrderId(tempId);
    
    // Just open the payment modal - don't create order yet
    setPaymentOpen(true);
    setPaymentSuccess(false);
  };

  const handlePaymentSuccess = async (payment) => {
    setIsProcessingOrder(true);
    try {
      // Validate cart and address
      if (!items || items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      const addressToUse = selectedAddress || address;
      if (!addressToUse) {
        toast.error("Please select a delivery address");
        return;
      }

      // NOW create the order with payment details
      const orderData = {
        items: items.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity || 1,
          price: item.price,
        })),
        deliveryAddress: {
          name: addressToUse.name || addressToUse.addressType || 'Home',
          phone: addressToUse.phone,
          street: addressToUse.street,
          city: addressToUse.city,
          state: addressToUse.state,
          pincode: addressToUse.pincode,
          country: addressToUse.country || 'India',
          latitude: addressToUse.latitude,
          longitude: addressToUse.longitude,
          landmark: addressToUse.landmark,
        },
        payment: {
          method: payment.method || 'cod',
          status: payment.status || 'success',
          transactionId: payment.id || payment.transactionId || null,
          paidAt: payment.status === 'success' ? new Date().toISOString() : null
        },
        pricing: {
          subtotal: orderSummary.subtotal,
          delivery: orderSummary.delivery,
          discount: orderSummary.discount,
          tax: 0,
          total: total,
        },
      };

      console.log('Creating order after payment confirmation:', orderData);
      const order = await createOrder(orderData);
      console.log('Order created successfully:', order);
      
      // Handle new multi-farmer order response format
      const isMultiFarmerOrder = order.orders && Array.isArray(order.orders);
      if (isMultiFarmerOrder) {
        toast.success(`Order placed successfully! Split across ${order.orders.length} farmer(s)`);
      } else {
        toast.success('Order placed successfully!');
      }
      
      // Clear the cart only after successful order creation
      await clearCart();
      
      setCompletedPayment(payment);
      setPaymentSuccess(true);
      setPaymentOpen(false);
      
      // Navigate to orders after showing success message
      setTimeout(() => {
        navigate('/consumer/orders');
      }, 2000);
    } catch (error) {
      console.error('Order creation failed:', error);
      
      // CRITICAL: Payment confirmed but order creation failed
      // Save payment info for recovery
      const failedOrder = {
        payment,
        orderData: {
          items: items.map(item => ({
            product: item._id || item.id,
            name: item.name,
            quantity: item.quantity || 1,
            price: item.price,
          })),
          deliveryAddress: selectedAddress || address,
          payment: {
            method: payment.method || 'cod',
            status: payment.status || 'success',
            transactionId: payment.id || payment.transactionId,
          },
          pricing: {
            subtotal: orderSummary.subtotal,
            delivery: orderSummary.delivery,
            discount: orderSummary.discount,
            total: total,
          },
        },
        timestamp: new Date().toISOString(),
        error: error.message,
      };
      
      // Save to localStorage for recovery
      localStorage.setItem('pending_order', JSON.stringify(failedOrder));
      
      // Show detailed error message
      if (payment.method !== 'cod' && payment.transactionId) {
        toast.error(
          `Payment successful (ID: ${payment.transactionId}) but order creation failed. Please contact support immediately.`,
          { duration: 10000 }
        );
      } else {
        toast.error(
          'Failed to place order. Your cart is saved. Please try again or contact support.',
          { duration: 6000 }
        );
      }
      
      setPaymentOpen(false);
      
      // Don't clear cart - user can retry
      // Don't navigate away - keep them on checkout page
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handlePaymentCancel = () => {
    setPaymentOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-6">
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-forest-800 dark:text-forest-100 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-forest-600" />
                Delivery Address
              </div>
              <div className="flex gap-2">
                <button 
                  className="text-forest-600 dark:text-forest-300 hover:underline text-sm"
                  onClick={() => setAddressModalOpen(true)}
                >
                  Change
                </button>
                <button 
                  className="text-forest-600 dark:text-forest-300 hover:underline text-sm"
                  onClick={() => navigate('/consumer/addresses')}
                >
                  Manage Addresses
                </button>
              </div>
            </div>
            {address ? (
              <div className="text-forest-700 dark:text-forest-300">
                <div className="font-medium">{address.name} • {address.phone}</div>
                <div>{address.street}</div>
                {address.landmark && <div>Near: {address.landmark}</div>}
                <div>{address.city}, {address.state} - {address.zipcode}</div>
                {address.latitude && address.longitude && (
                  <div className="mt-2 text-xs text-forest-500 dark:text-forest-400">
                    📍 Pinned Location: {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto text-forest-300 dark:text-forest-700 mb-3" />
                <p className="text-forest-600 dark:text-forest-400 mb-4">No delivery address selected</p>
                <Button onClick={() => navigate('/consumer/addresses')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Delivery Address
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-4">Payment Method</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedPaymentMethod('card')}
                className={`border-2 rounded-lg p-4 flex items-center space-x-3 transition-all cursor-pointer ${
                  selectedPaymentMethod === 'card'
                    ? 'border-forest-500 bg-forest-50 dark:bg-forest-800'
                    : 'border-forest-300 dark:border-forest-700 hover:border-forest-400'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${
                  selectedPaymentMethod === 'card' 
                    ? 'text-forest-600 dark:text-forest-300' 
                    : 'text-forest-500 dark:text-forest-400'
                }`} />
                <div className="text-left">
                  <div className={`font-medium ${
                    selectedPaymentMethod === 'card'
                      ? 'text-forest-800 dark:text-forest-100'
                      : 'text-forest-700 dark:text-forest-200'
                  }`}>
                    Debit/Credit Card
                  </div>
                  <div className="text-sm text-forest-500 dark:text-forest-400">Visa, Mastercard, Rupay</div>
                </div>
                {selectedPaymentMethod === 'card' && (
                  <CheckCircle2 className="w-5 h-5 text-forest-500 ml-auto" />
                )}
              </button>
              
              <button
                onClick={() => setSelectedPaymentMethod('upi')}
                className={`border-2 rounded-lg p-4 flex items-center space-x-3 transition-all cursor-pointer ${
                  selectedPaymentMethod === 'upi'
                    ? 'border-forest-500 bg-forest-50 dark:bg-forest-800'
                    : 'border-forest-300 dark:border-forest-700 hover:border-forest-400'
                }`}
              >
                <Smartphone className={`w-5 h-5 ${
                  selectedPaymentMethod === 'upi' 
                    ? 'text-forest-600 dark:text-forest-300' 
                    : 'text-forest-500 dark:text-forest-400'
                }`} />
                <div className="text-left">
                  <div className={`font-medium ${
                    selectedPaymentMethod === 'upi'
                      ? 'text-forest-800 dark:text-forest-100'
                      : 'text-forest-700 dark:text-forest-200'
                  }`}>
                    UPI
                  </div>
                  <div className="text-sm text-forest-500 dark:text-forest-400">GPay, PhonePe, Paytm</div>
                </div>
                {selectedPaymentMethod === 'upi' && (
                  <CheckCircle2 className="w-5 h-5 text-forest-500 ml-auto" />
                )}
              </button>
              
              <button
                onClick={() => setSelectedPaymentMethod('netbanking')}
                className={`border-2 rounded-lg p-4 flex items-center space-x-3 transition-all cursor-pointer ${
                  selectedPaymentMethod === 'netbanking'
                    ? 'border-forest-500 bg-forest-50 dark:bg-forest-800'
                    : 'border-forest-300 dark:border-forest-700 hover:border-forest-400'
                }`}
              >
                <Banknote className={`w-5 h-5 ${
                  selectedPaymentMethod === 'netbanking' 
                    ? 'text-forest-600 dark:text-forest-300' 
                    : 'text-forest-500 dark:text-forest-400'
                }`} />
                <div className="text-left">
                  <div className={`font-medium ${
                    selectedPaymentMethod === 'netbanking'
                      ? 'text-forest-800 dark:text-forest-100'
                      : 'text-forest-700 dark:text-forest-200'
                  }`}>
                    Net Banking
                  </div>
                  <div className="text-sm text-forest-500 dark:text-forest-400">All Major Banks</div>
                </div>
                {selectedPaymentMethod === 'netbanking' && (
                  <CheckCircle2 className="w-5 h-5 text-forest-500 ml-auto" />
                )}
              </button>
              
              <button
                onClick={() => setSelectedPaymentMethod('cod')}
                className={`border-2 rounded-lg p-4 flex items-center space-x-3 transition-all cursor-pointer ${
                  selectedPaymentMethod === 'cod'
                    ? 'border-forest-500 bg-forest-50 dark:bg-forest-800'
                    : 'border-forest-300 dark:border-forest-700 hover:border-forest-400'
                }`}
              >
                <Banknote className={`w-5 h-5 ${
                  selectedPaymentMethod === 'cod' 
                    ? 'text-forest-600 dark:text-forest-300' 
                    : 'text-forest-500 dark:text-forest-400'
                }`} />
                <div className="text-left">
                  <div className={`font-medium ${
                    selectedPaymentMethod === 'cod'
                      ? 'text-forest-800 dark:text-forest-100'
                      : 'text-forest-700 dark:text-forest-200'
                  }`}>
                    Cash on Delivery
                  </div>
                  <div className="text-sm text-forest-500 dark:text-forest-400">Pay when you receive</div>
                </div>
                {selectedPaymentMethod === 'cod' && (
                  <CheckCircle2 className="w-5 h-5 text-forest-500 ml-auto" />
                )}
              </button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <div className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-4">Order Summary</div>
            <div className="space-y-3 text-forest-700 dark:text-forest-300">
              <div className="flex justify-between">
                <span>Items ({orderSummary.items})</span>
                <span>₹{orderSummary.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{orderSummary.delivery}</span>
              </div>
              <div className="flex justify-between text-success-600">
                <span>Discount</span>
                <span>-₹{orderSummary.discount}</span>
              </div>
              <hr className="border-forest-200 dark:border-forest-700" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg" onClick={startPayment}>
              Pay ₹{total}
            </Button>
            <div className="text-center text-sm text-forest-500 dark:text-forest-400 mt-2">100% secure demo payment</div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isPaymentOpen} onClose={handlePaymentCancel} title="" size="lg">
        <PaymentGateway
          amount={total}
          orderId={tempOrderId}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          preSelectedMethod={selectedPaymentMethod}
        />
      </Modal>

      {/* Payment Success Modal */}
      <Modal isOpen={paymentSuccess} onClose={() => setPaymentSuccess(false)} title="" size="md">
        <div className="text-center py-8">
          <CheckCircle2 className="w-20 h-20 text-success-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-forest-800 dark:text-forest-100 mb-2">
            Payment Successful!
          </h2>
          <p className="text-forest-600 dark:text-forest-400 mb-2">
            Your order has been placed successfully
          </p>
          {completedPayment && (
            <div className="bg-forest-50 dark:bg-forest-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-forest-600 dark:text-forest-400">
                Payment ID: <span className="font-mono font-semibold">{completedPayment.id}</span>
              </p>
              <p className="text-sm text-forest-600 dark:text-forest-400">
                Amount: <span className="font-semibold">₹{completedPayment.amount.toFixed(2)}</span>
              </p>
            </div>
          )}
          <p className="text-sm text-forest-500 dark:text-forest-500 mb-6">
            Redirecting to your orders...
          </p>
        </div>
      </Modal>

      {/* Address Selection Modal */}
      <Modal 
        isOpen={isAddressModalOpen} 
        onClose={() => setAddressModalOpen(false)} 
        title="Select Delivery Address"
        size="lg"
      >
        <div className="p-6 space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-16 h-16 mx-auto text-forest-300 dark:text-forest-700 mb-4" />
              <p className="text-forest-600 dark:text-forest-400 mb-4">No saved addresses</p>
              <Button onClick={() => {
                setAddressModalOpen(false);
                navigate('/consumer/addresses');
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {addresses.map((addr) => (
                  <div
                    key={addr._id || addr.id}
                    onClick={() => handleAddressSelect(addr)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      (address?._id || address?.id) === (addr._id || addr.id)
                        ? 'border-forest-500 bg-forest-50 dark:bg-forest-800'
                        : 'border-forest-200 dark:border-forest-700 hover:border-forest-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-forest-600" />
                        <span className="font-semibold text-forest-800 dark:text-forest-100">
                          {addr.label}
                        </span>
                      </div>
                      {addr.isDefault && (
                        <span className="text-xs bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-forest-600 dark:text-forest-400 space-y-1">
                      <p className="font-medium text-forest-800 dark:text-forest-100">{addr.name} • {addr.phone}</p>
                      <p>{addr.street}</p>
                      {addr.landmark && <p>Near: {addr.landmark}</p>}
                      <p>{addr.city}, {addr.state} - {addr.zipcode}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setAddressModalOpen(false);
                  navigate('/consumer/addresses');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </>
          )}
        </div>
      </Modal>

      {/* Processing Order Overlay */}
      {isProcessingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-forest-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-forest-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-forest-800 dark:text-forest-100 mb-2">
              Processing Your Order
            </h3>
            <p className="text-forest-600 dark:text-forest-400 text-sm">
              Please wait while we confirm your order...
            </p>
            <p className="text-forest-500 dark:text-forest-500 text-xs mt-2">
              Do not close this window
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
