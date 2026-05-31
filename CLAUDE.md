# CLAUDE.md

Context for Claude when working in this repo.

## What this repo is

Personal fitness + nutrition tracker mobile app. Expo + React Native + shared backend tenant. Phase 3 boilerplate ships in this commit; Phase 4 (server tenant) + Phase 5 (parallel feature agents) follow.

## Required reading

- **Repo type**: `frontend-mobile`
- **Type spec**: `~/productivity/standards/frontend-mobile.md`
- **OTA system**: `~/productivity/standards/cloudflare-ota.md`
- **Pipeline**: `~/productivity/standards/app-development-pipeline.md` (10 phases, currently Phase 3)
- **Env files**: `~/productivity/standards/env-files.md`
- **Design (FROZEN)**: `~/productivity/hustle/liftfuel/design.md`
- **Hi-fi mockups**: `~/productivity/hustle/liftfuel/mockups/index.html` (40 screens, browser-viewable)

When proposing changes, follow design.md. **The design is FROZEN** — changes require ADR + agent re-scoping.

## Read order on session start

1. `README.md`
2. `CONVENTIONS.md`
3. `~/productivity/hustle/liftfuel/design.md` — full spec (visual system, IA, screens, data model, API, AI prompts, auth, tests)
4. `~/productivity/hustle/liftfuel/design.md` § 20 — Phase 5 partition (which agent owns what)
5. `packages/shared-types/src/index.ts` — DTOs locked
6. `apps/mobile/src/lib/api.ts` — fetch wrapper pattern

## Project layout

```
apps/mobile/
├── app/                          Expo Router pages (Agent A scaffolds, B-E add features)
├── src/
│   ├── lib/
│   │   ├── api.ts                fetch wrapper (DO NOT bypass this)
│   │   ├── auth.ts               signup/login/logout/token storage
│   │   └── theme.ts              (Agent A creates — palette tokens)
│   ├── components/               (Agent A scaffolds atoms, B-E add features)
│   ├── store/                    Zustand stores (auth, unit, workout, offline-queue)
│   └── styles/global.css
├── hooks/
│   └── useOTAUpdates.ts          OTA check on cold start
├── scripts/                      OTA build pipeline
├── certs/
│   └── certificate.pem           PUBLIC cert; safe to commit
├── app.config.js                 dynamic Expo config
├── eas.json                      3 EAS profiles
└── tailwind.config.ts            LiftFuel palette tokens per design.md

packages/shared-types/
└── src/index.ts                  DTOs (mobile ↔ server contract)
```

## Phase 5 agent partition (see design.md § 20)

| Agent | Scope | Branch |
|---|---|---|
| A | Shared contracts: api wrapper, auth, theme tokens, navigation skeleton, shared-types population | `feat/shared` |
| B | Auth + Onboarding (01-07) + Today (08) + Profile (37-40) | `feat/auth-today-profile` |
| C | Train + Active Workout — Routine/Week/Day CRUD (09-21) + Active workout flow (22-26) | `feat/train-workout` |
| D | Fuel — meal camera + day view + meal detail/edit (27-30) | `feat/fuel` |
| E | Stats + AI Chat — strength / volume / nutrition / correlation / ask (31-36) | `feat/stats-ai` |

**Agent A must complete + merge before B-E start.**

## Conventions (must follow)

- TypeScript strict (`noUncheckedIndexedAccess: true`)
- Functional components only (no class)
- Hooks for state (useState, useReducer) + Zustand for cross-component
- Server state via React Query (in Agent A's scaffold) — NOT in Zustand
- Expo Router for navigation (NOT react-navigation directly)
- NativeWind v4 for styling (NOT inline styles, NOT StyleSheet.create except animated values)
- `expo-secure-store` for tokens (NEVER AsyncStorage)
- All AI calls go through server (`apps/mobile/src/lib/api.ts` → server tenant → ai.askchimps.ai). NEVER call ai.askchimps.ai directly.
- All API calls use `src/lib/api.ts` (auto JWT + refresh). NEVER raw fetch.
- File-based routing only (Expo Router) — pages in `app/`
- Numerics use JetBrains Mono via `font-mono` Tailwind class (weights, reps, macros, durations)
- Tailwind class order: prettier-plugin-tailwindcss
- Branch model: `feat/<scope>` per agent (Phase 5) or `<type>/<slug>` general

## Auto-behaviors

- On new feature: identify which agent's scope it belongs to (design.md § 20); branch per agent
- On API call: use `api()` from `src/lib/api.ts`
- On auth-gated screen: check `isAuthed()` from `src/lib/auth.ts`
- On weight display: convert from canonical kg per user's unit pref; render in `font-mono`
- On new env var: update `apps/mobile/.env.example` + root `.env.example`

## Critical no-go's

- ❌ Calling `ai.askchimps.ai` directly from the app — go through server tenant
- ❌ Static bearer tokens in source — never
- ❌ AsyncStorage for tokens — use `expo-secure-store`
- ❌ Hardcoded API URLs — use `Constants.expoConfig.extra.apiUrl`
- ❌ Bypassing `api.ts` w/ raw fetch — auto-refresh + auth headers belong in one place
- ❌ Editing `app.config.js` `updates.url` — locked to ota-server pattern
- ❌ Adding to `eas.json` profiles arbitrary channels — only `development` / `preview` / `production`
- ❌ Cross-agent file edits in Phase 5 — respect partition (see design.md § 20)
- ❌ Storing weights in lb canonically — DB stores kg always, client converts for display
- ❌ Skipping PR detection on set save (server computes, client surfaces)
- ❌ Skipping screen render tests
- ❌ Skipping emulator screenshot in PR
- ❌ Bundling exercise GIFs in APK — fetch from `liftfuel-assets.r2.dev/exercises/<slug>.gif`
- ❌ Glassmorphism / Neumorphism — design is Soft-Dark Modern; rejected in design.md § 1
- ❌ Mixing icon libraries — `lucide-react-native` ONLY (not `@expo/vector-icons`)
- ❌ camelCase JSON over the wire for tokens / pagination / query params — use snake_case per design.md § 22.1 (matches VoxPense)

## Pitfalls (learned the hard way)

- **NativeWind v4 + Reanimated v3**: ensure `babel-plugin-react-native-reanimated` is LAST in plugin order (already correct in `babel.config.js`)
- **Expo Dev Client APK install**: must rebuild + reinstall when adding native deps (e.g., new Expo SDK plugin); JS-only changes hot-reload via Metro
- **OTA only ships JS**: Expo SDK upgrade OR `app.config.js` native config changes (icon, splash, permissions) REQUIRE a fresh EAS build
- **runtimeVersion**: locked to `"1.0.0"` in `app.config.js`. Bump only on native rebuild — bumping invalidates older OTA bundles, forcing fresh APK install
- **OTA cert path**: must be relative `./certs/certificate.pem` in `app.config.js`, not absolute
- **GIF playback**: use `expo-image` not `Image` from react-native — only `expo-image` autoplays animated GIFs reliably on Android
- **Drop set semantics**: TopSet + N drops (1-5), each drop has own weight + reps; no rest between drops in same set; design.md D-DROP locks this
- **Unit conversions**: DB stores kg only. Client converts to lb for display when `user.unit === 'LB'`. Never persist lb values; `LogSetDto.weightKg` always expects kg.
- **e1RM formula**: Epley `weightKg * (1 + reps/30)`. PR detector window = last 90d, warm-ups excluded.
- **Today resolver**: `(today - routine.startDate)/7 % cycleLength → week → dayOfWeek → Day`. Mon = dayIndex 0. Server returns resolved Day via `/routines/:id/today`.

## Where related stuff lives

- Planning + ADRs: `~/productivity/hustle/liftfuel/`
- Design (FROZEN): `~/productivity/hustle/liftfuel/design.md`
- Hi-fi mockups: `~/productivity/hustle/liftfuel/mockups/index.html`
- Server tenant (Phase 4): `~/Projects/server/src/apps/liftfuel/v1/`
- OTA server: https://github.com/yashguptadeveloper/ota-server
- Shared backend repo: https://github.com/yashguptadeveloper/server

## Operating principles

- Design is canonical — code matches design, not the other way
- Partition discipline — Phase 5 agents own non-overlapping scopes
- Pipeline phases gate progression — no skipping phases
- Emulator before user — every feature validated on Android emulator before APK ships
- User before production — user review approval required before prod deploy
- Server-canonical data — no SQLite/local DB; all reads/writes via tenant API
