import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  FileText, 
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Package,
  DollarSign,
  Tag,
  Send,
  Save
} from 'lucide-react';
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
    description: string;
    category: string;
    pricing: {
      type: 'fixed' | 'hourly' | 'quote';
      amount?: number;
      currency: string;
    };
  };
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    phone?: string;
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
  pricing: {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
  payment: {
    status: string;
    method?: string;
    transactionId?: string;
    paidAt?: string;
  };
  deliverables: Array<{
    title: string;
    description: string;
    fileUrl: string;
    completedAt: string;
  }>;
  communication: Array<{
    _id: string;
    from: {
      _id: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    message: string;
    timestamp: string;
    isInternal: boolean;
    attachments?: Array<{
      filename: string;
      url: string;
      type: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

const AdminOrderView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'communication' | 'deliverables' | 'actions'>('details');
  const [newMessage, setNewMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.order);
      setNewStatus(response.data.order.status);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'payment_confirmed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'under_review': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'payment_confirmed': return <CreditCard className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'in_progress': return <Package className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <DollarSign className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order?.status) return;

    try {
      setActionLoading(true);
      await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        notes: adminNotes
      });
      toast.success('Order status updated successfully');
      fetchOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveOrder = async () => {
    try {
      setActionLoading(true);
      await api.put(`/orders/${orderId}/approve`, {
        adminNotes: adminNotes || 'Order approved by admin'
      });
      toast.success('Order approved successfully');
      fetchOrder();
    } catch (error) {
      console.error('Error approving order:', error);
      toast.error('Failed to approve order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      await api.put(`/orders/${orderId}/reject`, {
        rejectionReason
      });
      toast.success('Order rejected successfully');
      fetchOrder();
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/orders/${orderId}/communication`, {
        message: newMessage,
        isInternal: false
      });
      toast.success('Message sent successfully');
      setNewMessage('');
      fetchOrder();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
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
            onClick={() => navigate('/admin/orders')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Orders</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-2 capitalize">{order.status.replace('_', ' ')}</span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'details', name: 'Order Details', icon: FileText },
                    { id: 'communication', name: 'Communication', icon: MessageCircle },
                    { id: 'deliverables', name: 'Deliverables', icon: Package },
                    { id: 'actions', name: 'Admin Actions', icon: Edit }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Service Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Service Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{order.serviceId.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{order.serviceId.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center text-gray-600">
                            <Tag className="w-4 h-4 mr-1" />
                            {order.serviceId.category}
                          </span>
                          <span className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${order.serviceId.pricing.amount?.toFixed(2)}
                            {order.serviceId.pricing.type === 'hourly' && '/hr'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Requirements */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Requirements</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{order.requirements}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    {order.timeline && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          {order.timeline.estimatedDelivery && (
                            <div className="mb-3">
                              <span className="text-sm font-medium text-gray-600">Estimated Delivery: </span>
                              <span className="text-sm text-gray-700">{formatDate(order.timeline.estimatedDelivery)}</span>
                            </div>
                          )}
                          {order.timeline.actualDelivery && (
                            <div className="mb-3">
                              <span className="text-sm font-medium text-gray-600">Actual Delivery: </span>
                              <span className="text-sm text-gray-700">{formatDate(order.timeline.actualDelivery)}</span>
                            </div>
                          )}
                          {order.timeline.milestones && order.timeline.milestones.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Milestones:</h4>
                              <div className="space-y-2">
                                {order.timeline.milestones.map((milestone, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700">{milestone.title}</span>
                                      <p className="text-gray-600">{milestone.description}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {milestone.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {order.additionalNotes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">{order.additionalNotes}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'communication' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Send Message */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Send Message to Client</h4>
                      <div className="space-y-3">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Type your message here..."
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={actionLoading || !newMessage.trim()}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {actionLoading ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </div>

                    {/* Communication History */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Communication History</h4>
                      {order.communication.length > 0 ? (
                        <div className="space-y-4">
                          {order.communication.map((message) => (
                            <div key={message._id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">
                                    {message.from.firstName} {message.from.lastName}
                                  </span>
                                  <span className="text-sm text-gray-500">({message.from.role})</span>
                                </div>
                                <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                              </div>
                              <p className="text-gray-700">{message.message}</p>
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                                  <div className="space-y-2">
                                    {message.attachments.map((attachment, index) => (
                                      <a
                                        key={index}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                                      >
                                        <Download className="w-4 h-4" />
                                        <span>{attachment.filename}</span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No communication yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'deliverables' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {order.deliverables && order.deliverables.length > 0 ? (
                      order.deliverables.map((deliverable, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{deliverable.title}</h4>
                            {deliverable.completedAt && (
                              <span className="text-sm text-green-600">Completed</span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3">{deliverable.description}</p>
                          {deliverable.fileUrl && (
                            <a
                              href={deliverable.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download File</span>
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No deliverables yet</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'actions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Status Update */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Update Order Status</h4>
                      <div className="space-y-3">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="payment_confirmed">Payment Confirmed</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="in_progress">In Progress</option>
                          <option value="under_review">Under Review</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Add notes about this status change..."
                        />
                        <button
                          onClick={handleStatusUpdate}
                          disabled={actionLoading || newStatus === order.status}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {actionLoading ? 'Updating...' : 'Update Status'}
                        </button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                      <div className="flex flex-wrap gap-3">
                        {order.status === 'payment_confirmed' && (
                          <>
                            <button
                              onClick={handleApproveOrder}
                              disabled={actionLoading}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Order
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Enter rejection reason:');
                                if (reason) {
                                  setRejectionReason(reason);
                                  handleRejectOrder();
                                }
                              }}
                              disabled={actionLoading}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Order
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${order.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${order.pricing.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Total</span>
                      <span className="font-bold text-lg text-primary-600">
                        ${order.pricing.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment.status)}`}>
                      {order.payment.status}
                    </span>
                  </div>
                  {order.payment.method && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Method</span>
                      <span className="font-medium capitalize">{order.payment.method}</span>
                    </div>
                  )}
                  {order.payment.paidAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid At</span>
                      <span className="font-medium">{formatDate(order.payment.paidAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {order.client.firstName} {order.client.lastName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{order.client.email}</span>
                  </div>
                  {order.client.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{order.client.phone}</span>
                    </div>
                  )}
                  {order.client.company && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{order.client.company}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 capitalize">{order.contactPreference}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium">{formatDate(order.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminOrderView;
