import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  Settings, 
  LogOut, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '280px' }}
        className="bg-white shadow-lg border-r border-gray-200 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <img 
                  src="/OnlyLogo-1.png" 
                  alt="Tubex Dubai Logo" 
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Tubex Dubai</h1>
                  <p className="text-xs text-gray-500 capitalize">{state.user?.role} Portal</p>
                </div>
              </motion.div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
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
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </motion.div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
              <Link
                to="/notifications"
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </Link>
            </motion.div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">
                {navigation.find(item => isActive(item.href))?.description || 'Welcome to your dashboard'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Website
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
