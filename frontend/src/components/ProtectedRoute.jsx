import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';

const ProtectedRoute = ({ children }) => {
  useEffect(() => {
    // Optional: Check token validity with backend
    const checkAuthStatus = async () => {
      // You could implement a token verification endpoint
    };
    
    checkAuthStatus();
  }, []);

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;