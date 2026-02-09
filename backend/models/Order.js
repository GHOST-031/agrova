const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    image: String
  }],
  deliveryAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
    latitude: Number,
    longitude: Number,
    landmark: String,
    deliveryInstructions: String
  },
  payment: {
    paymentId: String,
    method: {
      type: String,
      enum: ['card', 'upi', 'net_banking', 'wallet', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    transactionId: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    delivery: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  tracking: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    currentLocation: String
  },
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  notes: String
}, {
  timestamps: true
});

// Indexes for performance
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'items.farmer': 1, status: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    this.orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus, note = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note
  });
  
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  } else if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  await this.save();
};

// Method to calculate total
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.pricing.subtotal = subtotal;
  this.pricing.total = subtotal + this.pricing.delivery + this.pricing.tax - this.pricing.discount;
  return this.pricing.total;
};

module.exports = mongoose.model('Order', orderSchema);
