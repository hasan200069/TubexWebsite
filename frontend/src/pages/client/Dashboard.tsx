import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Eye,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';

interface Order {
  _id: string;
  orderNumber: string;
  serviceId: {
    _id: string;
    title: string;
    category: string;
    pricing: {
      type: string;
      amount?: number;
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
  payment: {
    status: string;
    method?: string;
    paidAt?: string;
  };
  adminNotes?: string;
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
  rejectedBy?: {
    firstName: string;
    lastName: string;
  };
  rejectedAt?: string;
  rejectionReason?: string;
}

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'payment_confirmed':
        return <CreditCard className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusMessage = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return 'Your order is pending payment. Please complete the payment to proceed.';
      case 'payment_confirmed':
        return 'Payment received! Your order is awaiting admin approval.';
      case 'approved':
        return 'Order approved! Work will begin soon.';
      case 'rejected':
        return order.rejectionReason ? `Order rejected: ${order.rejectionReason}` : 'Order has been rejected.';
      case 'in_progress':
        return 'Your order is currently being worked on.';
      case 'completed':
        return 'Order completed successfully!';
      case 'cancelled':
        return 'Order has been cancelled.';
      default:
        return 'Order status unknown.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {state.user?.firstName}!
          </h1>
          <p className="text-gray-600">Manage your orders and track their progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['pending', 'payment_confirmed', 'approved'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => navigate('/client/orders')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </button>
            </div>
          </div>
          
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start by browsing our services and placing your first order.</p>
              <button
                onClick={() => navigate('/services')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {order.serviceId.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {getStatusMessage(order)}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Order #{order.orderNumber}</span>
                        <span>•</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => navigate(`/client/orders/${order._id}/payment`)}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/client/orders/${order._id}`)}
                        className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Browse Services</h3>
            </div>
            <p className="text-gray-600 mb-4">Explore our wide range of IT services and solutions.</p>
            <button
              onClick={() => navigate('/services')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View Services →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
            </div>
            <p className="text-gray-600 mb-4">Track and manage all your orders in one place.</p>
            <button
              onClick={() => navigate('/client/orders')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View Orders →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Get Quote</h3>
            </div>
            <p className="text-gray-600 mb-4">Need a custom solution? Request a personalized quote.</p>
            <button
              onClick={() => navigate('/client/quotes')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Request Quote →
            </button>
          </div>
        </motion.div>
      </div>
    </Sidebar>
  );
};

export default Dashboard;
