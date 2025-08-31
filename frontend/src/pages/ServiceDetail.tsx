import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Shield,
  Award,
  Zap,
  Heart,
  Share2
} from 'lucide-react';
import api from '../config/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  pricing: {
    type: 'fixed' | 'hourly' | 'quote';
    amount?: number;
    currency: string;
    billingCycle: string;
  };
  deliveryTime: string;
  difficulty: string;
  technologies: string[];
  tags: string[];
  features: Array<{
    name: string;
    description: string;
    included: boolean;
  }>;
  rating: {
    average: number;
    count: number;
  };
  isFeatured: boolean;
  createdAt: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
}

interface OrderFormData {
  serviceId: string;
  quantity: number;
  customAmount?: number;
  requirements: string;
  timeline: string;
  contactPreference: 'email' | 'phone' | 'chat';
  additionalNotes: string;
}

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.user;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const [orderForm, setOrderForm] = useState<OrderFormData>({
    serviceId: id || '',
    quantity: 1,
    customAmount: undefined,
    requirements: '',
    timeline: '',
    contactPreference: 'email',
    additionalNotes: ''
  });

  const fetchService = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/services/${id}`);
      setService(response.data.service);
      setOrderForm(prev => ({ ...prev, serviceId: id || '' }));
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to load service details');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id, fetchService]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (service?.pricing.type === 'quote' && !orderForm.customAmount) {
      toast.error('Please enter your budget for custom quote');
      return;
    }

    if (!orderForm.requirements.trim()) {
      toast.error('Please describe your requirements');
      return;
    }

    try {
      setOrderLoading(true);
      
      const orderData = {
        serviceId: service?._id,
        quantity: orderForm.quantity,
        customAmount: service?.pricing.type === 'quote' ? orderForm.customAmount : undefined,
        requirements: orderForm.requirements,
        timeline: orderForm.timeline,
        contactPreference: orderForm.contactPreference,
        additionalNotes: orderForm.additionalNotes
      };

      if (service?.pricing.type === 'quote') {
        // For quote services, create a quote request
        await api.post('/quotes', orderData);
        toast.success('Quote request submitted successfully!');
        navigate('/client/quotes');
      } else {
        // For fixed/hourly services, create order and redirect to payment
        const response = await api.post('/orders', orderData);
        toast.success('Order created successfully!');
        navigate(`/client/orders/${response.data.order._id}/payment`);
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
    } finally {
      setOrderLoading(false);
      setShowOrderModal(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.title,
          text: service?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <button
            onClick={() => navigate('/services')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/services')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Services</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button
                onClick={toggleFavorite}
                className={`flex items-center space-x-2 ${
                  isFavorited ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6 mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {service.category}
                    </span>
                    {service.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Featured
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.difficulty === 'Basic' ? 'bg-green-100 text-green-700' :
                      service.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      service.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {service.difficulty}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h1>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.deliveryTime}
                    </div>
                    {service.rating.count > 0 && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        <span>{service.rating.average.toFixed(1)} ({service.rating.count} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                {service.description}
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border p-6 mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className={`w-5 h-5 mt-0.5 ${
                      feature.included ? 'text-green-500' : 'text-gray-300'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{feature.name}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Technologies */}
            {service.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border p-6 mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {service.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border p-6 sticky top-8"
            >
              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {service.pricing.type === 'fixed' ? (
                    `$${service.pricing.amount}`
                  ) : service.pricing.type === 'hourly' ? (
                    `$${service.pricing.amount}/hr`
                  ) : (
                    'Custom Quote'
                  )}
                </div>
                {service.pricing.type !== 'quote' && (
                  <p className="text-gray-600 text-sm">
                    {service.pricing.billingCycle}
                  </p>
                )}
              </div>

              {/* Order Button */}
              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 mb-4"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {service.pricing.type === 'quote' ? 'Request Quote' : 'Place Order'}
                </span>
              </button>

              {/* Contact Support */}
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 mb-6">
                <MessageCircle className="w-5 h-5" />
                <span>Contact Support</span>
              </button>

              {/* Service Info */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery Time</span>
                  <span className="font-medium">{service.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-medium">{service.difficulty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{service.category}</span>
                </div>
                {service.rating.count > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{service.rating.average.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Award className="w-4 h-4" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {service.pricing.type === 'quote' ? 'Request Quote' : 'Place Order'}
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-6">
                {/* Service Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{service.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Category: {service.category}</span>
                    <span className="font-medium">
                      {service.pricing.type === 'fixed' ? `$${service.pricing.amount}` :
                       service.pricing.type === 'hourly' ? `$${service.pricing.amount}/hr` :
                       'Custom Quote'}
                    </span>
                  </div>
                </div>

                {/* Custom Amount for Quote */}
                {service.pricing.type === 'quote' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Budget *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        min="1"
                        required
                        value={orderForm.customAmount || ''}
                        onChange={(e) => setOrderForm(prev => ({ 
                          ...prev, 
                          customAmount: parseFloat(e.target.value) || undefined 
                        }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter your budget"
                      />
                    </div>
                  </div>
                )}

                {/* Quantity */}
                {service.pricing.type !== 'quote' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm(prev => ({ 
                        ...prev, 
                        quantity: parseInt(e.target.value) || 1 
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={orderForm.requirements}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, requirements: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your project requirements in detail..."
                  />
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Timeline
                  </label>
                  <input
                    type="text"
                    value={orderForm.timeline}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Within 2 weeks, ASAP, etc."
                  />
                </div>

                {/* Contact Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    value={orderForm.contactPreference}
                    onChange={(e) => setOrderForm(prev => ({ 
                      ...prev, 
                      contactPreference: e.target.value as 'email' | 'phone' | 'chat' 
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="chat">Live Chat</option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={orderForm.additionalNotes}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Any additional information or special requests..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={orderLoading}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {orderLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>
                          {service.pricing.type === 'quote' ? 'Request Quote' : 'Place Order'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
