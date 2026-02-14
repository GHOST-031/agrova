const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      farmer,
      minPrice,
      maxPrice,
      organic,
      fresh,
      inStock,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;
    
    // Enforce pagination limits to prevent abuse
    const sanitizedLimit = Math.min(Math.max(Number(limit), 1), 100);
    const sanitizedPage = Math.max(Number(page), 1);
    
    let query = { status: 'active' };
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filters
    if (category) query.category = category;
    
    // Filter by farmer - handle both string and ObjectId formats
    if (farmer) {
      const mongoose = require('mongoose');
      try {
        // Try to convert to ObjectId if it's a valid MongoDB ID
        query.farmer = new mongoose.Types.ObjectId(farmer);
      } catch (e) {
        // If conversion fails, filter by string as fallback
        query.farmer = farmer;
      }
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (organic === 'true') query.isOrganic = true;
    if (fresh === 'true') query.isFresh = true;
    if (inStock === 'true') query.stock = { $gt: 0 };
    
    // Pagination
    const skip = (sanitizedPage - 1) * sanitizedLimit;
    
    const products = await Product.find(query)
      .populate('farmer', 'name farmDetails.location')
      .populate('category', 'name slug')
      .sort(sort)
      .limit(sanitizedLimit)
      .skip(skip);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      count: products.length,
      total,
      page: sanitizedPage,
      pages: Math.ceil(total / sanitizedLimit),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name email phoneNumber farmDetails')
      .populate('category', 'name slug')
      .populate('reviews');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Farmer)
exports.createProduct = async (req, res) => {
  try {
    // Add farmer ID from authenticated user
    req.body.farmer = req.user._id;
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer - own products only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Make sure user is product owner
    if (product.farmer.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer - own products only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Make sure user is product owner
    if (product.farmer.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }
    
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private (Farmer - own products only)
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide quantity'
      });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Make sure user is product owner
    if (product.farmer.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    await product.updateStock(quantity);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock',
      error: error.message
    });
  }
};

// @desc    Get farmer's products
// @route   GET /api/products/farmer/:farmerId
// @access  Public
exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      farmer: req.params.farmerId,
      status: 'active'
    }).populate('category', 'name slug');
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer products',
      error: error.message
    });
  }
};
