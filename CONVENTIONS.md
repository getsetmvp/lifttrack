# Conventions

Repo-local rules. Cross-repo standards live in `~/productivity/standards/`.

## Repo classification

| Field | Value |
|---|---|
| Type | `frontend-mobile` |
| Multi-surface | apps/mobile day-1; future apps/web |
| Deploy target | EAS Build → APK + Play Store |
| OTA | Cloudflare via yashguptadeveloper/ota-server |
| Visual style | Soft-Dark Modern (teal + orange) per design.md § 1 |

## Naming

| Rule | Example |
|---|---|
| Tenant id | `liftfuel` (lowercase, single word) |
| Branch | `feat/<scope>` per Phase 5 partition OR `<type>/<slug>` (`fix/set-logger-overflow`, `chore/deps`) |
| Component file | PascalCase (`SetRow.tsx`, `MacroRing.tsx`, `RestTimerArc.tsx`) |
| Hook file | camelCase prefixed `use` (`useWorkoutSession.ts`, `useMealCamera.ts`) |
| Util file | camelCase (`formatWeight.ts`, `e1rm.ts`, `macroTargets.ts`) |
| Screen file | Expo Router convention (`app/(tabs)/today.tsx`, `app/workout/[id]/active.tsx`) |

## Branch model

- `main` is protected
- Branch: `feat/<scope>` per Phase 5 partition OR `<type>/<slug>` for general work
- Conventional Branches types: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`, `perf/`, `build/`, `ci/`
- PR-only merges; squash to main
- Each PR includes emulator screenshot (per pipeline D7)

## Commits

Conventional Commits:
- Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `build`, `ci`
- Scopes: feature folder names (`auth`, `today`, `train`, `workout`, `fuel`, `stats`, `ai`, `profile`), or `mobile` / `shared-types` / `infra`

Examples:
- `feat(workout): add drop-set sheet w/ N-drop entry`
- `fix(api): retry on 401 when refresh token valid`
- `feat(fuel): wire meal-camera → upload → poll → result`
- `chore(deps): bump expo to 53.0.5`

## Code

- TypeScript strict mode, `noUncheckedIndexedAccess: true`
- Functional components only
- Hooks: `useState`, `useReducer`, custom hooks in `hooks/`
- Cross-component state: Zustand (one store per concern in `src/store/` — `useAuthStore`, `useUnitStore`, `useWorkoutStore`, `useOfflineQueueStore`)
- Server state: React Query (Agent A scaffolds; B-E consume)
- Styling: NativeWind v4 utility classes only
- Icons: `lucide-react-native` (matches mockup standard)
- File-based routing only (Expo Router)
- Named exports (no default exports except Expo Router route files which require default) — easier grep
- Numerics use `font-mono` Tailwind class (Inter for UI, JetBrains Mono for weights/reps/macros/durations)
- Weights stored canonically kg; `formatWeight(weightKg, unit)` for display
- e1RM formula: Epley — `weightKg * (1 + reps / 30)`

## Env file policy

Three-file pattern per `~/productivity/standards/env-files.md`:

| File | Purpose |
|---|---|
| `.env.example` (repo root + apps/mobile) | placeholder contract, committed |
| `.env.dev` | local dev secrets, gitignored, fresh-random |
| `.env.prod` | mirror of canonical prod values, gitignored |

EAS Build secrets configured per profile in `eas.json` `env:` block OR via `eas secret` CLI.

## Per-agent boundaries (Phase 5)

See `~/productivity/hustle/liftfuel/design.md` § 20. Each agent owns specific folders. Conflicts resolved by main thread.

## Anti-patterns

- ❌ AsyncStorage for tokens — use `expo-secure-store`
- ❌ Hardcoded server URL — use `Constants.expoConfig.extra.apiUrl`
- ❌ Skipping signature on OTA — `codeSigningCertificate` MUST be set
- ❌ Branch-driven prod (use tag-driven `v*` tags)
- ❌ Direct calls to `ai.askchimps.ai` — go through `api.ts` → server
- ❌ `react-navigation` direct usage — use Expo Router
- ❌ `StyleSheet.create` (use NativeWind classes, except for animated style values)
- ❌ Mixing fetch and axios — fetch is built-in, lib/api.ts uses it
- ❌ Skipping emulator screenshot in PR
- ❌ Reusing OTA version numbers — always monotonic increment
- ❌ Bundling exercise GIFs in APK — fetch from R2
- ❌ Glassmorphism / Neumorphism — design rejected both; do not reintroduce
- ❌ Persisting lb values — canonical storage is kg, only display converts
- ❌ Direct PR-detection logic on client — server returns `isPr` on `LogSetDto` response

## Documentation

- `README.md` — entry point for humans
- `CLAUDE.md` — entry point for Claude sessions
- `CONVENTIONS.md` — this file
- `~/productivity/hustle/liftfuel/design.md` — FROZEN design spec
- `~/productivity/hustle/liftfuel/mockups/index.html` — hi-fi mockups (40 screens)

## Testing

- Unit tests (Jest) for non-UI logic (`src/lib/`, helpers like e1rm, macro calc, unit conversion)
- Component render tests (RNTL) for screens — smoke render w/o crashes, NumberPad / SetRow / MacroRing interaction
- Manual emulator smoke for every feature flow before PR merge
- E2E (Detox) deferred to v1.1

## Deploy

OTA path: push to main → preview / tag v* → production (auto via GH Actions).
Native rebuild: `eas build --profile production --platform android` + `eas submit`.
Never deploy from laptop. CI is the only deployer.
