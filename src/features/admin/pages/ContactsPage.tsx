import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ContactsPage is deprecated and consolidated into CustomersPage.
 * Redirects directly to /admin/customers.
 */
export const ContactsPage: React.FC = () => {
  return <Navigate to="/admin/customers" replace />;
};
