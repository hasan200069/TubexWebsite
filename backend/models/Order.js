const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  customAmount: {
    type: Number,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: [
      'pending',
      'payment_confirmed', 
      'in_progress',
      'under_review',
      'completed',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  requirements: {
    type: String,
    required: true,
    maxlength: 5000
  },
  timeline: {
    type: String,
    maxlength: 500
  },
  contactPreference: {
    type: String,
    enum: ['email', 'phone', 'chat'],
    required: true
  },
  additionalNotes: {
    type: String,
    maxlength: 1000
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['stripe', 'paypal']
    },
    transactionId: String,
    paidAt: Date,
    stripePaymentIntentId: String,
    stripeChargeId: String
  },
  requirements: {
    type: String,
    maxlength: 5000
  },
  deliverables: [{
    title: String,
    description: String,
    fileUrl: String,
    completedAt: Date
  }],
  timeline: {
    estimatedDelivery: Date,
    actualDelivery: Date,
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      completedAt: Date,
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
      }
    }]
  },
  communication: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000
    },
    attachments: [{
      filename: String,
      url: String,
      type: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    reviewedAt: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  refund: {
    amount: Number,
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    refundId: String
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `TBX-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for efficient queries
orderSchema.index({ client: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
