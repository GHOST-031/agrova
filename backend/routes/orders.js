const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  updateTracking,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const {
  createOrderValidation,
  mongoIdValidation,
  paginationValidation,
  validate
} = require('../middleware/validator');

router.route('/')
  .post(protect, authorize('consumer'), createOrderValidation, validate, createOrder)
  .get(protect, authorize('admin'), paginationValidation, validate, getOrders);

router.get('/my/orders', protect, authorize('consumer'), paginationValidation, validate, getMyOrders);
router.get('/farmer/orders', protect, authorize('farmer'), paginationValidation, validate, getFarmerOrders);

router.route('/:id')
  .get(protect, mongoIdValidation, validate, getOrder);

router.put('/:id/status', protect, authorize('farmer', 'admin'), mongoIdValidation, validate, updateOrderStatus);
router.put('/:id/tracking', protect, authorize('farmer', 'admin'), mongoIdValidation, validate, updateTracking);
router.put('/:id/cancel', protect, authorize('consumer'), mongoIdValidation, validate, cancelOrder);

module.exports = router;
