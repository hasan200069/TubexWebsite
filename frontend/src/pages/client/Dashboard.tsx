import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { state } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {state.user?.firstName}!
          </h1>
          <p className="text-gray-600">Manage your orders, quotes, and account settings.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600">Client dashboard content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
