import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthStatusCard } from '../components/AuthStatusCard';

export const UnauthorizedPage: React.FC = () => {
  return (
    <AuthLayout maxWidth="md">
      <AuthStatusCard
        status="unauthorized"
        title="Access restricted"
        description="This area is intended for authorized users. Sign in with an account that has the appropriate permissions."
        primaryActionLabel="Return to Sign In"
        primaryActionHref="/login"
        secondaryActionLabel="Return to Home"
        secondaryActionHref="/"
        showPrototypeNotice={true}
      />
    </AuthLayout>
  );
};
