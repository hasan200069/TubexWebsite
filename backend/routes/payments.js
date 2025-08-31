const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for order
// @access  Private
router.post('/create-payment-intent', [auth, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      client: req.user.id,
      status: 'pending'
    }).populate('serviceId', 'title');

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not eligible for payment' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        clientId: req.user.id.toString(),
        serviceTitle: order.serviceId.title
      }
    });

    // Store payment intent ID in order
    order.payment.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Payment processing error' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment completion
// @access  Private
router.post('/confirm-payment', [auth, [
  body('paymentIntentId')
    .isString()
    .withMessage('Payment intent ID is required'),
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentIntentId, orderId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Update order
    const order = await Order.findOne({
      _id: orderId,
      client: req.user.id,
      'payment.stripePaymentIntentId': paymentIntentId
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.payment.status = 'completed';
    order.payment.paidAt = new Date();
    order.payment.transactionId = paymentIntent.charges.data[0]?.id;
    order.status = 'payment_confirmed';

    await order.save();

    res.json({
      message: 'Payment confirmed successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        payment: order.payment
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Payment confirmation error' });
  }
});

// @route   POST /api/payments/process
// @desc    Process payment for an order (simplified version)
// @access  Private (Client)
router.post('/process', [auth, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('paymentMethod')
    .isIn(['stripe', 'paypal'])
    .withMessage('Valid payment method is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, amount, paymentMethod } = req.body;

    // Get order details
    const order = await Order.findById(orderId)
      .populate('serviceId', 'title pricing')
      .populate('client', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.client._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order is not in pending status'
      });
    }

    if (order.totalAmount !== amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match order total'
      });
    }

    // Simulate successful payment
    const paymentResult = {
      success: true,
      transactionId: `txn_${Date.now()}`,
      amount: order.totalAmount,
      currency: 'USD',
      paymentMethod: paymentMethod
    };

    // Update order status
    order.status = 'payment_confirmed';
    order.payment = {
      status: 'completed',
      method: paymentMethod,
      transactionId: paymentResult.transactionId,
      paidAt: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      payment: paymentResult,
      order
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed'
    });
  }
});

module.exports = router;
