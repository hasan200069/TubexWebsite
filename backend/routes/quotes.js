const express = require('express');
const { body, validationResult } = require('express-validator');
const Quote = require('../models/Quote');
const Service = require('../models/Service');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quotes
// @desc    Get user quotes (client) or all quotes (admin)
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

    const [quotes, total] = await Promise.all([
      Quote.find(query)
        .populate('client', 'firstName lastName email company')
        .populate('adminResponse.respondedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Quote.countDocuments(query)
    ]);

    res.json({
      quotes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quotes
// @desc    Submit quote request
// @access  Private (Client)
router.post('/', [auth, [
  body('serviceId')
    .isMongoId()
    .withMessage('Valid service ID is required'),
  body('customAmount')
    .isFloat({ min: 1 })
    .withMessage('Custom amount must be at least $1'),
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

    const { serviceId, customAmount, requirements, timeline, contactPreference, additionalNotes } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if service requires quote
    if (service.pricing.type !== 'quote') {
      return res.status(400).json({ 
        message: 'This service does not require a quote. Please place a regular order instead.' 
      });
    }

    // Generate quote number
    const quoteNumber = `QUO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const quote = new Quote({
      quoteNumber,
      client: req.user.id,
      serviceId: serviceId,
      customAmount,
      requirements,
      timeline,
      contactPreference,
      additionalNotes,
      status: 'pending'
    });

    await quote.save();
    await quote.populate([
      { path: 'client', select: 'name email' },
      { path: 'serviceId', select: 'title description pricing category' }
    ]);

    res.status(201).json({
      success: true,
      quote
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quotes/:id
// @desc    Get single quote by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('client', 'firstName lastName email phone company')
      .populate('serviceId', 'title description category pricing')
      .populate('communication.from', 'firstName lastName')
      .lean();

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    // Check if user has access to this quote
    if (req.user.role === 'client' && quote.client._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ quote });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/quotes/:id/respond
// @desc    Admin respond to quote
// @access  Private (Admin)
router.put('/:id/respond', [adminAuth, [
  body('quotedAmount')
    .isFloat({ min: 0 })
    .withMessage('Valid quoted amount is required'),
  body('response')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Response must be between 1 and 2000 characters'),
  body('status')
    .isIn(['accepted', 'rejected'])
    .withMessage('Status must be accepted or rejected')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { quotedAmount, response, status } = req.body;

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    if (quote.status !== 'pending') {
      return res.status(400).json({ message: 'Quote has already been responded to' });
    }

    quote.quotedAmount = quotedAmount;
    quote.adminResponse = response;
    quote.status = status;
    quote.respondedAt = new Date();

    await quote.save();

    res.json({
      success: true,
      message: `Quote ${status} successfully`,
      quote
    });
  } catch (error) {
    console.error('Respond to quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quotes/:id/communication
// @desc    Add communication message to quote
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

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    // Check if user has access to this quote
    if (req.user.role === 'client' && quote.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only admins can send internal messages
    if (isInternal && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can send internal messages' });
    }

    quote.communication.push({
      from: req.user.id,
      message,
      isInternal,
      timestamp: new Date()
    });

    await quote.save();

    // Populate the from field for response
    await quote.populate('communication.from', 'firstName lastName');

    res.json({
      success: true,
      message: 'Message sent successfully',
      communication: quote.communication[quote.communication.length - 1]
    });
  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/quotes/:id/accept
// @desc    Client accept quote
// @access  Private (Client)
router.put('/:id/accept', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can accept quotes' });
    }

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    if (quote.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (quote.status !== 'accepted') {
      return res.status(400).json({ message: 'Quote is not in accepted status' });
    }

    // Quote is already accepted by admin, client just acknowledges
    res.json({
      success: true,
      message: 'Quote accepted successfully',
      quote
    });
  } catch (error) {
    console.error('Accept quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/quotes/:id/reject
// @desc    Client reject quote
// @access  Private (Client)
router.put('/:id/reject', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can reject quotes' });
    }

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    if (quote.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (quote.status !== 'accepted') {
      return res.status(400).json({ message: 'Quote is not in accepted status' });
    }

    quote.status = 'rejected';
    await quote.save();

    res.json({
      success: true,
      message: 'Quote rejected successfully',
      quote
    });
  } catch (error) {
    console.error('Reject quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
