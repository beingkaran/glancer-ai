#!/usr/bin/env python3
"""Generate a project file-tree diagram for the maintenance guide."""

from pathlib import Path
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import matplotlib.patheffects as pe

OUT = Path(__file__).resolve().parent.parent / "docs" / "guide-assets"
BG = "#0B0F1A"
PANEL = "#141B2D"
ACCENT = "#6366F1"
TEXT = "#E2E8F0"
MUTED = "#94A3B8"
BORDER = "#334155"

TREE = """glancer-ai/
├── public/              ← Static images, logos, blog banners
│   ├── blog-banners/    ← SVG banner art for blog cards
│   ├── blog-figures/    ← Inline diagrams inside blog posts
│   └── glancer-logo.svg ← Site logo
├── src/
│   ├── pages/           ← One file per page (Home, Blogs, AI Tools…)
│   ├── components/      ← Reusable UI (Navbar, Footer, Hero…)
│   ├── data/            ← Static content (blogs, glossary, news, tools)
│   ├── lib/             ← Logic (auth, AI, analytics, blog store)
│   ├── context/         ← React context (AuthContext)
│   ├── App.jsx          ← Routes & layout shell
│   └── main.jsx         ← App entry point
├── worker/              ← Cloudflare Worker (proxy + static serving)
├── functions/api/       ← Cloudflare Pages Functions (/api/llm, /api/proxy)
├── api/                 ← Vercel serverless (alternative host)
├── supabase/
│   └── schema.sql       ← Database tables + security rules
├── wrangler.jsonc       ← Cloudflare deploy config
├── vite.config.js       ← Dev server + build config
├── .env.example         ← Environment variable template
├── AUTH_SETUP.md        ← Auth setup instructions
└── AI_SETUP.md          ← AI API key setup instructions"""


def main():
    fig, ax = plt.subplots(figsize=(14, 10), facecolor=BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis("off")

    title = ax.text(7, 9.5, "Glancer AI — Project Folder Map",
                    ha="center", fontsize=20, fontweight="bold", color=TEXT)
    title.set_path_effects([pe.withStroke(linewidth=3, foreground=BG)])
    ax.text(7, 9.05, "Where to find and edit every part of the site",
            ha="center", fontsize=10, color=MUTED)

    box = FancyBboxPatch(
        (0.6, 0.5), 12.8, 8.2,
        boxstyle="round,pad=0.02,rounding_size=0.06",
        facecolor=PANEL, edgecolor=BORDER, linewidth=1.5,
    )
    ax.add_patch(box)

    ax.text(0.9, 8.3, TREE, ha="left", va="top", fontsize=10.5,
            color=TEXT, family="monospace", linespacing=1.55)

    # Color-coded legend
    hints = [
        (ACCENT, "Edit content here → src/data/"),
        ("#22D3EE", "Edit pages here → src/pages/"),
        ("#34D399", "Edit styling here → src/index.css + App.css"),
        ("#FB923C", "Edit deploy/hosting → wrangler.jsonc + worker/"),
    ]
    for i, (c, t) in enumerate(hints):
        ax.add_patch(plt.Rectangle((0.9 + (i % 2) * 6.2, 0.7 + (1 - i // 2) * 0.45),
                                    0.2, 0.18, facecolor=c))
        ax.text(1.2 + (i % 2) * 6.2, 0.79 + (1 - i // 2) * 0.45, t,
                va="center", fontsize=8.5, color=MUTED)

    out = OUT / "file-tree-diagram.png"
    plt.savefig(out, dpi=180, bbox_inches="tight", facecolor=BG)
    plt.close()
    print(f"Saved {out}")


if __name__ == "__main__":
    main()