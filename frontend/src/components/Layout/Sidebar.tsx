import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuth();


  const isActive = (path: string) => location.pathname === path;

  const clientNavigation = [
    {
      name: 'Dashboard',
      href: '/client/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      name: 'Orders',
      href: '/client/orders',
      icon: ShoppingCart,
      description: 'Manage your orders'
    },
    {
      name: 'Quotes',
      href: '/client/quotes',
      icon: FileText,
      description: 'Request custom quotes'
    }
  ];

  const adminNavigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      description: 'Admin overview'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      description: 'Manage all orders'
    },
    {
      name: 'Quotes',
      href: '/admin/quotes',
      icon: FileText,
      description: 'Manage quote requests'
    },
    {
      name: 'Services',
      href: '/admin/services',
      icon: Package,
      description: 'Manage services'
    }
  ];

  const navigation = state.user?.role === 'admin' ? adminNavigation : clientNavigation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '280px' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white/80 backdrop-blur-md shadow-xl border-r border-gray-200/50 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                <motion.img 
                  src="/OnlyLogo-1.png" 
                  alt="Tubex Dubai Logo" 
                  className="w-8 h-8 object-contain"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-deep-800 to-deep-600 bg-clip-text text-transparent">
                    Tubex Dubai
                  </h1>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-primary-500" />
                    <p className="text-xs text-gray-500 capitalize font-medium">{state.user?.role} Portal</p>
                  </div>
                </div>
              </motion.div>
            )}
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-primary-50 transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isCollapsed ? (
                  <motion.div
                    key="expand"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapse"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-b border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {state.user?.firstName} {state.user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {state.user?.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                to={item.href}
                className={`group relative flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-lg'
                    : 'text-deep-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50 hover:text-primary-600 hover:shadow-md'
                }`}
              >
                <motion.div
                  className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </motion.div>
                )}
                {isActive(item.href) && (
                  <motion.div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-l-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <motion.div 
          className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-deep-800 to-deep-600 bg-clip-text text-transparent">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                {navigation.find(item => isActive(item.href))?.description || 'Welcome to your dashboard'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  to="/"
                  className="text-sm text-deep-600 hover:text-primary-600 transition-colors duration-300 font-medium"
                >
                  Back to Website
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.div 
          className="flex-1 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
