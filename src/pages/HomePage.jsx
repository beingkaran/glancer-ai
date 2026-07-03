import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import IntelligenceFeed from '../components/IntelligenceFeed';
import SearchSection from '../components/SearchSection';
import NewsFaq from '../components/NewsFaq';
import NewsletterInline from '../components/NewsletterInline';

/*
 * HomePage — unified IntelligenceFeed for news and Deep Dives (blogs). The Hero
 * tab switcher and the feed's sticky segmented control share one `segment` state.
 */

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [segment, setSegment] = useState('all');

  // Retire legacy ?tab=blogs URLs from the old Analysis page.
  useEffect(() => {
    if (searchParams.get('tab') === 'blogs') setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSegment = useCallback((seg) => {
    setSegment(seg);
    if (searchParams.get('tab')) setSearchParams({}, { replace: true });
  }, [setSearchParams, searchParams]);

  const handleTabChange = useCallback((tab) => {
    if (tab === 'glossary') return;
    setSegment('all');
    requestAnimationFrame(() => {
      document.getElementById('home-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  return (
    <>
      <Hero activeTab="news" onTabChange={handleTabChange} />
      <IntelligenceFeed segment={segment} onSegment={handleSegment} />
      <div className="container"><NewsletterInline source="home" /></div>
      <div className="section-divider" aria-hidden="true" />
      <SearchSection />
      <NewsFaq />
    </>
  );
}