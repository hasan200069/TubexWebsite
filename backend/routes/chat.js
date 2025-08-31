const express = require('express');
const { body, validationResult } = require('express-validator');
const Chat = require('../models/Chat');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/chat
// @desc    Get user chats
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.user': req.user.id,
      status: { $in: ['active', 'closed'] }
    })
      .populate('participants.user', 'firstName lastName role avatar')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedQuote', 'quoteNumber')
      .sort({ lastActivity: -1 })
      .lean();

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat
// @desc    Create new chat
// @access  Private
router.post('/', [auth, [
  body('type')
    .isIn(['support', 'order', 'quote', 'general'])
    .withMessage('Invalid chat type'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must be less than 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, subject, message, relatedOrder, relatedQuote } = req.body;

    const chat = new Chat({
      participants: [
        {
          user: req.user.id,
          role: req.user.role
        }
      ],
      type,
      subject,
      relatedOrder,
      relatedQuote,
      messages: [
        {
          sender: req.user.id,
          content: message,
          messageType: 'text'
        }
      ]
    });

    await chat.save();
    await chat.populate([
      { path: 'participants.user', select: 'firstName lastName role avatar' },
      { path: 'messages.sender', select: 'firstName lastName role' }
    ]);

    res.status(201).json({
      message: 'Chat created successfully',
      chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
