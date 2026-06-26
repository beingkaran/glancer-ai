/*
 * BlogBanner — single source of truth for how a blog cover is rendered.
 *
 * Priority:  bannerImage (uploaded / illustrated cover)  >  logo (vendor brand)  >  emoji on gradient.
 * Used by blog cards, the featured hero, search suggestions, and the article page,
 * so banners stay consistent everywhere.
 */
export default function BlogBanner({
  post,
  className,
  style,
  emojiSize = '3rem',
  logoStyle,
  children,
}) {
  const img = post.bannerImage;
  return (
    <div
      className={className}
      style={{ ...(img ? null : { background: post.bgGradient || post.gradient }), ...style }}
      aria-hidden="true"
    >
      {img ? (
        <img className="blog-banner-img" src={img} alt="" loading="lazy" />
      ) : post.logo ? (
        <img className="blog-logo-img" style={logoStyle} src={post.logo} alt="" />
      ) : (
        <span style={{ position: 'relative', zIndex: 1, fontSize: emojiSize }}>
          {post.icon || post.emoji}
        </span>
      )}
      {children}
    </div>
  );
}
