const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Service = require('../models/Service');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user orders (client) or all orders (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (req.user.role === 'client') {
      query.client = req.user.id;
    }
    
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('client', 'firstName lastName email company')
        .populate('serviceId', 'title category pricing')
        .populate('assignedTo', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(query)
    ]);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    if (req.user.role === 'client') {
      query.client = req.user.id;
    }

    const order = await Order.findOne(query)
      .populate('client', 'firstName lastName email company phone')
      .populate('serviceId')
      .populate('assignedTo', 'firstName lastName email')
      .populate('communication.from', 'firstName lastName role');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Client)
router.post('/', [auth, [
  body('serviceId')
    .isMongoId()
    .withMessage('Valid service ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('requirements')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Requirements must be between 10 and 5000 characters'),
  body('timeline')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Timeline must be less than 500 characters'),
  body('contactPreference')
    .isIn(['email', 'phone', 'chat'])
    .withMessage('Valid contact preference is required'),
  body('additionalNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Additional notes must be less than 1000 characters')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { serviceId, quantity, customAmount, requirements, timeline, contactPreference, additionalNotes } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if pricing type requires quote
    if (service.pricing.type === 'quote') {
      return res.status(400).json({ 
        message: 'This service requires a quote. Please submit a quote request instead.' 
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    if (service.pricing.type === 'fixed') {
      totalAmount = (service.pricing.amount || 0) * quantity;
    } else if (service.pricing.type === 'hourly') {
      totalAmount = (service.pricing.amount || 0) * quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Calculate pricing breakdown
    const subtotal = totalAmount;
    const tax = 0; // No tax for now
    const total = subtotal + tax;

    const order = new Order({
      orderNumber,
      client: req.user.id,
      serviceId: serviceId,
      quantity,
      totalAmount,
      requirements,
      timeline,
      contactPreference,
      additionalNotes,
      pricing: {
        subtotal,
        tax,
        total,
        currency: 'USD'
      },
      status: 'pending'
    });

    await order.save();
    await order.populate([
      { path: 'client', select: 'firstName lastName email' },
      { path: 'serviceId', select: 'title description pricing category' }
    ]);

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/approve
// @desc    Approve order (Admin only)
// @access  Private (Admin)
router.put('/:id/approve', [adminAuth, [
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes must be less than 1000 characters')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { adminNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'payment_confirmed') {
      return res.status(400).json({ 
        message: 'Order must be payment confirmed before approval' 
      });
    }

    order.status = 'approved';
    order.approvedBy = req.user.id;
    order.approvedAt = new Date();
    if (adminNotes) {
      order.adminNotes = adminNotes;
    }

    // Add communication entry for approval
    order.communication.push({
      from: req.user.id,
      message: `Order approved by admin. ${adminNotes || ''}`,
      isInternal: false
    });

    await order.save();
    await order.populate([
      { path: 'client', select: 'firstName lastName email' },
      { path: 'serviceId', select: 'title category' },
      { path: 'approvedBy', select: 'firstName lastName' }
    ]);

    res.json({
      message: 'Order approved successfully',
      order
    });
  } catch (error) {
    console.error('Approve order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/reject
// @desc    Reject order (Admin only)
// @access  Private (Admin)
router.put('/:id/reject', [adminAuth, [
  body('rejectionReason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rejectionReason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Cannot reject completed or cancelled order' 
      });
    }

    order.status = 'rejected';
    order.rejectedBy = req.user.id;
    order.rejectedAt = new Date();
    order.rejectionReason = rejectionReason;

    // Add communication entry for rejection
    order.communication.push({
      from: req.user.id,
      message: `Order rejected by admin. Reason: ${rejectionReason}`,
      isInternal: false
    });

    await order.save();
    await order.populate([
      { path: 'client', select: 'firstName lastName email' },
      { path: 'serviceId', select: 'title category' },
      { path: 'rejectedBy', select: 'firstName lastName' }
    ]);

    res.json({
      message: 'Order rejected successfully',
      order
    });
  } catch (error) {
    console.error('Reject order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', [adminAuth, [
  body('status')
    .isIn([
      'pending', 'payment_confirmed', 'approved', 'rejected',
      'in_progress', 'under_review', 'completed', 'cancelled', 'refunded'
    ])
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    // Add communication entry for status update
    if (notes) {
      order.communication.push({
        from: req.user.id,
        message: `Status updated to ${status}. ${notes}`,
        isInternal: false
      });
    }

    await order.save();
    await order.populate([
      { path: 'client', select: 'firstName lastName email' },
      { path: 'serviceId', select: 'title category' }
    ]);

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders/:id/communication
// @desc    Add communication message to order
// @access  Private
router.post('/:id/communication', [auth, [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
  body('isInternal')
    .optional()
    .isBoolean()
    .withMessage('isInternal must be a boolean')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message, isInternal = false } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    if (req.user.role === 'client' && order.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    // Add communication entry
    order.communication.push({
      from: req.user.id,
      message,
      isInternal,
      timestamp: new Date()
    });

    await order.save();

    // Populate the from field for response
    await order.populate('communication.from', 'firstName lastName role');

    const newMessage = order.communication[order.communication.length - 1];

    res.status(201).json({
      message: 'Communication added successfully',
      communication: newMessage
    });
  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
