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

module.exports = router;
