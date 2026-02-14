const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'gram', 'liter', 'piece', 'dozen', 'bundle']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  images: [{
    url: String,
    public_id: String
  }],
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minOrder: {
    type: Number,
    default: 1
  },
  maxOrder: {
    type: Number,
    default: 100
  },
  tags: [String],
  
  // Product attributes
  isOrganic: {
    type: Boolean,
    default: false
  },
  isFreshProduce: {
    type: Boolean,
    default: true
  },
  harvestDate: Date,
  shelfLife: {
    type: Number, // in days
  },
  
  // Ratings
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Product status
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  
  // Delivery
  deliveryTime: {
    type: String,
    default: '2-3 days'
  },
  freeDelivery: {
    type: Boolean,
    default: false
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for search and filters
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ farmer: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1, status: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ status: 1, stock: 1 });
productSchema.index({ isOrganic: 1, status: 1 });
productSchema.index({ 'ratings.average': -1, status: 1 });

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Method to check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  return this.stock >= quantity && this.status === 'active';
};

// Method to update stock
productSchema.methods.updateStock = async function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock -= quantity;
    this.soldCount += quantity;
  } else {
    this.stock += quantity;
  }
  
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  } else if (this.stock > 0 && this.status === 'out_of_stock') {
    this.status = 'active';
  }
  
  await this.save();
};

module.exports = mongoose.model('Product', productSchema);
