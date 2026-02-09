import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  ChevronRight,
  Lock,
  CheckCircle,
  X,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { usePayment, PAYMENT_METHODS } from '../../contexts/PaymentContext';
import toast from 'react-hot-toast';

const PaymentGateway = ({ amount, orderId, onSuccess, onCancel, preSelectedMethod = null }) => {
  const { 
    processPayment, 
    isProcessing, 
    savedCards, 
    savedUPIs,
    saveCard,
    removeCard,
    saveUPI,
    removeUPI,
  } = usePayment();

  const [selectedMethod, setSelectedMethod] = useState(preSelectedMethod);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [saveForLater, setSaveForLater] = useState(false);

  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    nickname: '',
  });

  // UPI form state
  const [upiId, setUpiId] = useState('');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('');

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState('');

  const paymentMethods = [
    {
      id: PAYMENT_METHODS.UPI,
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay via Google Pay, PhonePe, Paytm',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: PAYMENT_METHODS.CARD,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: PAYMENT_METHODS.NET_BANKING,
      name: 'Net Banking',
      icon: Banknote,
      description: 'All major banks supported',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: PAYMENT_METHODS.WALLET,
      name: 'Wallet',
      icon: Wallet,
      description: 'Paytm, PhonePe, Amazon Pay',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: PAYMENT_METHODS.COD,
      name: 'Cash on Delivery',
      icon: Banknote,
      description: 'Pay when you receive',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const popularBanks = [
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' },
    { id: 'pnb', name: 'Punjab National Bank' },
  ];

  const wallets = [
    { id: 'paytm', name: 'Paytm' },
    { id: 'phonepe', name: 'PhonePe' },
    { id: 'amazonpay', name: 'Amazon Pay' },
    { id: 'mobikwik', name: 'Mobikwik' },
  ];

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      // Format card number: 1234 5678 9012 3456
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.slice(0, 19); // Max 16 digits + 3 spaces
    } else if (name === 'expiry') {
      // Format expiry: MM/YY
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      formattedValue = formattedValue.slice(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (name === 'name') {
      formattedValue = value.toUpperCase();
    }

    setCardData({ ...cardData, [name]: formattedValue });
  };

  const validateCard = () => {
    const cardNumber = cardData.number.replace(/\s/g, '');
    if (cardNumber.length !== 16) {
      toast.error('Invalid card number');
      return false;
    }
    if (!cardData.name) {
      toast.error('Card holder name is required');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      toast.error('Invalid expiry date (MM/YY)');
      return false;
    }
    if (cardData.cvv.length !== 3) {
      toast.error('Invalid CVV');
      return false;
    }
    return true;
  };

  const validateUPI = (upiId) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(upiId);
  };

  const handlePayment = async () => {
    let paymentDetails = {};

    if (selectedMethod === PAYMENT_METHODS.CARD) {
      if (!validateCard()) return;
      
      if (saveForLater) {
        saveCard({
          number: cardData.number,
          name: cardData.name,
          expiry: cardData.expiry,
          nickname: cardData.nickname || 'My Card',
        });
      }

      paymentDetails = {
        cardLast4: cardData.number.slice(-4),
        cardName: cardData.name,
      };
    } else if (selectedMethod === PAYMENT_METHODS.UPI) {
      if (!validateUPI(upiId)) {
        toast.error('Invalid UPI ID format (e.g., user@bank)');
        return;
      }

      if (saveForLater) {
        saveUPI(upiId);
      }

      paymentDetails = { upiId };
    } else if (selectedMethod === PAYMENT_METHODS.NET_BANKING) {
      if (!selectedBank) {
        toast.error('Please select a bank');
        return;
      }
      paymentDetails = { bank: selectedBank };
    } else if (selectedMethod === PAYMENT_METHODS.WALLET) {
      if (!selectedWallet) {
        toast.error('Please select a wallet');
        return;
      }
      paymentDetails = { wallet: selectedWallet };
    }

    // For the new flow: Don't call backend payment processing
    // The order will be created AFTER payment confirmation in CheckoutPage
    // Just return success with payment details
    const payment = {
      id: `PAY${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderId: orderId,
      amount: amount,
      method: selectedMethod,
      status: 'success',
      timestamp: new Date().toISOString(),
      details: paymentDetails,
    };

    // Call onSuccess which will create the order
    onSuccess(payment);
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case PAYMENT_METHODS.CARD:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Saved Cards */}
            {savedCards.length > 0 && !showCardForm && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-forest-800 dark:text-forest-200">
                  Saved Cards
                </h4>
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-3 border-2 border-forest-200 dark:border-forest-700 rounded-lg hover:border-forest-400 cursor-pointer"
                    onClick={() => {
                      setCardData({
                        ...cardData,
                        number: card.maskedNumber,
                        name: card.name,
                        expiry: card.expiry,
                      });
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                      <div>
                        <p className="text-sm font-medium text-forest-800 dark:text-forest-200">
                          {card.nickname}
                        </p>
                        <p className="text-xs text-forest-600 dark:text-forest-400">
                          {card.maskedNumber} • Exp: {card.expiry}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCard(card.id);
                      }}
                      className="p-1 hover:bg-error-100 dark:hover:bg-error-900 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-error-600" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setShowCardForm(true)}
                  className="flex items-center gap-2 text-sm text-forest-600 dark:text-forest-300 hover:text-forest-800"
                >
                  <Plus className="w-4 h-4" />
                  Add New Card
                </button>
              </div>
            )}

            {/* Card Form */}
            {(showCardForm || savedCards.length === 0) && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={cardData.number}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border-2 border-forest-300 dark:border-forest-600 rounded-lg focus:border-forest-500 dark:bg-forest-800 dark:text-forest-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={cardData.name}
                    onChange={handleCardInputChange}
                    placeholder="JOHN DOE"
                    className="w-full px-4 py-2 border-2 border-forest-300 dark:border-forest-600 rounded-lg focus:border-forest-500 dark:bg-forest-800 dark:text-forest-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border-2 border-forest-300 dark:border-forest-600 rounded-lg focus:border-forest-500 dark:bg-forest-800 dark:text-forest-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      className="w-full px-4 py-2 border-2 border-forest-300 dark:border-forest-600 rounded-lg focus:border-forest-500 dark:bg-forest-800 dark:text-forest-100"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={saveForLater}
                    onChange={(e) => setSaveForLater(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="saveCard" className="text-sm text-forest-700 dark:text-forest-300">
                    Save this card for future payments
                  </label>
                </div>
                {saveForLater && (
                  <div>
                    <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                      Card Nickname (Optional)
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={cardData.nickname}
                      onChange={handleCardInputChange}
                      placeholder="My HDFC Card"
                      className="w-full px-4 py-2 border-2 border-forest-300 dark:border-forest-600 rounded-lg focus:border-forest-500 dark:bg-forest-800 dark:text-forest-100"
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );

      case PAYMENT_METHODS.UPI:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Saved UPIs */}
            {savedUPIs.length > 0 && !showUPIForm && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-forest-800 dark:text-forest-200">
                  Saved UPI IDs
                </h4>
                {savedUPIs.map((upi) => (
                  <div
                    key={upi.id}
                    className="flex items-center justify-between p-3 border-2 border-forest-200 dark:border-forest-700 rounded-lg hover:border-forest-400 cursor-pointer"
                    onClick={() => setUpiId(upi.upiId)}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                      <p className="text-sm font-medium text-forest-800 dark:text-forest-200">
                        {upi.upiId}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUPI(upi.id);
                      }}
                      className="p-1 hover:bg-error-100 dark:hover:bg-error-900 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-error-600" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setShowUPIForm(true)}
                  className="flex items-center gap-2 text-sm text-forest-600 dark:text-forest-300 hover:text-forest-800"
                >
                  <Plus className="w-4 h-4" />
                  Add New UPI ID
                </button>
              </div>
            )}

            {/* UPI Form */}
            {(showUPIForm || savedUPIs.length === 0) && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-forest-700 dark:text-forest-300 mb-1">
                    Enter UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-2 border-2 border-forest-300 dark:border-forest-600 rounded-lg focus:border-forest-500 dark:bg-forest-800 dark:text-forest-100"
                  />
                  <p className="text-xs text-forest-600 dark:text-forest-400 mt-1">
                    Format: username@bankname (e.g., john@paytm)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveUPI"
                    checked={saveForLater}
                    onChange={(e) => setSaveForLater(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="saveUPI" className="text-sm text-forest-700 dark:text-forest-300">
                    Save this UPI ID for future payments
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        );

      case PAYMENT_METHODS.NET_BANKING:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-semibold text-forest-800 dark:text-forest-200">
              Select Your Bank
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {popularBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    selectedBank === bank.id
                      ? 'border-forest-500 bg-forest-50 dark:bg-forest-700 text-forest-800 dark:text-forest-100'
                      : 'border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300 hover:border-forest-400'
                  }`}
                >
                  {bank.name}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case PAYMENT_METHODS.WALLET:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-semibold text-forest-800 dark:text-forest-200">
              Select Wallet
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWallet(wallet.id)}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    selectedWallet === wallet.id
                      ? 'border-forest-500 bg-forest-50 dark:bg-forest-700 text-forest-800 dark:text-forest-100'
                      : 'border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300 hover:border-forest-400'
                  }`}
                >
                  {wallet.name}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case PAYMENT_METHODS.COD:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4"
          >
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">Cash on Delivery</p>
                <p>You can pay in cash when the order is delivered to your address.</p>
                <p className="mt-2 text-xs">
                  Please keep exact change ready. COD orders may have additional charges.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-forest-800 rounded-lg shadow-lg border border-forest-200 dark:border-forest-700">
      <div className="p-6 border-b border-forest-200 dark:border-forest-700">
        <h2 className="text-xl font-bold text-forest-800 dark:text-forest-100 mb-2">
          Select Payment Method
        </h2>
        <div className="flex items-center gap-2 text-2xl font-bold text-forest-600 dark:text-forest-300">
          <span>₹{amount.toFixed(2)}</span>
          <Lock className="w-5 h-5 text-success-600" />
        </div>
      </div>

      <div className="p-6">
        {/* Payment Methods List */}
        {!selectedMethod ? (
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 border-2 border-forest-200 dark:border-forest-700 rounded-lg hover:border-forest-400 dark:hover:border-forest-500 transition-all`}
                >
                  <div className={`p-3 rounded-lg ${method.bgColor}`}>
                    <Icon className={`w-6 h-6 ${method.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-forest-800 dark:text-forest-100">
                      {method.name}
                    </h3>
                    <p className="text-xs text-forest-600 dark:text-forest-400">
                      {method.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-forest-400" />
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Back button */}
            <button
              onClick={() => {
                setSelectedMethod(null);
                setShowCardForm(false);
                setShowUPIForm(false);
                setSaveForLater(false);
              }}
              className="text-sm text-forest-600 dark:text-forest-300 hover:text-forest-800 font-medium"
            >
              ← Change Payment Method
            </button>

            {/* Payment Form */}
            {renderPaymentForm()}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 border-2 border-forest-300 dark:border-forest-600 text-forest-700 dark:text-forest-300 font-semibold rounded-lg hover:bg-forest-50 dark:hover:bg-forest-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-forest-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ₹{amount.toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-forest-600 dark:text-forest-400 pt-2">
              <Lock className="w-4 h-4" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;
