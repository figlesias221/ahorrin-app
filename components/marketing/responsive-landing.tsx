'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { HeroUltimate } from './hero-ultimate';
import { HeroMobile } from './hero-mobile';

// Lazy load below-the-fold sections
const FounderStory = dynamic(() => import('./founder-story').then(m => ({ default: m.FounderStory })), { loading: () => <div className="py-24" /> });
const FreeToolsShowcase = dynamic(() => import('./free-tools-showcase').then(m => ({ default: m.FreeToolsShowcase })), { loading: () => <div className="py-24" /> });
const BenefitsGrid = dynamic(() => import('./benefits-grid').then(m => ({ default: m.BenefitsGrid })), { loading: () => <div className="py-24" /> });
const IngestionShowcase = dynamic(() => import('./ingestion-showcase').then(m => ({ default: m.IngestionShowcase })), { loading: () => <div className="py-24" /> });
const CategoriesShowcase = dynamic(() => import('./categories-showcase').then(m => ({ default: m.CategoriesShowcase })), { loading: () => <div className="py-24" /> });
const ChartsShowcase = dynamic(() => import('./charts-showcase').then(m => ({ default: m.ChartsShowcase })), { loading: () => <div className="py-24" /> });
const AIAssistantShowcase = dynamic(() => import('./ai-assistant-showcase').then(m => ({ default: m.AIAssistantShowcase })), { loading: () => <div className="py-24" /> });
const StatsShowcase = dynamic(() => import('./stats-showcase').then(m => ({ default: m.StatsShowcase })), { loading: () => <div className="py-24" /> });
const BlogSection = dynamic(() => import('./blog-section').then(m => ({ default: m.BlogSection })), { loading: () => <div className="py-24" /> });
const FAQReal = dynamic(() => import('./faq-real').then(m => ({ default: m.FAQReal })), { loading: () => <div className="py-24" /> });
const FeaturesMobile = dynamic(() => import('./features-mobile').then(m => ({ default: m.FeaturesMobile })), { loading: () => <div className="py-24" /> });
const ShowcaseMobile = dynamic(() => import('./showcase-mobile').then(m => ({ default: m.ShowcaseMobile })), { loading: () => <div className="py-24" /> });

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
        <FreeToolsShowcase />
        <StatsShowcase />
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
      <FreeToolsShowcase />
      <StatsShowcase />
      <BlogSection />
      <FAQReal />
    </>
  );
}
