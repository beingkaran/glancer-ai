#!/usr/bin/env python3
"""Generate a beautiful hosting architecture diagram for Glancer AI."""

from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe

OUT = Path(__file__).resolve().parent.parent / "docs" / "guide-assets"
OUT.mkdir(parents=True, exist_ok=True)

# Brand palette
BG = "#0B0F1A"
PANEL = "#141B2D"
ACCENT = "#6366F1"
ACCENT2 = "#22D3EE"
ACCENT3 = "#A78BFA"
GREEN = "#34D399"
ORANGE = "#FB923C"
TEXT = "#E2E8F0"
MUTED = "#94A3B8"
BORDER = "#334155"


def rounded_box(ax, x, y, w, h, color, label, sublabel="", icon="", lw=1.5):
    box = FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0.02,rounding_size=0.08",
        facecolor=color, edgecolor=BORDER, linewidth=lw, zorder=2,
    )
    ax.add_patch(box)
    if icon:
        ax.text(x + w / 2, y + h - 0.22, icon, ha="center", va="center",
                fontsize=22, color=TEXT, zorder=3)
    ax.text(x + w / 2, y + h / 2 + (0.08 if sublabel else 0),
            label, ha="center", va="center", fontsize=11, fontweight="bold",
            color=TEXT, zorder=3, wrap=True)
    if sublabel:
        ax.text(x + w / 2, y + h / 2 - 0.28, sublabel, ha="center", va="center",
                fontsize=8.5, color=MUTED, zorder=3, wrap=True)


def arrow(ax, x1, y1, x2, y2, color=ACCENT2, label=""):
    arr = FancyArrowPatch(
        (x1, y1), (x2, y2),
        arrowstyle="-|>", mutation_scale=14,
        color=color, linewidth=2, zorder=1,
        connectionstyle="arc3,rad=0.0",
    )
    ax.add_patch(arr)
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx, my + 0.12, label, ha="center", va="bottom",
                fontsize=7.5, color=color, fontstyle="italic", zorder=4)


def main():
    fig, ax = plt.subplots(figsize=(16, 11), facecolor=BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 11)
    ax.axis("off")

    # Title
    title = ax.text(8, 10.55, "Glancer AI — Hosting & Architecture",
                    ha="center", va="center", fontsize=22, fontweight="bold", color=TEXT)
    title.set_path_effects([pe.withStroke(linewidth=3, foreground=BG)])
    ax.text(8, 10.1, "glancerai.com  ·  React SPA  ·  Cloudflare Pages/Workers  ·  Supabase",
            ha="center", va="center", fontsize=10, color=MUTED)

    # ── Layer labels ──
    for lx, label in [(0.35, "VISITORS"), (0.35, "EDGE"), (0.35, "APP"), (0.35, "APIs"), (0.35, "DATA")]:
        pass
    layers = [
        (10.2, "👤  VISITORS"),
        (8.6, "☁️  CLOUDFLARE EDGE"),
        (6.4, "⚛️  FRONTEND (React SPA)"),
        (3.8, "🔌  SERVERLESS APIs"),
        (1.2, "🗄️  EXTERNAL SERVICES"),
    ]
    for y, lbl in layers:
        ax.text(0.4, y, lbl, ha="left", va="center", fontsize=9,
                fontweight="bold", color=ACCENT2, alpha=0.85)

    # Visitors
    rounded_box(ax, 6.5, 9.5, 3, 1.1, PANEL, "Web Browsers",
                "Desktop · Mobile · No install needed", "🌐")

    # Cloudflare
    rounded_box(ax, 1.2, 7.8, 3.4, 1.5, "#1E293B", "Cloudflare DNS",
                "glancerai.com → Pages", "🌍")
    rounded_box(ax, 5.3, 7.8, 5.4, 1.5, "#1E293B", "Cloudflare Worker",
                "worker/index.js — routes traffic", "⚡")
    rounded_box(ax, 11.1, 7.8, 3.7, 1.5, "#1E293B", "Static Assets (dist/)",
                "Vite build · HTML/JS/CSS", "📦")

    # Pages Functions
    rounded_box(ax, 1.2, 5.8, 3.8, 1.4, PANEL, "/api/llm",
                "functions/api/llm.js\nGemini · Groq · OpenRouter", "🤖")
    rounded_box(ax, 5.5, 5.8, 4.2, 1.4, PANEL, "/api/proxy",
                "functions/api/proxy.js\nCORS proxy for news feeds", "📡")
    rounded_box(ax, 10.2, 5.8, 4.6, 1.4, PANEL, "Turnstile CAPTCHA",
                "Bot protection on auth forms", "🛡️")

    # React app modules
    modules = [
        (1.0, 3.6, "HomePage", "News + Blogs tabs"),
        (3.5, 3.6, "AIToolsPage", "25+ custom tools"),
        (6.0, 3.6, "BlogsPage", "Curated + user posts"),
        (8.5, 3.6, "MetricsPage", "Charts & benchmarks"),
        (11.0, 3.6, "GlossaryPage", "AIOps terms"),
        (13.2, 3.6, "AdminPage", "/_glancer/admin"),
    ]
    for x, y, name, sub in modules:
        rounded_box(ax, x, y, 2.2, 1.2, "#1A2235", name, sub, lw=1)

    # Data layer
    rounded_box(ax, 1.0, 0.5, 4.5, 1.8, "#172554", "Supabase",
                "Auth · profiles · blogs · analytics\nRow Level Security (RLS)", "🔐")
    rounded_box(ax, 6.0, 0.5, 3.5, 1.8, "#172554", "LLM Providers",
                "Gemini / Groq / OpenRouter\nAPI keys in env vars", "🧠")
    rounded_box(ax, 10.0, 0.5, 3.5, 1.8, "#172554", "RSS / News Sources",
                "Fetched via /api/proxy\n(third-party feeds)", "📰")
    rounded_box(ax, 13.8, 0.5, 2.0, 1.8, "#172554", "AdSense",
                "Optional ads", "💰")

    # Arrows — visitor flow
    arrow(ax, 8, 9.5, 8, 9.3, ACCENT2)
    arrow(ax, 8, 9.5, 8, 9.3, ACCENT2)
    arrow(ax, 8, 9.5, 7.0, 9.3, MUTED)
    arrow(ax, 8, 9.5, 8.0, 9.3, ACCENT2, "")
    # DNS → Worker
    arrow(ax, 4.6, 7.8, 6.0, 8.5, ACCENT2, "resolve")
    arrow(ax, 8.0, 7.8, 8.0, 7.2, ACCENT2, "route")
    arrow(ax, 12.9, 7.8, 10.5, 7.2, GREEN, "static")
    # Worker → APIs
    arrow(ax, 7.0, 7.8, 3.1, 7.2, ACCENT3, "POST")
    arrow(ax, 8.5, 7.8, 7.6, 7.2, ACCENT3, "GET")
    # Worker → SPA modules
    arrow(ax, 8.0, 7.8, 8.0, 4.8, ACCENT, "SPA fallback")
    # Modules → data
    arrow(ax, 2.1, 3.6, 3.2, 2.3, GREEN, "read/write")
    arrow(ax, 7.1, 3.6, 3.5, 2.3, GREEN)
    arrow(ax, 14.3, 3.6, 3.5, 2.3, GREEN, "moderate")
    arrow(ax, 4.6, 5.8, 7.8, 2.3, ORANGE, "AI calls")
    arrow(ax, 7.6, 5.8, 11.8, 2.3, ORANGE, "fetch feeds")

    # Legend
    leg_y = 0.15
    for i, (c, t) in enumerate([
        (ACCENT2, "HTTP traffic"),
        (GREEN, "Database / storage"),
        (ORANGE, "External API"),
        (ACCENT3, "Serverless function"),
    ]):
        ax.add_patch(mpatches.Rectangle((0.5 + i * 3.8, leg_y), 0.25, 0.15,
                                         facecolor=c, edgecolor="none"))
        ax.text(0.85 + i * 3.8, leg_y + 0.075, t, va="center", fontsize=8, color=MUTED)

    # Deploy flow box
    deploy = FancyBboxPatch(
        (0.5, 10.0), 5.2, 0.45,
        boxstyle="round,pad=0.02,rounding_size=0.05",
        facecolor="#1E1B4B", edgecolor=ACCENT, linewidth=1, zorder=2,
    )
    ax.add_patch(deploy)
    ax.text(3.1, 10.225,
            "Deploy:  npm run build  →  npx wrangler deploy  →  live on Cloudflare",
            ha="center", va="center", fontsize=8.5, color=ACCENT3)

    out_path = OUT / "architecture-diagram.png"
    plt.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=BG, edgecolor="none")
    plt.close()
    print(f"Saved {out_path}")


if __name__ == "__main__":
    main()