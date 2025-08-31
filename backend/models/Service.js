const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development', 
      'Cloud Services',
      'Cybersecurity',
      'Data Analytics',
      'IT Consulting',
      'DevOps',
      'AI/ML',
      'Database Management',
      'Network Infrastructure',
      'Technical Support',
      'Custom Software'
    ]
  },
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'hourly', 'quote'],
      required: true
    },
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    billingCycle: {
      type: String,
      enum: ['one-time', 'monthly', 'yearly'],
      default: 'one-time'
    }
  },
  features: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    included: {
      type: Boolean,
      default: true
    }
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  deliveryTime: {
    type: String,
    required: true // e.g., "1-2 weeks", "3-5 business days"
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  requirements: [{
    type: String,
    trim: true
  }],
  portfolio: [{
    title: String,
    description: String,
    image: String,
    url: String
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
serviceSchema.index({ 
  title: 'text', 
  description: 'text', 
  shortDescription: 'text',
  tags: 'text'
});

serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ isFeatured: 1, isActive: 1 });
serviceSchema.index({ 'pricing.amount': 1 });

module.exports = mongoose.model('Service', serviceSchema);
