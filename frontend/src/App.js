import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './components/NotificationManager';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/Profile';
import BrowsePrograms from './pages/student/BrowsePrograms';
import ProgramDetail from './pages/student/ProgramDetail';
import MyApplications from './pages/student/MyApplications';
import PaymentHistory from './pages/student/PaymentHistory';
import StudentNotifications from './pages/student/Notifications';

import UniversityDashboard from './pages/university/UniversityDashboard';
import UniversityProfile from './pages/university/Profile';
import ManagePrograms from './pages/university/ManagePrograms';
import ViewApplications from './pages/university/ViewApplications';

import AdminDashboard from './pages/admin/AdminDashboard';
import StudentVerification from './pages/admin/StudentVerification';
import UniversityVerification from './pages/admin/UniversityVerification';
import UserManagement from './pages/admin/UserManagement';
import AllApplications from './pages/admin/AllApplications';
import PaymentTracking from './pages/admin/PaymentTracking';
import Analytics from './pages/admin/Analytics';
import AdminLogs from './pages/admin/AdminLogs';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/student/dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/profile" element={<PrivateRoute allowedRoles={['student']}><StudentProfile /></PrivateRoute>} />
          <Route path="/student/programs" element={<PrivateRoute allowedRoles={['student']}><BrowsePrograms /></PrivateRoute>} />
          <Route path="/student/programs/:id" element={<PrivateRoute allowedRoles={['student']}><ProgramDetail /></PrivateRoute>} />
          <Route path="/student/applications" element={<PrivateRoute allowedRoles={['student']}><MyApplications /></PrivateRoute>} />
          <Route path="/student/payments" element={<PrivateRoute allowedRoles={['student']}><PaymentHistory /></PrivateRoute>} />
          <Route path="/student/notifications" element={<PrivateRoute allowedRoles={['student']}><StudentNotifications /></PrivateRoute>} />

          <Route path="/university/dashboard" element={<PrivateRoute allowedRoles={['university']}><UniversityDashboard /></PrivateRoute>} />
          <Route path="/university/profile" element={<PrivateRoute allowedRoles={['university']}><UniversityProfile /></PrivateRoute>} />
          <Route path="/university/programs" element={<PrivateRoute allowedRoles={['university']}><ManagePrograms /></PrivateRoute>} />
          <Route path="/university/applications" element={<PrivateRoute allowedRoles={['university']}><ViewApplications /></PrivateRoute>} />

          <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/students" element={<PrivateRoute allowedRoles={['admin']}><StudentVerification /></PrivateRoute>} />
          <Route path="/admin/universities" element={<PrivateRoute allowedRoles={['admin']}><UniversityVerification /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><UserManagement /></PrivateRoute>} />
          <Route path="/admin/applications" element={<PrivateRoute allowedRoles={['admin']}><AllApplications /></PrivateRoute>} />
          <Route path="/admin/payments" element={<PrivateRoute allowedRoles={['admin']}><PaymentTracking /></PrivateRoute>} />
          <Route path="/admin/analytics" element={<PrivateRoute allowedRoles={['admin']}><Analytics /></PrivateRoute>} />
          <Route path="/admin/logs" element={<PrivateRoute allowedRoles={['admin']}><AdminLogs /></PrivateRoute>} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
