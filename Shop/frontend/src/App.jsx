import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Customer Pages
import Home from './pages/customer/Home';
import Register from './pages/customer/Register';
import DailyFoods from './pages/customer/DailyFoods';
import Cart from './pages/customer/Cart';
import PlaceOrder from './pages/customer/PlaceOrder';
import OrderHistory from './pages/customer/OrderHistory';
import Profile from './pages/customer/Profile';

// Unified Login
import UnifiedLogin from './pages/UnifiedLogin';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MasterFoods from './pages/admin/MasterFoods';
import ManageFoods from './pages/admin/ManageFoods';
import AddDailyFood from './pages/admin/AddDailyFood';
import OrdersList from './pages/admin/OrdersList';
import AddOrderManual from './pages/admin/AddOrderManual';
import Customers from './pages/admin/Customers';
import ManageAdmins from './pages/admin/ManageAdmins';
import ManageLocations from './pages/admin/ManageLocations';
import ManageNotices from './pages/admin/ManageNotices';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<UnifiedLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/daily-foods" element={<DailyFoods />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/place-order"
                  element={
                    <PrivateRoute>
                      <PlaceOrder />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/order-history"
                  element={
                    <PrivateRoute>
                      <OrderHistory />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/master-foods"
                  element={
                    <AdminRoute>
                      <MasterFoods />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/foods"
                  element={
                    <AdminRoute>
                      <ManageFoods />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/foods/add"
                  element={
                    <AdminRoute>
                      <AddDailyFood />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <OrdersList />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders/add"
                  element={
                    <AdminRoute>
                      <AddOrderManual />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/customers"
                  element={
                    <AdminRoute>
                      <Customers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/admins"
                  element={
                    <AdminRoute>
                      <ManageAdmins />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/locations"
                  element={
                    <AdminRoute>
                      <ManageLocations />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/notices"
                  element={
                    <AdminRoute>
                      <ManageNotices />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
