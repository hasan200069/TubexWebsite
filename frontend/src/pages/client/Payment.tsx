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
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../config/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz');

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
  timeline: {
    estimatedDelivery?: string;
    actualDelivery?: string;
    milestones?: Array<{
      title: string;
      description: string;
      dueDate: string;
      completedAt?: string;
      status: 'pending' | 'in_progress' | 'completed';
    }>;
  };
  contactPreference: string;
  additionalNotes: string;
  createdAt: string;
}

interface PaymentFormData {
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const PaymentForm: React.FC<{ order: Order; user: any }> = ({ order, user }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });


  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Payment form submitted');
    console.log('Stripe available:', !!stripe);
    console.log('Elements available:', !!elements);
    console.log('Order available:', !!order);
    
    if (!stripe || !elements || !order) {
      console.error('Missing required dependencies for payment');
      return;
    }

    try {
      setProcessing(true);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error('Card element not found');
        return;
      }

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: paymentForm.cardholderName,
          address: {
            line1: paymentForm.billingAddress.street,
            city: paymentForm.billingAddress.city,
            state: paymentForm.billingAddress.state,
            postal_code: paymentForm.billingAddress.zipCode,
            country: paymentForm.billingAddress.country,
          },
        },
      });

      if (pmError) {
        toast.error(pmError.message || 'Payment method creation failed');
        return;
      }

      // Process payment
      const response = await api.post('/payments/process', {
        orderId: order._id,
        paymentMethodId: paymentMethod.id
      });
      
      if (response.data.success) {
        toast.success('Payment successful! Your order has been confirmed.');
        navigate('/client/orders');
      } else if (response.data.requires_action) {
        // Handle 3D Secure authentication
        const { error: confirmError } = await stripe.confirmCardPayment(
          response.data.payment_intent.client_secret
        );

        if (confirmError) {
          toast.error(confirmError.message || 'Payment confirmation failed');
        } else {
          toast.success('Payment successful! Your order has been confirmed.');
          navigate('/client/orders');
        }
      } else {
        toast.error(response.data.message || 'Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      const message = error.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };


  return (
    <Sidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
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
                {/* Card Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Information *
                  </label>
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <CardElement options={cardElementOptions} />
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing || !stripe}
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
    </Sidebar>
  );
};

const Payment: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.user;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching order with ID:', orderId);
      const response = await api.get(`/orders/${orderId}`);
      console.log('Order response:', response.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-4">Order ID: {orderId}</p>
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
    <Elements stripe={stripePromise}>
      <PaymentForm order={order} user={user} />
    </Elements>
  );
};

export default Payment;
