#!/usr/bin/env bash
set -euo pipefail

# Pillar project runner
# Runs all npm scripts defined in package.json in a practical order.
# For Expo start-like scripts that run indefinitely, we execute a short smoke run via timeout.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is required but not found. Install Node.js (includes npm) and retry."
  exit 1
fi

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  cat <<'USAGE'
Usage:
  ./run_everything.sh            # full run (install + checks + smoke run of all scripts)
  ./run_everything.sh --quick    # install + typecheck only

Notes:
- Scripts like start/web/android/ios are long-running Expo processes.
- This script uses timeout-based smoke runs to confirm they start without hanging forever.
USAGE
  exit 0
fi

echo "▶ Installing dependencies"
npm install

echo "▶ Running TypeScript typecheck"
npm run typecheck

if [[ "${1:-}" == "--quick" ]]; then
  echo "✅ Quick mode complete"
  exit 0
fi

if command -v timeout >/dev/null 2>&1; then
  TIMEOUT_CMD=(timeout 20s)
else
  echo "⚠️ 'timeout' command not found. Falling back to 20s background/poll kill strategy."
  TIMEOUT_CMD=()
fi

smoke_run() {
  local script_name="$1"
  echo "▶ Smoke-running npm script: ${script_name}"

  if [[ ${#TIMEOUT_CMD[@]} -gt 0 ]]; then
    set +e
    "${TIMEOUT_CMD[@]}" npm run "${script_name}"
    local rc=$?
    set -e

    # timeout exits 124 when command is still running at timeout boundary; that's expected here.
    if [[ $rc -ne 0 && $rc -ne 124 ]]; then
      echo "❌ Script '${script_name}' failed with exit code ${rc}"
      exit $rc
    fi
  else
    npm run "${script_name}" >/tmp/pillar-${script_name}.log 2>&1 &
    local pid=$!
    sleep 20
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
      wait "$pid" 2>/dev/null || true
    fi
  fi

  echo "✅ Smoke run finished for: ${script_name}"
}

smoke_run start
smoke_run web
smoke_run android
smoke_run ios

echo "🎉 All project scripts completed (or passed smoke-run checks)."
