import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  DollarSign, 
  Calendar, 
  Clock, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Send,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';

interface Quote {
  _id: string;
  quoteNumber: string;
  serviceId: {
    _id: string;
    title: string;
    description: string;
    category: string;
  };
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  };
  requirements: string;
  timeline: string;
  customAmount: number;
  contactPreference: string;
  additionalNotes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  quotedAmount?: number;
  adminResponse?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  communication?: Array<{
    _id: string;
    from: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    message: string;
    timestamp: string;
    isInternal: boolean;
  }>;
}

const AdminQuoteView: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({
    quotedAmount: '',
    response: '',
    status: 'accepted' as 'accepted' | 'rejected'
  });

  useEffect(() => {
    if (quoteId) {
      fetchQuote();
    }
  }, [quoteId]);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quotes/${quoteId}`);
      setQuote(response.data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
      toast.error('Failed to fetch quote details');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !quote) return;

    try {
      setSendingMessage(true);
      await api.post(`/quotes/${quote._id}/communication`, {
        message: newMessage,
        isInternal: false
      });
      
      setNewMessage('');
      toast.success('Message sent successfully');
      fetchQuote(); // Refresh to get updated communication
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleRespondToQuote = async () => {
    if (!quote) return;

    try {
      const responsePayload = {
        quotedAmount: parseFloat(responseData.quotedAmount),
        response: responseData.response,
        status: responseData.status
      };

      await api.put(`/quotes/${quote._id}/respond`, responsePayload);
      toast.success(`Quote ${responseData.status} successfully`);
      setShowResponseModal(false);
      setResponseData({ quotedAmount: '', response: '', status: 'accepted' });
      fetchQuote();
    } catch (error) {
      console.error('Error responding to quote:', error);
      toast.error('Failed to respond to quote');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </Sidebar>
    );
  }

  if (!quote) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Quote not found</h3>
            <p className="text-gray-500">The quote you're looking for doesn't exist.</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/quotes')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Quotes</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quote Details</h1>
              <p className="text-sm text-gray-600">Quote #{quote.quoteNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
              {getStatusIcon(quote.status)}
              <span className="ml-2 capitalize">{quote.status}</span>
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(quote.priority)}`}>
              {quote.priority}
            </span>
            {quote.status === 'pending' && (
              <button
                onClick={() => setShowResponseModal(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Respond
              </button>
            )}
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
                    { id: 'details', name: 'Details', icon: FileText },
                    { id: 'communication', name: 'Communication', icon: MessageSquare }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
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
                  <div className="space-y-6">
                    {/* Service Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Service Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Service</label>
                            <p className="text-sm text-gray-900">{quote.serviceId.title}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Category</label>
                            <p className="text-sm text-gray-900">{quote.serviceId.category}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600">Description</label>
                            <p className="text-sm text-gray-900">{quote.serviceId.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Requirements</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{quote.requirements}</p>
                      </div>
                    </div>

                    {/* Timeline & Budget */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline & Budget</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Timeline</label>
                            <p className="text-sm text-gray-900">{quote.timeline || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Requested Amount</label>
                            <p className="text-sm text-gray-900">${quote.customAmount.toLocaleString()}</p>
                          </div>
                          {quote.quotedAmount && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Quoted Amount</label>
                              <p className="text-sm text-gray-900 font-medium">${quote.quotedAmount.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {quote.additionalNotes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{quote.additionalNotes}</p>
                        </div>
                      </div>
                    )}

                    {/* Admin Response */}
                    {quote.adminResponse && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Response</h3>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{quote.adminResponse}</p>
                          {quote.respondedAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Responded on {formatDate(quote.respondedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'communication' && (
                  <div className="space-y-6">
                    {/* Communication History */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Communication History</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {quote.communication && quote.communication.length > 0 ? (
                          quote.communication.map((message) => (
                            <div
                              key={message._id}
                              className={`p-4 rounded-lg ${
                                message.isInternal
                                  ? 'bg-yellow-50 border-l-4 border-yellow-400'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {message.from.firstName} {message.from.lastName}
                                  </span>
                                  {message.isInternal && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                      Internal
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatDate(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{message.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No communication yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Send Message */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Send Message</h3>
                      <div className="space-y-4">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Type your message here..."
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="internal"
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="internal" className="text-sm text-gray-600">
                              Internal note (not visible to client)
                            </label>
                          </div>
                          <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || sendingMessage}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {sendingMessage ? 'Sending...' : 'Send Message'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {quote.client.firstName} {quote.client.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Client</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-900">{quote.client.email}</p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>

                {quote.client.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-900">{quote.client.phone}</p>
                      <p className="text-xs text-gray-500">Phone</p>
                    </div>
                  </div>
                )}

                {quote.client.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-900">{quote.client.company}</p>
                      <p className="text-xs text-gray-500">Company</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-900 capitalize">{quote.contactPreference}</p>
                    <p className="text-xs text-gray-500">Preferred Contact</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quote Number</span>
                  <span className="font-medium">{quote.quoteNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {getStatusIcon(quote.status)}
                    <span className="ml-1 capitalize">{quote.status}</span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Priority</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(quote.priority)}`}>
                    {quote.priority}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Requested Amount</span>
                  <span className="font-medium">${quote.customAmount.toLocaleString()}</span>
                </div>
                {quote.quotedAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quoted Amount</span>
                    <span className="font-medium text-primary-600">${quote.quotedAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{formatDate(quote.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expires</span>
                  <span className="font-medium">{formatDate(quote.expiresAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Modal */}
        {showResponseModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Respond to Quote {quote.quoteNumber}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={responseData.status}
                      onChange={(e) => setResponseData({ ...responseData, status: e.target.value as 'accepted' | 'rejected' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quoted Amount ($)
                    </label>
                    <input
                      type="number"
                      value={responseData.quotedAmount}
                      onChange={(e) => setResponseData({ ...responseData, quotedAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter quoted amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Message
                    </label>
                    <textarea
                      value={responseData.response}
                      onChange={(e) => setResponseData({ ...responseData, response: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your response message..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowResponseModal(false);
                      setResponseData({ quotedAmount: '', response: '', status: 'accepted' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRespondToQuote}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default AdminQuoteView;
