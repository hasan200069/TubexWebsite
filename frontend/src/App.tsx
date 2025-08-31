import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/client/Dashboard';
import Orders from './pages/client/Orders';
import Payment from './pages/client/Payment';
import Chat from './pages/client/Chat';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminChat from './pages/admin/AdminChat';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:id" element={<ServiceDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Client Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="client">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute requiredRole="client">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders/:orderId/payment"
              element={
                <ProtectedRoute requiredRole="client">
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="chat"
              element={
                <ProtectedRoute requiredRole="client">
                  <Chat />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/chat"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminChat />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;