import { Link } from 'react-router-dom';
import { HOME_EDITORIAL } from '../data/seoGuides';
import { BLOG_POSTS } from '../data/allBlogs';

const FEATURED = BLOG_POSTS.filter((p) => p.featured).slice(0, 6);
const MORE = BLOG_POSTS.filter((p) => !p.featured).slice(0, 6);

export default function HomeEditorial() {
  return (
    <section className="seo-editorial container" aria-labelledby="seo-editorial-title">
      <h2 id="seo-editorial-title" className="seo-editorial-title">{HOME_EDITORIAL.title}</h2>
      {HOME_EDITORIAL.paragraphs.map((p) => (
        <p key={p.slice(0, 48)} className="seo-editorial-p">{p}</p>
      ))}

      <h3 className="seo-editorial-sub">Featured Deep Dives</h3>
      <ul className="seo-editorial-list">
        {FEATURED.map((b) => (
          <li key={b.id}>
            <Link to={`/blog/${b.id}`}>{b.title}</Link>
            {b.subtitle && <span className="seo-editorial-meta"> — {b.subtitle}</span>}
          </li>
        ))}
      </ul>

      <h3 className="seo-editorial-sub">More analysis &amp; comparisons</h3>
      <ul className="seo-editorial-list">
        {MORE.map((b) => (
          <li key={b.id}>
            <Link to={`/blog/${b.id}`}>{b.title}</Link>
          </li>
        ))}
        <li><Link to="/topics">Browse all topic hubs →</Link></li>
        <li><Link to="/glossary">Search the 2,200-term glossary →</Link></li>
      </ul>
    </section>
  );
}