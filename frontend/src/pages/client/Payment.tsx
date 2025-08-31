import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  Lock,
  Clock,
  User
} from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface Order {
  _id: string;
  serviceId: {
    _id: string;
    title: string;
    description: string;
    pricing: {
      type: 'fixed' | 'hourly' | 'quote';
      amount?: number;
      currency: string;
    };
  };
  quantity: number;
  totalAmount: number;
  status: string;
  requirements: string;
  timeline: string;
  contactPreference: string;
  additionalNotes: string;
  createdAt: string;
}

interface PaymentFormData {
  paymentMethod: 'stripe' | 'paypal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const Payment: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.user;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    paymentMethod: 'stripe',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/client/orders');
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order) return;

    try {
      setProcessing(true);

      const paymentData = {
        orderId: order._id,
        amount: order.totalAmount,
        paymentMethod: paymentForm.paymentMethod,
        ...(paymentForm.paymentMethod === 'stripe' && {
          cardDetails: {
            number: paymentForm.cardNumber,
            expiry: paymentForm.expiryDate,
            cvv: paymentForm.cvv,
            name: paymentForm.cardholderName
          },
          billingAddress: paymentForm.billingAddress
        })
      };

      const response = await api.post('/payments/process', paymentData);
      
      if (response.data.success) {
        toast.success('Payment successful! Your order has been confirmed.');
        navigate('/client/orders');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      const message = error.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/client/orders')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Orders
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
              onClick={() => navigate('/client/orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Orders</span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="w-6 h-6 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentForm(prev => ({ ...prev, paymentMethod: 'stripe' }))}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        paymentForm.paymentMethod === 'stripe'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-primary-600" />
                        <div>
                          <div className="font-medium">Credit Card</div>
                          <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentForm(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        paymentForm.paymentMethod === 'paypal'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PP</span>
                        </div>
                        <div>
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-gray-600">Pay with PayPal</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                {paymentForm.paymentMethod === 'stripe' && (
                  <>
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm(prev => ({ 
                          ...prev, 
                          cardNumber: formatCardNumber(e.target.value) 
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm(prev => ({ 
                            ...prev, 
                            expiryDate: formatExpiryDate(e.target.value) 
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm(prev => ({ 
                            ...prev, 
                            cvv: e.target.value.replace(/\D/g, '') 
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="123"
                        />
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.cardholderName}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Billing Address */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentForm.billingAddress.street}
                            onChange={(e) => setPaymentForm(prev => ({ 
                              ...prev, 
                              billingAddress: { ...prev.billingAddress, street: e.target.value }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="123 Main St"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              required
                              value={paymentForm.billingAddress.city}
                              onChange={(e) => setPaymentForm(prev => ({ 
                                ...prev, 
                                billingAddress: { ...prev.billingAddress, city: e.target.value }
                              }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              required
                              value={paymentForm.billingAddress.state}
                              onChange={(e) => setPaymentForm(prev => ({ 
                                ...prev, 
                                billingAddress: { ...prev.billingAddress, state: e.target.value }
                              }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="NY"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              required
                              value={paymentForm.billingAddress.zipCode}
                              onChange={(e) => setPaymentForm(prev => ({ 
                                ...prev, 
                                billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                              }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="10001"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country *
                            </label>
                            <select
                              required
                              value={paymentForm.billingAddress.country}
                              onChange={(e) => setPaymentForm(prev => ({ 
                                ...prev, 
                                billingAddress: { ...prev.billingAddress, country: e.target.value }
                              }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="GB">United Kingdom</option>
                              <option value="AU">Australia</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* PayPal Notice */}
                {paymentForm.paymentMethod === 'paypal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">Secure PayPal Payment</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-2">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Pay ${order.totalAmount.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Service Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900">{order.serviceId.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{order.serviceId.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{order.quantity}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Unit Price</span>
                  <span className="font-medium">
                    ${order.serviceId.pricing.amount?.toFixed(2)}
                    {order.serviceId.pricing.type === 'hourly' && '/hr'}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Order #{order._id.slice(-8)}</span>
                </div>
                                 <div className="flex items-center space-x-2 text-gray-600">
                   <User className="w-4 h-4" />
                   <span>{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
                 </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Status: {order.status}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Money Back Guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
