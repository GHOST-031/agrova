import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};

export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  WALLET: 'wallet',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const PaymentProvider = ({ children }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [savedUPIs, setSavedUPIs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load saved payment methods from localStorage
  useEffect(() => {
    const storedCards = localStorage.getItem('agrova_saved_cards');
    const storedUPIs = localStorage.getItem('agrova_saved_upis');
    const storedHistory = localStorage.getItem('agrova_payment_history');

    if (storedCards) setSavedCards(JSON.parse(storedCards));
    if (storedUPIs) setSavedUPIs(JSON.parse(storedUPIs));
    if (storedHistory) setPaymentHistory(JSON.parse(storedHistory));
  }, []);

  // Save cards to localStorage
  useEffect(() => {
    localStorage.setItem('agrova_saved_cards', JSON.stringify(savedCards));
  }, [savedCards]);

  // Save UPIs to localStorage
  useEffect(() => {
    localStorage.setItem('agrova_saved_upis', JSON.stringify(savedUPIs));
  }, [savedUPIs]);

  // Save payment history to localStorage
  useEffect(() => {
    localStorage.setItem('agrova_payment_history', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  // Process payment
  const processPayment = async (paymentData) => {
    setIsProcessing(true);
    
    try {
      // Handle COD separately
      if (paymentData.method === PAYMENT_METHODS.COD) {
        const response = await api.processCOD(paymentData.orderId);
        
        if (response.success) {
          const payment = {
            id: `PAY${Date.now()}`,
            orderId: paymentData.orderId,
            amount: paymentData.amount,
            method: PAYMENT_METHODS.COD,
            status: PAYMENT_STATUS.PENDING,
            timestamp: new Date().toISOString(),
            details: {},
          };
          
          setPaymentHistory(prev => [payment, ...prev]);
          toast.success('Order placed! Pay on delivery.');
          setIsProcessing(false);
          return { success: true, payment };
        }
      }

      // For online payments (Card, UPI, Net Banking, Wallet)
      // Create Razorpay order
      const orderResponse = await api.createPaymentOrder(paymentData.amount, paymentData.orderId);
      
      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // Razorpay options
      const options = {
        key: orderResponse.data.key,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Agrova Marketplace',
        description: `Payment for Order #${paymentData.orderId.slice(-8)}`,
        order_id: orderResponse.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: paymentData.orderId,
            });

            if (verifyResponse.success) {
              const payment = {
                id: response.razorpay_payment_id,
                orderId: paymentData.orderId,
                amount: paymentData.amount,
                method: paymentData.method,
                status: PAYMENT_STATUS.SUCCESS,
                timestamp: new Date().toISOString(),
                details: paymentData.details || {},
              };
              
              setPaymentHistory(prev => [payment, ...prev]);
              toast.success('Payment successful!');
              setIsProcessing(false);
              
              // Call success callback if provided
              if (window._razorpaySuccessCallback) {
                window._razorpaySuccessCallback({ success: true, payment });
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            setIsProcessing(false);
            
            if (window._razorpaySuccessCallback) {
              window._razorpaySuccessCallback({ success: false, error: error.message });
            }
          }
        },
        prefill: {
          name: paymentData.details?.name || '',
          email: paymentData.details?.email || '',
          contact: paymentData.details?.phone || '',
        },
        theme: {
          color: '#22c55e',
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
            setIsProcessing(false);
            
            if (window._razorpaySuccessCallback) {
              window._razorpaySuccessCallback({ success: false, error: 'Payment cancelled by user' });
            }
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      // Return a promise that resolves when payment is complete
      return new Promise((resolve) => {
        window._razorpaySuccessCallback = resolve;
      });

    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      toast.error(error.message || 'Payment processing failed');
      return { success: false, error: error.message };
    }
  };

  // Save card details
  const saveCard = (cardData) => {
    const newCard = {
      id: `CARD${Date.now()}`,
      ...cardData,
      // Mask card number (show last 4 digits only)
      maskedNumber: `**** **** **** ${cardData.number.slice(-4)}`,
      savedAt: new Date().toISOString(),
    };
    
    // Remove the full card number for security
    delete newCard.number;
    delete newCard.cvv;
    
    setSavedCards(prev => [...prev, newCard]);
    toast.success('Card saved successfully');
    return newCard;
  };

  // Remove saved card
  const removeCard = (cardId) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
    toast.success('Card removed');
  };

  // Save UPI ID
  const saveUPI = (upiId) => {
    const newUPI = {
      id: `UPI${Date.now()}`,
      upiId: upiId,
      savedAt: new Date().toISOString(),
    };
    
    setSavedUPIs(prev => [...prev, newUPI]);
    toast.success('UPI ID saved successfully');
    return newUPI;
  };

  // Remove saved UPI
  const removeUPI = (upiId) => {
    setSavedUPIs(prev => prev.filter(upi => upi.id !== upiId));
    toast.success('UPI ID removed');
  };

  // Verify payment (for backend integration)
  const verifyPayment = async (paymentId) => {
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentHistory(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: PAYMENT_STATUS.SUCCESS }
            : payment
        )
      );
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Initiate refund
  const initiateRefund = async (paymentId) => {
    try {
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPaymentHistory(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: PAYMENT_STATUS.REFUNDED }
            : payment
        )
      );
      
      toast.success('Refund initiated successfully');
      return { success: true };
    } catch (error) {
      toast.error('Refund failed');
      return { success: false, error: error.message };
    }
  };

  // Get payment by ID
  const getPaymentById = (paymentId) => {
    return paymentHistory.find(payment => payment.id === paymentId);
  };

  // Get payments by order ID
  const getPaymentsByOrderId = (orderId) => {
    return paymentHistory.filter(payment => payment.orderId === orderId);
  };

  const value = {
    paymentHistory,
    savedCards,
    savedUPIs,
    isProcessing,
    processPayment,
    saveCard,
    removeCard,
    saveUPI,
    removeUPI,
    verifyPayment,
    initiateRefund,
    getPaymentById,
    getPaymentsByOrderId,
    PAYMENT_METHODS,
    PAYMENT_STATUS,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;
