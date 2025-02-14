import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import JobApplicant from './components/dashboard/beginner/job_find/job_applicant';
import FindEvents from './components/dashboard/beginner/event_find/find_events';
import FindMentors from './components/dashboard/beginner/find_mentor/mentors';
import SessionsPage from './components/dashboard/beginner/session/new';
import InstantMessages from './components/dashboard/beginner/messages/amateur_chat';
import AchievementsPage from './components/dashboard/beginner/achievement/gold';
import ProfilePage from './components/dashboard/beginner/profile/profile_new';


import CompleteProfile from './components/dashboard/professionnal/profile/proffesional_profile';
import RatingPage from './components/dashboard/beginner/rate/rate_user';
import SettingPage from './components/dashboard/professionnal/setting/professional_setting';
import OnlineClasses from './components/dashboard/professionnal/classe/online_classe';
import Classe from './components/dashboard/professionnal/classe/classe';





import JobOffers from './components/dashboard/institut/job/job_offers';
import Events from './components/dashboard/institut/events/events';
import TalentPool from './components/dashboard/institut/Talent Pool/talents';
import InstitutePage from './components/dashboard/institut/setting/setting_institute';
import Rapports from './components/dashboard/institut/Reports/Rapports';
import Recruitment from './components/dashboard/institut/Recruitment/Recruitment';
import Mentorship from './components/dashboard/institut/Mentorship/Mentorship';






import BeginnerLayout from './components/dashboard/beginner/biginner_layout';
import './styles/globals.css';

// Optional: Add protected route wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Ensure boolean
  const userRole = localStorage.getItem('userRole');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    } else if (requiredRole && userRole !== requiredRole) {
      navigate('/'); // Redirect to home if user role doesn't match
    }
  }, [isAuthenticated, userRole, navigate, requiredRole]);

  // Render children only if authenticated and role matches
  return isAuthenticated && (!requiredRole || userRole === requiredRole) ? children : null;
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
        <Route
          path="/admin_dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardWithLayout />
            </ProtectedRoute>
          }
        />
        
        {/* Nested admin routes */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserFormPage />
              </ProtectedRoute>
            }
          />
        </Route>
        
        {/* Beginner routes */}
        <Route
          path="/beginner_dashboard"
          element={
            <ProtectedRoute requiredRole="amateur">
              <BeginnerDashboard stage="beginner" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning"
          element={
            <ProtectedRoute requiredRole="amateur">
              <LearningPathPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentors"
          element={
            <ProtectedRoute requiredRole="amateur">
              <FindMentors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute requiredRole="amateur">
              <SessionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute requiredRole="amateur">
              <InstantMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute requiredRole="amateur">
              <AchievementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="amateur">
              <ProfilePage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/rate"
          element={
            <ProtectedRoute requiredRole="amateur">
              <RatingPage />
            </ProtectedRoute>
          }
        />
          <Route
          path="/job_applicant"
          element={
            <ProtectedRoute requiredRole="amateur">
              <JobApplicant />
            </ProtectedRoute>
          }
        />
           <Route
          path="/find_events"
          element={
            <ProtectedRoute requiredRole="amateur">
              <FindEvents />
            </ProtectedRoute>
          }
        />

        {/* Professional routes */}
        <Route
          path="/professional_dashboard"
          element={
            <ProtectedRoute requiredRole="professional">
              <ProfessionalDashboard stage="professional" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete"
          element={
            <ProtectedRoute requiredRole="professional">
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route
                  path="/setting"
                  element={
                    <ProtectedRoute requiredRole="professional">
                      <SettingPage />
                    </ProtectedRoute>
                  }
                />

        <Route
          path="/online_classe"
          element={
            <ProtectedRoute requiredRole="professional">
              <OnlineClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classe"
          element={
            <ProtectedRoute requiredRole="professional">
              <Classe />
            </ProtectedRoute>
          }
        />


        {/* Institution routes */}
        <Route
          path="/institut_dashboard"
          element={
            <ProtectedRoute requiredRole="institution">
              <InstitutionDashboard stage="institut" />
            </ProtectedRoute>
          }
        />
          <Route
          path="/job"
          element={
            <ProtectedRoute requiredRole="institution">
              <JobOffers />
            </ProtectedRoute>
          }
        />
           <Route
          path="/event"
          element={
            <ProtectedRoute requiredRole="institution">
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/talent"
          element={
            <ProtectedRoute requiredRole="institution">
              <TalentPool />
            </ProtectedRoute>
          }
        />
         <Route
          path="/setting_institute"
          element={
            <ProtectedRoute requiredRole="institution">
              <InstitutePage />
            </ProtectedRoute>
          }
        />
          <Route
          path="/rapport"
          element={
            <ProtectedRoute requiredRole="institution">
              <Rapports />
            </ProtectedRoute>
          }
        />
           <Route
          path="/Recruitment"
          element={
            <ProtectedRoute requiredRole="institution">
              <Recruitment />
            </ProtectedRoute>
          }
        />
           <Route
          path="/Mentorship"
          element={
            <ProtectedRoute requiredRole="institution">
              <Mentorship />
            </ProtectedRoute>
          }
        />
        
        {/* Other routes */}
        <Route path="/Contact_us" element={<ContactPage />} />
        <Route path="/about_us" element={<AboutUs />} />
        
        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}