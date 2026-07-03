/*
 * Primary author for curated Glancer AI blogs — E-E-A-T signals (Person schema,
 * visible bio, same details as the About page).
 */
export const PRIMARY_AUTHOR = {
  name: 'Karan Shah',
  role: 'Founder & Creator of Glancer AI',
  email: 'karan.igniite@gmail.com',
  linkedin: 'https://www.linkedin.com/in/beingkaran/',
  site: 'https://glancerai.com',
  image: 'https://glancerai.com/karan.webp',
  imageFallback: 'https://glancerai.com/karan.jpg',
  bio:
    'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
  bioShort:
    'Engineer and founder of Glancer AI. Writes about AIOps, observability, and AI without the vendor spin.',
};

/** Apply primary author fields to a curated post (does not touch community submissions). */
export function withPrimaryAuthor(post) {
  if (!post || post.author === 'Community') return post;
  return {
    ...post,
    author: PRIMARY_AUTHOR.name,
    authorRole: PRIMARY_AUTHOR.role,
    authorBio: PRIMARY_AUTHOR.bio,
    authorImage: PRIMARY_AUTHOR.image,
    authorLinkedIn: PRIMARY_AUTHOR.linkedin,
    avatar: 'KS',
  };
}