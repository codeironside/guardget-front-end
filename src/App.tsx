import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import FaqPage from './pages/public/FaqPage';
import PricingPage from './pages/public/PricingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import DeviceCheckerPage from './pages/public/DeviceCheckerPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard Pages
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import MyDevicesPage from './pages/dashboard/MyDevicesPage';
import RegisterDevicePage from './pages/dashboard/RegisterDevicePage';
import ReportDevicePage from './pages/dashboard/ReportDevicePage';
import TransferOwnershipPage from './pages/dashboard/TransferOwnershipPage';
import DeviceStatusPage from './pages/dashboard/DeviceStatusPage';
import SubscriptionsPage from './pages/dashboard/SubscriptionsPage';
import ReceiptsPage from './pages/dashboard/ReceiptsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import PaymentSuccessPage from './pages/dashboard/PaymentSucesspage';
import PaymentErrorPage from './pages/dashboard/PaymentErrorPage';
// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminDevicesPage from './pages/admin/AdminDevicesPage';
import AdminSubscriptionsPage from './pages/admin/AdminSubscriptionsPage';
import AdminReceiptsPage from './pages/admin/AdminReceiptsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminTransfersPage from './pages/admin/AdminTransfersPage';
import AdminReportDevicePage from './pages/admin/AdminReportDevicePage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="device-checker" element={<DeviceCheckerPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHomePage />} />
              <Route path="my-devices" element={<MyDevicesPage />} />
              <Route path="register-device" element={<RegisterDevicePage />} />
              <Route path="report-device" element={<ReportDevicePage />} />
              <Route
                path="transfer-ownership"
                element={<TransferOwnershipPage />}
              />
              <Route path="device-status" element={<DeviceStatusPage />} />
              <Route path="subscriptions" element={<SubscriptionsPage />} />
              <Route path="paymentsuccess" element={<PaymentSuccessPage />} />
              <Route path="paymenterror" element={<PaymentErrorPage />} />
              <Route path="receipts" element={<ReceiptsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="devices" element={<AdminDevicesPage />} />
              <Route path="report-device" element={<AdminReportDevicePage />} />
              <Route path="transfers" element={<AdminTransfersPage />} />
              <Route
                path="subscriptions"
                element={<AdminSubscriptionsPage />}
              />
              <Route path="receipts" element={<AdminReceiptsPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: "#ff4b4b",
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;