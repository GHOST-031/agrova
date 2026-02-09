const Address = require('../models/Address');

// @desc    Get all addresses for logged-in user
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort('-isDefault -createdAt');
    
    res.json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    });
  }
};

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
exports.getAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Make sure user owns this address
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this address'
      });
    }
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching address',
      error: error.message
    });
  }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
exports.createAddress = async (req, res) => {
  try {
    const {
      label,
      name,
      phone,
      street,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
      landmark,
      deliveryInstructions,
      isDefault
    } = req.body;
    
    // Log received data for debugging
    console.log('Received address data:', req.body);
    console.log('Required fields check:', { name, phone, street, city, state, pincode });
    
    // Validate required fields
    if (!name || !phone || !street || !city || !state || !pincode) {
      console.error('Missing required fields:', {
        name: !name ? 'MISSING' : 'OK',
        phone: !phone ? 'MISSING' : 'OK',
        street: !street ? 'MISSING' : 'OK',
        city: !city ? 'MISSING' : 'OK',
        state: !state ? 'MISSING' : 'OK',
        pincode: !pincode ? 'MISSING' : 'OK'
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // If this is the first address or isDefault is true, make it default
    const addressCount = await Address.countDocuments({ user: req.user._id });
    const shouldBeDefault = addressCount === 0 || isDefault === true;
    
    const address = await Address.create({
      user: req.user._id,
      label,
      name,
      phone,
      street,
      city,
      state,
      pincode,
      country: country || 'India',
      latitude,
      longitude,
      landmark,
      deliveryInstructions,
      isDefault: shouldBeDefault
    });
    
    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating address',
      error: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    let address = await Address.findById(req.params.id);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Make sure user owns this address
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this address'
      });
    }
    
    // Update address
    address = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Make sure user owns this address
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this address'
      });
    }
    
    // If deleting default address, set another as default
    if (address.isDefault) {
      const otherAddress = await Address.findOne({
        user: req.user._id,
        _id: { $ne: address._id }
      });
      
      if (otherAddress) {
        otherAddress.isDefault = true;
        await otherAddress.save();
      }
    }
    
    await address.deleteOne();
    
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Make sure user owns this address
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this address'
      });
    }
    
    // Set this as default (pre-save hook will handle unsetting others)
    address.isDefault = true;
    await address.save();
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting default address',
      error: error.message
    });
  }
};
