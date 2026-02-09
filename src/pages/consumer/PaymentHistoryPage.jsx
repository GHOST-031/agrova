import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  Download,
  Filter,
} from 'lucide-react';
import { usePayment, PAYMENT_METHODS, PAYMENT_STATUS } from '../../contexts/PaymentContext';
import Card from '../../components/ui/Card';

const PaymentHistoryPage = () => {
  const { paymentHistory } = usePayment();
  const [filter, setFilter] = React.useState('all');

  const getPaymentIcon = (method) => {
    switch (method) {
      case PAYMENT_METHODS.CARD:
        return CreditCard;
      case PAYMENT_METHODS.UPI:
        return Smartphone;
      case PAYMENT_METHODS.NET_BANKING:
      case PAYMENT_METHODS.COD:
        return Banknote;
      case PAYMENT_METHODS.WALLET:
        return Wallet;
      default:
        return CreditCard;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return CheckCircle;
      case PAYMENT_STATUS.FAILED:
        return XCircle;
      case PAYMENT_STATUS.PENDING:
        return Clock;
      case PAYMENT_STATUS.REFUNDED:
        return RefreshCcw;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return 'text-success-600 bg-success-100 dark:bg-success-900 dark:text-success-200';
      case PAYMENT_STATUS.FAILED:
        return 'text-error-600 bg-error-100 dark:bg-error-900 dark:text-error-200';
      case PAYMENT_STATUS.PENDING:
        return 'text-warning-600 bg-warning-100 dark:bg-warning-900 dark:text-warning-200';
      case PAYMENT_STATUS.REFUNDED:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'text-forest-600 bg-forest-100 dark:bg-forest-900 dark:text-forest-200';
    }
  };

  const getMethodName = (method) => {
    switch (method) {
      case PAYMENT_METHODS.CARD:
        return 'Card Payment';
      case PAYMENT_METHODS.UPI:
        return 'UPI Payment';
      case PAYMENT_METHODS.NET_BANKING:
        return 'Net Banking';
      case PAYMENT_METHODS.WALLET:
        return 'Wallet';
      case PAYMENT_METHODS.COD:
        return 'Cash on Delivery';
      default:
        return method;
    }
  };

  const filteredPayments = paymentHistory.filter((payment) => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 mb-2">
          Payment History
        </h1>
        <p className="text-forest-600 dark:text-forest-400 mb-6">
          View all your payment transactions
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-forest-gradient text-white'
                : 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 hover:bg-forest-200 dark:hover:bg-forest-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter(PAYMENT_STATUS.SUCCESS)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === PAYMENT_STATUS.SUCCESS
                ? 'bg-success-500 text-white'
                : 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 hover:bg-forest-200 dark:hover:bg-forest-700'
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setFilter(PAYMENT_STATUS.PENDING)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === PAYMENT_STATUS.PENDING
                ? 'bg-warning-500 text-white'
                : 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 hover:bg-forest-200 dark:hover:bg-forest-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter(PAYMENT_STATUS.FAILED)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === PAYMENT_STATUS.FAILED
                ? 'bg-error-500 text-white'
                : 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 hover:bg-forest-200 dark:hover:bg-forest-700'
            }`}
          >
            Failed
          </button>
          <button
            onClick={() => setFilter(PAYMENT_STATUS.REFUNDED)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === PAYMENT_STATUS.REFUNDED
                ? 'bg-blue-500 text-white'
                : 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 hover:bg-forest-200 dark:hover:bg-forest-700'
            }`}
          >
            Refunded
          </button>
        </div>

        {/* Payment List */}
        {filteredPayments.length === 0 ? (
          <Card className="p-12 text-center">
            <CreditCard className="w-16 h-16 mx-auto text-forest-300 dark:text-forest-700 mb-4" />
            <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-100 mb-2">
              No payments found
            </h3>
            <p className="text-forest-600 dark:text-forest-400">
              {filter === 'all'
                ? 'You haven\'t made any payments yet'
                : `No ${filter} payments found`}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => {
              const PaymentIcon = getPaymentIcon(payment.method);
              const StatusIcon = getStatusIcon(payment.status);
              
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left Section - Payment Details */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-forest-100 dark:bg-forest-800 rounded-lg">
                          <PaymentIcon className="w-6 h-6 text-forest-600 dark:text-forest-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-forest-800 dark:text-forest-100">
                              {getMethodName(payment.method)}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-forest-600 dark:text-forest-400 mb-1">
                            Payment ID: <span className="font-mono">{payment.id}</span>
                          </p>
                          
                          {payment.orderId && (
                            <p className="text-sm text-forest-600 dark:text-forest-400 mb-1">
                              Order ID: <span className="font-mono">{payment.orderId}</span>
                            </p>
                          )}
                          
                          <p className="text-xs text-forest-500 dark:text-forest-500">
                            {new Date(payment.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                          
                          {/* Additional Details */}
                          {payment.details && Object.keys(payment.details).length > 0 && (
                            <div className="mt-2 text-xs text-forest-600 dark:text-forest-400">
                              {payment.details.cardLast4 && (
                                <span>Card: •••• {payment.details.cardLast4}</span>
                              )}
                              {payment.details.upiId && (
                                <span>UPI: {payment.details.upiId}</span>
                              )}
                              {payment.details.bank && (
                                <span>Bank: {payment.details.bank}</span>
                              )}
                              {payment.details.wallet && (
                                <span>Wallet: {payment.details.wallet}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right Section - Amount & Actions */}
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="text-2xl font-bold text-forest-800 dark:text-forest-100">
                          ₹{payment.amount.toFixed(2)}
                        </div>
                        
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-forest-600 dark:text-forest-300 hover:text-forest-800 dark:hover:text-forest-100 hover:bg-forest-100 dark:hover:bg-forest-800 rounded-lg transition-colors"
                          onClick={() => {
                            // Implement receipt download
                            alert('Receipt download feature coming soon!');
                          }}
                        >
                          <Download className="w-4 h-4" />
                          Receipt
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentHistoryPage;
