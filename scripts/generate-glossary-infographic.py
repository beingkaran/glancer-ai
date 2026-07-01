#!/usr/bin/env python3
"""
Generate a Google Discover–ready glossary infographic (1200×675 JPG).

Discover requires raster images ≥1200px wide in ~16:9. This script reads live
term counts from the merged glossary data and writes public/glossary-infographic.jpg.
Run: python3 scripts/generate-glossary-infographic.py
"""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "glossary-infographic.jpg"

W, H = 1200, 675
BG = "#0a0f1e"
PANEL = "#121a2e"
BORDER = "#2a3550"
TEXT = "#e8edf7"
MUTED = "#8b9ab8"
WHITE = "#ffffff"

GROUPS = [
    ("Observability Core", "#06b6d4", [
        "Fundamentals", "Metrics", "Logging", "Tracing", "Visualization", "Standards & Tools",
    ]),
    ("Operations & Reliability", "#a855f7", [
        "AIOps", "APM", "Incident", "Reliability", "IT Operations",
    ]),
    ("Infrastructure & Platform", "#3b82f6", [
        "Kubernetes", "Containers", "Cloud Native", "Cloud Providers",
        "Infrastructure", "Compute & Runtime", "Networking", "Service Mesh",
    ]),
    ("Engineering & Data", "#f97316", [
        "DevOps & CI/CD", "Architecture", "Distributed Systems", "Databases",
        "Data & Streaming", "Data Formats", "Security & SIEM",
    ]),
    ("AI & Experience", "#22c55e", ["AI/ML", "Digital Experience"]),
]

ICONS = {
    "AI/ML": "🧠", "AIOps": "🤖", "APM": "📊", "Architecture": "🏛",
    "Cloud Native": "☁", "Cloud Providers": "⛅", "Compute & Runtime": "⚙",
    "Containers": "📦", "Data & Streaming": "🌊", "Data Formats": "📄",
    "Databases": "🗃", "DevOps & CI/CD": "🔧", "Digital Experience": "🖥",
    "Distributed Systems": "🕸", "Fundamentals": "📚", "IT Operations": "🛠",
    "Incident": "🚨", "Infrastructure": "🏗", "Kubernetes": "☸",
    "Logging": "📋", "Metrics": "📈", "Networking": "🌐", "Reliability": "🛡",
    "Security & SIEM": "🔒", "Service Mesh": "🔗", "Standards & Tools": "🧰",
    "Tracing": "🧵", "Visualization": "📉",
}

SAMPLES = {
    "Fundamentals": "SLO · SLI", "Metrics": "PromQL", "Logging": "LogQL",
    "Tracing": "Spans", "Visualization": "Grafana", "Standards & Tools": "OTel",
    "AIOps": "Anomaly", "APM": "Latency", "Incident": "Postmortem",
    "Reliability": "Chaos", "IT Operations": "ITSM",
    "Kubernetes": "Pods", "Containers": "Docker", "Cloud Native": "GitOps",
    "Cloud Providers": "AWS/GCP", "Infrastructure": "Capacity", "Compute & Runtime": "eBPF",
    "Networking": "TLS", "Service Mesh": "Istio",
    "DevOps & CI/CD": "CI/CD", "Architecture": "Microservices",
    "Distributed Systems": "Consensus", "Databases": "OLTP", "Data & Streaming": "Kafka",
    "Data Formats": "Protobuf", "Security & SIEM": "SIEM",
    "AI/ML": "RAG · LLM", "Digital Experience": "Core Web Vitals",
}


def load_counts() -> tuple[int, dict[str, int]]:
    js = r"""
    import { GLOSSARY_TERMS as B } from './src/data/allGlossary.js';
    import { EXTRA_GLOSSARY_TERMS as E } from './src/data/extraGlossary.js';
    import { EXTRA_GLOSSARY_BATCH4 as B4 } from './src/data/extraGlossaryBatch4.js';
    const seen = new Set();
    const key = t => (t.term||'').trim().toLowerCase();
    const counts = {};
    let total = 0;
    for (const arr of [B, E, B4]) {
      for (const t of arr) {
        const k = key(t);
        if (!k || seen.has(k)) continue;
        seen.add(k); total++;
        counts[t.category] = (counts[t.category] || 0) + 1;
      }
    }
    console.log(JSON.stringify({ total, counts }));
    """
    proc = subprocess.run(
        ["node", "--input-type=module", "-e", js],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    data = json.loads(proc.stdout.strip())
    return data["total"], data["counts"]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def rounded_rect(draw, xy, fill, outline=None, radius=10):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=1)


def main():
    total, counts = load_counts()
    cat_count = len(counts)
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    title_f = font(26, True)
    sub_f = font(14)
    group_f = font(11, True)
    cell_name_f = font(10, True)
    cell_sub_f = font(8)
    flow_f = font(10, True)
    footer_f = font(11)

    # Header gradient band
    for x in range(W):
        t = x / W
        r = int(10 + t * 30)
        g = int(15 + t * 20)
        b = int(30 + t * 50)
        draw.line([(x, 0), (x, 78)], fill=(r, g, b))

    draw.text((W // 2, 22), "AI, AIOps & Observability Glossary Map", font=title_f, fill=WHITE, anchor="mm")
    draw.text(
        (W // 2, 52),
        f"{total:,} terms  ·  {cat_count} categories  ·  glancerai.com/glossary",
        font=sub_f,
        fill=MUTED,
        anchor="mm",
    )

    # Category grid — one band per group
    y = 86
    cell_h = 68
    gap = 6
    margin_x = 18
    usable_w = W - margin_x * 2

    for group_label, color, cats in GROUPS:
        n = len(cats)
        cols = n if n <= 6 else (4 if n == 7 else 8)
        cell_w = (usable_w - (cols - 1) * gap) // cols
        rows = (n + cols - 1) // cols

        rounded_rect(draw, (margin_x, y, W - margin_x, y + 16), fill=_tint(color), outline=color, radius=6)
        draw.text((margin_x + 8, y + 8), group_label.upper(), font=group_f, fill=color, anchor="lm")
        group_total = sum(counts.get(c, 0) for c in cats)
        draw.text((W - margin_x - 8, y + 8), f"{group_total:,}", font=group_f, fill=MUTED, anchor="rm")
        y += 20

        for i, cat in enumerate(cats):
            col = i % cols
            row = i // cols
            cx = margin_x + col * (cell_w + gap)
            cy = y + row * (cell_h + gap)
            _draw_cell(draw, cx, cy, cell_w, cell_h, cat, counts.get(cat, 0), cell_name_f, cell_sub_f)

        y += rows * (cell_h + gap) + 4

    # Bottom flow strip
    flow_y = H - 58
    rounded_rect(draw, (margin_x, flow_y, W - margin_x, H - 14), fill=PANEL, outline=BORDER, radius=10)
    flows = [
        ("Metrics → Logs → Traces → Observability → AIOps", "#06b6d4"),
        ("Data → Model → Inference → Agents → Value", "#22c55e"),
    ]
    for i, (text, col) in enumerate(flows):
        draw.text((margin_x + 14, flow_y + 16 + i * 18), text, font=flow_f, fill=col, anchor="lm")

    draw.text((W // 2, H - 6), "Glancer AI · Free glossary for engineers & SREs", font=footer_f, fill=MUTED, anchor="mb")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "JPEG", quality=92, optimize=True)
    print(f"✓ glossary-infographic.jpg ({W}×{H}, {total:,} terms) → {OUT}")


def _tint(hex_color: str) -> str:
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return f"#{max(0, r // 6):02x}{max(0, g // 6):02x}{max(0, b // 5):02x}"


def _draw_cell(draw, x, y, w, h, cat, count, name_f, sub_f):
    rounded_rect(draw, (x, y, x + w, y + h), fill=PANEL, outline=BORDER, radius=8)
    icon = ICONS.get(cat, "📘")
    draw.text((x + w // 2, y + 14), icon, font=name_f, fill=TEXT, anchor="mm")
    short = cat if len(cat) <= 14 else cat[:12] + "…"
    draw.text((x + w // 2, y + 30), short, font=name_f, fill=TEXT, anchor="mm")
    draw.text((x + w // 2, y + 44), f"{count} terms", font=sub_f, fill=MUTED, anchor="mm")
    sample = SAMPLES.get(cat, "")
    if sample:
        draw.text((x + w // 2, y + 58), sample, font=sub_f, fill="#06b6d4", anchor="mm")


if __name__ == "__main__":
    main()