const express = require('express');
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Quote = require('../models/Quote');
const Chat = require('../models/Chat');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalServices,
      totalOrders,
      totalQuotes,
      pendingQuotes,
      activeChats,
      recentOrders,
      monthlyRevenue
    ] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      Service.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Quote.countDocuments(),
      Quote.countDocuments({ status: 'submitted' }),
      Chat.countDocuments({ status: 'active' }),
      Order.find({ status: { $in: ['payment_confirmed', 'in_progress'] } })
        .populate('client', 'firstName lastName')
        .populate('service', 'title')
        .limit(10)
        .sort({ createdAt: -1 })
        .lean(),
      Order.aggregate([
        {
          $match: {
            'payment.status': 'completed',
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$pricing.total' }
          }
        }
      ])
    ]);

    res.json({
      stats: {
        totalUsers,
        totalServices,
        totalOrders,
        totalQuotes,
        pendingQuotes,
        activeChats,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      },
      recentOrders
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    let query = { role: 'client' };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
