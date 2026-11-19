import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy AuthPage redirecting to standard /login
 */
export const AuthPage: React.FC = () => {
  return <Navigate to="/login" replace />;
};
