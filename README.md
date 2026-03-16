# Pillar — Premium Home Workout Tracker

Pillar is an Expo + React Native + TypeScript app for daily bodyweight training with a premium, minimalist visual system. It is optimized for fast everyday logging and designed to look polished from first launch.

## MVP features included

- Premium onboarding flow with exercise + goals + reminders setup.
- Expo Router navigation with native-feeling bottom tabs.
- Local SQLite schema for exercises, workout entries, daily summaries, goals, media entries, quotes.
- Signature quote pill at top of Today screen with subtle motion.
- Fast workout logging (reps, sets, duration) and daily volume scoring.
- Calendar heat system with green/yellow/red performance buckets.
- Progress dashboard with trend highlights, best/worst days, consistency framing.
- Media timeline with photo/video importing for progress tracking.
- Premium-ready locked insight card and billing service interface.
- Backend-ready adapter interface with local implementation and remote placeholder.

## Tech stack

- Expo SDK 54
- React Native + TypeScript
- Expo Router
- expo-sqlite
- expo-image-picker

## Quick start

Run the app with one command (recommended):
```bash
./run_app.sh
```

If `package.json` gets broken by a bad merge/edit, `./run_app.sh` now auto-restores from `package.clean.json` and continues.

Or with npm script:
```bash
npm run app:run
```

Manual flow:
```bash
npm install
npm run start
```

Run everything (preflight + install + checks + script smoke runs):
```bash
./run_everything.sh
```

Preflight checks (now built into the script):
- Detect unresolved git conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
- Validate `package.json` JSON syntax before install

Then open with:
- iOS Expo Go app
- Android Expo Go app
- or web via `npm run web`

Phone preview command (stable over different networks):
```bash
npm run phone
```

Dependency deprecation clean-up command:
```bash
npm install && npm run deps:refresh
```

If install fails due registry/proxy issues, run:
```bash
npm run doctor:install
```

## Project structure

- `app/` — routes and screens
- `components/` — reusable premium UI primitives
- `lib/` — SQLite initialization + shared app state logic
- `services/` — backend and billing interfaces + local implementations
- `constants/` — theme and editable scoring configuration
- `data/` — starter exercises and quote dataset

## SQLite schema (local MVP)

- `exercises`
- `workout_entries`
- `daily_summaries`
- `goals`
- `media_entries`
- `quotes`
- `app_meta`

## Scoring logic

Daily score is centralized in `constants/scoring.ts` and used to map performance buckets:
- Green: top-tier day
- Yellow: middle day
- Red: weakest day

Adjustable thresholds and weight variables are in one file to keep scoring transparent.

## Architecture notes

- `BackendAdapter` defines data operations for future sync.
- `LocalBackendAdapter` currently powers the app through SQLite.
- `RemoteBackendAdapter` is a typed placeholder stub for future implementation.
- `BillingService` and `LocalBillingService` prepare premium feature gating.

## Later upgrade path for widgets, backend sync, and payments

### Widgets
- Keep core state read/write through service adapters so widget timelines can read summary tables.
- Add Expo dev build + native widget modules later without rewriting business logic.

### Backend sync
- Replace or augment `LocalBackendAdapter` with a Supabase/Postgres or Firebase adapter.
- Add conflict handling and background sync policies while preserving existing interfaces.

### Payments
- Replace `LocalBillingService` with RevenueCat for App Store subscriptions.
- Map `PremiumFeature` flags to entitlements and unlock advanced insight modules.

## Notes

This MVP is intentionally Expo Go compatible for rapid testing. Native-only widget modules and full subscription SDK wiring are deferred, but architecture seams are already in place.


## Merge conflict recovery (if you see <<<<<< / ====== / >>>>>>)

If your files contain conflict markers, resolve them before running the app:

```bash
rg -n "^(<<<<<<<|=======|>>>>>>>)" README.md package.json run_everything.sh
```

If markers are found and you want to keep the SDK 54 + phone preview setup, restore these files from the latest committed version:

```bash
git checkout -- package.json run_everything.sh README.md
```

Then install and run:

```bash
npm install
npm run phone
```

## Merge helper (accept incoming + run)

If you are in a merge conflict and want to keep **incoming changes** everywhere, run:

```bash
./accept_incoming_and_run.sh
```

This will accept incoming versions for all conflicted files, stage them, verify `package.json`, and launch Expo Go with the existing one-command runner.

