import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { LandingPage } from '@/features/marketing/pages/LandingPage';
import { PlaceholderPage } from '@/features/marketing/pages/PlaceholderPage';
import {
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerificationPage,
  UnauthorizedPage,
  AcceptInvitePage,
  CustomerSignupPage,
} from '@/features/auth';
import { CompanySetupPage } from '@/features/setup';
import {
  AdminLayout,
  HomePage,
  TicketsPage,
  AdminKbPage,
  CustomersPage,
  UsersPage,
  TeamsPage,
  AssignmentRulesPage,
  HelpdeskPage,
  AiSettingsPage,
  ReportsPage,
  SlaPoliciesPage,
  ProfilePage,
} from '@/features/admin';
import {
  AgentLayout,
  AgentQueuePage,
  AgentResolutionPage,
  AgentKbPage,
  AgentPerformancePage,
} from '@/features/agent';
import {
  CustomerLayout,
  CustomerTicketsPage,
  CustomerKbPage,
} from '@/features/customer';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MarketingLayout>
        <LandingPage />
      </MarketingLayout>
    ),
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <CustomerSignupPage /> },
  { path: '/register', element: <CustomerSignupPage /> },
  { path: '/customer/signup', element: <Navigate to="/signup" replace /> },
  { path: '/setup', element: <CompanySetupPage /> },
  { path: '/onboarding', element: <Navigate to="/setup" replace /> },
  { path: '/admin/login', element: <Navigate to="/login" replace /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/accept-invite', element: <AcceptInvitePage /> },
  { path: '/setup-password', element: <AcceptInvitePage /> },
  { path: '/auth/verify', element: <VerificationPage /> },
  { path: '/auth/unauthorized', element: <UnauthorizedPage /> },
  { path: '/auth/signin', element: <Navigate to="/login" replace /> },
  {
    path: '/placeholder',
    element: (
      <MarketingLayout>
        <PlaceholderPage />
      </MarketingLayout>
    ),
  },
  {
    path: '/get-started',
    element: (
      <MarketingLayout>
        <PlaceholderPage />
      </MarketingLayout>
    ),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'dashboard', element: <Navigate to="/admin" replace /> },
      { path: 'tickets', element: <TicketsPage /> },
      { path: 'kb', element: <AdminKbPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'contacts', element: <Navigate to="/admin/customers" replace /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'teams', element: <TeamsPage /> },
      { path: 'assignment-rules', element: <AssignmentRulesPage /> },
      { path: 'helpdesk', element: <HelpdeskPage /> },
      { path: 'ai-settings', element: <AiSettingsPage /> },
      { path: 'sla', element: <SlaPoliciesPage /> },
      { path: 'sla-policies', element: <Navigate to="/admin/sla" replace /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <Navigate to="/admin?settings=open" replace /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'organizations', element: <Navigate to="/admin/customers" replace /> },
      { path: 'support', element: <Navigate to="/admin/tickets" replace /> },
    ],
  },
  {
    path: '/agent',
    element: <AgentLayout />,
    children: [
      { index: true, element: <AgentQueuePage /> },
      { path: 'queue', element: <AgentQueuePage /> },
      { path: 'resolve', element: <Navigate to="/agent/resolve/TICK-8042" replace /> },
      { path: 'resolve/:ticketId', element: <AgentResolutionPage /> },
      { path: 'kb', element: <AgentKbPage /> },
      { path: 'performance', element: <AgentPerformancePage /> },
    ],
  },
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <Navigate to="/customer/tickets" replace /> },
      { path: 'tickets', element: <CustomerTicketsPage /> },
      { path: 'kb', element: <CustomerKbPage /> },
      { path: 'chat', element: <Navigate to="/customer/tickets" replace /> },
    ],
  },
  { path: '/portal', element: <Navigate to="/customer" replace /> },
  { path: '/manager', element: <Navigate to="/admin" replace /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
