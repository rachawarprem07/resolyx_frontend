import React from 'react';
import { Container } from '@/components/ui/Container';
import { HeroBackground } from './HeroBackground';
import { HeroHeaderContent } from './HeroHeaderContent';
import { HeroBrowserMockup } from './HeroBrowserMockup';

/**
 * HeroSection — Master Hero Section replicating the exact design:
 * Centered next-gen AI pill, bold headline, value proposition copy,
 * dual CTAs, and Safari-framed browser mockup with floating metrics.
 */
export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-6 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20">
      {/* 1. Atmospheric Ambient Office Background & Dual Constellation Meshes */}
      <HeroBackground />

      <Container size="xl" className="relative z-10">
        <div className="flex flex-col items-center">
          {/* 2. Top Announcement, Centered Headline, Copy & Action Buttons */}
          <HeroHeaderContent />

          {/* 3. High-Fidelity Safari Browser Mockup with Floating Metric Cards */}
          <div className="mt-8 sm:mt-10 md:mt-12 w-full">
            <HeroBrowserMockup />
          </div>
        </div>
      </Container>
    </section>
  );
};
