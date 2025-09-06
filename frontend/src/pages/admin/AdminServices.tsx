import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Search,
  Save,
  X,
  DollarSign,
  Clock,
  Settings
} from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Layout/Sidebar';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  pricing: {
    type: 'fixed' | 'hourly' | 'quote';
    amount: number;
    currency: string;
    billingCycle: string;
  };
  features: Array<{
    name: string;
    description: string;
    included: boolean;
  }>;
  technologies: string[];
  deliveryTime: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  isActive: boolean;
  isFeatured: boolean;
  difficulty: string;
  requirements: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const categories = [
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
];

const difficulties = ['Basic', 'Intermediate', 'Advanced', 'Expert'];
const pricingTypes = ['fixed', 'hourly', 'quote'];
const billingCycles = ['one-time', 'monthly', 'yearly'];

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pricing: {
      type: 'fixed' as 'fixed' | 'hourly' | 'quote',
      amount: 0,
      currency: 'USD',
      billingCycle: 'one-time'
    },
    features: [{ name: '', description: '', included: true }],
    technologies: [''],
    deliveryTime: '',
    difficulty: 'Intermediate',
    requirements: [''],
    tags: [''],
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const filteredFeatures = formData.features.filter(f => f.name.trim());
      const serviceData = {
        ...formData,
        features: filteredFeatures.length > 0 ? filteredFeatures : [{ name: 'Standard Service', description: 'Basic service features', included: true }],
        technologies: formData.technologies.filter(t => t.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        tags: formData.tags.filter(t => t.trim())
      };

      if (editingService) {
        await api.put(`/services/${editingService._id}`, serviceData);
        toast.success('Service updated successfully');
      } else {
        await api.post('/services', serviceData);
        toast.success('Service created successfully');
      }
      
      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      console.error('Error details:', error.response?.data);
      
      // Show specific validation errors if available
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        const message = error.response?.data?.message || 'Failed to save service';
        toast.error(message);
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      pricing: {
        ...service.pricing,
        amount: service.pricing.amount || 0
      },
      features: service.features.length > 0 ? service.features.map(f => ({
        ...f,
        description: f.description || ''
      })) : [{ name: '', description: '', included: true }],
      technologies: service.technologies.length > 0 ? service.technologies : [''],
      deliveryTime: service.deliveryTime,
      difficulty: service.difficulty,
      requirements: service.requirements.length > 0 ? service.requirements : [''],
      tags: service.tags.length > 0 ? service.tags : [''],
      isActive: service.isActive,
      isFeatured: service.isFeatured
    });
    setShowModal(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`/services/${serviceId}`);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const toggleFeatured = async (serviceId: string, currentFeatured: boolean) => {
    try {
      await api.put(`/services/${serviceId}`, { isFeatured: !currentFeatured });
      toast.success(`Service ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      pricing: {
        type: 'fixed',
        amount: 0,
        currency: 'USD',
        billingCycle: 'one-time'
      },
      features: [{ name: '', description: '', included: true }],
      technologies: [''],
      deliveryTime: '',
      difficulty: 'Intermediate',
      requirements: [''],
      tags: [''],
      isActive: true,
      isFeatured: false
    });
  };

  const addArrayField = (field: 'features' | 'technologies' | 'requirements' | 'tags') => {
    if (field === 'features') {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { name: '', description: '', included: true }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }));
    }
  };

  const removeArrayField = (field: 'features' | 'technologies' | 'requirements' | 'tags', index: number) => {
    if (field === 'features') {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const updateArrayField = (field: 'technologies' | 'requirements' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const updateFeature = (index: number, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [key]: value } : feature
      )
    }));
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
              <p className="text-gray-600 mt-2">Manage your IT services catalog</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingService(null);
                setShowModal(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredServices.length} service(s)
              </span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {service.isFeatured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFeatured(service._id, service.isFeatured)}
                      className={`p-1 rounded ${
                        service.isFeatured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      title={service.isFeatured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                      title="Edit service"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {service.description.length > 150 ? service.description.substring(0, 150) + '...' : service.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.deliveryTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-primary-600 font-semibold">
                    {service.pricing.type === 'fixed' ? (
                      `$${service.pricing.amount}`
                    ) : service.pricing.type === 'hourly' ? (
                      `$${service.pricing.amount}/hr`
                    ) : (
                      'Custom Quote'
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    service.difficulty === 'Basic' ? 'bg-green-100 text-green-800' :
                    service.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    service.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {service.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No services found</div>
            <p className="text-gray-500">Try adjusting your search criteria or add a new service.</p>
          </div>
        )}
      </div>

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Enter service title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows={5}
                  placeholder="Detailed description of the service, features, and benefits"
                />
              </div>

              {/* Pricing */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pricing Type *
                    </label>
                    <select
                      required
                      value={formData.pricing.type}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        pricing: { ...prev.pricing, type: e.target.value as any }
                      }))}
                      className="input-field"
                    >
                      {pricingTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.pricing.type !== 'quote' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.pricing.amount}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          pricing: { ...prev.pricing, amount: parseFloat(e.target.value) || 0 }
                        }))}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Cycle
                    </label>
                    <select
                      value={formData.pricing.billingCycle}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        pricing: { ...prev.pricing, billingCycle: e.target.value }
                      }))}
                      className="input-field"
                    >
                      {billingCycles.map(cycle => (
                        <option key={cycle} value={cycle}>
                          {cycle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., 1-2 weeks, 3-5 business days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="input-field"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => updateArrayField('technologies', index, e.target.value)}
                      className="input-field flex-1"
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                    {formData.technologies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('technologies', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('technologies')}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  + Add Technology
                </button>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Features
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-3 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) => updateFeature(index, 'name', e.target.value)}
                        className="input-field"
                        placeholder="Feature name"
                      />
                      <input
                        type="text"
                        value={feature.description || ''}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        className="input-field"
                        placeholder="Feature description"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={feature.included}
                          onChange={(e) => updateFeature(index, 'included', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Included in service</span>
                      </label>
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('features', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('features')}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  + Add Feature
                </button>
              </div>

              {/* Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Service Settings
                </h3>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Active (visible to clients)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Featured service</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Update' : 'Create'} Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default AdminServices;
