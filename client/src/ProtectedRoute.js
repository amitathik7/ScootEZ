import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, isAdmin, isEmployee }) => {
  // Define routes that only admins can access
  const adminRoutes = [
    '/admin-dashboard',
    '/create-employee',
    '/create-admin',
    '/admin-profile',
    '/admin/employees',
    '/employee/:id'
  ];

  // Get the current path
  const currentPath = window.location.pathname;

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some(route => new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`).test(currentPath));

  // Admin-only access
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  // General authentication check
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;



