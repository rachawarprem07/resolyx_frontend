import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { TrustSection } from '../components/TrustSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PrivacySection } from '../components/PrivacySection';
import { UseCasesSection } from '../components/UseCasesSection';
import { FAQSection } from '../components/FAQSection';
import { FinalCTASection } from '../components/FinalCTASection';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero with Interactive Preview */}
      <HeroSection />

      {/* 2. Value Proposition (Trust / Pillars) */}
      <TrustSection />

      {/* 3. Product Features Grid */}
      <FeaturesSection />

      {/* 4. How It Works (Capture -> Understand -> Resolve) */}
      <HowItWorksSection />

      {/* 5. Privacy & Private AI Differentiator */}
      <PrivacySection />

      {/* 6. Two Helpdesk Use Cases (IT & Customer) */}
      <UseCasesSection />

      {/* 7. FAQ Accordion */}
      <FAQSection />

      {/* 8. Final Call to Action */}
      <FinalCTASection />
    </div>
  );
};
