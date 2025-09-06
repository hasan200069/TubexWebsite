import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Send,
  Download,
  User
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

const QuoteView: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

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

  const acceptQuote = async () => {
    if (!quote) return;

    try {
      await api.put(`/quotes/${quote._id}/accept`);
      toast.success('Quote accepted successfully');
      fetchQuote();
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast.error('Failed to accept quote');
    }
  };

  const rejectQuote = async () => {
    if (!quote) return;

    try {
      await api.put(`/quotes/${quote._id}/reject`);
      toast.success('Quote rejected');
      fetchQuote();
    } catch (error) {
      console.error('Error rejecting quote:', error);
      toast.error('Failed to reject quote');
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
              onClick={() => navigate('/client/quotes')}
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
            {quote.status === 'accepted' && (
              <button
                onClick={() => navigate(`/client/orders/new?quoteId=${quote._id}`)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Order
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
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Requirements</h3>
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
                            <label className="block text-sm font-medium text-gray-600">Your Budget</label>
                            <p className="text-sm text-gray-900">${quote.customAmount.toLocaleString()}</p>
                          </div>
                          {quote.quotedAmount && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Quoted Amount</label>
                              <p className="text-sm text-gray-900 font-medium text-primary-600">${quote.quotedAmount.toLocaleString()}</p>
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

                    {/* Quote Actions */}
                    {quote.status === 'accepted' && quote.quotedAmount && (
                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-green-900 mb-2">Quote Accepted!</h3>
                            <p className="text-sm text-green-700">
                              Your quote has been accepted. You can now create an order to proceed with the project.
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/client/orders/new?quoteId=${quote._id}`)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Create Order
                          </button>
                        </div>
                      </div>
                    )}

                    {quote.status === 'rejected' && (
                      <div className="bg-red-50 rounded-lg p-6">
                        <div className="flex items-center">
                          <XCircle className="w-6 h-6 text-red-600 mr-3" />
                          <div>
                            <h3 className="text-lg font-medium text-red-900 mb-2">Quote Rejected</h3>
                            <p className="text-sm text-red-700">
                              Unfortunately, we cannot proceed with this quote request at this time.
                            </p>
                          </div>
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
                          quote.communication
                            .filter(message => !message.isInternal) // Only show client-visible messages
                            .map((message) => (
                              <div
                                key={message._id}
                                className={`p-4 rounded-lg ${
                                  message.from._id === state.user?.id
                                    ? 'bg-primary-50 ml-8'
                                    : 'bg-gray-50 mr-8'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {message.from.firstName} {message.from.lastName}
                                    </span>
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
                        <div className="flex items-center justify-end">
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
                  <span className="text-gray-600">Your Budget</span>
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

            {/* Quick Actions */}
            {quote.status === 'accepted' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/client/orders/new?quoteId=${quote._id}`)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Order
                  </button>
                  <button
                    onClick={() => {
                      // Download quote as PDF (placeholder)
                      toast.success('Quote download started');
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default QuoteView;
