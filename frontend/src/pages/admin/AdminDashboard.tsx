import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  User,
  Calendar,
  Eye,
  MessageSquare
} from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';

interface Order {
  _id: string;
  orderNumber: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
  };
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

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const handleApprove = async () => {
    if (!selectedOrder) return;

    try {
      setActionLoading(true);
      await api.put(`/orders/${selectedOrder._id}/approve`, {
        adminNotes: adminNotes.trim() || undefined
      });
      
      toast.success('Order approved successfully');
      setShowModal(false);
      setAdminNotes('');
      fetchOrders();
    } catch (error: any) {
      console.error('Error approving order:', error);
      const message = error.response?.data?.message || 'Failed to approve order';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      await api.put(`/orders/${selectedOrder._id}/reject`, {
        rejectionReason: rejectionReason.trim()
      });
      
      toast.success('Order rejected successfully');
      setShowModal(false);
      setRejectionReason('');
      fetchOrders();
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      const message = error.response?.data?.message || 'Failed to reject order';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (order: Order, action: 'approve' | 'reject') => {
    setSelectedOrder(order);
    setShowModal(true);
    setAdminNotes('');
    setRejectionReason('');
  };

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {state.user?.firstName}! Manage orders and clients.</p>
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'payment_confirmed').length}
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
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'approved').length}
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.client.firstName} {order.client.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.client.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.serviceId.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.serviceId.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment.status)}`}>
                        {order.payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {order.status === 'payment_confirmed' && (
                          <>
                            <button
                              onClick={() => openModal(order, 'approve')}
                              className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => openModal(order, 'reject')}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order Number</label>
                      <p className="text-sm text-gray-900">{selectedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Information</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">
                        <strong>{selectedOrder.client.firstName} {selectedOrder.client.lastName}</strong>
                      </p>
                      <p className="text-sm text-gray-600">{selectedOrder.client.email}</p>
                      {selectedOrder.client.company && (
                        <p className="text-sm text-gray-600">{selectedOrder.client.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Service Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Details</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{selectedOrder.serviceId.title}</p>
                      <p className="text-sm text-gray-600">Category: {selectedOrder.serviceId.category}</p>
                      <p className="text-sm text-gray-600">Quantity: {selectedOrder.quantity}</p>
                      <p className="text-sm text-gray-600">Total: ${selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedOrder.requirements}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  {selectedOrder.timeline && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-900">
                          {selectedOrder.timeline.estimatedDelivery && `Estimated: ${formatDate(selectedOrder.timeline.estimatedDelivery)}`}
                          {selectedOrder.timeline.actualDelivery && ` | Actual: ${formatDate(selectedOrder.timeline.actualDelivery)}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {selectedOrder.additionalNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-900">{selectedOrder.additionalNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  {selectedOrder.status === 'payment_confirmed' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Notes (Optional)
                        </label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Add any notes for the client..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (Required for rejection)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Explain why the order is being rejected..."
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={handleApprove}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {actionLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              <span>Approve Order</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={actionLoading || !rejectionReason.trim()}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {actionLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5" />
                              <span>Reject Order</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default AdminDashboard;
