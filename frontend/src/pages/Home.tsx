import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap,
  Shield,
  Globe,
  Code,
  Smartphone,
  Cloud,
  Lock
} from 'lucide-react';
import api from '../config/api';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  pricing: {
    type: string;
    amount?: number;
    currency: string;
  };
  images: Array<{ url: string; alt: string; isPrimary: boolean }>;
  rating: {
    average: number;
    count: number;
  };
}

const Home: React.FC = () => {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const response = await api.get('/services/featured');
        setFeaturedServices(response.data.services);
      } catch (error) {
        console.error('Error fetching featured services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  const features = [
    {
      icon: Code,
      title: 'Custom Development',
      description: 'Tailored solutions built specifically for your business needs.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Industry-leading security measures to protect your data.',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Quick turnaround times without compromising quality.',
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Round-the-clock technical support and maintenance.',
    },
  ];

  const categories = [
    { icon: Globe, name: 'Web Development', count: '50+ Services' },
    { icon: Smartphone, name: 'Mobile Apps', count: '30+ Services' },
    { icon: Cloud, name: 'Cloud Services', count: '25+ Services' },
    { icon: Lock, name: 'Cybersecurity', count: '20+ Services' },
  ];

  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '200+', label: 'Happy Clients' },
    { number: '24/7', label: 'Support Available' },
    { number: '99.9%', label: 'Uptime Guarantee' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-950/80 to-deep-800/80"></div>
                 <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-20 left-10 w-72 h-72 bg-deep-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
           <div className="absolute top-40 right-20 w-96 h-96 bg-deep-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
           <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-deep-400/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
         </div>
        
        <div className="relative max-w-7xl mx-auto container-padding py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <img 
                    src="/OnlyLogo-1.png" 
                    alt="Tubex Dubai Logo" 
                    className="w-16 h-16 object-contain drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-deep-500/20 rounded-full blur-xl"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Tubex Dubai</h2>
                  <p className="text-deep-200 text-sm">Technology Solutions</p>
                </div>
              </div>
              
                             <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8 text-shadow-lg">
                 Transform Your 
                 <span className="block text-gradient-deep bg-gradient-to-r from-deep-300 to-deep-100">Business</span>
                 <span className="block text-white">with Premium IT</span>
               </h1>
              
              <p className="text-xl text-primary-100 mb-10 leading-relaxed max-w-2xl">
                From cutting-edge web development to enterprise cybersecurity, we deliver 
                innovative IT solutions that drive digital transformation across the UAE.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                                 <Link
                   to="/services"
                   className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group"
                 >
                   Explore Services
                   <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
                <Link
                  to="/contact"
                  className="glass text-white text-lg px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/30"
                >
                  Get Free Quote
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="glass rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    >
                                                                                           <div className="text-4xl font-black text-deep-300 mb-3 drop-shadow-lg">
                         {stat.number}
                       </div>
                      <div className="text-deep-200 text-sm font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Why Choose <span className="text-gradient">Tubex Dubai?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine cutting-edge technology with proven expertise to deliver 
              exceptional results that drive your business forward.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-hover p-8 group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive IT solutions across multiple domains to meet all your 
              technology needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/services?category=${encodeURIComponent(category.name)}`}
                  className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-200"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.count}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {!isLoading && featuredServices.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our most popular and highly-rated services that deliver exceptional value.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.slice(0, 6).map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {service.category}
                      </span>
                      {service.rating.count > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {service.rating.average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description.length > 120 ? service.description.substring(0, 120) + '...' : service.description}
                    </p>
                    
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
                      <Link
                        to={`/services/${service._id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/services"
                className="btn-primary"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding gradient-sophisticated text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-950/50 to-deep-800/50"></div>
                 <div className="absolute top-0 right-0 w-96 h-96 bg-deep-500/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-deep-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
                         <h2 className="text-4xl lg:text-6xl font-black mb-8 text-shadow-lg">
               Ready to Transform Your <span className="text-deep-300">Business?</span>
             </h2>
            <p className="text-xl text-deep-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join hundreds of satisfied clients across the UAE who have revolutionized their 
              operations with our expert IT services and cutting-edge solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                             <Link
                 to="/register"
                 className="btn-primary text-lg px-10 py-5 inline-flex items-center justify-center group"
               >
                 Get Started Today
                 <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
               </Link>
              <Link
                to="/contact"
                className="glass text-white text-lg px-10 py-5 rounded-xl font-semibold inline-flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
