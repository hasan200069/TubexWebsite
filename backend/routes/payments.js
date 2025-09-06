const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-method
// @desc    Create payment method for order
// @access  Private
router.post('/create-payment-method', [auth, [
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

    // Create payment intent
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
// @desc    Process payment for an order using Stripe
// @access  Private (Client)
router.post('/process', [auth, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('paymentMethodId')
    .isString()
    .withMessage('Payment method ID is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, paymentMethodId } = req.body;

    // Get order details
    const order = await Order.findById(orderId)
      .populate('serviceId', 'title pricing')
      .populate('client', 'firstName lastName email');

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

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      metadata: {
        orderId: order._id.toString(),
        clientId: req.user.id.toString(),
        serviceTitle: order.serviceId.title
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Payment successful
      order.status = 'payment_confirmed';
      order.payment = {
        status: 'completed',
        method: 'stripe',
        transactionId: paymentIntent.charges.data[0]?.id,
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntent.id,
        stripeChargeId: paymentIntent.charges.data[0]?.id
      };

      await order.save();

      res.json({
        success: true,
        message: 'Payment processed successfully',
        payment: {
          id: paymentIntent.id,
          amount: order.totalAmount,
          currency: 'USD',
          status: 'succeeded'
        },
        order
      });
    } else if (paymentIntent.status === 'requires_action') {
      // Payment requires additional action (3D Secure, etc.)
      res.json({
        success: false,
        requires_action: true,
        payment_intent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret
        }
      });
    } else {
      // Payment failed
      res.status(400).json({
        success: false,
        message: 'Payment failed',
        error: paymentIntent.last_payment_error?.message || 'Payment could not be processed'
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    
    if (error.type === 'StripeCardError') {
      res.status(400).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Payment processing failed'
      });
    }
  }
});

module.exports = router;
