import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Construction, Info } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const PlaceholderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const featureName = searchParams.get('feature') || 'Feature';

  return (
    <div className="py-20 sm:py-32">
      <Container size="sm">
        <div className="resolva-card p-8 sm:p-12 text-center bg-surface">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-6">
            <Construction className="h-7 w-7" />
          </div>

          <Badge variant="warning" size="md" className="mb-4">
            Under Development
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {featureName} is not yet implemented
          </h1>

          <p className="mt-4 text-sm sm:text-base text-foreground-muted leading-relaxed max-w-lg mx-auto">
            This button links to the future {featureName} module. In accordance with the frontend
            architecture guidelines, no fake backend or mocked completion is executed.
          </p>

          <div className="mt-6 rounded-lg bg-surface-subtle p-4 border border-border text-left flex items-start gap-3">
            <Info className="h-5 w-5 text-brand-indigo shrink-0 mt-0.5" />
            <div className="text-xs text-foreground-muted space-y-1">
              <p className="font-semibold text-foreground">Planned Module Architecture:</p>
              <p>
                Authentication, user provisioning, and full ticket dispatch require integration with
                your private backend service and self-hosted model runtime.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              variant="primary"
              size="md"
              href="/"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Overview
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
