import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import GreetingBanner from '../components/GreetingBanner';
import NewsTab from '../components/NewsTab';
import BlogsTab from '../components/BlogsTab';
import SearchSection from '../components/SearchSection';
import NewsFaq from '../components/NewsFaq';
import NewsletterInline from '../components/NewsletterInline';

const HOME_TABS = new Set(['news', 'blogs']);

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => (HOME_TABS.has(tabFromUrl) ? tabFromUrl : 'news'));

  // Keep the active tab in sync when arriving via back/forward or a direct link.
  useEffect(() => {
    if (HOME_TABS.has(tabFromUrl)) setActiveTab(tabFromUrl);
    else if (!tabFromUrl) setActiveTab('news');
  }, [tabFromUrl]);

  // Scroll to the tab switcher when landing on the blogs section from a blog post.
  useEffect(() => {
    if (tabFromUrl === 'blogs') {
      requestAnimationFrame(() => {
        document.getElementById('home-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [tabFromUrl]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'blogs') setSearchParams({ tab: 'blogs' }, { replace: true });
    else if (tab === 'news') setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Keep the URL in sync while the blogs tab is showing so browser-back lands correctly.
  useEffect(() => {
    if (activeTab === 'blogs' && tabFromUrl !== 'blogs') {
      setSearchParams({ tab: 'blogs' }, { replace: true });
    } else if (activeTab === 'news' && tabFromUrl === 'blogs') {
      setSearchParams({}, { replace: true });
    }
  }, [activeTab, tabFromUrl, setSearchParams]);

  return (
    <>
      <Hero activeTab={activeTab} onTabChange={handleTabChange} />
      <GreetingBanner />
      {activeTab === 'news'  && <NewsTab />}
      {activeTab === 'blogs' && <BlogsTab />}
      <div className="container"><NewsletterInline source="home" /></div>
      <div className="section-divider" aria-hidden="true" />
      <SearchSection />
      <NewsFaq />
    </>
  );
}
