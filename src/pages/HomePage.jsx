import { useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import IntelligenceFeed from '../components/IntelligenceFeed';
import SearchSection from '../components/SearchSection';
import NewsFaq from '../components/NewsFaq';
import NewsletterInline from '../components/NewsletterInline';
import HomeEditorial from '../components/HomeEditorial';
import { catFromSlug, segmentPath } from '../lib/feedRoutes';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * HomePage — unified IntelligenceFeed for news and Deep Dives (blogs).
 *
 * Multi-page: each feed view is its own URL, so every segment is a real,
 * shareable, indexable page rather than client-side tab state:
 *   /                   → All (news + analysis)
 *   /news               → News only
 *   /news/topic/:slug   → one category (e.g. /news/topic/open-source)
 * The feed's segment chips are plain links between these routes; this page
 * just derives the active segment from the URL.
 */

const FEED_META = {
  all: {
    title: null, // site default
    description:
      'Practitioner-grade AIOps and observability intelligence — live AI news from 100+ sources plus in-depth analysis, in one feed.',
  },
  news: {
    title: "Today's AI News — Live Headlines from 100+ Sources",
    description:
      "Today's AI and observability headlines, refreshed continuously from 100+ curated sources — research, models, industry, AIOps and more.",
  },
};

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { topicSlug } = useParams();
  const { pathname } = useLocation();

  // Segment is derived from the URL — the URL is the single source of truth.
  const topicCat = topicSlug ? catFromSlug(topicSlug) : undefined;
  const segment = topicCat || (pathname.startsWith('/news') ? 'news' : 'all');

  const meta = FEED_META[segment] || {
    title: `${segment} — AI News & Analysis`,
    description: `Latest ${segment} headlines and practitioner analysis, curated from 100+ AI and observability sources.`,
  };
  useDocumentMeta({ title: meta.title, description: meta.description, path: segmentPath(segment) });

  // Retire legacy ?tab=blogs URLs from the old Analysis page.
  useEffect(() => {
    if (searchParams.get('tab') === 'blogs') setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleTabChange = useCallback((tab) => {
    if (tab === 'glossary') return;
    navigate('/', { state: { keepScroll: true } });
    requestAnimationFrame(() => {
      document.getElementById('home-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [navigate]);

  return (
    <>
      <Hero activeTab="news" onTabChange={handleTabChange} />
      <IntelligenceFeed segment={segment} />
      <div className="container" id="newsletter"><NewsletterInline source="home" /></div>
      <div className="section-divider" aria-hidden="true" />
      <SearchSection />
      <NewsFaq />
      <div className="section-divider" aria-hidden="true" />
      <HomeEditorial />
    </>
  );
}
