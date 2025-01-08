import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing_pages/homepage';
import AuthPages from './components/auth/AuthPages';
import PasswordResetPages from './components/auth/PasswordResetPages';
import AdminDashboard from './components/dashboard/admin/admin';
import BeginnerDashboard from "./components/dashboard/beginner/beginner";
import ProfessionalDashboard from "./components/dashboard/professionnal/professionnal";
import InstitutionDashboard  from "./components/dashboard/institut/institut";
import './styles/globals.css';

// Optional: Add protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = false; // Replace with your auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPages />} />
        <Route path="/signup" element={<AuthPages isSignUp={true} />} />
        <Route path="/forgot-password" element={<PasswordResetPages />} />
        <Route path="/reset-password" element={<PasswordResetPages stage="reset" />} />
        <Route path="/verify-reset" element={<PasswordResetPages stage="verify" />} />
        <Route path="/admin_dashboard" element={<AdminDashboard stage="admin" />} />
        <Route path="/beginner_dashboard" element={<BeginnerDashboard stage="beginner" />} />
        <Route path="/professional_dashboard" element={<ProfessionalDashboard stage="professional" />} />
        <Route path="/institut_dashboard" element={<InstitutionDashboard stage="institut" />} />

        {/* Protected routes example */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard Page</div>
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}