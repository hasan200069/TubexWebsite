const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Service = require('../models/Service');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services (public)
// @access  Public
router.get('/', [
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'rating', 'newest']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query['pricing.amount'] = {};
      if (minPrice) query['pricing.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.amount'].$lte = parseFloat(maxPrice);
    }

    // Build sort
    let sortOptions = {};
    switch (sort) {
      case 'price_asc':
        sortOptions = { 'pricing.amount': 1 };
        break;
      case 'price_desc':
        sortOptions = { 'pricing.amount': -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Add featured services to top
    if (!search) {
      sortOptions = { isFeatured: -1, ...sortOptions };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [services, total] = await Promise.all([
      Service.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'firstName lastName')
        .lean(),
      Service.countDocuments(query)
    ]);

    res.json({
      services,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/featured
// @desc    Get featured services
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const services = await Service.find({
      isActive: true,
      isFeatured: true
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('createdBy', 'firstName lastName')
      .lean();

    res.json({ services });
  } catch (error) {
    console.error('Get featured services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/categories
// @desc    Get service categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });
    
    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Service.countDocuments({
          category,
          isActive: true
        });
        return { name: category, count };
      })
    );

    res.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isActive: true
    }).populate('createdBy', 'firstName lastName avatar');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get related services
    const relatedServices = await Service.find({
      _id: { $ne: service._id },
      category: service.category,
      isActive: true
    })
      .limit(4)
      .select('title shortDescription pricing images category')
      .lean();

    res.json({
      service,
      relatedServices
    });
  } catch (error) {
    console.error('Get service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid service ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/services
// @desc    Create new service (Admin only)
// @access  Private (Admin)
router.post('/', [adminAuth, [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .isIn([
      'Web Development', 'Mobile Development', 'Cloud Services',
      'Cybersecurity', 'Data Analytics', 'IT Consulting', 'DevOps',
      'AI/ML', 'Database Management', 'Network Infrastructure',
      'Technical Support', 'Custom Software'
    ])
    .withMessage('Invalid category'),
  body('pricing.type')
    .isIn(['fixed', 'hourly', 'quote'])
    .withMessage('Invalid pricing type'),
  body('pricing.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('deliveryTime')
    .trim()
    .notEmpty()
    .withMessage('Delivery time is required'),
  body('features')
    .isArray({ min: 1 })
    .withMessage('At least one feature is required'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const serviceData = {
      ...req.body,
      createdBy: req.user.id
    };

    const service = new Service(serviceData);
    await service.save();

    await service.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service (Admin only)
// @access  Private (Admin)
router.put('/:id', [adminAuth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('pricing.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid service ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid service ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/categories
// @desc    Get all service categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const formattedCategories = categories.map(cat => ({
      name: cat._id,
      count: cat.count
    }));

    res.json({
      success: true,
      categories: formattedCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid service ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
