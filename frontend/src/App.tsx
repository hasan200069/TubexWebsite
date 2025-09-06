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
import OrderView from './pages/client/OrderView';
import Payment from './pages/client/Payment';
import Quotes from './pages/client/Quotes';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import ManageOrders from './pages/admin/ManageOrders';
import AdminOrderView from './pages/admin/AdminOrderView';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminQuoteView from './pages/admin/AdminQuoteView';
import QuoteView from './pages/client/QuoteView';
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
              path="client/dashboard"
              element={
                <ProtectedRoute requiredRole="client">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="client/orders"
              element={
                <ProtectedRoute requiredRole="client">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="client/orders/:orderId"
              element={
                <ProtectedRoute requiredRole="client">
                  <OrderView />
                </ProtectedRoute>
              }
            />
            <Route
              path="client/orders/:orderId/payment"
              element={
                <ProtectedRoute requiredRole="client">
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="client/quotes"
              element={
                <ProtectedRoute requiredRole="client">
                  <Quotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="client/quotes/:quoteId"
              element={
                <ProtectedRoute requiredRole="client">
                  <QuoteView />
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
              path="admin/orders"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/orders/:orderId"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOrderView />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/quotes"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminQuotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/quotes/:quoteId"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminQuoteView />
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