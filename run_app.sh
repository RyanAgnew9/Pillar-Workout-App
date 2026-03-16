#!/usr/bin/env bash
set -euo pipefail

# One-command launcher for beginners.
# It auto-restores a known-good package.json if your local file is malformed,
# installs dependencies (with self-heal), then starts Expo tunnel for Expo Go.

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

validate_or_restore_package_json() {
  if node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'));" >/dev/null 2>&1; then
    echo "✅ package.json is valid"
    return 0
  fi

  echo "⚠️ package.json is malformed. Restoring known-good template (package.clean.json)."
  if [[ -f package.clean.json ]]; then
    cp package.clean.json package.json
  else
    echo "❌ package.clean.json is missing; cannot auto-recover package.json"
    exit 1
  fi

  node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'));" >/dev/null
  echo "✅ package.json restored"
}

install_with_self_heal() {
  if [[ -d node_modules ]]; then
    echo "✅ Dependencies already installed; skipping install"
    return 0
  fi

  echo "▶ First run detected: installing dependencies"
  set +e
  npm install
  rc=$?
  set -e

  if [[ $rc -eq 0 ]]; then
    echo "✅ npm install succeeded"
    return 0
  fi

  echo "⚠️ npm install failed; running self-heal installer"
  npm run doctor:install
}

validate_or_restore_package_json
install_with_self_heal

echo "▶ Starting Pillar in Expo Go tunnel mode"
npm run phone
