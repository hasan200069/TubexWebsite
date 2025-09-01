import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Shield,
  Code,
  Cloud,
  Smartphone,
  Lock,
  Users,
  Zap
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<any>;
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    // General Questions
    {
      id: 'what-is-tubex',
      question: 'What is Tubex Dubai and what services do you provide?',
      answer: 'Tubex Dubai is a forward-thinking IT Services and Consulting firm based in Al Garhoud, Dubai. We provide comprehensive IT solutions including cloud services, cybersecurity, digital transformation, custom software development, AI development, app development, and IT consulting. We help businesses of all sizes harness the power of technology for growth, efficiency, and innovation.',
      category: 'general',
      icon: HelpCircle
    },
    {
      id: 'company-size',
      question: 'How big is your company and team?',
      answer: 'Tubex Dubai is a growing company with 2-10 employees, founded in 2023. We maintain a lean, expert team that allows us to provide personalized service while delivering enterprise-level solutions. Our team consists of experienced professionals in various IT domains including software development, cloud architecture, cybersecurity, and AI development.',
      category: 'general',
      icon: Users
    },
    {
      id: 'location-service',
      question: 'Do you only serve clients in Dubai, or do you work globally?',
      answer: 'While we are based in Dubai, we serve clients globally. Our digital-first approach allows us to work with businesses worldwide. We have experience serving clients across 15+ countries and can provide remote support, consultation, and development services regardless of your location.',
      category: 'general',
      icon: Shield
    },

    // IT Services
    {
      id: 'cloud-solutions',
      question: 'What cloud solutions do you offer?',
      answer: 'We provide comprehensive cloud and infrastructure solutions:\n\n**Core Services:**\n• Cloud migration and modernization\n• Cloud architecture design and implementation\n• Multi-cloud strategies and management\n• Cloud security and compliance\n\n**DevOps & Automation:**\n• DevOps implementation and CI/CD pipelines\n• Containerization with Docker and Kubernetes\n• Infrastructure as Code (IaC)\n• Serverless solutions and microservices\n\n**Optimization & Management:**\n• Cloud cost optimization and monitoring\n• Performance tuning and scaling\n• Disaster recovery and backup solutions\n• 24/7 cloud infrastructure monitoring\n\n**Cloud Providers:**\n• Amazon Web Services (AWS)\n• Microsoft Azure\n• Google Cloud Platform (GCP)\n• Hybrid and multi-cloud environments',
      category: 'services',
      icon: Cloud
    },
    {
      id: 'cybersecurity',
      question: 'What cybersecurity services do you provide?',
      answer: 'Our comprehensive cybersecurity services include:\n\n**Security Assessment & Testing:**\n• Security assessments and audits\n• Penetration testing and vulnerability scanning\n• Vulnerability management and remediation\n• Security architecture design and review\n\n**Compliance & Governance:**\n• GDPR compliance consulting\n• ISO 27001 implementation\n• SOC 2 Type II compliance\n• Industry-specific compliance (HIPAA, PCI DSS)\n\n**Incident Response & Training:**\n• Incident response planning and execution\n• Security awareness training programs\n• Phishing simulation and testing\n• Emergency response and forensics\n\n**Ongoing Protection:**\n• 24/7 security monitoring and alerting\n• Threat intelligence and analysis\n• Security policy development\n• Regular security updates and patches\n\nWe help protect your business from evolving cyber threats with proactive security measures.',
      category: 'services',
      icon: Lock
    },
    {
      id: 'software-development',
      question: 'What types of software development do you specialize in?',
      answer: 'We specialize in comprehensive custom software development:\n\n**Web Development:**\n• Responsive web applications\n• Progressive Web Apps (PWA)\n• E-commerce platforms\n• Content Management Systems (CMS)\n\n**Mobile Development:**\n• Native iOS and Android apps\n• Cross-platform mobile solutions\n• Hybrid mobile applications\n• Mobile app optimization and maintenance\n\n**Enterprise Solutions:**\n• Enterprise resource planning (ERP) systems\n• Customer relationship management (CRM)\n• Business process automation\n• Legacy system modernization\n\n**Backend & Integration:**\n• RESTful API development\n• GraphQL API implementation\n• Microservices architecture\n• Database design and optimization\n\n**Methodologies & Technologies:**\n• Agile development methodologies\n• DevOps and CI/CD implementation\n• Modern frameworks and technologies\n• Cloud-native development approaches',
      category: 'services',
      icon: Code
    },
    {
      id: 'ai-development',
      question: 'Do you offer AI and machine learning development?',
      answer: 'Yes, we provide comprehensive AI development services:\n\n**Machine Learning Solutions:**\n• Custom ML model development\n• Predictive analytics and forecasting\n• Recommendation systems\n• Anomaly detection systems\n\n**Natural Language Processing:**\n• Text analysis and sentiment analysis\n• Language translation services\n• Document processing and extraction\n• Conversational AI and chatbots\n\n**Computer Vision:**\n• Image recognition and classification\n• Object detection and tracking\n• Facial recognition systems\n• Medical imaging analysis\n\n**AI Integration & Strategy:**\n• AI integration into existing systems\n• AI strategy consulting and planning\n• Data pipeline development\n• AI model deployment and monitoring\n\n**Business Applications:**\n• Process automation with AI\n• Customer service chatbots\n• Business intelligence and insights\n• Fraud detection and prevention\n\nWe help businesses leverage AI to automate processes and gain valuable insights from their data.',
      category: 'services',
      icon: Zap
    },
    {
      id: 'app-development',
      question: 'What mobile app development services do you offer?',
      answer: 'We provide comprehensive mobile app development services:\n\n**App Development Types:**\n• Native iOS and Android applications\n• Cross-platform mobile solutions\n• Progressive Web Apps (PWA)\n• Hybrid mobile applications\n\n**Design & Development:**\n• UI/UX design and prototyping\n• Custom app development\n• API integration and backend services\n• Database design and implementation\n\n**Deployment & Distribution:**\n• App Store and Google Play deployment\n• Enterprise app distribution\n• Beta testing and quality assurance\n• App store optimization (ASO)\n\n**Maintenance & Support:**\n• App updates and feature enhancements\n• Bug fixes and performance optimization\n• Security updates and compliance\n• Analytics and user behavior tracking\n\n**Key Features:**\n• User-friendly and intuitive interfaces\n• Secure data handling and encryption\n• Scalable architecture for growth\n• Offline functionality and sync\n• Push notifications and real-time updates\n\nWe create mobile apps that are user-friendly, secure, and scalable for your business needs.',
      category: 'services',
      icon: Smartphone
    },

    // Process & Timeline
    {
      id: 'project-process',
      question: 'What is your typical project process?',
      answer: 'Our process typically includes:\n\n**1. Initial Consultation & Requirements Gathering**\n• Understanding your business needs and objectives\n• Technical requirements analysis\n• Project scope definition\n\n**2. Project Planning & Proposal**\n• Detailed project roadmap creation\n• Resource allocation and timeline planning\n• Comprehensive proposal with deliverables\n\n**3. Design & Architecture Phase**\n• System architecture design\n• UI/UX design and prototyping\n• Technical specifications documentation\n\n**4. Development & Testing**\n• Agile development methodology\n• Regular code reviews and quality assurance\n• Comprehensive testing (unit, integration, user acceptance)\n\n**5. Deployment & Launch**\n• Production environment setup\n• Data migration and system deployment\n• Go-live support and monitoring\n\n**6. Training & Documentation**\n• User training sessions\n• Administrator training\n• Comprehensive documentation delivery\n\n**7. Ongoing Support & Maintenance**\n• 24/7 technical support\n• Regular system updates and patches\n• Performance monitoring and optimization\n\nWe follow agile methodologies and provide regular updates throughout the project.',
      category: 'process',
      icon: Clock
    },
    {
      id: 'project-timeline',
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on complexity and scope. Simple websites or apps may take 2-4 weeks, while complex enterprise solutions can take 3-6 months or more. During our initial consultation, we provide a detailed timeline based on your specific requirements. We also offer phased delivery for larger projects.',
      category: 'process',
      icon: Clock
    },
    {
      id: 'communication',
      question: 'How do you communicate during projects?',
      answer: 'We maintain regular communication through multiple channels including email, phone calls, video meetings, and project management tools. We provide weekly progress reports, hold regular check-ins, and are always available for urgent questions. Our team is responsive and keeps you informed throughout the entire project lifecycle.',
      category: 'process',
      icon: MessageCircle
    },

    // Pricing & Payment
    {
      id: 'pricing-model',
      question: 'What is your pricing model?',
      answer: 'We offer flexible pricing models to suit different project needs:\n\n**Pricing Options:**\n• **Fixed-Price Projects** - Ideal for well-defined projects with clear requirements\n• **Hourly Rates** - Perfect for ongoing development and consulting work\n• **Retainer Agreements** - Best for long-term partnerships and maintenance\n• **Hybrid Models** - Combination of fixed and hourly pricing\n\n**Pricing Factors:**\n• Project complexity and scope\n• Timeline and delivery requirements\n• Technology stack and integrations\n• Team size and expertise required\n• Ongoing support and maintenance needs\n\n**Our Approach:**\n• Detailed quotes after requirements analysis\n• Transparent pricing with no hidden costs\n• Value-focused solutions within your budget\n• Flexible payment terms and options\n\nContact us for a customized quote tailored to your specific project needs.',
      category: 'pricing',
      icon: Shield
    },
    {
      id: 'payment-terms',
      question: 'What are your payment terms?',
      answer: 'We offer flexible payment terms to accommodate different project types:\n\n**Project-Based Payments:**\n• **Initial Deposit** - Typically 30-50% of total project cost\n• **Milestone Payments** - Tied to project phases and deliverables\n• **Final Payment** - Upon project completion and acceptance\n\n**Ongoing Services:**\n• **Monthly Billing** - For regular maintenance and support\n• **Quarterly Billing** - For long-term retainer agreements\n• **Annual Contracts** - With discounted rates for commitment\n\n**Payment Methods:**\n• Bank transfers and wire transfers\n• Credit card payments\n• Digital payment platforms\n• Cryptocurrency (for select projects)\n\n**Terms & Conditions:**\n• All payment terms clearly outlined in project agreements\n• Net 30 payment terms for established clients\n• Early payment discounts available\n• Flexible payment schedules for large projects\n\nWe work with you to establish payment terms that work for your business.',
      category: 'pricing',
      icon: Shield
    },
    {
      id: 'cost-estimate',
      question: 'Can you provide a cost estimate before starting?',
      answer: 'Yes, we provide comprehensive cost estimates to help you make informed decisions:\n\n**Estimate Process:**\n• **Initial Consultation** - Free discovery session to understand your needs\n• **Requirements Analysis** - Detailed technical and business requirements review\n• **Scope Definition** - Clear project boundaries and deliverables\n• **Cost Breakdown** - Transparent pricing for each project component\n\n**What\'s Included in Estimates:**\n• **Development Costs** - Coding, testing, and quality assurance\n• **Design & UX** - User interface and experience design\n• **Infrastructure** - Hosting, cloud services, and deployment\n• **Testing & QA** - Comprehensive testing and quality assurance\n• **Documentation** - Technical documentation and user guides\n• **Initial Support** - Post-launch support and training\n\n**Estimate Options:**\n• **Basic Package** - Core functionality and essential features\n• **Standard Package** - Enhanced features and integrations\n• **Premium Package** - Full-featured solution with advanced capabilities\n• **Custom Solutions** - Tailored packages for specific requirements\n\nWe provide multiple options with different feature sets and timelines to help you choose the best fit for your budget and needs.',
      category: 'pricing',
      icon: Shield
    },

    // Support & Maintenance
    {
      id: 'post-launch-support',
      question: 'Do you provide support after project completion?',
      answer: 'Yes, we offer comprehensive post-launch support to ensure your systems remain optimal:\n\n**Support Services:**\n• **Bug Fixes** - Quick resolution of any issues or bugs\n• **Security Updates** - Regular security patches and vulnerability fixes\n• **Performance Monitoring** - Continuous system performance tracking\n• **Feature Enhancements** - Adding new features and improvements\n• **System Updates** - Keeping your software current and compatible\n\n**Support Packages:**\n• **Basic Maintenance** - Essential updates and bug fixes\n• **Standard Support** - Regular monitoring and priority support\n• **Premium Support** - 24/7 monitoring and rapid response\n• **Enterprise Support** - Dedicated support team and SLA guarantees\n\n**What We Monitor:**\n• System uptime and availability\n• Performance metrics and optimization\n• Security threats and vulnerabilities\n• User experience and functionality\n• Backup and disaster recovery\n\nOur support ensures your systems remain secure, updated, and performing optimally long after project completion.',
      category: 'support',
      icon: Shield
    },
    {
      id: 'response-time',
      question: 'What is your response time for support requests?',
      answer: 'We provide different response times based on issue priority and support package:\n\n**Response Time SLAs:**\n• **Critical Issues** - 1-2 hours (system down, security breach)\n• **High Priority** - 4-8 hours (major functionality issues)\n• **Medium Priority** - 24 hours (minor bugs, feature requests)\n• **Low Priority** - 48-72 hours (general inquiries, documentation)\n\n**Support Package Levels:**\n• **Basic Support** - 24-48 hour response time\n• **Standard Support** - 8-24 hour response time\n• **Premium Support** - 2-8 hour response time\n• **Enterprise Support** - 1-4 hour response time with dedicated team\n\n**Emergency Support:**\n• **24/7 Emergency Line** - For critical business system issues\n• **Dedicated Hotline** - Direct access to senior technical team\n• **Escalation Process** - Automatic escalation for unresolved issues\n• **On-site Support** - Available for critical enterprise clients\n\n**Business Hours:**\n• **Monday-Friday** - 9:00 AM - 6:00 PM (GST)\n• **Saturday** - 10:00 AM - 2:00 PM (GST)\n• **Sunday** - Emergency support only\n\nWe also offer emergency support for critical business systems with faster response times.',
      category: 'support',
      icon: Clock
    },
    {
      id: 'training',
      question: 'Do you provide training for the systems you build?',
      answer: 'Yes, we provide comprehensive training programs for all systems we develop:\n\n**Training Types:**\n• **User Training** - End-user training for daily operations\n• **Administrator Training** - System administration and management\n• **Technical Training** - Advanced technical skills and troubleshooting\n• **Train-the-Trainer** - Training your internal team to train others\n\n**Training Content:**\n• **System Overview** - Understanding the complete system architecture\n• **Feature Walkthrough** - Detailed explanation of all features\n• **Best Practices** - Optimal ways to use the system\n• **Troubleshooting** - Common issues and resolution methods\n• **Security Guidelines** - Best practices for system security\n\n**Training Delivery:**\n• **On-site Training** - At your office location\n• **Remote Training** - Online sessions via video conferencing\n• **Hybrid Approach** - Combination of on-site and remote sessions\n• **Self-paced Learning** - Online modules and documentation\n\n**Training Materials:**\n• **User Manuals** - Comprehensive step-by-step guides\n• **Video Tutorials** - Recorded training sessions\n• **Quick Reference Cards** - Essential information at a glance\n• **Interactive Demos** - Hands-on practice sessions\n\n**Ongoing Support:**\n• **Follow-up Sessions** - Additional training as needed\n• **Q&A Sessions** - Regular question and answer periods\n• **Updates Training** - Training for new features and updates\n• **Refresher Courses** - Periodic training to maintain skills\n\nWe ensure your team is comfortable using the new systems and can maintain them effectively.',
      category: 'support',
      icon: Users
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'services', name: 'Services', icon: Code },
    { id: 'process', name: 'Process', icon: Clock },
    { id: 'pricing', name: 'Pricing', icon: Shield },
    { id: 'support', name: 'Support', icon: Users }
  ];

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Frequently Asked <span className="text-accent-400">Questions</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Find answers to common questions about our IT services, processes, and solutions. 
              Can't find what you're looking for? Contact us directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or category filter.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact Us Instead
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <faq.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    {openItems.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {openItems.includes(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="pl-14">
                            <div className="text-gray-600 leading-relaxed">
                              {faq.answer.split('\n').map((line, index) => {
                                if (line.startsWith('**') && line.endsWith('**')) {
                                  // Bold headings
                                  return (
                                    <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2 first:mt-0">
                                      {line.replace(/\*\*/g, '')}
                                    </h4>
                                  );
                                } else if (line.startsWith('•')) {
                                  // Bullet points
                                  return (
                                    <div key={index} className="flex items-start mb-1">
                                      <span className="text-primary-600 mr-2 mt-1">•</span>
                                      <span className="flex-1">
                                        {line.replace(/^•\s*/, '').split('**').map((part, partIndex) => 
                                          partIndex % 2 === 1 ? (
                                            <strong key={partIndex} className="font-semibold text-gray-900">{part}</strong>
                                          ) : part
                                        )}
                                      </span>
                                    </div>
                                  );
                                } else if (line.trim() === '') {
                                  // Empty lines for spacing
                                  return <div key={index} className="h-2"></div>;
                                } else {
                                  // Regular text
                                  return (
                                    <p key={index} className="mb-2">
                                      {line.split('**').map((part, partIndex) => 
                                        partIndex % 2 === 1 ? (
                                          <strong key={partIndex} className="font-semibold text-gray-900">{part}</strong>
                                        ) : part
                                      )}
                                    </p>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Our team of experts is here to help. Contact us directly for personalized 
              answers to your specific questions about our IT services and solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-600 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact Us
              </a>
              <a
                href="tel:+971-4-3976100"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold rounded-lg transition-all duration-200"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call +971-4-3976100
              </a>
              <a
                href="mailto:info@tubexdubai.com"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold rounded-lg transition-all duration-200"
              >
                <Mail className="mr-2 w-5 h-5" />
                Send Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
