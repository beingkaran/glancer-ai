#!/usr/bin/env python3
"""
Generate the exhaustive Glancer AI Maintenance Guide PDF.
Run: python3 scripts/generate-maintenance-guide.py
Output: docs/Glancer-AI-Maintenance-Guide.pdf
"""

from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak,
    Table, TableStyle, KeepTogether, ListFlowable, ListItem,
)
from reportlab.pdfgen import canvas

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from code_reference_section import build_code_reference

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "docs" / "guide-assets"
SCREENSHOTS = ASSETS / "screenshots"
OUT_PDF = ROOT / "docs" / "Glancer-AI-Maintenance-Guide.pdf"

# Brand colors
BRAND = colors.HexColor("#6366F1")
BRAND_LIGHT = colors.HexColor("#A5B4FC")
DARK = colors.HexColor("#0B0F1A")
TEXT = colors.HexColor("#1E293B")
MUTED = colors.HexColor("#64748B")
ACCENT_BG = colors.HexColor("#EEF2FF")
CODE_BG = colors.HexColor("#F1F5F9")


class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED)
        self.drawRightString(letter[0] - 0.6 * inch, 0.45 * inch,
                             f"Glancer AI Maintenance Guide  ·  Page {self._pageNumber} of {page_count}")
        self.drawString(0.75 * inch, 0.45 * inch, "glancerai.com")


def build_styles():
    base = getSampleStyleSheet()
    styles = {}

    styles["CoverTitle"] = ParagraphStyle(
        "CoverTitle", parent=base["Title"],
        fontSize=32, leading=38, textColor=colors.white,
        alignment=TA_CENTER, spaceAfter=12, fontName="Helvetica-Bold",
    )
    styles["CoverSub"] = ParagraphStyle(
        "CoverSub", parent=base["Normal"],
        fontSize=14, leading=20, textColor=BRAND_LIGHT,
        alignment=TA_CENTER, spaceAfter=6,
    )
    styles["H1"] = ParagraphStyle(
        "H1", parent=base["Heading1"],
        fontSize=22, leading=28, textColor=BRAND,
        spaceBefore=18, spaceAfter=12, fontName="Helvetica-Bold",
    )
    styles["H2"] = ParagraphStyle(
        "H2", parent=base["Heading2"],
        fontSize=15, leading=20, textColor=colors.HexColor("#4338CA"),
        spaceBefore=14, spaceAfter=8, fontName="Helvetica-Bold",
    )
    styles["H3"] = ParagraphStyle(
        "H3", parent=base["Heading3"],
        fontSize=12, leading=16, textColor=TEXT,
        spaceBefore=10, spaceAfter=6, fontName="Helvetica-Bold",
    )
    styles["Body"] = ParagraphStyle(
        "Body", parent=base["Normal"],
        fontSize=10.5, leading=15, textColor=TEXT,
        alignment=TA_JUSTIFY, spaceAfter=8,
    )
    styles["BodyLeft"] = ParagraphStyle(
        "BodyLeft", parent=styles["Body"], alignment=TA_LEFT,
    )
    styles["Tip"] = ParagraphStyle(
        "Tip", parent=styles["Body"],
        backColor=ACCENT_BG, borderColor=BRAND_LIGHT,
        borderWidth=1, borderPadding=8,
        leftIndent=6, rightIndent=6,
    )
    styles["Code"] = ParagraphStyle(
        "Code", parent=base["Code"],
        fontSize=9, leading=12, textColor=colors.HexColor("#0F172A"),
        backColor=CODE_BG, leftIndent=10, rightIndent=10,
        spaceBefore=4, spaceAfter=8, fontName="Courier",
    )
    styles["Caption"] = ParagraphStyle(
        "Caption", parent=base["Normal"],
        fontSize=9, leading=12, textColor=MUTED,
        alignment=TA_CENTER, spaceBefore=4, spaceAfter=14,
        fontName="Helvetica-Oblique",
    )
    styles["TOC"] = ParagraphStyle(
        "TOC", parent=styles["Body"],
        fontSize=11, leading=18, leftIndent=12,
    )
    return styles


def img(path, width=6.5 * inch, max_height=4.0 * inch):
    p = Path(path)
    if not p.exists():
        return Paragraph(f"<i>[Image not found: {p.name}]</i>", build_styles()["Caption"])
    im = Image(str(p))
    ratio = im.imageWidth / im.imageHeight
    h = width / ratio
    if h > max_height:
        h = max_height
        width = h * ratio
    im.drawWidth = width
    im.drawHeight = h
    im.hAlign = "CENTER"
    return im


def tip(text, styles):
    return Paragraph(f"<b>💡 Tip:</b> {text}", styles["Tip"])


def code(text, styles):
    return Paragraph(text.replace("\n", "<br/>"), styles["Code"])


def steps(items, styles):
    return ListFlowable(
        [ListItem(Paragraph(s, styles["BodyLeft"]), leftIndent=18) for s in items],
        bulletType="1", start="1",
    )


def file_table(rows, styles):
    data = [["What you want to change", "Open this file"]] + rows
    t = Table(data, colWidths=[3.2 * inch, 3.5 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ACCENT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def screenshot_block(name, caption, styles, width=6.2 * inch):
    return KeepTogether([
        img(SCREENSHOTS / f"{name}.png", width=width),
        Paragraph(caption, styles["Caption"]),
    ])


def cover_page(styles):
    elems = []
    elems.append(Spacer(1, 1.2 * inch))
    elems.append(img(SCREENSHOTS / "01-home.png", width=5.5 * inch, max_height=3.0 * inch))
    elems.append(Spacer(1, 0.4 * inch))
    elems.append(Paragraph("Glancer AI", styles["CoverTitle"]))
    elems.append(Paragraph("Complete Maintenance &amp; Editing Guide", styles["CoverSub"]))
    elems.append(Spacer(1, 0.2 * inch))
    elems.append(Paragraph(
        "A beginner-friendly, step-by-step handbook for understanding, editing,<br/>"
        "and hosting every feature of glancerai.com",
        styles["CoverSub"],
    ))
    elems.append(Spacer(1, 0.6 * inch))
    elems.append(Paragraph("Version 1.0  ·  June 2026", styles["CoverSub"]))
    elems.append(PageBreak())
    return elems


def toc(styles):
    sections = [
        "1. What Is Glancer AI?",
        "2. Before You Start (Tools You Need)",
        "3. Running the Site on Your Computer",
        "4. Project Folder Map",
        "5. Hosting &amp; Architecture Diagram",
        "6. How Pages Connect (Routing)",
        "7. Editing the Homepage",
        "8. Editing AI News",
        "9. Editing Blogs",
        "10. Editing AI Tools",
        "11. Editing Metrics &amp; Charts",
        "12. Editing the Glossary",
        "13. Editing About &amp; FAQ Pages",
        "14. User Accounts &amp; Authentication",
        "15. Blog Writing &amp; Approval Workflow",
        "16. Admin Dashboard",
        "17. Analytics",
        "18. Styling, Theme &amp; Branding",
        "19. Environment Variables (.env)",
        "20. Deploying to Production (Cloudflare)",
        "21. Common Maintenance Tasks",
        "22. Troubleshooting",
        "<b>Part II — In-Depth Code Reference</b>",
        "23. Entry Point &amp; Configuration (main.jsx, App.jsx, vite.config.js)",
        "24. Worker &amp; Serverless APIs (6 files)",
        "25. Authentication Context (AuthContext.jsx)",
        "26. Library Modules — src/lib/ (15 files)",
        "27. Static Data — src/data/ (6 files)",
        "28. Pages — src/pages/ (13 files)",
        "29. Components — src/components/ (16 files)",
    ]
    elems = [Paragraph("Table of Contents", styles["H1"]), Spacer(1, 0.2 * inch)]
    for s in sections:
        elems.append(Paragraph(s, styles["TOC"]))
    elems.append(PageBreak())
    return elems


def build_story(styles):
    s = []
    s += cover_page(styles)
    s += toc(styles)

    # ── 1. What Is Glancer AI ──
    s.append(Paragraph("1. What Is Glancer AI?", styles["H1"]))
    s.append(Paragraph(
        "<b>Glancer AI</b> (glancerai.com) is a free AI intelligence hub for engineers, SREs, "
        "and researchers. It combines breaking AI news, industry metrics, a searchable AIOps "
        "glossary, expert blogs, and 25+ free in-browser AI tools — all in one modern website.",
        styles["Body"],
    ))
    s.append(Paragraph("Main features at a glance:", styles["H3"]))
    s.append(steps([
        "<b>AI News</b> — live RSS feed of AI/tech headlines, read in-site.",
        "<b>Blogs</b> — curated articles plus community submissions (admin-approved).",
        "<b>Free AI Tools</b> — launch ChatGPT/Gemini/Claude with prompts, plus custom tools (FAQ generator, PDF converters, SEO utilities).",
        "<b>Metrics</b> — interactive charts on AI adoption and observability benchmarks.",
        "<b>Glossary</b> — searchable dictionary of AIOps and AI terms.",
        "<b>User accounts</b> — sign up, write blogs, manage profile (powered by Supabase).",
        "<b>Admin dashboard</b> — approve/reject blogs, manage writers, view analytics.",
    ], styles))
    s.append(PageBreak())

    # ── 2. Before You Start ──
    s.append(Paragraph("2. Before You Start (Tools You Need)", styles["H1"]))
    s.append(Paragraph("You only need three free tools installed on your computer:", styles["Body"]))
    s.append(steps([
        "<b>Node.js</b> (v18 or newer) — runs the website. Download from nodejs.org. Check with: <font face='Courier'>node --version</font>",
        "<b>A code editor</b> — VS Code (free) is recommended. Open the <font face='Courier'>glancer-ai</font> folder as your project.",
        "<b>Git</b> (optional) — for version control and deploying. Download from git-scm.com.",
    ], styles))
    s.append(tip(
        "You do NOT need to understand React deeply. This guide tells you exactly which file "
        "to open for each change. Think of files as editable recipe cards.",
        styles,
    ))
    s.append(Paragraph("Accounts you'll set up (all free tiers):", styles["H3"]))
    s.append(steps([
        "<b>Cloudflare</b> — hosts the live website (glancerai.com).",
        "<b>Supabase</b> — database + user login. See AUTH_SETUP.md in the project.",
        "<b>Google AI Studio</b> (optional) — free Gemini API key for live AI tools. See AI_SETUP.md.",
    ], styles))
    s.append(PageBreak())

    # ── 3. Running Locally ──
    s.append(Paragraph("3. Running the Site on Your Computer", styles["H1"]))
    s.append(Paragraph("Follow these steps every time you want to preview your changes:", styles["Body"]))
    s.append(steps([
        "Open Terminal (Mac) or Command Prompt (Windows).",
        "Navigate to the project folder: <font face='Courier'>cd path/to/glancer-ai</font>",
        "Install dependencies (first time only): <font face='Courier'>npm install</font>",
        "Copy environment template: <font face='Courier'>cp .env.example .env</font> then fill in your Supabase keys.",
        "Start the dev server: <font face='Courier'>npm run dev</font>",
        "Open your browser to <font face='Courier'>http://localhost:5184</font>",
        "Edit any file, save it — the browser refreshes automatically.",
    ], styles))
    s.append(code(
        "# Quick reference commands\n"
        "npm install          # install packages (first time)\n"
        "npm run dev          # start local preview server\n"
        "npm run build        # build production files into dist/\n"
        "npx wrangler deploy  # deploy to Cloudflare",
        styles,
    ))
    s.append(tip("The dev server runs on port 5184 (configured in vite.config.js).", styles))
    s.append(PageBreak())

    # ── 4. Project Folder Map ──
    s.append(Paragraph("4. Project Folder Map", styles["H1"]))
    s.append(Paragraph(
        "The diagram below shows where every important file lives. Bookmark this page — "
        "it is your map for all future edits.",
        styles["Body"],
    ))
    s.append(img(ASSETS / "file-tree-diagram.png", width=6.8 * inch, max_height=5.5 * inch))
    s.append(Paragraph("Figure 1 — Project folder structure and what each folder controls.", styles["Caption"]))
    s.append(Paragraph("Quick reference table:", styles["H3"]))
    s.append(file_table([
        ["Change navigation menu links", "<font face='Courier'>src/components/Navbar.jsx</font>"],
        ["Change footer text/links", "<font face='Courier'>src/components/Footer.jsx</font>"],
        ["Add a new page/route", "<font face='Courier'>src/App.jsx</font> + new file in <font face='Courier'>src/pages/</font>"],
        ["Change site-wide colors/fonts", "<font face='Courier'>src/index.css</font>"],
        ["Add a blog article (curated)", "<font face='Courier'>src/data/allBlogs.js</font>"],
        ["Add a glossary term", "<font face='Courier'>src/data/allGlossary.js</font>"],
        ["Add an AI tool link", "<font face='Courier'>src/data/aiTools.js</font>"],
        ["Add a custom in-browser tool", "<font face='Courier'>src/data/customTools.js</font>"],
        ["Change database rules", "<font face='Courier'>supabase/schema.sql</font>"],
        ["Change deploy/hosting settings", "<font face='Courier'>wrangler.jsonc</font>"],
    ], styles))
    s.append(PageBreak())

    # ── 5. Architecture ──
    s.append(Paragraph("5. Hosting &amp; Architecture Diagram", styles["H1"]))
    s.append(Paragraph(
        "Glancer AI is a <b>static React website</b> hosted on <b>Cloudflare</b>. "
        "There is no traditional server you manage — Cloudflare serves the built files "
        "and runs small serverless functions for AI and news-proxy requests.",
        styles["Body"],
    ))
    s.append(img(ASSETS / "architecture-diagram.png", width=6.8 * inch, max_height=5.8 * inch))
    s.append(Paragraph(
        "Figure 2 — How glancerai.com is hosted: visitors → Cloudflare → React app + APIs → Supabase/LLMs.",
        styles["Caption"],
    ))
    s.append(Paragraph("How a page visit works (step by step):", styles["H3"]))
    s.append(steps([
        "Visitor types glancerai.com in their browser.",
        "Cloudflare DNS routes the request to Cloudflare Pages/Workers.",
        "The Cloudflare Worker (worker/index.js) checks the URL path.",
        "If the path is /api/proxy → the Worker fetches external news feeds (bypassing browser CORS limits).",
        "If the path is /api/llm → a Pages Function calls Gemini/Groq/OpenRouter with your secret API key.",
        "All other paths → the built React app (dist/) is served. React Router handles /blogs, /ai-tools, etc.",
        "The React app talks directly to Supabase for login, blogs, and analytics (protected by database security rules).",
    ], styles))
    s.append(Paragraph("Alternative hosting:", styles["H3"]))
    s.append(Paragraph(
        "The project also supports <b>Vercel</b> (api/llm.js for AI, no Worker needed). "
        "Cloudflare is the primary production setup for glancerai.com.",
        styles["Body"],
    ))
    s.append(PageBreak())

    # ── 6. Routing ──
    s.append(Paragraph("6. How Pages Connect (Routing)", styles["H1"]))
    s.append(Paragraph(
        "Every URL on the site is defined in <font face='Courier'>src/App.jsx</font>. "
        "When you add a new page, you add a Route here.",
        styles["Body"],
    ))
    s.append(file_table([
        ["/", "HomePage — news/blogs tabs + search"],
        ["/blogs", "BlogsPage — all blog articles"],
        ["/blog/:id", "BlogPostPage — single article view"],
        ["/blog/write", "BlogWritePage — write new article (login required)"],
        ["/ai-tools", "AIToolsPage — external + custom AI tools"],
        ["/metrics", "MetricsPage — charts and benchmarks"],
        ["/glossary", "GlossaryPage — searchable terms"],
        ["/about", "AboutPage — about the site"],
        ["/faq", "FAQPage — frequently asked questions"],
        ["/profile", "ProfilePage — user account + my blogs"],
        ["/reset-password", "ResetPasswordPage — password reset flow"],
        ["/_glancer/admin", "AdminPage — hidden admin dashboard"],
        ["/news/:id", "NewsReaderPage — read a news article in-site"],
    ], styles))
    s.append(tip(
        "The admin URL is intentionally obscure (/_glancer/admin). You can change it in "
        "App.jsx, but update any bookmarks accordingly.",
        styles,
    ))
    s.append(PageBreak())

    # ── 7. Homepage ──
    s.append(Paragraph("7. Editing the Homepage", styles["H1"]))
    s.append(screenshot_block("01-home", "Screenshot — Homepage with AI News tab active.", styles))
    s.append(Paragraph("The homepage has three sections:", styles["Body"]))
    s.append(steps([
        "<b>Hero banner</b> — big headline + News/Blogs tab switcher. Edit: src/components/Hero.jsx",
        "<b>News or Blogs tab</b> — content below the hero. Edit: src/components/NewsTab.jsx or BlogsTab.jsx",
        "<b>Search section</b> — site-wide search. Edit: src/components/SearchSection.jsx",
    ], styles))
    s.append(Paragraph("To change the hero headline:", styles["H3"]))
    s.append(code(
        "// Open: src/components/Hero.jsx\n"
        "// Look for the main <h1> text and edit the string inside.",
        styles,
    ))
    s.append(Paragraph("To switch the default tab (news vs blogs):", styles["H3"]))
    s.append(code(
        "// Open: src/pages/HomePage.jsx\n"
        "// Change: useState('news')  →  useState('blogs')",
        styles,
    ))
    s.append(screenshot_block("02-home-blogs-tab", "Screenshot — Homepage with Blogs tab selected.", styles))
    s.append(PageBreak())

    # ── 8. AI News ──
    s.append(Paragraph("8. Editing AI News", styles["H1"]))
    s.append(Paragraph(
        "The news feed pulls live RSS headlines from external sources. It uses a "
        "<b>CORS proxy</b> (/api/proxy) because browsers cannot fetch third-party feeds directly.",
        styles["Body"],
    ))
    s.append(file_table([
        ["Change news sources / RSS URLs", "src/data/newsData.js"],
        ["News card display logic", "src/components/NewsTab.jsx"],
        ["In-site article reader", "src/pages/NewsReaderPage.jsx"],
        ["Proxy server logic", "worker/proxyCore.js + functions/api/proxy.js"],
    ], styles))
    s.append(Paragraph("To add a new news source:", styles["H3"]))
    s.append(steps([
        "Open src/data/newsData.js",
        "Copy an existing entry object in the NEWS_SOURCES array.",
        "Change id, name, url (RSS feed URL), excerpt, and category.",
        "Save and refresh the browser — the new source appears in the feed.",
    ], styles))
    s.append(tip(
        "If news images show emoji placeholders in production, verify /api/proxy is deployed "
        "(functions/api/proxy.js must exist on Cloudflare Pages).",
        styles,
    ))
    s.append(PageBreak())

    # ── 9. Blogs ──
    s.append(Paragraph("9. Editing Blogs", styles["H1"]))
    s.append(screenshot_block("03-blogs", "Screenshot — Blogs listing page.", styles))
    s.append(Paragraph("Glancer AI has two types of blog content:", styles["Body"]))
    s.append(steps([
        "<b>Curated blogs</b> — hard-coded expert articles in src/data/allBlogs.js (you edit these directly).",
        "<b>User blogs</b> — submitted by signed-in visitors, stored in Supabase, approved by admin.",
    ], styles))
    s.append(Paragraph("To add or edit a curated blog article:", styles["H3"]))
    s.append(steps([
        "Open src/data/allBlogs.js",
        "Each article is an object with: id, title, subtitle, category, author, date, readTime, tags, body (HTML).",
        "Copy an existing article object and modify the fields.",
        "For banner images: add SVG to public/blog-banners/ and set bannerImage: '/blog-banners/your-file.svg'.",
        "For inline diagrams: add SVG to public/blog-figures/ and reference in the body HTML.",
    ], styles))
    s.append(Paragraph("Blog card styling:", styles["H3"]))
    s.append(Paragraph(
        "Edit src/components/BlogsTab.jsx (homepage cards) and src/pages/BlogsPage.jsx (full listing). "
        "Banner component: src/components/BlogBanner.jsx.",
        styles["Body"],
    ))
    s.append(screenshot_block("10-blog-write", "Screenshot — Blog writing page (requires sign-in).", styles))
    s.append(PageBreak())

    # ── 10. AI Tools ──
    s.append(Paragraph("10. Editing AI Tools", styles["H1"]))
    s.append(screenshot_block("04-ai-tools", "Screenshot — Free AI Tools page.", styles))
    s.append(Paragraph("The AI Tools page has two sections:", styles["Body"]))
    s.append(Paragraph("A) External AI Tools (deep-link to ChatGPT, Gemini, etc.)", styles["H2"]))
    s.append(Paragraph("Edit src/data/aiTools.js — each tool has name, url, launch mode (deeplink/clipboard/open), and prompt handling.", styles["Body"]))
    s.append(Paragraph("B) Custom In-Browser Tools (run on the page itself)", styles["H2"]))
    s.append(Paragraph("Edit src/data/customTools.js — register tools with inputs schema and a run() function.", styles["Body"]))
    s.append(file_table([
        ["Add external tool link", "src/data/aiTools.js"],
        ["Add custom tool", "src/data/customTools.js"],
        ["Tool UI (form + output)", "src/components/ToolRunner.jsx"],
        ["Offline tool logic", "src/lib/toolEngines.js"],
        ["Live AI tool logic", "src/lib/aiEngines.js"],
        ["LLM API proxy", "functions/api/llm.js"],
    ], styles))
    s.append(Paragraph("To enable live AI (not just offline templates):", styles["H3"]))
    s.append(steps([
        "Get a free API key from Google AI Studio (Gemini recommended).",
        "Add GEMINI_API_KEY=your-key to .env (local) or Cloudflare env vars (production).",
        "See AI_SETUP.md for full instructions.",
    ], styles))
    s.append(PageBreak())

    # ── 11. Metrics ──
    s.append(Paragraph("11. Editing Metrics &amp; Charts", styles["H1"]))
    s.append(screenshot_block("05-metrics", "Screenshot — Metrics page with charts.", styles))
    s.append(Paragraph(
        "Charts are built with Chart.js. Data and chart config live in src/pages/MetricsPage.jsx "
        "and the homepage preview in src/components/MetricsTab.jsx.",
        styles["Body"],
    ))
    s.append(steps([
        "Open src/pages/MetricsPage.jsx",
        "Find the chart data arrays (labels, datasets).",
        "Update numbers and labels to reflect new benchmarks.",
        "Colors and styling are in the same file and in src/index.css.",
    ], styles))
    s.append(PageBreak())

    # ── 12. Glossary ──
    s.append(Paragraph("12. Editing the Glossary", styles["H1"]))
    s.append(screenshot_block("06-glossary", "Screenshot — Glossary search page.", styles))
    s.append(Paragraph(
        "All glossary terms are in src/data/allGlossary.js as a GLOSSARY_TERMS array. "
        "Each term has: term, abbr, category, definition, related.",
        styles["Body"],
    ))
    s.append(steps([
        "Open src/data/allGlossary.js",
        "Add a new object to the GLOSSARY_TERMS array.",
        "Save — the term is instantly searchable on /glossary.",
    ], styles))
    s.append(Paragraph("Page layout and search UI: src/pages/GlossaryPage.jsx", styles["Body"]))
    s.append(PageBreak())

    # ── 13. About & FAQ ──
    s.append(Paragraph("13. Editing About &amp; FAQ Pages", styles["H1"]))
    s.append(screenshot_block("07-about", "Screenshot — About page.", styles))
    s.append(screenshot_block("08-faq", "Screenshot — FAQ page.", styles))
    s.append(file_table([
        ["About page content", "src/pages/AboutPage.jsx"],
        ["FAQ questions & answers", "src/pages/FAQPage.jsx"],
        ["Page title / SEO meta tags", "src/lib/useDocumentMeta.js"],
    ], styles))
    s.append(tip("FAQ entries are JavaScript objects with q and a fields — just copy and edit.", styles))
    s.append(PageBreak())

    # ── 14. Auth ──
    s.append(Paragraph("14. User Accounts &amp; Authentication", styles["H1"]))
    s.append(screenshot_block("09-profile-signin", "Screenshot — Profile / Sign-in page.", styles))
    s.append(Paragraph(
        "Login is powered by <b>Supabase</b> (free). Users sign up with email + password. "
        "Security is enforced by Row Level Security in the database — not by hiding URLs.",
        styles["Body"],
    ))
    s.append(file_table([
        ["Supabase connection", "src/lib/supabase.js"],
        ["Login state (who is signed in)", "src/context/AuthContext.jsx"],
        ["Sign-in / sign-up form", "src/components/AuthForm.jsx"],
        ["CAPTCHA widget", "src/components/Turnstile.jsx"],
        ["Password reset page", "src/pages/ResetPasswordPage.jsx"],
        ["Database tables + security", "supabase/schema.sql"],
        ["Setup instructions", "AUTH_SETUP.md"],
    ], styles))
    s.append(Paragraph("One-time Supabase setup:", styles["H3"]))
    s.append(steps([
        "Create free project at supabase.com",
        "Run supabase/schema.sql in SQL Editor",
        "Copy Project URL + anon key into .env",
        "Sign up on the site — first account becomes admin automatically",
    ], styles))
    s.append(PageBreak())

    # ── 15. Blog Workflow ──
    s.append(Paragraph("15. Blog Writing &amp; Approval Workflow", styles["H1"]))
    s.append(Paragraph("This is the lifecycle of a community blog post:", styles["Body"]))
    s.append(steps([
        "User signs in and visits /blog/write",
        "They write in the rich-text editor (TipTap) and submit",
        "Post is saved with status = 'pending' (hidden from public)",
        "User sees it in their Profile as 'Pending Review'",
        "Admin opens /_glancer/admin, previews, and clicks Approve or Reject",
        "Approved posts appear on /blogs and the homepage",
    ], styles))
    s.append(file_table([
        ["Write page + editor", "src/pages/BlogWritePage.jsx"],
        ["Save/load blog posts", "src/lib/blogStore.js"],
        ["Single post view", "src/pages/BlogPostPage.jsx"],
        ["User's own posts", "src/pages/ProfilePage.jsx"],
        ["Profanity filter", "src/lib/profanity.js"],
        ["Comments on posts", "src/components/Comments.jsx"],
    ], styles))
    s.append(PageBreak())

    # ── 16. Admin ──
    s.append(Paragraph("16. Admin Dashboard", styles["H1"]))
    s.append(screenshot_block("11-admin", "Screenshot — Admin dashboard (login required, admin only).", styles))
    s.append(Paragraph(
        "URL: <font face='Courier'>/_glancer/admin</font>. Only users with is_admin=true in the "
        "database can access moderation features.",
        styles["Body"],
    ))
    s.append(Paragraph("Admin capabilities:", styles["H3"]))
    s.append(steps([
        "Approve / reject / delete pending blog submissions",
        "Preview full article before approving",
        "Toggle writer allowlist (restrict who can submit blogs)",
        "Add/remove writer emails from allowlist",
        "View site analytics (page views, unique visitors, trends)",
    ], styles))
    s.append(Paragraph("Edit admin UI: src/pages/AdminPage.jsx + src/components/AnalyticsPanel.jsx", styles["Body"]))
    s.append(tip(
        "To make someone else an admin, run in Supabase SQL Editor: "
        "<font face='Courier'>update profiles set is_admin = true where email = 'them@example.com';</font>",
        styles,
    ))
    s.append(PageBreak())

    # ── 17. Analytics ──
    s.append(Paragraph("17. Analytics", styles["H1"]))
    s.append(Paragraph(
        "Anonymous page-hit tracking stores visits in Supabase (page_hits table). "
        "No personal data — just a random browser ID for unique visitor counts.",
        styles["Body"],
    ))
    s.append(file_table([
        ["Record page views", "src/lib/analytics.js (called from App.jsx)"],
        ["Admin analytics panel", "src/components/AnalyticsPanel.jsx"],
        ["Database table + RPC", "supabase/schema.sql (page_hits, page_analytics())"],
    ], styles))
    s.append(PageBreak())

    # ── 18. Styling ──
    s.append(Paragraph("18. Styling, Theme &amp; Branding", styles["H1"]))
    s.append(file_table([
        ["Site-wide colors, fonts, spacing", "src/index.css"],
        ["App layout overrides", "src/App.css"],
        ["Dark/light theme toggle", "src/App.jsx (theme state) + CSS [data-theme] selectors"],
        ["Logo files", "public/glancer-logo.svg, public/favicon.svg"],
        ["Hero background image", "src/assets/hero.png"],
        ["Font family (Geist)", "src/main.jsx (Fontsource imports)"],
        ["Google AdSense (optional)", "src/lib/adsense.js + src/components/AdSlot.jsx"],
    ], styles))
    s.append(Paragraph("To change the primary brand color:", styles["H3"]))
    s.append(code(
        "/* Open src/index.css — look for CSS variables at the top: */\n"
        "--accent: #6366f1;     /* main purple accent */\n"
        "--accent-2: #22d3ee;   /* cyan highlight */",
        styles,
    ))
    s.append(PageBreak())

    # ── 19. Environment Variables ──
    s.append(Paragraph("19. Environment Variables (.env)", styles["H1"]))
    s.append(Paragraph("Copy .env.example to .env and fill in:", styles["Body"]))
    t = Table([
        ["Variable", "Required?", "What it does"],
        ["VITE_SUPABASE_URL", "Yes (for auth/blogs)", "Supabase project URL"],
        ["VITE_SUPABASE_ANON_KEY", "Yes (for auth/blogs)", "Public Supabase key (safe in browser)"],
        ["GEMINI_API_KEY", "Optional", "Powers live AI tools (server-side only)"],
        ["GROQ_API_KEY", "Optional", "Alternative LLM provider"],
        ["OPENROUTER_API_KEY", "Optional", "Alternative LLM provider"],
        ["VITE_TURNSTILE_SITE_KEY", "Optional", "CAPTCHA on sign-in forms"],
    ], colWidths=[2.0 * inch, 1.2 * inch, 3.3 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ACCENT_BG]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    s.append(t)
    s.append(Spacer(1, 0.2 * inch))
    s.append(tip("Variables starting with VITE_ are exposed to the browser. API keys do NOT have VITE_ prefix — they stay server-side.", styles))
    s.append(PageBreak())

    # ── 20. Deploy ──
    s.append(Paragraph("20. Deploying to Production (Cloudflare)", styles["H1"]))
    s.append(Paragraph("Every time you want to publish changes to glancerai.com:", styles["Body"]))
    s.append(steps([
        "Make and test your edits locally (npm run dev)",
        "Build production files: npm run build  (creates dist/ folder)",
        "Deploy to Cloudflare: npx wrangler deploy",
        "Set environment variables in Cloudflare dashboard → Settings → Environment variables",
        "Verify the live site at https://glancerai.com",
    ], styles))
    s.append(Paragraph("wrangler.jsonc controls:", styles["H3"]))
    s.append(steps([
        "Worker entry: worker/index.js (handles /api/proxy + static files)",
        "Static assets: dist/ folder (your built React app)",
        "SPA fallback: all unknown routes serve index.html (React Router handles them)",
    ], styles))
    s.append(Paragraph("Cloudflare Pages Functions (auto-deployed from functions/ folder):", styles["H3"]))
    s.append(steps([
        "functions/api/llm.js — POST /api/llm (AI proxy)",
        "functions/api/proxy.js — GET /api/proxy (news CORS proxy)",
    ], styles))
    s.append(PageBreak())

    # ── 21. Common Tasks ──
    s.append(Paragraph("21. Common Maintenance Tasks", styles["H1"]))
    tasks = [
        ("Add a new page", [
            "Create src/pages/MyPage.jsx",
            "Add <Route path='/my-page' element={<MyPage />} /> in src/App.jsx",
            "Add nav link in src/components/Navbar.jsx",
        ]),
        ("Change site title / SEO", [
            "Edit src/lib/useDocumentMeta.js (default title, description)",
            "Per-page: each page calls useDocumentMeta() with its own title",
        ]),
        ("Update sitemap for Google", [
            "Edit public/sitemap.xml — add new <url> entries",
        ]),
        ("Add a blog banner image", [
            "Create SVG in public/blog-banners/",
            "Reference as bannerImage: '/blog-banners/name.svg' in allBlogs.js",
        ]),
        ("Block a user from writing", [
            "Admin dashboard → Writer Access → enable restrict mode",
            "Remove their email from the allowlist",
        ]),
        ("Rotate AI API key", [
            "Update GEMINI_API_KEY in Cloudflare env vars",
            "Redeploy — no code change needed",
        ]),
    ]
    for title, sub_steps in tasks:
        s.append(Paragraph(title, styles["H2"]))
        s.append(steps(sub_steps, styles))
    s.append(PageBreak())

    # ── 22. Troubleshooting ──
    s.append(Paragraph("22. Troubleshooting", styles["H1"]))
    troubles = [
        ("Site won't start (npm run dev fails)", "Run npm install. Check Node.js version (18+). Delete node_modules and package-lock.json, then npm install again."),
        ("Login doesn't work", "Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env. Confirm schema.sql was run in Supabase."),
        ("AI tools show offline templates only", "Set GEMINI_API_KEY in .env (local) or Cloudflare env vars (production). Check AI_SETUP.md."),
        ("News feed shows emoji placeholders", "Ensure /api/proxy is deployed (functions/api/proxy.js). Check Cloudflare Functions logs."),
        ("Blog submit fails", "User must be signed in. Check Supabase logs. Verify RLS policies in schema.sql."),
        ("Admin page says 'Access denied'", "Your account needs is_admin=true. First signup is auto-admin; others need SQL update."),
        ("Changes not visible after deploy", "Run npm run build before wrangler deploy. Hard-refresh browser (Cmd+Shift+R)."),
        ("CAPTCHA not showing", "Set VITE_TURNSTILE_SITE_KEY and configure Turnstile secret in Supabase auth settings."),
    ]
    data = [["Problem", "Solution"]] + [[p, sol] for p, sol in troubles]
    tt = Table(data, colWidths=[2.5 * inch, 4.2 * inch])
    tt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#DC2626")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FEF2F2")]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    s.append(tt)
    s.append(Spacer(1, 0.4 * inch))
    s.append(Paragraph(
        "<b>Need more help?</b> Read AUTH_SETUP.md and AI_SETUP.md in the project root. "
        "Each is a focused setup guide for authentication and AI respectively.",
        styles["Body"],
    ))

    # Part II — every .js / .jsx file explained in depth
    s.extend(build_code_reference(styles))

    s.append(PageBreak())
    s.append(Paragraph(
        "— End of Guide (Part I: Site Maintenance + Part II: Code Reference) —",
        ParagraphStyle("End", parent=styles["Body"], alignment=TA_CENTER, textColor=MUTED),
    ))

    return s


def add_cover_background(canv, doc):
    """Dark cover background on page 1."""
    if canv.getPageNumber() == 1:
        canv.saveState()
        canv.setFillColor(DARK)
        canv.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
        canv.restoreState()


def main():
    OUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    styles = build_styles()

    doc = SimpleDocTemplate(
        str(OUT_PDF),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.65 * inch,
        title="Glancer AI Maintenance Guide",
        author="Glancer AI",
    )

    def on_page(canv, doc):
        add_cover_background(canv, doc)
        if canv.getPageNumber() > 1:
            canv.saveState()
            canv.setStrokeColor(colors.HexColor("#E2E8F0"))
            canv.setLineWidth(0.5)
            canv.line(0.75 * inch, letter[1] - 0.55 * inch,
                      letter[0] - 0.75 * inch, letter[1] - 0.55 * inch)
            canv.restoreState()

    doc.build(build_story(styles), onFirstPage=on_page, onLaterPages=on_page,
              canvasmaker=NumberedCanvas)
    print(f"✅ Guide saved to {OUT_PDF}")
    print(f"   Pages: {OUT_PDF.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()