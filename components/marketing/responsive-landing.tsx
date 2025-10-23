'use client';

import { useEffect, useState } from 'react';
import { HeroUltimate } from './hero-ultimate';
import { HeroMobile } from './hero-mobile';
import { FounderStory } from './founder-story';
import { FreeToolCTA } from './free-tool-cta';
import { BenefitsGrid } from './benefits-grid';
import { IngestionShowcase } from './ingestion-showcase';
import { CategoriesShowcase } from './categories-showcase';
import { ChartsShowcase } from './charts-showcase';
import { AIAssistantShowcase } from './ai-assistant-showcase';
import { StatsShowcase } from './stats-showcase';
import { Testimonials } from './testimonials';
import { BlogSection } from './blog-section';
import { FAQReal } from './faq-real';
import { FeaturesMobile } from './features-mobile';
import { ShowcaseMobile } from './showcase-mobile';

export function ResponsiveLanding() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if mobile on initial load
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // Mobile version
  if (isMobile) {
    return (
      <>
        <HeroMobile />
        <FounderStory />
        <FeaturesMobile />
        <ShowcaseMobile />
        <FreeToolCTA />
        <StatsShowcase />
        <Testimonials />
        <BlogSection />
        <FAQReal />
      </>
    );
  }

  // Desktop version
  return (
    <>
      <HeroUltimate />
      <FounderStory />
      <BenefitsGrid />
      <IngestionShowcase />
      <CategoriesShowcase />
      <ChartsShowcase />
      <AIAssistantShowcase />
      <FreeToolCTA />
      <StatsShowcase />
      <Testimonials />
      <BlogSection />
      <FAQReal />
    </>
  );
}
