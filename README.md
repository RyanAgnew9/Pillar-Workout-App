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

- Expo SDK 53
- React Native + TypeScript
- Expo Router
- expo-sqlite
- expo-image-picker

## Quick start

```bash
npm install
npm run start
```

Then open with:
- iOS Expo Go app
- Android Expo Go app
- or web via `npm run web`

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
