const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getFarmerProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('farmer', 'admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('farmer', 'admin'), updateProduct)
  .delete(protect, authorize('farmer', 'admin'), deleteProduct);

router.put('/:id/stock', protect, authorize('farmer', 'admin'), updateStock);
router.get('/farmer/:farmerId', getFarmerProducts);

module.exports = router;
