const { body, param, query, validationResult } = require('express-validator');

// Validation error handler middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validation rules
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
  body('phoneNumber')
    .optional()
    .matches(/^[+]?[0-9]{10,15}$/).withMessage('Invalid phone number'),
  
  body('userType')
    .optional()
    .isIn(['consumer', 'farmer', 'admin']).withMessage('Invalid user type')
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Order validation rules
exports.createOrderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  
  body('items.*.product')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 1000 }).withMessage('Quantity must be between 1 and 1000'),
  
  body('deliveryAddress.name')
    .trim()
    .notEmpty().withMessage('Delivery name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),
  
  body('deliveryAddress.phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+]?[0-9]{10,15}$/).withMessage('Invalid phone number'),
  
  body('deliveryAddress.street')
    .trim()
    .notEmpty().withMessage('Street address is required')
    .isLength({ max: 200 }).withMessage('Street address too long'),
  
  body('deliveryAddress.city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ max: 100 }).withMessage('City name too long'),
  
  body('deliveryAddress.state')
    .trim()
    .notEmpty().withMessage('State is required')
    .isLength({ max: 100 }).withMessage('State name too long'),
  
  body('deliveryAddress.pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .matches(/^[0-9]{5,10}$/).withMessage('Invalid pincode'),
  
  body('payment.method')
    .optional()
    .isIn(['card', 'upi', 'net_banking', 'wallet', 'cod'])
    .withMessage('Invalid payment method')
];

// Product validation rules
exports.createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  
  body('unit')
    .notEmpty().withMessage('Unit is required')
    .isIn(['kg', 'gram', 'liter', 'piece', 'dozen', 'bundle'])
    .withMessage('Invalid unit'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  
  body('minOrder')
    .optional()
    .isInt({ min: 1 }).withMessage('Minimum order must be at least 1'),
  
  body('maxOrder')
    .optional()
    .isInt({ min: 1 }).withMessage('Maximum order must be at least 1')
];

// Cart validation rules
exports.addToCartValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100')
];

exports.updateCartValidation = [
  param('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100')
];

// Query validation rules
exports.paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .customSanitizer(value => Math.min(Number(value), 100)) // Cap at 100
];

// MongoDB ID validation
exports.mongoIdValidation = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isMongoId().withMessage('Invalid ID format')
];

// Sanitization helpers
exports.sanitizeInput = (fields) => {
  return fields.map(field => body(field).trim().escape());
};
