/*
 * blogSlides — normalize blog posts (curated + approved community posts) into the
 * same item shape the news carousel renders. This lets the full-screen reader
 * continue seamlessly into blogs once the RSS headlines run out, in the same
 * card format. Internal blogs open at /blog/:id (flagged `internal` so the
 * carousel routes in-app instead of to an external source).
 */

function plainText(md = '') {
  return String(md)
    .replace(/```[\s\S]*?```/g, ' ')      // code fences
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .replace(/[#>*_`~-]/g, ' ')           // md punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

export function blogToSlide(post, i = 0) {
  const text = post.subtitle || plainText(post.body).slice(0, 220);
  return {
    rid: `b-${post.id}`,
    id: post.id,
    title: post.title,
    excerpt: text.length > 200 ? text.slice(0, 197) + '…' : text,
    category: post.category || 'Blog',
    categoryClass: 'tag-purple',
    source: post.author ? `Glancer Blog · ${post.author}` : 'Glancer Blog',
    date: post.date
      ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
    readMin: post.readTime || 5,
    image: post.bannerImage || null,
    gradient: post.gradient || post.bgGradient || 'linear-gradient(135deg, #1a0533 0%, #4c1d95 50%, #7c3aed 100%)',
    emoji: post.icon || post.emoji || '✍️',
    url: `/blog/${post.id}`,
    internal: true,
  };
}

export function blogsToSlides(posts) {
  return (posts || []).map(blogToSlide);
}
