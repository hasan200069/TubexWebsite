const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quoteNumber: {
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
  customAmount: {
    type: Number,
    required: true,
    min: 0
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
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: [
      'pending',
      'accepted',
      'rejected',
      'expired'
    ],
    default: 'pending'
  },
  quotedAmount: {
    type: Number,
    min: 0
  },
  adminResponse: {
    type: String,
    maxlength: 2000
  },
  respondedAt: {
    type: Date
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
      url: String
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
  convertedToOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }
}, {
  timestamps: true
});

// Generate quote number before saving
quoteSchema.pre('save', async function(next) {
  if (!this.quoteNumber) {
    const count = await this.constructor.countDocuments();
    this.quoteNumber = `QTE-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for efficient queries
quoteSchema.index({ client: 1, status: 1 });
quoteSchema.index({ quoteNumber: 1 });
quoteSchema.index({ status: 1, priority: 1 });
quoteSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Quote', quoteSchema);
