import dynamic from 'next/dynamic';
import type { BlogPostMetadata } from '@/lib/mdx';
import { HeroUltimate } from './hero-ultimate';
import { HeroMobile } from './hero-mobile';
import { BlogSection } from './blog-section';

// Lazy load below-the-fold sections
const FounderStory = dynamic(() => import('./founder-story').then(m => ({ default: m.FounderStory })), { loading: () => <div className="py-24" /> });
const FreeToolsShowcase = dynamic(() => import('./free-tools-showcase').then(m => ({ default: m.FreeToolsShowcase })), { loading: () => <div className="py-24" /> });
const BenefitsGrid = dynamic(() => import('./benefits-grid').then(m => ({ default: m.BenefitsGrid })), { loading: () => <div className="py-24" /> });
const IngestionShowcase = dynamic(() => import('./ingestion-showcase').then(m => ({ default: m.IngestionShowcase })), { loading: () => <div className="py-24" /> });
const CategoriesShowcase = dynamic(() => import('./categories-showcase').then(m => ({ default: m.CategoriesShowcase })), { loading: () => <div className="py-24" /> });
const ChartsShowcase = dynamic(() => import('./charts-showcase').then(m => ({ default: m.ChartsShowcase })), { loading: () => <div className="py-24" /> });
const AIAssistantShowcase = dynamic(() => import('./ai-assistant-showcase').then(m => ({ default: m.AIAssistantShowcase })), { loading: () => <div className="py-24" /> });
const StatsShowcase = dynamic(() => import('./stats-showcase').then(m => ({ default: m.StatsShowcase })), { loading: () => <div className="py-24" /> });
const FAQReal = dynamic(() => import('./faq-real').then(m => ({ default: m.FAQReal })), { loading: () => <div className="py-24" /> });
const FeaturesMobile = dynamic(() => import('./features-mobile').then(m => ({ default: m.FeaturesMobile })), { loading: () => <div className="py-24" /> });
const ShowcaseMobile = dynamic(() => import('./showcase-mobile').then(m => ({ default: m.ShowcaseMobile })), { loading: () => <div className="py-24" /> });

interface ResponsiveLandingProps {
  latestPosts: BlogPostMetadata[];
}

// Server-rendered: responsive variants are toggled with CSS breakpoints so all
// content is present in the initial HTML (crawlers must see a full page).
export function ResponsiveLanding({ latestPosts }: ResponsiveLandingProps) {
  return (
    <>
      <div className="md:hidden">
        <HeroMobile />
      </div>
      <div className="hidden md:block">
        <HeroUltimate />
      </div>

      <FounderStory />
      <BlogSection posts={latestPosts} />

      <div className="md:hidden">
        <FeaturesMobile />
        <ShowcaseMobile />
      </div>
      <div className="hidden md:block">
        <BenefitsGrid />
        <IngestionShowcase />
        <CategoriesShowcase />
        <ChartsShowcase />
        <AIAssistantShowcase />
      </div>

      <FreeToolsShowcase />
      <StatsShowcase />
      <FAQReal />
    </>
  );
}
