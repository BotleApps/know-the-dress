#!/usr/bin/env bash
set -euo pipefail

echo "✦ StyleSift — local dev"
echo ""

# Check Node
if ! command -v node &>/dev/null; then
  echo "✗ Node.js not found. Install it: https://nodejs.org"
  exit 1
fi

# Install deps if needed
if [ ! -d "node_modules" ]; then
  echo "→ Installing dependencies…"
  npm install
  echo ""
fi

echo "→ Starting Vite dev server"
echo "  Open: http://localhost:5173"
echo ""
echo "  Note: /api/log calls will 404 locally (no side-effects — the UI works fine)."
echo "  For full function testing, run:  netlify dev --offline"
echo ""
npx vite
