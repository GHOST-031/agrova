const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Method to add product to wishlist
wishlistSchema.methods.addProduct = async function(productId) {
  if (!this.products.includes(productId)) {
    this.products.push(productId);
    return await this.save();
  }
  return this;
};

// Method to remove product from wishlist
wishlistSchema.methods.removeProduct = async function(productId) {
  this.products = this.products.filter(
    id => id.toString() !== productId.toString()
  );
  return await this.save();
};

// Method to check if product is in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
  return this.products.some(
    id => id.toString() === productId.toString()
  );
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
