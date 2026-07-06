import { useParams, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import FrontPage, { FRONT_DESK_COUNT } from '../components/FrontPage';
import IntelligenceFeed from '../components/IntelligenceFeed';
import SearchSection from '../components/SearchSection';
import NewsletterInline from '../components/NewsletterInline';
import HomeEditorial from '../components/HomeEditorial';
import { catFromSlug, segmentPath } from '../lib/feedRoutes';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * HomePage — compact masthead, then the front page (Deep Dives + The Wire
 * side by side, both above the fold), then the full IntelligenceFeed.
 *
 * Multi-page: each feed view is its own URL, so every segment is a real,
 * shareable, indexable page rather than client-side tab state:
 *   /                   → All (front page + Deep Dives + news)
 *   /news               → News only
 *   /news/topic/:slug   → one category (e.g. /news/topic/open-source)
 * The feed's segment chips are plain links between these routes; this page
 * just derives the active segment from the URL. The front page only renders
 * on "All" — segment views go straight to the filtered feed.
 */

const FEED_META = {
  all: {
    title: null, // site default
    description:
      'Practitioner-grade AIOps and observability intelligence — in-depth deep dives and analysis plus live AI news from 100+ sources, in one feed.',
  },
  news: {
    title: "Today's AI News — Live Headlines from 100+ Sources",
    description:
      "Today's AI and observability headlines, refreshed continuously from 100+ curated sources — research, models, industry, AIOps and more.",
  },
};

export default function HomePage() {
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

  return (
    <>
      <Hero />
      {segment === 'all' && <FrontPage />}
      <IntelligenceFeed segment={segment} skipAnalysis={segment === 'all' ? FRONT_DESK_COUNT : 0} />
      <div className="container" id="newsletter"><NewsletterInline source="home" /></div>
      <div className="section-divider" aria-hidden="true" />
      <SearchSection />
      <div className="section-divider" aria-hidden="true" />
      <HomeEditorial />
    </>
  );
}
