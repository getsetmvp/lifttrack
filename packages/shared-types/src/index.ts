// Shared types mirroring server DTOs. Single source of truth for mobile + (future) web.
// Per design.md § 12 (data model) + § 13 (API contract).
//
// Wire convention (matches VoxPense + locked across all tenants):
//   - Model fields: camelCase (1:1 w/ Prisma camelCase columns)
//   - POST/PATCH request bodies: camelCase fields
//   - GET query params: snake_case
//   - Pagination response: { data, next_cursor } (snake_case keys)
//   - Auth token fields: snake_case (access_token, refresh_token)

// ── enums ─────────────────────────────────────────────────────────────────

export type Unit = 'KG' | 'LB';
export type Goal = 'MUSCLE' | 'FAT' | 'MAINTAIN' | 'STRENGTH';
export type CycleMode = 'LOOP' | 'SEQUENCE' | 'WEEKLY_PICK';
export type MuscleGroup =
  | 'CHEST' | 'BACK' | 'SHOULDERS' | 'LEGS' | 'ARMS' | 'CORE' | 'FULL_BODY' | 'OTHER';
export type Equipment =
  | 'BARBELL' | 'DUMBBELL' | 'CABLE' | 'MACHINE' | 'BODYWEIGHT' | 'BAND' | 'KETTLEBELL' | 'OTHER';
export type ExerciseCategory = 'COMPOUND' | 'ISOLATION' | 'CARDIO' | 'MOBILITY';
export type MealSlot =
  | 'BREAKFAST' | 'PRE_LUNCH' | 'LUNCH' | 'SNACK'
  | 'PRE_WORKOUT' | 'POST_WORKOUT' | 'DINNER';
export type MealStatus = 'PENDING' | 'ANALYZING' | 'ANALYZED' | 'EDITED' | 'FAILED';

// ── user + auth ──────────────────────────────────────────────────────────

export interface MacroOverride {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  unit: Unit;
  increment: number;
  goal: Goal;
  heightCm: number | null;
  bodyFatPct: number | null;
  macroOverride: MacroOverride | null;
  fcmToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// ── exercises (read-only catalog) ────────────────────────────────────────

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  category: ExerciseCategory;
  instructions: string | null;
  gifKey: string | null;
  gifUrl?: string;
  createdAt: string;
}

export interface ExerciseHistoryPoint {
  date: string;
  e1rm: number;
}

export interface ExerciseHistoryResponse {
  sets: WorkoutSet[];
  e1rmCurve: ExerciseHistoryPoint[];
}

// ── day / week / routine (3-tier reusable hierarchy) ─────────────────────

export interface DayExerciseInput {
  exerciseId: string;
  order: number;
  isWarmup: boolean;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
  allowsDropset: boolean;
  notes: string | null;
}

export interface DayExercise extends DayExerciseInput {
  id: string;
  dayId: string;
  exercise?: Exercise;
}

export interface CreateDayDto {
  name: string;
  notes?: string | null;
  exercises: DayExerciseInput[];
}

export interface Day {
  id: string;
  userId: string;
  name: string;
  notes: string | null;
  exercises: DayExercise[];
  usedInWeeks?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeekSlot {
  id: string;
  weekId: string;
  dayIndex: number; // 0..6 (Mon..Sun)
  dayId: string | null; // null = rest
  day?: Day | null;
}

export interface CreateWeekDto {
  name: string;
  slots: Array<{ dayIndex: number; dayId: string | null }>;
}

export interface Week {
  id: string;
  userId: string;
  name: string;
  slots: WeekSlot[];
  usedInRoutines?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineWeekRef {
  id: string;
  routineId: string;
  weekId: string;
  position: number;
  week?: Week;
}

export interface CreateRoutineDto {
  name: string;
  cycleMode: CycleMode;
  startDate: string;
  weekIds: string[];
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  cycleMode: CycleMode;
  startDate: string;
  weekRefs: RoutineWeekRef[];
  currentPosition?: number;
  todayDayId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineTodayResponse {
  day: Day | null;
  isRest: boolean;
  weekPosition: number;
  dayIndex: number;
}

// ── workout (sessions + sets + drops) ────────────────────────────────────

export interface SetDrop {
  id: string;
  workoutSetId: string;
  dropIndex: number;
  weightKg: number;
  reps: number;
}

export interface WorkoutSet {
  id: string;
  workoutExerciseId: string;
  setIndex: number;
  weightKg: number;
  reps: number;
  isWarmup: boolean;
  isFailure: boolean;
  isPr: boolean;
  drops: SetDrop[];
  deletedAt: string | null;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  exercise?: Exercise;
  order: number;
  sets: WorkoutSet[];
}

export interface WorkoutTotals {
  durationMin: number;
  volumeKg: number;
  prs: number;
}

export interface Workout {
  id: string;
  userId: string;
  routineId: string | null;
  dayId: string | null;
  dayName: string | null;
  startedAt: string;
  endedAt: string | null;
  notes: string | null;
  mood: number | null;
  totalVolume: number | null;
  prCount: number;
  exercises: WorkoutExercise[];
  totals?: WorkoutTotals;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StartWorkoutDto {
  dayId?: string;
  routineId?: string;
}

export interface LogSetDto {
  weightKg: number;
  reps: number;
  isWarmup?: boolean;
  isFailure?: boolean;
}

export interface LogSetResponse extends WorkoutSet {}

export interface LogDropDto {
  dropIndex: number;
  weightKg: number;
  reps: number;
}

// ── nutrition ────────────────────────────────────────────────────────────

export interface MealItem {
  id: string;
  mealId: string;
  name: string;
  portionG: number | null;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface CreateMealItemDto {
  name: string;
  portionG?: number | null;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Meal {
  id: string;
  userId: string;
  date: string;
  slot: MealSlot;
  photoKey: string | null;
  photoUrl?: string;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  aiConfidence: number | null;
  status: MealStatus;
  notes: string | null;
  items: MealItem[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── body metrics ─────────────────────────────────────────────────────────

export interface BodyMetric {
  id: string;
  userId: string;
  date: string;
  weightKg: number | null;
  bodyFatPct: number | null;
}

export interface CreateBodyMetricDto {
  date: string;
  weightKg?: number | null;
  bodyFatPct?: number | null;
}

// ── analytics ────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  workouts: number;
  prs: number;
  streak: number;
  volumeKg: number;
  kcalAvg: number;
  proteinPerKgAvg: number;
}

export interface E1rmPoint {
  date: string;
  e1rm: number;
}

export interface StrengthDetail {
  e1rmCurve: E1rmPoint[];
  best: { weight: number; reps: number; date: string };
}

export interface StrengthRow {
  exerciseId: string;
  name: string;
  e1rmLatest: number;
  deltaPct: number;
  spark: number[];
}

export interface VolumePoint {
  period: string;
  volumeKg: number;
  sets: number;
  prs: number;
}

export interface NutritionPoint {
  period: string;
  kcalAvg: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  adherencePct: number;
}

export interface CorrelationPoint {
  x: number;
  y: number;
  date: string;
}

export interface CorrelationResponse {
  points: CorrelationPoint[];
  r: number;
  insightMd: string | null;
}

// ── AI Q&A ───────────────────────────────────────────────────────────────

export interface AskDto {
  question: string;
}

export interface AskSource {
  kind: 'workout' | 'meal' | 'exercise' | 'metric';
  id: string | null;
  label: string;
}

export interface AskResponse {
  answerMd: string;
  sources: AskSource[];
}

// ── pagination (matches VoxPense `{ data, next_cursor }` shape) ──────────

export interface Page<T> {
  data: T[];
  next_cursor: string | null;
}

// ── error envelope (per backend.md standard) ─────────────────────────────

export interface ApiErrorBody {
  statusCode: number;
  message: string;
  errors?: Array<{ path?: string; message: string }>;
  path?: string;
  timestamp?: string;
  tenant?: string;
  version?: string;
}
