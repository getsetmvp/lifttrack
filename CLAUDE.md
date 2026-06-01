# CLAUDE.md

Context for Claude when working in this repo.

## What this repo is

Personal fitness + nutrition tracker mobile app. Expo + React Native + shared backend tenant. **Phase 5 ~95% complete · entering Phase 7 (EAS preview APK).** Currently in Play Store launch sequence — see `~/Productivity/hustle/liftfuel/play-store-launch.md`.

## Required reading on session start (IN THIS ORDER)

1. **`~/Productivity/hustle/liftfuel/state.md`** — last-known-state snapshot (what works now, what doesn't, test creds, emulator/device IDs)
2. **`~/Productivity/hustle/liftfuel/play-store-launch.md`** — current active plan (9 stages to Play Store · DOD per step)
3. `~/Productivity/hustle/liftfuel/tasks.md` — ordered todos mirroring launch plan
4. `README.md` (this repo) — repo state + quick run
5. `CONVENTIONS.md` (this repo) — repo-local rules
6. `~/Productivity/hustle/liftfuel/design.md` — FROZEN spec (visual system, IA, screens, data model, API, AI prompts)
7. `~/Productivity/hustle/liftfuel/mockup-audit.md` — per-screen pixel-parity sign-off
8. `packages/shared-types/src/index.ts` — DTO contract (mobile ↔ server)
9. `apps/mobile/src/lib/api.ts` — fetch wrapper (auto JWT refresh)

The design is FROZEN — changes require ADR + agent re-scoping.

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

### Build / SDK / runtime
- **Expo SDK pin = 54** (matches Expo Go installed on emulator-5554). Don't upgrade to 55/56 unless Expo Go upgrades too. `npx expo install --check` verifies canonical versions.
- **Babel plugin**: `react-native-worklets/plugin` (NOT `react-native-reanimated/plugin`). reanimated v4 moved worklets to its own pkg. `react-native-worklets@0.5.1` pinned (canonical SDK 54).
- **NativeWind**: `babel-preset-expo` WITHOUT `jsxImportSource: 'nativewind'` override. Setting that override breaks Pressable function-style props.
- **typedRoutes disabled** (`experiments.typedRoutes: false` in `app.config.js`) — dynamic routes like `/meal/[id]` clash w/ strict typed routes after SDK 54.
- **Metro on port 8082** (voxpense holds 8081 when both sessions run). Use `--port 8082 --host lan` + `adb -s <emu> reverse tcp:8082 tcp:8082`.

### Pressable atom anti-pattern (CRITICAL)
- ❌ `<Pressable style={({ pressed }) => ({...})}>` — BROKEN by NativeWind v4 css-interop wrapper. Style gets clobbered. All atoms had this bug initially; all converted to static `style={{...}}` on Pressable. If new pressed feedback needed, wrap in `<View>` w/ `useState`-tracked opacity OR use static style + accept no press visual.
- ❌ `<Link asChild><Button>` — Link wrapping eats Button's `fullWidth`/`alignSelf: 'stretch'`. Use `onPress={() => router.push('...')}` directly on Button.

### Domain / data
- **Expo Dev Client APK install**: must rebuild + reinstall when adding native deps; JS-only changes hot-reload via Metro
- **OTA only ships JS**: Expo SDK upgrade OR `app.config.js` native config changes REQUIRE a fresh EAS build
- **runtimeVersion**: locked `"1.0.0"`. Bump only on native rebuild — invalidates older OTA bundles
- **OTA cert path**: must be relative `./certs/certificate.pem` in `app.config.js`
- **GIF playback**: use `expo-image` not `Image` from react-native — only `expo-image` autoplays GIFs reliably on Android
- **Drop set semantics**: TopSet + N drops (1-5), each drop has own weight + reps; no rest between drops; design.md D-DROP locks
- **Unit conversions**: DB stores kg ONLY. Client converts to lb for display when `user.unit === 'LB'`. Never persist lb. `LogSetDto.weightKg` always expects kg.
- **e1RM formula**: Epley `weightKg * (1 + reps/30)`. PR detector window = last 90d, warm-ups excluded.
- **Today resolver**: `(today - routine.startDate)/7 % cycleLength → week → dayOfWeek → Day`. Mon = dayIndex 0. Server `/routines/:id/today`.
- **Wire format**: snake_case for tokens/pagination/query params; camelCase for POST/PATCH body fields. Matches VoxPense.
- **`adb shell input text`** eats spaces — test data won't round-trip via adb input. Use comma or underscore in test strings.

### Workflow (user lock 2026-06-01)
- **NO PRs on this repo** — commit + push direct to `main`. User explicit rule.
- Server (`yashguptadeveloper/server`) IS PR-only / squash-merge — different repo.
- Phase 5 ~95% done. Current focus: Play Store launch sequence (Stage 1 = R2 + server gaps).
- 81-exercise catalog seeded via server PR #6 (merged 2026-06-01). `gifKey` still NULL — Cloudflare R2 bucket pending creation (Stage 1.1 of launch plan).
- Light theme deferred per design D-LIT lock (v1.1).

### Navigation pitfalls landed 2026-06-01
- **Stack animation = `'none'`** (set in every `_layout.tsx`). White-flash on back was caused by react-native-screens native surface clearing during animation. Combined w/ `enableScreens(false)` (JS stack) + `DarkTheme` nav provider + absolute dark backdrop + `expo-system-ui` window bg + `freezeOnBlur: false`. Don't re-enable native screens or any animation without re-verifying no flash on phone.
- **`safeBack(fallback)` helper** in `src/lib/safeBack.ts` — use everywhere instead of `router.back()`. Falls back to `router.replace(fallback)` when stack is empty (deep-link landings, modal replaces). Applied across 28 screens.
- **Tab tap resets stack to tab root** — `(tabs)/_layout.tsx` uses `listeners` w/ `e.preventDefault()` + `router.navigate(rootPath)` per tab. Don't restore default Tabs behavior.
- **Pull-to-refresh** via `useRefresh(...queries)` helper in `src/lib/useRefresh.ts`. Wired on 10 list/dashboard screens.

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
