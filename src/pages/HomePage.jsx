import { useState } from 'react';
import Hero from '../components/Hero';
import GreetingBanner from '../components/GreetingBanner';
import NewsTab from '../components/NewsTab';
import BlogsTab from '../components/BlogsTab';
import SearchSection from '../components/SearchSection';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <>
      <Hero activeTab={activeTab} onTabChange={setActiveTab} />
      <GreetingBanner />
      {activeTab === 'news'  && <NewsTab />}
      {activeTab === 'blogs' && <BlogsTab />}
      <div className="section-divider" aria-hidden="true" />
      <SearchSection />
    </>
  );
}
