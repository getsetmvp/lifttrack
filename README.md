# liftfuel

> Train smart. Eat smarter. Log every rep, snap every meal, see why progress moves.

## Status

| Field | Value |
|---|---|
| Type | `frontend-mobile` (internal monorepo: `apps/mobile/` day-1, future `apps/web/`) |
| Visibility | Private |
| Status | Phase 5 (~70% complete). End-to-end walkable on emulator. Workout-w/-exercises blocked on R2 asset seed. |
| Branch model | **direct-to-main, NO PRs** (user lock 2026-06-01) |
| Expo SDK | **54** (locked; matches Expo Go installed on emulator-5554) |
| Backend tenant | `liftfuel` on `https://server.getsetmvp.com/liftfuel/v1/*` |
| OTA system | Cloudflare via [yashguptadeveloper/ota-server](https://github.com/yashguptadeveloper/ota-server) — NOT EAS Update |
| Distribution | EAS Build → APK day-1 (Play Store internal testing later) |
| Owner | Yash |
| Founded | 2026-05-31 |
| Last verified on emulator | 2026-06-01 (auth → onboarding → today → tabs → day creation) |

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

## What's live (verified)

| Surface | State |
|---|---|
| Auth: welcome / login / register w/ password strength | ✅ live |
| Onboarding: unit → goal → body | ✅ live, persists to `/users/me` + `/body-metrics` |
| Today tab (live data) | ✅ live |
| Train tab + routines/weeks/days list+detail+new | ✅ live (UI), needs exercise catalog for full UX |
| Active workout + set logger sheet + complete | ✅ live (UI), needs exercises |
| Fuel tab — 7 meal slots + macro rings + camera FAB | ✅ live (UI), camera flow needs device |
| Stats landing + AI chat (live `/ai/ask`) | ✅ live |
| Profile + settings + body metrics + about | ✅ live |
| Server tenant (signup/login/refresh/me/days/weeks/routines/workouts/meals/analytics/ai) | ✅ live |

## What's NOT live yet (P1 backlog in planning tasks.md)

- Exercise catalog (R2 bucket creation + 82 GIF upload + seed Exercise table)
- Meal camera flow (needs real device)
- Exercise picker w/ search
- Drop-set sheet (full N-drop UI)
- Rest-timer overlay route
- Stats sub-pages: strength / volume / nutrition / correlation
- Light theme (locked deferred per design D-LIT)
- Jest + RNTL tests
- Sentry RN

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
| Framework | Expo SDK 53 (managed) + React Native 0.79 |
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
