#!/usr/bin/env bash
set -euo pipefail

# Pillar project runner
# Modes:
# - default: install + typecheck + smoke-run app scripts
# - --quick: install + typecheck only
# - --phone: start Expo in tunnel mode for phone preview

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is required but not found. Install Node.js (includes npm) and retry."
  exit 1
fi

check_conflict_markers() {
  local markers
  markers=$(rg -n "^(<<<<<<<|=======|>>>>>>>)" . -g '!*.png' || true)
  if [[ -n "$markers" ]]; then
    echo "❌ Git conflict markers found. Resolve these before running:"
    echo "$markers"
    exit 1
  fi
}

validate_package_json() {
  if command -v node >/dev/null 2>&1; then
    node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('✅ package.json JSON is valid')"
  else
    echo "⚠️ node not found for JSON validation; skipping package.json parse check"
  fi
}

install_with_self_heal() {
  echo "▶ Installing dependencies"

  set +e
  npm install
  local rc=$?
  set -e

  if [[ $rc -eq 0 ]]; then
    echo "✅ npm install succeeded"
    return 0
  fi

  echo "⚠️ npm install failed (exit ${rc}). Attempting automatic registry/proxy self-heal..."

  npm config set registry https://registry.npmjs.org || true
  npm config delete proxy || true
  npm config delete https-proxy || true
  npm cache clean --force || true

  set +e
  npm install --registry=https://registry.npmjs.org
  rc=$?
  set -e

  if [[ $rc -ne 0 ]]; then
    echo "❌ npm install still failing after self-heal."
    echo "Run this locally and retry:" 
    echo "   npm run doctor:install"
    exit $rc
  fi

  echo "✅ npm install succeeded after self-heal"
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  cat <<'USAGE'
Usage:
  ./run_everything.sh            # full run (preflight + install + checks + smoke run of all scripts)
  ./run_everything.sh --quick    # preflight + install + typecheck only
  ./run_everything.sh --phone    # preflight + launch Expo for phone preview (tunnel mode)

One-command self-heal install:
  npm run doctor:install

Notes:
- Scripts like start/web/android/ios are long-running Expo processes.
- This script uses timeout-based smoke runs to confirm they start without hanging forever.
USAGE
  exit 0
fi

echo "▶ Running preflight checks"
check_conflict_markers
validate_package_json

if [[ "${1:-}" == "--phone" ]]; then
  echo "▶ Launching Expo tunnel for phone preview"
  install_with_self_heal
  npm run phone
  exit 0
fi

install_with_self_heal

echo "▶ Refreshing transitive dependency tree"
npm run deps:refresh

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
