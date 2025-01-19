import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing_pages/homepage';
import AuthPages from './components/auth/AuthPages';
import PasswordResetPages from './components/auth/PasswordResetPages';
import AdminLayout from './components/dashboard/admin/admin_layout';
import AdminDashboard from './components/dashboard/admin/admin';
import BeginnerDashboard from "./components/dashboard/beginner/beginner";
import ProfessionalDashboard from "./components/dashboard/professionnal/professionnal";
import InstitutionDashboard from "./components/dashboard/institut/institut";
import ContactPage from "./components/landing_pages/contact_us";
import AboutUs from "./components/landing_pages/abous_us";
import UserListPage from './components/dashboard/admin/user-management/UserListPage';
import UserFormPage from './components/dashboard/admin/user-management/UserFormPage';

import LearningPathPage from './components/dashboard/beginner/learning/learning_path';
import FindMentors from './components/dashboard/beginner/find_mentor/mentors';
import SessionsPage from './components/dashboard/beginner/session/new';
import InstantMessages from './components/dashboard/beginner/messages/amateur_chat';






import './styles/globals.css';

// Optional: Add protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = false; // Replace with your auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Wrapper component to ensure AdminDashboard is rendered within AdminLayout
const AdminDashboardWithLayout = () => {
  return (
    <AdminLayout>
      <AdminDashboard stage="admin" />
    </AdminLayout>
  );
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
        
        {/* Admin routes */}
        <Route path="/admin_dashboard" element={<AdminDashboardWithLayout />} />
        
        {/* Nested admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
\
        <Route path="/admin/users" element={<UserListPage />} />
        <Route path="/admin/users/:id" element={<UserFormPage />} />
        </Route>
        
        {/* amateur pannel */}
        <Route path="/beginner_dashboard" element={<BeginnerDashboard stage="beginner" />} />

        <Route path="/learning" element={<LearningPathPage />} />
        <Route path="/mentors" element={<FindMentors />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/chat" element={<InstantMessages />} />






        {/* Other dashboard routes */}

        <Route path="/professional_dashboard" element={<ProfessionalDashboard stage="professional" />} />
        <Route path="/institut_dashboard" element={<InstitutionDashboard stage="institut" />} />
        
        {/* Other routes */}
        <Route path="/Contact_us" element={<ContactPage />} />
        <Route path="/about_us" element={<AboutUs />} />
        
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