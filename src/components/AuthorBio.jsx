import { Link } from 'react-router-dom';
import { PRIMARY_AUTHOR } from '../data/authorMeta';

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

export default function AuthorBio({ post }) {
  const name = post?.author || PRIMARY_AUTHOR.name;
  const isKaran =
    /karan\s*shah/i.test(name) ||
    !post?.author ||
    /admin|glancer/i.test(post?.author || '');

  if (!isKaran) {
    return (
      <aside className="author-bio" aria-label="About the author">
        <p className="author-bio-text">Written by <strong>{name}</strong>.</p>
      </aside>
    );
  }

  const bio = post?.authorBio || PRIMARY_AUTHOR.bio;
  const role = post?.authorRole || PRIMARY_AUTHOR.role;

  return (
    <aside className="author-bio" aria-label="About the author">
      <picture>
        <source srcSet="/karan.webp" type="image/webp" />
        <img
          className="author-bio-photo author-portrait author-portrait-md"
          src="/karan.jpg"
          alt={PRIMARY_AUTHOR.name}
          width={72}
          height={72}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </picture>
      <div className="author-bio-body">
        <p className="author-bio-name">
          <Link to="/about">{PRIMARY_AUTHOR.name}</Link>
        </p>
        <p className="author-bio-role">{role}</p>
        <p className="author-bio-text">{bio}</p>
        <div className="author-bio-links">
          <a href={PRIMARY_AUTHOR.linkedin} target="_blank" rel="noopener noreferrer me">
            <LinkedInIcon /> LinkedIn
          </a>
          <a href={`mailto:${PRIMARY_AUTHOR.email}`}>{PRIMARY_AUTHOR.email}</a>
        </div>
      </div>
    </aside>
  );
}