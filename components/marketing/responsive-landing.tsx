'use client';

import { useEffect, useState } from 'react';
import { HeroUltimate } from './hero-ultimate';
import { HeroMobile } from './hero-mobile';
import { IngestionShowcase } from './ingestion-showcase';
import { CategoriesShowcase } from './categories-showcase';
import { ChartsShowcase } from './charts-showcase';
import { AIAssistantShowcase } from './ai-assistant-showcase';
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
        <FeaturesMobile />
        <ShowcaseMobile />
        <FAQReal />
      </>
    );
  }

  // Desktop version
  return (
    <>
      <HeroUltimate />
      <IngestionShowcase />
      <CategoriesShowcase />
      <ChartsShowcase />
      <AIAssistantShowcase />
      <FAQReal />
    </>
  );
}
