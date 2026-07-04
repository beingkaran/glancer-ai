import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import IntelligenceFeed from '../components/IntelligenceFeed';
import SearchSection from '../components/SearchSection';
import NewsletterInline from '../components/NewsletterInline';
import HomeEditorial from '../components/HomeEditorial';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * HomePage — the Deep Dives home. The live RSS news feed was retired; the home
 * stream is now practitioner analysis (blogs) only, followed by the glossary
 * search and editorial sections.
 */

export default function HomePage() {
  const navigate = useNavigate();

  useDocumentMeta({
    title: null, // site default
    description:
      'Practitioner-grade AIOps and observability intelligence — in-depth analysis, vendor comparisons and deep dives for engineers.',
    path: '/',
  });

  const handleTabChange = useCallback((tab) => {
    if (tab === 'glossary') return;
    navigate('/', { state: { keepScroll: true } });
    requestAnimationFrame(() => {
      document.getElementById('intelligence-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [navigate]);

  return (
    <>
      <Hero activeTab="deepdives" onTabChange={handleTabChange} />
      <IntelligenceFeed />
      <div className="container" id="newsletter"><NewsletterInline source="home" /></div>
      <div className="section-divider" aria-hidden="true" />
      <SearchSection />
      <div className="section-divider" aria-hidden="true" />
      <HomeEditorial />
    </>
  );
}
