#!/usr/bin/env bash
# Regenerate the full Glancer AI Maintenance Guide PDF (diagrams + screenshots + PDF).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "▸ Generating architecture diagram…"
python3 scripts/generate-architecture-diagram.py

echo "▸ Generating file-tree diagram…"
python3 scripts/generate-file-tree-diagram.py

echo "▸ Capturing screenshots (requires dev server on :5184)…"
if curl -sf http://localhost:5184/ >/dev/null 2>&1; then
  node scripts/capture-screenshots.mjs http://localhost:5184
else
  echo "  ⚠ Dev server not running — using existing screenshots in docs/guide-assets/screenshots/"
fi

echo "▸ Building PDF guide…"
python3 scripts/generate-maintenance-guide.py

echo "✅ Done: docs/Glancer-AI-Maintenance-Guide.pdf"