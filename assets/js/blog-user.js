/* ObservaPedia — Blog User & Community Posts (localStorage) */
window.BlogUser = (function () {
  var POSTS_KEY = 'observapedia_blog_posts';
  var NAME_KEY  = 'observapedia_blog_username';
  var AVT_KEY   = 'observapedia_blog_avatar';

  function getName()       { return localStorage.getItem(NAME_KEY) || ''; }
  function setName(n)      { localStorage.setItem(NAME_KEY, n); }
  function getAvatar()     { return localStorage.getItem(AVT_KEY) || '✍️'; }
  function setAvatar(e)    { localStorage.setItem(AVT_KEY, e); }

  function getPosts() {
    try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function getPost(id) {
    return getPosts().find(function (p) { return p.id === id; }) || null;
  }

  function savePost(post) {
    var posts = getPosts().filter(function (p) { return p.id !== post.id; });
    var now = new Date().toISOString();
    if (!post.createdAt) post.createdAt = now;
    post.updatedAt = now;
    post.isUserPost = true;
    // Pending posts are hidden from public blog until admin approves
    post.hidden = (post.status === 'pending' || post.status === 'rejected');
    posts.unshift(post);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return post;
  }

  function deletePost(id) {
    var posts = getPosts().filter(function (p) { return p.id !== id; });
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  /* Posts awaiting admin review */
  function getPendingPosts() {
    return getPosts().filter(function (p) { return p.status === 'pending'; });
  }

  /* Posts visible to the public — approved OR legacy posts with no status field */
  function getApprovedPosts() {
    return getPosts().filter(function (p) {
      return !p.status || p.status === 'approved';
    });
  }

  /* Posts rejected by admin — kept so authors can see their rejection reason */
  function getRejectedPosts() {
    return getPosts().filter(function (p) { return p.status === 'rejected'; });
  }

  function approvePost(id) {
    var posts = getPosts().map(function (p) {
      if (p.id === id) {
        p.status = 'approved';
        p.hidden = false;
        p.approvedAt = new Date().toISOString();
      }
      return p;
    });
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  function rejectPost(id, reason) {
    var posts = getPosts().map(function (p) {
      if (p.id === id) {
        p.status = 'rejected';
        p.hidden = true;
        p.rejectedAt = new Date().toISOString();
        if (reason) p.rejectReason = reason;
      }
      return p;
    });
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  function generateId(title) {
    var slug = (title || 'post')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    return 'u-' + slug + '-' + Date.now().toString(36);
  }

  return {
    getName, setName, getAvatar, setAvatar,
    getPosts, getPost, savePost, deletePost, generateId,
    getPendingPosts, getApprovedPosts, getRejectedPosts,
    approvePost, rejectPost
  };
})();
