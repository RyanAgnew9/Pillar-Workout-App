#!/usr/bin/env bash
set -euo pipefail

# Use this during an active merge conflict when you want to keep all incoming changes.
# It accepts incoming (theirs) for every conflicted file, stages them, validates package.json,
# then starts the app launcher.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ This script must run inside a git repository."
  exit 1
fi

if ! git rev-parse -q --verify MERGE_HEAD >/dev/null 2>&1; then
  echo "ℹ️ No active merge detected. Nothing to resolve."
  echo "▶ Starting app directly..."
  exec ./run_app.sh
fi

CONFLICTED_FILES=$(git diff --name-only --diff-filter=U)
if [[ -z "${CONFLICTED_FILES}" ]]; then
  echo "ℹ️ Merge in progress, but no conflicted files were found."
else
  echo "▶ Accepting incoming changes for conflicted files:"
  echo "${CONFLICTED_FILES}"
  git checkout --theirs -- ${CONFLICTED_FILES}
  git add ${CONFLICTED_FILES}
fi

if rg -n "^(<<<<<<<|=======|>>>>>>>)" . >/dev/null 2>&1; then
  echo "❌ Conflict markers still found after accepting incoming changes."
  rg -n "^(<<<<<<<|=======|>>>>>>>)" .
  exit 1
fi

if command -v node >/dev/null 2>&1; then
  node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'));"
  echo "✅ package.json is valid"
fi

echo "✅ Incoming changes accepted."
echo "ℹ️ If this merge is ready, finish it with: git commit"
echo "▶ Launching app..."
exec ./run_app.sh

