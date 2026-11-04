/*
 * SignalTicker — the masthead "Signal" strip: a slow, pausable ticker of the
 * LIVE news feed (the newest AI/observability headlines). The signature element
 * of the "AI Intelligence Desk" identity. Pure CSS marquee (see .signal-ticker*).
 *
 * It loads news the same way the feed does — getNews() seeded with STATIC_NEWS so
 * the strip renders instantly, then swaps in the live feed when it resolves (and
 * on the shared 'glancer:news-updated' background-refresh event). Each item links
 * to the in-app reader route (/news/:rid): a plain click navigates there, while
 * modifier/middle clicks keep the <a href> so the real source opens in a new tab.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNews, getCachedNews, STATIC_NEWS } from '../lib/newsFeed';

// Keep the strip lightweight — it lives in the navbar on every front-page paint.
const TICKER_LIMIT = 18;

function SignalItem({ item, onOpen }) {
  return (
    <a
      href={item.url}
      className="signal-ticker-item"
      onClick={onOpen(item)}
      rel="noopener noreferrer"
      aria-label={`${item.source}: ${item.title}`}
    >
      <b>{item.source}</b> {item.title}
    </a>
  );
}

export default function SignalTicker() {
  const navigate = useNavigate();
  // Seed with the static fallback so the marquee renders before the fetch lands.
  const [items, setItems] = useState(STATIC_NEWS);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { items: fresh } = await getNews();
        if (alive && fresh?.length) setItems(fresh);
      } catch {
        /* keep static fallback */
      }
    })();

    const onUpdate = () => {
      const cached = getCachedNews();
      if (alive && cached?.items?.length) setItems(cached.items);
    };
    window.addEventListener('glancer:news-updated', onUpdate);
    return () => {
      alive = false;
      window.removeEventListener('glancer:news-updated', onUpdate);
    };
  }, []);

  const onOpen = (item) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    navigate(`/news/${item.rid}`);
  };

  const headlines = items.slice(0, TICKER_LIMIT);
  // Rendered twice (distinct keys) so the marquee reads continuously as it loops.
  const makeRun = (pass) =>
    headlines.map((item) => <SignalItem key={`${item.rid}-${pass}`} item={item} onOpen={onOpen} />);

  return (
    <div className="signal-ticker" aria-label="Live AI news feed">
      <div className="signal-ticker-inner">
        <div className="signal-ticker-label">
          <span className="signal-ticker-pulse" aria-hidden="true" />
          Signal
        </div>
        <div className="signal-ticker-track">
          <div className="signal-ticker-run">{makeRun('a')}{makeRun('b')}</div>
        </div>
      </div>
    </div>
  );
}
