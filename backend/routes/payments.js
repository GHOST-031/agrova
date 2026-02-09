const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  processCOD,
  refundPayment,
  getPaymentDetails,
} = require('../controllers/paymentController');

// All routes are protected
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/cod', protect, processCOD);
router.post('/refund', protect, refundPayment);
router.get('/:paymentId', protect, getPaymentDetails);

module.exports = router;
