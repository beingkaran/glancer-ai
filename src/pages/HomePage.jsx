import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import GreetingBanner from '../components/GreetingBanner';
import IntelligenceFeed from '../components/IntelligenceFeed';
import SearchSection from '../components/SearchSection';
import NewsFaq from '../components/NewsFaq';
import NewsletterInline from '../components/NewsletterInline';

/*
 * HomePage — the News and Analysis feeds are now a single IntelligenceFeed.
 * The Hero tab switcher and the feed's own sticky segmented control both drive
 * one `segment` state, so there's no route/tab hop between news and long-form.
 *
 * URL sync: ?tab=blogs (used by "back to analysis" links from articles) maps to
 * the Analysis segment; the plain home URL is the blended "All" feed.
 */

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const wantsBlogs = searchParams.get('tab') === 'blogs';
  const [segment, setSegment] = useState(wantsBlogs ? 'analysis' : 'all');

  // Sync when arriving via back/forward or a direct ?tab=blogs link.
  useEffect(() => {
    if (wantsBlogs) setSegment('analysis');
  }, [wantsBlogs]);

  // Scroll to the feed controls when landing on analysis from an article.
  useEffect(() => {
    if (wantsBlogs) {
      requestAnimationFrame(() => {
        document.getElementById('home-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [wantsBlogs]);

  // Keep the URL honest so browser-back lands on the right segment.
  const handleSegment = useCallback((seg) => {
    setSegment(seg);
    if (seg === 'analysis') setSearchParams({ tab: 'blogs' }, { replace: true });
    else if (searchParams.get('tab')) setSearchParams({}, { replace: true });
  }, [setSearchParams, searchParams]);

  // Hero's News/Analysis tabs feed the same segment state.
  const activeTab = segment === 'analysis' ? 'blogs' : 'news';
  const handleTabChange = useCallback((tab) => {
    handleSegment(tab === 'blogs' ? 'analysis' : 'all');
  }, [handleSegment]);

  return (
    <>
      <Hero activeTab={activeTab} onTabChange={handleTabChange} />
      <GreetingBanner />
      <IntelligenceFeed segment={segment} onSegment={handleSegment} />
      <div className="container"><NewsletterInline source="home" /></div>
      <div className="section-divider" aria-hidden="true" />
      <SearchSection />
      <NewsFaq />
    </>
  );
}
