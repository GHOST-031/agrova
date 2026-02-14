const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Consumer)
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      paymentDetails,
      pricing,
      payment
    } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required'
      });
    }
    
    // Start transaction for atomic operations
    session.startTransaction();
    
    // Fetch all products in bulk (fixes N+1 query problem)
    const productIds = items.map(item => item.product);
    const products = await Product.find({
      _id: { $in: productIds },
      status: 'active'
    }).session(session);
    
    if (products.length !== items.length) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'One or more products not found or inactive'
      });
    }
    
    // Create product map for quick lookup
    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    
    // Verify stock and calculate total
    let calculatedSubtotal = 0;
    const processedItems = [];
    const stockUpdates = [];
    
    for (const item of items) {
      const product = productMap.get(item.product.toString());
      
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }
      
      if (!product.isInStock() || product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock or insufficient quantity (Available: ${product.stock}, Requested: ${item.quantity})`
        });
      }
      
      calculatedSubtotal += product.price * item.quantity;
      
      processedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: item.price || product.price,
        farmer: product.farmer,
        image: product.images?.[0]?.url || ''
      });
      
      stockUpdates.push({
        updateOne: {
          filter: { 
            _id: product._id,
            stock: { $gte: item.quantity }  // Double-check stock hasn't changed
          },
          update: { 
            $inc: { 
              stock: -item.quantity,
              soldCount: item.quantity 
            }
          }
        }
      });
    }
    
    // Atomic stock update with bulkWrite
    const stockUpdateResult = await Product.bulkWrite(stockUpdates, { session });
    
    if (stockUpdateResult.modifiedCount !== items.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Stock changed during order processing. Please try again.'
      });
    }

    // Generate unique parent order ID (for linking split orders)
    const parentOrderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Handle payment data (support both old and new format)
    const paymentData = payment || {
      method: paymentMethod || 'cod',
      status: paymentDetails?.status || 'pending',
      transactionId: paymentDetails?.transactionId || '',
      paidAt: paymentDetails?.status === 'success' ? new Date() : null
    };
    
    // GROUP ITEMS BY FARMER - Create separate orders for each farmer
    const itemsByFarmer = {};
    processedItems.forEach(item => {
      const farmerId = item.farmer.toString();
      if (!itemsByFarmer[farmerId]) {
        itemsByFarmer[farmerId] = [];
      }
      itemsByFarmer[farmerId].push(item);
    });
    
    const createdOrders = [];
    const farmerIds = Object.keys(itemsByFarmer);
    
    // Create a separate order for each farmer
    for (const farmerId of farmerIds) {
      const farmerItems = itemsByFarmer[farmerId];
      
      // Calculate subtotal for this farmer's items
      const farmerSubtotal = farmerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Distribute delivery and discount proportionally
      const farmerDelivery = (pricing?.delivery || 0) * (farmerSubtotal / calculatedSubtotal);
      const farmerDiscount = (pricing?.discount || 0) * (farmerSubtotal / calculatedSubtotal);
      const farmerTax = (pricing?.tax || 0) * (farmerSubtotal / calculatedSubtotal);
      const farmerTotal = farmerSubtotal + farmerDelivery + farmerTax - farmerDiscount;
      
      const orderData = {
        orderId: `${parentOrderId}-F${farmerIds.indexOf(farmerId) + 1}`,
        parentOrderId, // Link to parent order
        user: req.user._id,
        farmer: farmerId, // Identify which farmer this order belongs to
        items: farmerItems,
        deliveryAddress,
        payment: paymentData,
        pricing: {
          subtotal: farmerSubtotal,
          delivery: farmerDelivery,
          discount: farmerDiscount,
          tax: farmerTax,
          total: farmerTotal
        },
        status: paymentData.status === 'success' || paymentData.method === 'cod' ? 'confirmed' : 'pending'
      };
      
      const [order] = await Order.create([orderData], { session });
      createdOrders.push(order);
    }
    
    // Commit transaction
    await session.commitTransaction();
    
    // Populate all orders after transaction
    for (let order of createdOrders) {
      await order.populate('user', 'name email phoneNumber');
      await order.populate('items.product', 'name price images');
      await order.populate('items.farmer', 'name');
      await order.populate('farmer', 'name email farmDetails');
    }
    
    // Return parent order summary with all child orders
    res.status(201).json({
      success: true,
      message: `Order created and split across ${createdOrders.length} farmer(s)`,
      parentOrderId,
      orders: createdOrders,
      summary: {
        totalOrders: createdOrders.length,
        totalAmount: createdOrders.reduce((sum, order) => sum + order.pricing.total, 0),
        items: createdOrders.reduce((sum, order) => sum + order.items.length, 0),
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get all orders (for admin)
// @route   GET /api/orders
// @access  Private (Admin)
exports.getOrders = async (req, res) => {
  try {
    const {
      status,
      user,
      farmer,
      page = 1,
      limit = 20
    } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (user) query.user = user;
    if (farmer) query['items.farmer'] = farmer;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const orders = await Order.find(query)
      .populate('user', 'name email phoneNumber')
      .populate('items.product', 'name price images')
      .populate('items.farmer', 'name farmDetails.location')
      .sort('-createdAt')
      .limit(Number(limit))
      .skip(skip);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phoneNumber')
      .populate('items.product', 'name price images description')
      .populate('items.farmer', 'name email phoneNumber farmDetails')
      .populate('farmer', 'name email phoneNumber farmDetails'); // Populate farmer field for split orders
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Make sure user is order owner or farmer or admin
    const isOwner = order.user._id.toString() === req.user._id.toString();
    
    // Check if farmer owns this order (NEW: split order farmer field)
    const isFarmerOwner = order.farmer && order.farmer._id.toString() === req.user._id.toString();
    
    // Check if farmer has items in this order (LEGACY: items.farmer field)
    const hasItemsFromFarmer = order.items && order.items.some(item => 
      item.farmer && item.farmer._id.toString() === req.user._id.toString()
    );
    
    const isAdmin = req.user.userType === 'admin';
    
    if (!isOwner && !isFarmerOwner && !hasItemsFromFarmer && !isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my/orders
// @access  Private (Consumer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price images')
      .populate('items.farmer', 'name farmDetails.location')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get farmer orders
// @route   GET /api/orders/farmer/orders
// @access  Private (Farmer)
exports.getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user._id;
    
    // Query to find orders that belong specifically to this farmer
    // (after order splitting by farmer logic)
    const orders = await Order.find({ 
      farmer: farmerId 
    })
      .populate('user', 'name email phoneNumber')
      .populate('items.product', 'name price images stock')
      .populate('items.farmer', 'name')
      .sort('-createdAt');
    
    // Also handle legacy orders where farmer field might not be set
    // but items belong to this farmer (for backward compatibility)
    const legacyOrders = await Order.find({
      farmer: { $exists: false },
      'items.farmer': farmerId
    })
      .populate('user', 'name email phoneNumber')
      .populate('items.product', 'name price images stock')
      .populate('items.farmer', 'name')
      .sort('-createdAt');
    
    // Filter legacy orders to only include items belonging to this farmer
    const filteredLegacyOrders = legacyOrders.map(order => {
      const farmerItems = order.items.filter(item => 
        item.farmer && item.farmer._id.toString() === farmerId.toString()
      );
      if (farmerItems.length > 0) {
        order.items = farmerItems;
        return order;
      }
      return null;
    }).filter(order => order !== null);
    
    const allOrders = [...orders, ...filteredLegacyOrders];
    
    res.json({
      success: true,
      count: allOrders.length,
      data: allOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer/Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization
    // New logic: Check if order.farmer matches (for split orders)
    // Fallback: Check if any item's farmer matches (for legacy orders)
    const isFarmerOwner = order.farmer && order.farmer.toString() === req.user._id.toString();
    const hasItemsFromFarmer = order.items.some(item => item.farmer && item.farmer.toString() === req.user._id.toString());
    const isAdmin = req.user.userType === 'admin';
    
    if (!isFarmerOwner && !hasItemsFromFarmer && !isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    await order.updateStatus(status);
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Update order tracking
// @route   PUT /api/orders/:id/tracking
// @access  Private (Farmer/Admin)
exports.updateTracking = async (req, res) => {
  try {
    const { trackingNumber, carrier, estimatedDelivery } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization
    const isFarmer = order.items.some(item => item.farmer.toString() === req.user._id.toString());
    const isAdmin = req.user.userType === 'admin';
    
    if (!isFarmer && !isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    order.tracking = {
      trackingNumber,
      carrier,
      estimatedDelivery
    };
    
    await order.save();
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tracking',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Consumer - own orders only)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Make sure user is order owner
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }
    
    // Can only cancel if status is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }
    
    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        await product.updateStock(item.quantity);
      }
    }
    
    await order.updateStatus('cancelled');
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};
