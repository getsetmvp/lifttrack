# liftfuel

> Train smart. Eat smarter. Log every rep, snap every meal, see why progress moves.

## Status

| Field | Value |
|---|---|
| Type | `frontend-mobile` (internal monorepo: `apps/mobile/` day-1, future `apps/web/`) |
| Visibility | Private |
| Status | **Phase 5 ~95% complete · entering Phase 7 (EAS preview APK).** Daily-driveable on Expo Go on AVD + Vivo V2437. Workout / meal / AI flows live end-to-end. 81-exercise catalog seeded. |
| Pipeline target | **Play Store launch in ~14 days** — see `~/Productivity/hustle/liftfuel/play-store-launch.md` |
| Branch model | **direct-to-main, NO PRs** (mobile only; user lock 2026-06-01). Server is PR-only / squash-merge. |
| Expo SDK | **54** (locked; matches Expo Go on emulator) |
| Stack | Expo Router v6 (file-based) · React Native 0.81 · NativeWind v4 · Zustand · TanStack Query v5 · expo-secure-store · `react-native-screens` w/ `enableScreens(false)` JS stack |
| Backend tenant | `liftfuel` on `https://server.getsetmvp.com/liftfuel/v1/*` |
| OTA system | Cloudflare via [yashguptadeveloper/ota-server](https://github.com/yashguptadeveloper/ota-server) — NOT EAS Update |
| Distribution | EAS Build → preview APK (next) → Play Store internal track |
| Test user | `loadtest-1780313214756@liftfuel.dev` / `LoadTest2026Aa` (45 workouts, 48 PRs seeded) |
| Owner | Yash |
| Founded | 2026-05-31 |
| Last verified | 2026-06-01 — full app walk: auth + onboarding + today + train + active workout (start/log set/rest timer/finish) + fuel + camera/AI parse + stats + profile, all live on phone via Expo Go |

## Snapshot for fresh sessions

Authoritative state lives in **`~/Productivity/hustle/liftfuel/STATE.md`** (auto-updated each session). The launch plan lives in **`~/Productivity/hustle/liftfuel/play-store-launch.md`**. Read those two first.

## Quick run (Android emulator)

```bash
# Terminal 1 — Metro bundler
cd ~/Projects/liftfuel/apps/mobile
EXPO_NO_INTERACTIVE=1 npx expo start --port 8082 --host lan

# Terminal 2 — load app in Expo Go on emulator
# Replace <emu> with `emulator-5554` (or `adb devices` to find yours)
adb -s <emu> reverse tcp:8082 tcp:8082
adb -s <emu> shell am force-stop host.exp.exponent
adb -s <emu> shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8082"

# Force-stop + relaunch to pick up code changes (Expo Go caches manifest)
```

## What's live (verified 2026-06-01)

| Surface | State |
|---|---|
| Auth: welcome / login / register w/ password strength | ✅ live |
| Onboarding: unit → goal → body | ✅ live |
| Today: routine subtitle w/ Day-N · workout-completed state · mini-rings · streak | ✅ live |
| Train: active routine, library counts, routines/weeks/days list+detail+new | ✅ live |
| Active workout: timer + per-set kg/lb numpad + drop-set sheet + rest-timer auto-trigger + PR detection | ✅ live |
| Exercise picker (search + muscle filter) | ✅ live; GIF thumbs pending R2 |
| Fuel: 7 slots, macro ring, date nav, camera FAB | ✅ live |
| Camera: capture/gallery + 640px shrink + AI parse-meal → meal detail | ✅ live; photo upload pending server endpoint |
| Stats: landing + strength/volume/nutrition/correlation sub-pages + AI ask | ✅ live (sub-pages w/ empty-state placeholders for charts) |
| Profile + edit + body-metrics (chart + entries) + settings + about | ✅ live |
| Pull-to-refresh on 10 list screens · safeBack helper on 28 screens · tab tap resets · slide_no animation w/ DarkTheme | ✅ live |
| Server tenant (auth/users/days/weeks/routines/workouts/meals/exercises/analytics/ai) | ✅ live; 81-entry catalog seeded |

## What's NOT live yet (Play Store launch blockers, ordered in `play-store-launch.md`)

- R2 bucket + exercise GIFs + meal photo upload (Stage 1)
- Password reset + account deletion server + mobile (Stage 1-2)
- Sentry RN crash tracking (Stage 3)
- Jest + RNTL sanity tests (Stage 3)
- Privacy + ToS hosted URLs + linked (Stage 4)
- EAS Build preview + production AAB (Stage 5)
- Play Console listing + AAB upload (Stage 6)
- 14-day internal + closed testing track validation (Stage 7-8)
- Light theme (deferred v1.1 per D-LIT lock)

## What it is

Personal fitness + nutrition tracker that **correlates** the two: log every rep (including drop sets, decimal weights, kg/lb), snap every meal for AI-powered macro analysis, and surface **why** your progress is moving up or down.

6 features per [design.md](../../productivity/hustle/liftfuel/design.md):

1. Workout planning — 3-tier reusable Day / Week / Routine hierarchy w/ cycle modes (LOOP / SEQUENCE / WEEKLY_PICK).
2. Workout logging — fast set entry, decimal weights, drop sets, PR detection (Epley e1RM, 90d window).
3. Exercise reference — animated GIFs hosted on Cloudflare R2 public bucket.
4. Nutrition capture — photo → AI vision → macros across 7 meal slots.
5. Progress analysis — per-lift e1RM curves, weekly volume, macro adherence, nutrition × strength correlation.
6. AI Q&A — natural-language over user's data ("why did bench dip last week?").

## Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 54 (managed) + React Native 0.81 |
| Language | TypeScript strict |
| Routing | Expo Router (file-based) |
| Styling | NativeWind v4 (Tailwind) + Soft-Dark Modern palette (teal + orange) |
| State | Zustand (UI / workout queue) + React Query (server state, Phase 5) |
| Auth storage | `expo-secure-store` (NOT AsyncStorage) |
| Camera | `expo-camera` (meal photos) |
| Images / GIFs | `expo-image` (GIF playback for exercise reference) |
| Local notif | `expo-notifications` (rest timer alerts) |
| Charts | `react-native-svg` + custom Skia renderer (Phase 5 decides Skia vs Victory) |
| API client | hand-typed fetch wrapper, `src/lib/api.ts` |
| Backend | tenant `liftfuel` in shared [yashguptadeveloper/server](https://github.com/yashguptadeveloper/server) |
| AI | server-proxied via `ai.askchimps.ai` (meal vision + Q&A) |
| Build | EAS Build (3 profiles: development / preview / production) |
| OTA | Cloudflare Worker + R2 via `ota-server` |
| Error tracking | Sentry React Native (Phase 5) |

## Build profiles

| Profile | Audience | Build command |
|---|---|---|
| development | me + 3 testers | `eas build --profile development -p android` |
| preview | beta testers | `eas build --profile preview -p android` |
| production | Play Store users | `eas build --profile production -p android` |

## Distribution

| Stage | Audience | Mechanism |
|---|---|---|
| Local dev | me | Expo Dev Client + USB / emulator |
| Preview APK | beta | EAS download URL |
| Play Store internal | invited testers | EAS Submit |
| Production | public | Play Console promotion |

## OTA updates

```bash
git push origin main          # → preview channel auto-publishes
git tag v1.0.1 && git push --tags    # → production channel auto-publishes
```

Apps fetch on next cold start. No native rebuild for JS-only changes.

## Repository layout

```
liftfuel/
├── apps/
│   ├── mobile/                  Expo app (day-1)
│   │   ├── app/                 Expo Router pages
│   │   ├── src/
│   │   │   ├── lib/             api.ts, auth.ts, theme tokens
│   │   │   ├── components/      (Phase 5 fills)
│   │   │   ├── store/           Zustand stores (Phase 5)
│   │   │   └── styles/          global.css for NativeWind
│   │   ├── hooks/useOTAUpdates.ts
│   │   ├── scripts/             OTA build + upload
│   │   ├── certs/certificate.pem (PUBLIC, safe to commit)
│   │   ├── app.config.js        dynamic Expo config
│   │   ├── eas.json             3 EAS profiles
│   │   ├── tailwind.config.ts   LiftFuel palette per design.md
│   │   └── package.json
│   └── web/                     (deferred; planned for v1.1)
├── packages/
│   └── shared-types/            TS DTOs shared mobile ↔ server
├── .github/workflows/
│   └── ota-publish.yaml         push to main → preview / tag v* → production
├── README.md                    this file
├── CLAUDE.md                    Claude session primer
├── CONVENTIONS.md               repo-local rules
└── package.json                 pnpm workspaces root
```

## Quick start

```bash
# Prereqs: Node 20+, pnpm 9+, Expo account (for EAS), Android Studio or USB Android device
cd ~/Projects/liftfuel
pnpm install
cd apps/mobile
cp .env.example .env.dev       # fill EXPO_PUBLIC_API_URL + Cloudflare creds
pnpm dev                        # Expo Metro (requires Dev Client APK first install)
```

First-time Dev Client install:
```bash
cd apps/mobile
npx eas build --profile development --platform android
# install APK → daily dev via `pnpm dev`
```

## Env files

Three-file convention per [`~/productivity/standards/env-files.md`](../../productivity/standards/env-files.md):

| File | Source | Committed? | Purpose |
|---|---|---|---|
| `.env.example` | this repo | ✅ | Placeholder contract |
| `.env.dev` | local laptop | ❌ | Local dev secrets (fresh-random) |
| `.env.prod` | mirror of canonical | ❌ | Local mirror of prod secrets, **1Password is canonical** |

`EXPO_PUBLIC_*` vars are baked into the bundle (visible to clients) — never put server-side secrets there.

## Adding a feature

1. Read `~/productivity/hustle/liftfuel/design.md` (locked spec)
2. Identify which Phase 5 agent's scope the feature belongs to (see § 20 partition)
3. Branch `feat/<scope>`
4. Implement w/ unit tests + screen render tests
5. Run on Android emulator + take screenshot for PR
6. Open PR + merge
7. CD auto-publishes OTA to preview channel

## Standards followed

- `~/productivity/standards/frontend-mobile.md` — repo type spec
- `~/productivity/standards/cloudflare-ota.md` — OTA system
- `~/productivity/standards/env-files.md` — env file convention
- `~/productivity/standards/app-development-pipeline.md` — 10-phase build process
- `~/productivity/standards/hi-fi-mockups.md` — design output format

## Related

- **Planning + design + ADRs**: `~/productivity/hustle/liftfuel/` (private)
- **Hi-fi mockups** (40 phone frames, browser-viewable): `~/productivity/hustle/liftfuel/mockups/index.html`
- **Server tenant** (post-Phase 4): `~/Projects/server/src/apps/liftfuel/v1/`
- **Shared OTA infra**: [yashguptadeveloper/ota-server](https://github.com/yashguptadeveloper/ota-server)
- **Existing MVP** (reference only, will be archived): `~/Apps/liftfuel/`
