"""
Part II of the maintenance guide: in-depth explanation of every .js and .jsx file.
Imported by generate-maintenance-guide.py.
"""

from reportlab.platypus import Paragraph, Spacer, PageBreak, ListFlowable, ListItem
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors

BRAND = colors.HexColor("#6366F1")


def _esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _path(p):
    return f"<font face='Courier' color='#4338CA'><b>{_esc(p)}</b></font>"


def _render_file(doc, styles):
    elems = []
    elems.append(Paragraph(_path(doc["path"]), styles["H3"]))
    elems.append(Paragraph(f"<b>Purpose:</b> {doc['purpose']}", styles["Body"]))
    if doc.get("exports"):
        elems.append(Paragraph(f"<b>Exports:</b> {doc['exports']}", styles["Body"]))
    if doc.get("imports"):
        elems.append(Paragraph(f"<b>Key imports:</b> {doc['imports']}", styles["Body"]))
    if doc.get("state"):
        elems.append(Paragraph(f"<b>State &amp; hooks:</b> {doc['state']}", styles["Body"]))
    if doc.get("logic"):
        elems.append(Paragraph("<b>Logic (step by step):</b>", styles["BodyLeft"]))
        elems.append(ListFlowable(
            [ListItem(Paragraph(s, styles["BodyLeft"]), leftIndent=14) for s in doc["logic"]],
            bulletType="1", start="1",
        ))
    if doc.get("render"):
        elems.append(Paragraph(f"<b>What the user sees:</b> {doc['render']}", styles["Body"]))
    if doc.get("edit"):
        elems.append(Paragraph("<b>What to edit here:</b>", styles["BodyLeft"]))
        elems.append(ListFlowable(
            [ListItem(Paragraph(s, styles["BodyLeft"]), leftIndent=14) for s in doc["edit"]],
            bulletType="bullet", leftIndent=12,
        ))
    elems.append(Spacer(1, 0.12 * inch))
    return elems


# ── All 60 JS/JSX files, grouped for the PDF ──────────────────────────────

GROUPS = [
    ("Entry Point &amp; Configuration", [
        {
            "path": "src/main.jsx",
            "purpose": "Browser entry point — mounts React into the DOM, loads fonts/CSS, optionally injects Google AdSense, wraps the app in routing and auth.",
            "exports": "None (side-effect bootstrap only).",
            "logic": [
                "Import React, BrowserRouter, global CSS, Geist fonts, App, and AuthProvider.",
                "If AdSense is enabled and script not already in &lt;head&gt;, append the adsbygoogle.js loader.",
                "Call createRoot(document.getElementById('root')) to attach React.",
                "Render: StrictMode → BrowserRouter → AuthProvider → App.",
            ],
            "edit": [
                "Add global providers (theme, i18n) by wrapping &lt;App /&gt; inside AuthProvider.",
                "Change fonts by editing @fontsource imports.",
                "Rarely needs changes unless boot process changes.",
            ],
        },
        {
            "path": "src/App.jsx",
            "purpose": "Top-level layout shell and router — every page URL, theme toggle, navbar/footer visibility, analytics, onboarding tour.",
            "exports": "default App component.",
            "state": "theme (useState, default 'dark'); pathname from useLocation().",
            "logic": [
                "Effect 1: set data-theme on &lt;html&gt; when theme changes (CSS dark/light).",
                "Effect 2: scroll to top on every route change.",
                "Effect 3: recordHit(pathname) for analytics — skips /_glancer/* admin routes.",
                "Render decorative background, Navbar (hidden on admin), OnboardingTour (home only), Routes, Footer (hidden on admin).",
                "Routes: /, /blogs, /blog/:id, /blog/write, /ai-tools, /metrics, /glossary, /profile, /_glancer/admin, etc.",
            ],
            "render": "Every page the visitor navigates to — plus global chrome (nav, footer, background).",
            "edit": [
                "New page: create src/pages/YourPage.jsx, import, add &lt;Route path='...' element={...} /&gt;.",
                "Default theme: change useState('dark') initial value.",
                "Exclude routes from analytics in the recordHit effect.",
            ],
        },
        {
            "path": "vite.config.js",
            "purpose": "Vite dev/build config. Adds dev-only middleware so /api/llm and /api/proxy work locally like production.",
            "exports": "default defineConfig function.",
            "logic": [
                "llmDevApi: POST /api/llm → reads body, optional x-llm-key header, calls runLLM from api/_llmCore.js.",
                "proxyDevApi: GET /api/proxy?url= → calls proxyFetch from worker/proxyCore.js with CORS headers.",
                "Plugins: react(), llmDevApi(mode), proxyDevApi(). Server port: PORT env or 5184.",
            ],
            "edit": [
                "Change dev port in server.port.",
                "Add new dev API routes by copying the middleware pattern.",
                "Production APIs deploy separately (functions/ or api/).",
            ],
        },
    ]),
    ("Cloudflare Worker &amp; Serverless APIs", [
        {
            "path": "worker/index.js",
            "purpose": "Cloudflare Worker entry — sits in front of static dist/ build. Handles /api/proxy; everything else goes to ASSETS binding.",
            "exports": "default { async fetch(request, env) }.",
            "logic": [
                "Parse URL. If /api/proxy: OPTIONS → CORS preflight; GET → proxyFetch(url param), cache 10 min.",
                "On proxy error → 502 with CORS headers.",
                "All other paths → env.ASSETS.fetch(request) (static files + SPA index.html fallback).",
            ],
            "edit": ["Add Worker routes before ASSETS fallback.", "Tune cache-control on proxy responses.", "CORS in CORS constant."],
        },
        {
            "path": "worker/proxyCore.js",
            "purpose": "Shared CORS proxy logic used by Worker AND Vite dev middleware — identical behavior in dev and prod.",
            "exports": "validateTarget(target), proxyFetch(target).",
            "logic": [
                "validateTarget: require url param, parse URL, allow only http/https, block private/loopback hosts (SSRF guard).",
                "proxyFetch: validate → fetch upstream with browser-like User-Agent/Accept/Referer → return {status, contentType, body}.",
            ],
            "edit": ["Extend PRIVATE_HOST regex for SSRF rules.", "Tweak headers if feeds fail.", "Keep functions/api/proxy.js in sync."],
        },
        {
            "path": "functions/api/llm.js",
            "purpose": "Cloudflare Pages Function for POST /api/llm — self-contained LLM proxy (keys never in browser).",
            "exports": "onRequestPost({ request, env }).",
            "logic": [
                "Parse JSON: system, prompt, temperature (default 0.7). Reject empty prompt → 400.",
                "Read optional x-llm-key header (bring-your-own Gemini key).",
                "Build provider chain: LLM_PROVIDER override, else Gemini → Groq → OpenRouter if keys exist.",
                "Try each provider; on success return { text, provider }; fall through on quota/outage.",
                "No keys → 503 not configured.",
            ],
            "edit": ["Set GEMINI_API_KEY etc. in Cloudflare env vars.", "Edit DEFAULT_MODELS.", "Mirror changes in api/_llmCore.js."],
        },
        {
            "path": "functions/api/proxy.js",
            "purpose": "Cloudflare Pages Function for GET /api/proxy — fixes production news feed (without it, SPA returned index.html).",
            "exports": "onRequestOptions(), onRequestGet({ request }).",
            "logic": [
                "OPTIONS → CORS preflight.",
                "GET: validate url param (SSRF rules), fetch upstream, return body with CORS + 10-min cache.",
                "Validation/fetch logic mirrors proxyCore.js inline for Pages bundling.",
            ],
            "edit": ["Change max-age cache.", "Update PRIVATE_HOST if blocking valid URLs."],
        },
        {
            "path": "api/llm.js",
            "purpose": "Vercel serverless handler for POST /api/llm — thin wrapper around _llmCore.js.",
            "exports": "default handler(req, res).",
            "logic": [
                "Reject non-POST → 405.",
                "Read system, prompt, temperature from req.body; x-llm-key header.",
                "Call runLLM({ ..., env: process.env, byokKey }).",
                "Return 200 { text, provider } or error status.",
            ],
            "edit": ["Used on Vercel deploy only; local dev uses Vite middleware.", "Provider logic lives in _llmCore.js."],
        },
        {
            "path": "api/_llmCore.js",
            "purpose": "Shared LLM orchestration — used by Vercel api/llm.js and Vite dev middleware.",
            "exports": "providerChain, pickProvider, runLLM.",
            "logic": [
                "keyFor: Gemini accepts BYOK header; Groq/OpenRouter use server env only.",
                "providerChain: respect LLM_PROVIDER override, else filter PROVIDER_ORDER by available keys.",
                "callGemini: Google generateContent REST. callOpenAICompatible: Groq/OpenRouter chat completions.",
                "runLLM: validate prompt, clamp temperature, loop providers, throw 503 if no keys.",
            ],
            "edit": ["Add provider: extend DEFAULT_MODELS, keyFor, PROVIDER_ORDER.", "Change maxTokens default.", "Sync functions/api/llm.js."],
        },
    ]),
    ("Authentication Context", [
        {
            "path": "src/context/AuthContext.jsx",
            "purpose": "App-wide Supabase email/password auth — current user, admin flag, sign-up/in, password reset, logout.",
            "exports": "AuthProvider component, useAuth() hook.",
            "state": "user, loading; derived isAuthed, isAdmin, configured.",
            "logic": [
                "On mount: getSession() → load profile from profiles table → setLoading(false).",
                "Subscribe onAuthStateChange → reload profile on sign-in/out/token refresh.",
                "mapUser: build { id, email, name, isAdmin, picture } from session + profile row.",
                "signUp: supabase.auth.signUp with metadata; returns needsConfirmation if email confirm on.",
                "signIn: signInWithPassword. resetPassword: email link to /reset-password.",
                "updatePassword: for recovery flow. logout: signOut + clear user.",
                "isAdmin comes from profiles.is_admin in database — not client-side guess.",
            ],
            "render": "No UI — consumed by AuthForm, Navbar, AdminPage, ProfilePage, etc.",
            "edit": [
                "Wrap app in &lt;AuthProvider&gt; in main.jsx (already done).",
                "Use const { user, signIn, logout, isAdmin } = useAuth() in any component.",
                "Grant admin via SQL on profiles table, not in this file.",
            ],
        },
    ]),
    ("Library Modules (src/lib/)", [
        {
            "path": "src/lib/supabase.js",
            "purpose": "Creates the single Supabase client from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
            "exports": "isSupabaseConfigured (boolean), supabase (client or null).",
            "logic": [
                "Read and trim env vars. If missing → log warning, export supabase=null.",
                "If configured → createClient with persistSession and autoRefreshToken.",
                "Anon key is public/safe — real security is Row Level Security in schema.sql.",
            ],
            "edit": ["Set vars in .env, restart dev server.", "Never put service-role key here."],
        },
        {
            "path": "src/lib/blogStore.js",
            "purpose": "Data layer for user blogs, comments, likes, and writer allowlist — all Supabase-backed.",
            "exports": "getApprovedUserBlogs, getMyBlogs, getAllBlogs, addBlog, updateBlog, updateBlogStatus, deleteBlog, getBlogById, getPublishedBlogs, getComments, addComment, deleteComment, toggleCommentLike, canCurrentUserWrite, getWriterAccess, setRestrictWriters, addWriter, removeWriter.",
            "logic": [
                "fromRow: converts DB snake_case to UI camelCase post shape.",
                "getApprovedUserBlogs: query status=approved, newest first.",
                "addBlog: insert with status=pending, author from session, fire glancer:blogs-changed event.",
                "updateBlog: patch fields, force status back to pending for re-review.",
                "updateBlogStatus/deleteBlog: admin-only (enforced by RLS server-side).",
                "getComments: fetch comments + like counts; annotate likedByMe, mine.",
                "toggleCommentLike: insert/delete like row for signed-in user.",
                "getPublishedBlogs: approved user blogs + curated BLOG_POSTS from allBlogs.js.",
                "canCurrentUserWrite: RPC can_write() for writer allowlist.",
            ],
            "edit": ["Status flow enforced in schema.sql.", "Comment max length 2000 in addComment.", "Listen for glancer:blogs-changed to refresh lists."],
        },
        {
            "path": "src/lib/analytics.js",
            "purpose": "Anonymous page-hit tracking in Supabase; admin-only aggregate stats.",
            "exports": "recordHit(path), getPageAnalytics().",
            "logic": [
                "visitorId: stable random UUID in localStorage (glancer:visitor-id).",
                "recordHit: insert into page_hits — never throws (analytics must not break pages).",
                "getPageAnalytics: admin-only RPC page_analytics() — totals, unique visitors, trends.",
            ],
            "edit": ["Change VISITOR_KEY namespace.", "Analytics schema in supabase/schema.sql."],
        },
        {
            "path": "src/lib/newsFeed.js",
            "purpose": "Live AI news from RSS feeds with localStorage cache and static fallback.",
            "exports": "displayImage, getNews, getCachedNews, getCachedNewsItem, STATIC_NEWS.",
            "logic": [
                "displayImage: proxy remote images through wsrv.nl for cards.",
                "fetchViaRss2Json: try rss2json API first.",
                "fetchViaProxy: fallback — fetch XML via proxiedText, parse with DOMParser.",
                "fetchLiveNews: parallel feeds, merge, sort by date, dedupe by title.",
                "getNews: return cache if fresh (12h live / 20min static); else fetch live; on fail use STATIC_NEWS from newsData.js.",
                "enrichImagesInBackground: fetch og:image for cards missing thumbnails; dispatch glancer:news-updated.",
            ],
            "edit": ["Add RSS URLs to FEEDS array.", "Tune CACHE_TTL.", "Card styling via GRADIENTS/EMOJIS."],
        },
        {
            "path": "src/lib/proxy.js",
            "purpose": "Fetch cross-origin text by racing CORS proxies — first success wins.",
            "exports": "proxiedText(url, ms).",
            "logic": [
                "Try /api/proxy (first-party), then proxy.cors.sh, then allorigins.win.",
                "Each attempt has timeout (default 9s) and minimum body length 200 chars.",
                "Promise.any — reject only if all proxies fail.",
            ],
            "edit": ["Reorder PROXIES array.", "Adjust timeout and min body length."],
        },
        {
            "path": "src/lib/articleReader.js",
            "purpose": "Fetch news article HTML via proxy and extract readable content blocks for in-app reader.",
            "exports": "fetchArticle(url) → { blocks, heroImage }.",
            "logic": [
                "Fetch HTML via proxiedText (11s timeout).",
                "Extract hero from og:image or twitter:image meta.",
                "Find best container (article, .entry-content, main…) with ≥3 paragraphs.",
                "Walk p, h2, h3, blockquote, img — skip junk via class/id heuristics.",
                "Dedupe paragraphs; require ≥2 blocks or throw 'thin content'.",
                "Return up to 60 blocks.",
            ],
            "edit": ["Add site selectors to CONTAINER_SELECTORS.", "Tune JUNK regex.", "Increase slice(0,60) for longer articles."],
        },
        {
            "path": "src/lib/llm.js",
            "purpose": "Browser client for POST /api/llm — site-wide free AI; optional user key in localStorage.",
            "exports": "getUserKey, setUserKey, askLLM.",
            "logic": [
                "askLLM: POST /api/llm with prompt, system, temperature.",
                "Attach x-llm-key header if user stored a key (glancer_llm_key).",
                "On 503/404/network fail: set notConfigured flag for offline fallback.",
                "Return { text, provider } on success.",
            ],
            "edit": ["Default temperature 0.7.", "Server keys in AI_SETUP.md / Cloudflare env."],
        },
        {
            "path": "src/lib/aiEngines.js",
            "purpose": "Live-AI versions of generative tools — call askLLM, fall back to toolEngines offline templates.",
            "exports": "faqGeneratorAI, emailResponseAI, letterGeneratorAI, customerServiceScriptAI, promptOptimizerAI, blogTitleGeneratorAI, chatbotNameGeneratorAI, brandNameGeneratorAI.",
            "logic": [
                "aiRun: call askLLM with system+prompt; on success return output with provider name.",
                "On failure: call matching toolEngines fallback; add warning note.",
                "Each *AI(v): build prompts from form values v, set temperature, point to offline fallback.",
            ],
            "edit": ["Edit system/prompt strings for AI tone.", "New AI tool = new export + toolEngines fallback."],
        },
        {
            "path": "src/lib/toolEngines.js",
            "purpose": "Offline implementations of custom tools — markdown converters, sitemap kit, calculators, template generators.",
            "exports": "30+ functions: csvToMarkdown, sitemapFinder, chatbotRoi, faqGenerator, promptGenerator, etc.",
            "logic": [
                "Markdown converters: parse csv/json/html/xml/dom → GitHub-flavored markdown tables/headings.",
                "Sitemap tools: find/validate/extract/generate XML sitemaps and robots.txt via proxiedText.",
                "chatbotRoi: compute deflected tickets, savings, ROI% from form numbers.",
                "faqGenerator: split text into sentences, build Q&amp;A pairs from templates.",
                "promptGenerator: assemble prompts from APE/RACE/CREATE/SPARK frameworks.",
                "Each returns { output, lang?, preview?, stats?, error? } for ToolRunner UI.",
            ],
            "edit": ["One export per custom tool in customTools.js.", "Edit template strings for generators.", "FRAMEWORKS object for prompt styles."],
        },
        {
            "path": "src/lib/docEngines.js",
            "purpose": "In-browser Word↔PDF converters — no server upload, 100% client-side.",
            "exports": "wordToPdf({ file }), pdfToWord({ file }).",
            "logic": [
                "wordToPdf: mammoth docx→HTML → walk h1-h4, p, li, img, table → jsPDF pages.",
                "pdfToWord: pdfjs-dist extract text with x/y positions → group lines → docx Paragraphs.",
                "Return { blob, filename, stats, note } for download.",
            ],
            "edit": ["Tune PDF margins/font sizes.", "Error messages for unsupported .doc or scanned PDFs."],
        },
        {
            "path": "src/lib/blogImages.js",
            "purpose": "Inject curated diagrams/photos into editorial blog HTML at render time (user blogs untouched).",
            "exports": "POST_FIGURES, figuresForPost, injectFiguresIntoHtml.",
            "logic": [
                "POST_FIGURES maps post id → figure array (SVG diagrams + Unsplash photos).",
                "injectFiguresIntoHtml: find h2 positions; place diagram before 2nd h2, photo ~60% through.",
                "Build figure HTML with lazy-loaded img and optional caption.",
            ],
            "edit": ["Add entry to POST_FIGURES for new editorial post.", "SVGs in public/blog-figures/."],
        },
        {
            "path": "src/lib/profanity.js",
            "purpose": "Client-side profanity filter for comments — whole-word match with leetspeak normalization.",
            "exports": "findProfanity(text), containsProfanity(text).",
            "logic": [
                "Split text on non-alphanumeric boundaries.",
                "normalizeToken: lowercase, leet map (0→o, @→a), collapse repeated letters.",
                "Match against BLOCKLIST set; return found words.",
            ],
            "edit": ["Add/remove words in BLOCKLIST.", "UX guard only — not security."],
        },
        {
            "path": "src/lib/useDocumentMeta.js",
            "purpose": "React hook for per-page SEO — title, description, canonical, Open Graph, Twitter cards.",
            "exports": "useDocumentMeta({ title, description, path, type, image }).",
            "logic": [
                "useEffect on deps change: set document.title to 'Page · Glancer AI'.",
                "Upsert meta tags and canonical link (https://glancerai.com + path).",
                "Set og:* and twitter:* tags for social sharing.",
            ],
            "edit": ["Change SITE/ORIGIN constants.", "Call at top of each page component."],
        },
        {
            "path": "src/lib/adsense.js",
            "purpose": "Central AdSense config — ads disabled until real publisher ID is set.",
            "exports": "ADSENSE_CLIENT, ADSENSE_ENABLED, AD_SLOTS.",
            "logic": [
                "ADSENSE_ENABLED = true only when client matches ca-pub-\\d{16} and is not placeholder.",
                "AD_SLOTS maps logical names (toolsTop, content) to slot IDs.",
            ],
            "edit": ["Replace ADSENSE_CLIENT with real ID.", "Update public/ads.txt to match."],
        },
        {
            "path": "src/lib/miniMarkdown.js",
            "purpose": "Tiny markdown→HTML for tool output preview only. Escapes HTML first, then transforms.",
            "exports": "renderMarkdown(md).",
            "logic": [
                "esc() all input first for safety.",
                "Line loop: tables (|---|), headings #–######, HR, blockquote, ul, ol, paragraphs.",
                "inline(): code, bold, italic, links.",
            ],
            "edit": ["Add syntax in main loop.", "Keep esc-before-transform order for security."],
        },
    ]),
    ("Static Data (src/data/)", [
        {
            "path": "src/data/allBlogs.js",
            "purpose": "Canonical blog catalog — 20 curated articles with full HTML bodies. Primary source for blog content.",
            "exports": "BLOG_POSTS array.",
            "logic": [
                "Each post: id (URL slug), bannerImage, title, subtitle, category, icon, bgGradient, author, date, readTime, tags, featured, body (HTML string).",
                "No runtime logic — UI finds by id and renders body as HTML.",
                "Merged with user blogs in blogStore.getPublishedBlogs().",
            ],
            "edit": ["Copy existing post object for new article.", "Add SVG to public/blog-banners/.", "Use classes: key-takeaways, callout in body HTML."],
        },
        {
            "path": "src/data/blogData.js",
            "purpose": "Legacy metadata-only stub for 6 posts — NOT imported anywhere in the app.",
            "exports": "BLOG_POSTS (6 lightweight objects, no body).",
            "logic": ["Static array only.", "Superseded by allBlogs.js."],
            "edit": ["Do not edit for production — use allBlogs.js.", "Safe to delete if unused."],
        },
        {
            "path": "src/data/newsData.js",
            "purpose": "Fallback news when live RSS fails — 20 curated items linking to publisher AI hubs.",
            "exports": "NEWS_ITEMS, NEWS_CATEGORIES.",
            "logic": [
                "Each item: id, category, categoryClass (CSS tag color), emoji, gradient, title, excerpt, url, source, date, readMin.",
                "NEWS_CATEGORIES drives filter chips on news UI.",
            ],
            "edit": ["Add item with unique id and matching categoryClass.", "Update date strings for freshness."],
        },
        {
            "path": "src/data/aiTools.js",
            "purpose": "15 external AI tools (ChatGPT, Gemini, Claude…) with launch-from-page behavior.",
            "exports": "AI_TOOLS, TOOL_CATEGORIES, resolveLaunch(tool, prompt).",
            "logic": [
                "Each tool: launch mode deeplink | clipboard | open.",
                "deeplink(prompt): build URL with encoded prompt.",
                "clipboard: open tool URL, copy prompt to clipboard.",
                "resolveLaunch: trim prompt, return { mode, url, copied } for UI.",
            ],
            "edit": ["Add tool object with correct launch mode.", "Fix provider URL in deeplink() function."],
        },
        {
            "path": "src/data/customTools.js",
            "purpose": "Registry for ~30 in-browser custom tools — form schema + run() function per tool.",
            "exports": "CUSTOM_TOOL_CATEGORIES, CUSTOM_TOOLS.",
            "logic": [
                "Each tool: id, name, category, badge, inputs[], cta, run (from toolEngines/aiEngines/docEngines).",
                "Heavy doc converters lazy-loaded via dynamic import().",
                "ai:true tools use aiEngines; async:true awaits promises.",
                "ToolRunner reads inputs, calls run(values), shows output.",
            ],
            "edit": ["Add function in toolEngines.js, then object here.", "Input types: text, textarea, url, number, select, file."],
        },
        {
            "path": "src/data/allGlossary.js",
            "purpose": "1,599 AIOps/AI glossary terms — powers glossary page and home search.",
            "exports": "GLOSSARY_TERMS array.",
            "logic": [
                "Each term: term, abbr, category (28 categories), definition, related (term name links).",
                "GlossaryPage filters/searches; SearchSection quick-lookup on home.",
                "related resolved by matching term strings in array.",
            ],
            "edit": ["Add term objects with exact shape.", "Large file — prefer scripted regeneration over hand-editing thousands of lines."],
        },
    ]),
    ("Pages (src/pages/)", [
        {
            "path": "src/pages/HomePage.jsx",
            "purpose": "Landing page — hero + News/Blogs tab switcher + glossary search.",
            "state": "activeTab: 'news' | 'blogs'.",
            "logic": ["Pass activeTab to Hero.", "Render NewsTab if news, BlogsTab if blogs.", "Always render SearchSection at bottom."],
            "render": "Hero tabs, news or blog grid, search widget.",
            "edit": ["Default tab: useState('news').", "Add tab: extend state + Hero + conditional render."],
        },
        {
            "path": "src/pages/BlogsPage.jsx",
            "purpose": "Full blog listing — search, categories, featured article, admin delete.",
            "state": "filter, search, posts (merged), busyId, showSuggest.",
            "logic": [
                "Merge userBlogs + BLOG_POSTS; filter by category and search.",
                "Featured = newest user blog or curated featured.",
                "Search suggestions: top 6 matches; outside-click closes dropdown.",
                "handleDelete: admin-only with confirm.",
            ],
            "render": "Hero, search, category chips, featured card, blog grid with links to /blog/:id.",
            "edit": ["Featured logic.", "ALL_CATEGORIES.", "Grid via blogs-grid CSS."],
        },
        {
            "path": "src/pages/BlogPostPage.jsx",
            "purpose": "Single article view — banner, HTML body, share, comments, related posts.",
            "state": "post (loading/object/null), more (3 related). bodyHtml via useMemo with injectFiguresIntoHtml.",
            "logic": ["Load by id from blogStore + BLOG_POSTS.", "Inject editorial figures.", "Show Comments + ShareBar."],
            "render": "Full article layout or Not Found.",
            "edit": ["Related count .slice(0,3).", "bodyHtml processing."],
        },
        {
            "path": "src/pages/BlogWritePage.jsx",
            "purpose": "Create/edit articles — TipTap rich editor, banner upload, submit for review.",
            "state": "title, subtitle, category, tags, emoji, gradient, bannerImage, readTime, editor, canWrite, submitting, error.",
            "logic": [
                "Gate: sign-in → writer permission (can_write RPC) → form.",
                "fileToCompressedDataURL: compress images to WebP for banner/inline.",
                "handleSubmit: validate → addBlog (new) or updateBlog (edit) → status pending.",
                "Edit mode: load post by :id from URL.",
            ],
            "render": "Rich text form or success screen.",
            "edit": ["CATEGORIES, GRADIENTS, EMOJIS arrays.", "Toolbar buttons.", "Validation in handleSubmit."],
        },
        {
            "path": "src/pages/AIToolsPage.jsx",
            "purpose": "Custom in-browser tools grid + external AI launchpad with search/filter.",
            "state": "customQuery, customCat, activeTool (modal), query, activeCat, prompts, toast.",
            "logic": [
                "Filter CUSTOM_TOOLS and AI_TOOLS by search + category.",
                "Click custom tool → open ToolRunner modal.",
                "launch(): resolveLaunch, copy prompt, open new tab.",
                "AdSlot placements between sections.",
            ],
            "render": "Two tool sections, search, category chips, toast notifications.",
            "edit": ["Tools in data files.", "useDocumentMeta for SEO title."],
        },
        {
            "path": "src/pages/MetricsPage.jsx",
            "purpose": "Full AI industry metrics dashboard — Chart.js bar/line/doughnut charts.",
            "logic": [
                "No React state — hardcoded STATS, LEADERBOARD, funding, adoption, benchmark, tokens data.",
                "Chart option objects control colors/fonts.",
                "ChartSource links under each chart.",
            ],
            "render": "8 KPI cards + 4 chart rows with source attribution.",
            "edit": ["Update STATS and chart data arrays.", "Copy chart-card block to add charts."],
        },
        {
            "path": "src/pages/GlossaryPage.jsx",
            "purpose": "Full glossary browser — search autocomplete, 28 categories, up to 120 results.",
            "state": "query, activeCat, showSuggest, refs for scroll.",
            "logic": [
                "useMemo: categories, suggestions (top matches), results (capped at RESULT_CAP=120).",
                "pickSuggestion: fill query + scroll to results.",
                "pickCategory: browse by category without search.",
            ],
            "render": "Search, category grid OR result cards with definitions and related chips.",
            "edit": ["RESULT_CAP.", "CAT_ICONS.", "Placeholder text."],
        },
        {
            "path": "src/pages/AboutPage.jsx",
            "purpose": "Static about page — founder bio, values, contact.",
            "state": "ProfilePhoto broken flag for image fallback.",
            "logic": ["ProfilePhoto: /karan.jpg with KS gradient fallback.", "VALUES array for 4-value grid."],
            "render": "Creator card, site description, values, email CTA.",
            "edit": ["Bio text, social links.", "public/karan.jpg photo."],
        },
        {
            "path": "src/pages/FAQPage.jsx",
            "purpose": "SEO FAQ accordion + Google FAQPage JSON-LD structured data.",
            "state": "open accordion index (-1 = all closed).",
            "logic": [
                "FAQS array: 12 Q&amp;A objects.",
                "useEffect injects JSON-LD script into head for rich results.",
                "Click toggles one accordion item at a time.",
            ],
            "render": "Accordion FAQ + CTA links.",
            "edit": ["Edit FAQS array (updates UI + SEO).", "useDocumentMeta."],
        },
        {
            "path": "src/pages/ProfilePage.jsx",
            "purpose": "User account — sign-in when logged out; profile + my articles when logged in.",
            "state": "blogs, busyId.",
            "logic": [
                "Signed out → AuthForm.",
                "Signed in → avatar, stats (total/pending/approved), article list with View/Edit/Delete.",
                "Listen glancer:blogs-changed to refresh.",
            ],
            "render": "Login form or dashboard with article management.",
            "edit": ["STATUS_META labels.", "Stats counts object."],
        },
        {
            "path": "src/pages/ResetPasswordPage.jsx",
            "purpose": "Password reset landing from Supabase email link.",
            "state": "ready, checking, password, confirm, showPw, busy, error, done.",
            "logic": [
                "Listen for PASSWORD_RECOVERY auth event.",
                "Validate passwords match and min length.",
                "updatePassword via AuthContext → redirect to profile.",
            ],
            "render": "Verifying → form → success or expired link message.",
            "edit": ["Min password length.", "Redirect delay after success."],
        },
        {
            "path": "src/pages/NewsReaderPage.jsx",
            "purpose": "In-app news article reader — full content or RSS fallback.",
            "state": "item from cache, state loading/ready/error, article blocks. HeroImage stage chain.",
            "logic": [
                "getCachedNewsItem(rid) — if missing show error.",
                "fetchArticle(url) for full parsed blocks.",
                "Fallback: cleanRssHtml on RSS summary while loading.",
                "HeroImage: proxy → raw → emoji fallback stages.",
            ],
            "render": "Back bar, hero, title, body blocks or summary, source link.",
            "edit": ["Block renderers in map.", "goBack destination."],
        },
        {
            "path": "src/pages/AdminPage.jsx",
            "purpose": "Admin moderation dashboard — approve/reject blogs, writer allowlist, analytics.",
            "state": "blogs, activeFilter, preview, access, newWriter, accessBusy, busyId.",
            "logic": [
                "Gate: loading → AuthForm → not admin message → dashboard.",
                "Filters: pending, approved, rejected, all, writers, analytics.",
                "updateStatus: approve/reject via blogStore (RLS enforced).",
                "Writer access: toggle restrict, add/remove emails.",
                "Analytics tab renders AnalyticsPanel.",
            ],
            "render": "Sidebar + post list with preview pane OR writer settings OR analytics.",
            "edit": ["Add sidebar filter + content block.", "Approval messages."],
        },
    ]),
    ("Components (src/components/)", [
        {
            "path": "src/components/Navbar.jsx",
            "purpose": "Site-wide navigation — logo, links, Write, profile, theme toggle, mobile menu.",
            "state": "mobileOpen, hidden (scroll-hide), lastY ref.",
            "logic": [
                "NAV_LINKS array drives desktop + mobile links.",
                "handleWrite: redirect unsigned users to /profile.",
                "Scroll down hides navbar; scroll up shows it.",
            ],
            "render": "Fixed header with responsive hamburger menu.",
            "edit": ["NAV_LINKS.", "Scroll threshold y < 80."],
        },
        {
            "path": "src/components/Footer.jsx",
            "purpose": "Site-wide footer — explore links, legal, copyright.",
            "logic": ["Static 4-column grid.", "No state."],
            "render": "Footer links + 'Made with ♥ by Karan Shah'.",
            "edit": ["Link columns.", "Copyright year/text."],
        },
        {
            "path": "src/components/Hero.jsx",
            "purpose": "Home hero with parallax, headline, tab switcher (News/Blogs/Metrics/Glossary).",
            "state": "scrollY for parallax; heroRef, contentRef.",
            "logic": [
                "TABS: News/Blogs call onTabChange; Metrics/Glossary navigate away.",
                "Parallax: transform and opacity from scrollY.",
            ],
            "render": "Animated hero with tab buttons (#home-tabs for tour).",
            "edit": ["Headline in h1.", "TABS array.", "Parallax multiplier."],
        },
        {
            "path": "src/components/NewsTab.jsx",
            "purpose": "Home news section — live RSS or static fallback.",
            "state": "activeFilter, items, live, loading. Thumb stage for image fallback.",
            "logic": [
                "getNews(20) on mount; listen glancer:news-updated.",
                "Featured card + grid; category filters when live.",
                "Thumb: displayImage proxy → gradient+emoji fallback.",
            ],
            "render": "News cards linking to /news/:id or external url.",
            "edit": ["getNews limit.", "NEWS_CATEGORIES."],
        },
        {
            "path": "src/components/BlogsTab.jsx",
            "purpose": "Home blogs preview — merged user + curated posts.",
            "state": "filter, userBlogs.",
            "logic": [
                "getApprovedUserBlogs + BLOG_POSTS, filter by category.",
                "Optional limit prop → 'View all' link to /blogs.",
            ],
            "render": "Blog card grid with banners.",
            "edit": ["limit prop from HomePage.", "Category chips slice(0,6)."],
        },
        {
            "path": "src/components/MetricsTab.jsx",
            "purpose": "Compact metrics section for home page (subset of MetricsPage).",
            "logic": ["4 KPIs + 3 charts.", "Same data pattern as MetricsPage."],
            "render": "Stats cards and charts embedded on home.",
            "edit": ["Sync STATS with MetricsPage.jsx.", "Updated date string."],
        },
        {
            "path": "src/components/SearchSection.jsx",
            "purpose": "Home glossary quick-search with chips and inline definition.",
            "state": "value, result, searched, showSuggest.",
            "logic": [
                "lookup(): best match from GLOSSARY_TERMS.",
                "CHIPS: preset quick-search terms.",
                "Outside-click closes suggestions.",
            ],
            "render": "Search box, 7 chips, definition panel, stats bar.",
            "edit": ["CHIPS array.", "Stats numbers in bar."],
        },
        {
            "path": "src/components/AuthForm.jsx",
            "purpose": "Reusable sign-in / sign-up / forgot-password form.",
            "state": "mode, name, email, password, showPw, busy, error, info, captchaToken.",
            "logic": [
                "handleSubmit: validate → signIn/signUp/resetPassword via useAuth.",
                "Turnstile captchaToken passed when enabled.",
                "friendlyError maps Supabase errors to plain English.",
                "Shows 'not configured' if Supabase env missing.",
            ],
            "render": "Tabbed auth form with optional CAPTCHA.",
            "edit": ["Validation rules.", "friendlyError messages."],
        },
        {
            "path": "src/components/Turnstile.jsx",
            "purpose": "Cloudflare Turnstile CAPTCHA — optional, only if VITE_TURNSTILE_SITE_KEY set.",
            "exports": "isCaptchaEnabled, TURNSTILE_SITE_KEY.",
            "logic": [
                "loadScript once for challenges.cloudflare.com/turnstile.",
                "Render widget; onToken callback to parent.",
                "Returns null if disabled.",
            ],
            "render": "CAPTCHA widget below auth form fields.",
            "edit": ["Set VITE_TURNSTILE_SITE_KEY in .env.", "theme prop dark/light."],
        },
        {
            "path": "src/components/BlogBanner.jsx",
            "purpose": "Unified blog cover — bannerImage &gt; logo &gt; emoji on gradient.",
            "logic": ["Priority chain in if/else.", "Accepts className, emojiSize, children."],
            "render": "Cover image on every blog card and post header.",
            "edit": ["Fallback priority order.", "Pass children for overlays."],
        },
        {
            "path": "src/components/ShareBar.jsx",
            "purpose": "Social share buttons (X, LinkedIn, Facebook, WhatsApp) + copy link.",
            "state": "copied brief feedback.",
            "logic": ["Build platform share URLs with encoded title+url.", "copyLink uses clipboard API."],
            "render": "Row of share buttons below blog posts.",
            "edit": ["Add/remove platforms in links object."],
        },
        {
            "path": "src/components/Comments.jsx",
            "purpose": "Blog comments — post, like, delete (Supabase).",
            "state": "comments, draft, loading, submitting, busyId.",
            "logic": [
                "Hidden if Supabase not configured.",
                "handleSubmit: profanity check via findProfanity → addComment.",
                "toggleCommentLike: optimistic UI update.",
                "Delete: own comment or admin.",
            ],
            "render": "Composer + comment list with avatars and hearts.",
            "edit": ["maxLength 2000.", "Profanity handling."],
        },
        {
            "path": "src/components/AnalyticsPanel.jsx",
            "purpose": "Admin analytics — visit counters and trend charts.",
            "state": "stats, error, loading.",
            "logic": [
                "getPageAnalytics() on mount.",
                "StatCard for total/today/week/year.",
                "trendData builds Chart.js datasets from daily/weekly/yearly rows.",
            ],
            "render": "4 KPI cards + 3 trend charts.",
            "edit": ["Data from page_analytics RPC in schema.sql."],
        },
        {
            "path": "src/components/OnboardingTour.jsx",
            "purpose": "First-visit guided tour with spotlight overlay on navbar features.",
            "state": "running, step index i, rect for spotlight, demoToggled ref.",
            "logic": [
                "Auto-start after 900ms if glancer:tour-seen not in localStorage.",
                "STEPS target elements with data-tour attributes.",
                "Demo theme toggle on theme step.",
                "Keyboard: Esc/arrows/Enter.",
            ],
            "render": "Dim overlay + coach card + 'Show me' replay button.",
            "edit": ["STEPS array + matching data-tour on targets.", "Clear glancer:tour-seen to replay."],
        },
        {
            "path": "src/components/ToolRunner.jsx",
            "purpose": "Modal to run any custom tool — dynamic form, execute run(), show output.",
            "state": "values, result, busy, view output/preview, copied, showKey/keyVal for BYOK.",
            "logic": [
                "seedValues from tool.inputs defaults.",
                "run(): await tool.run(values) if async.",
                "renderMarkdown for preview; copy/download output.",
                "Escape or overlay click closes; body scroll locked.",
            ],
            "render": "Full-screen tool modal with form + results.",
            "edit": ["Tools defined in customTools.js.", "AI key panel for ai:true tools."],
        },
        {
            "path": "src/components/AdSlot.jsx",
            "purpose": "Google AdSense placeholder — renders nothing until configured.",
            "state": "ref, pushed ref to prevent double push.",
            "logic": [
                "Return null if !ADSENSE_ENABLED.",
                "useEffect: push to window.adsbygoogle once.",
            ],
            "render": "'Advertisement' label + ins.adsbygoogle element.",
            "edit": ["Slot IDs in adsense.js AD_SLOTS."],
        },
    ]),
]


def build_code_reference(styles):
    """Append Part II — in-depth code reference for all JS/JSX files."""
    elems = []
    elems.append(PageBreak())
    elems.append(Paragraph("Part II — In-Depth Code Reference", styles["H1"]))
    elems.append(Paragraph(
        "This section explains <b>every JavaScript and JSX file</b> in the Glancer AI project — "
        "what it does, how the logic flows step by step, and what you would edit as a maintainer. "
        "Files are grouped by folder. Read Part I first for the big picture; use this section "
        "when you need to understand or change specific code.",
        styles["Body"],
    ))
    elems.append(Spacer(1, 0.15 * inch))

    file_num = 0
    for group_title, files in GROUPS:
        elems.append(PageBreak())
        elems.append(Paragraph(group_title, styles["H1"]))
        elems.append(Spacer(1, 0.1 * inch))
        for doc in files:
            file_num += 1
            elems.extend(_render_file(doc, styles))

    elems.append(Spacer(1, 0.2 * inch))
    elems.append(Paragraph(
        f"<b>Code reference complete.</b> All {file_num} JavaScript/JSX source files documented.",
        ParagraphStyle("CodeRefEnd", parent=styles["Body"], textColor=BRAND),
    ))
    return elems