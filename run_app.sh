#!/usr/bin/env bash
set -euo pipefail

# One-command launcher: installs (with self-heal) if needed, then starts Expo for phone.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is required but not found. Install Node.js and retry."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "❌ node is required but not found. Install Node.js and retry."
  exit 1
fi

# Ensure package.json is valid before doing anything.
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'));"

# Auto-install only when node_modules is missing.
if [[ ! -d node_modules ]]; then
  echo "▶ First run detected: installing dependencies"
  set +e
  npm install
  rc=$?
  set -e

  if [[ $rc -ne 0 ]]; then
    echo "⚠️ npm install failed; running self-heal installer"
    npm run doctor:install
  fi
else
  echo "✅ Dependencies already installed; skipping install"
fi

echo "▶ Starting Pillar in Expo Go tunnel mode"
npm run phone
