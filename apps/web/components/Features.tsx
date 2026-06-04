import {
  Dumbbell,
  Camera,
  Timer,
  Trophy,
  Flame,
  LineChart,
  MessageSquareText,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Container } from './Container';

const FEATURES = [
  {
    icon: Dumbbell,
    title: 'Real set logger',
    blurb:
      'Decimal weights, drop sets, warm-up flags, kg / lb on the fly. Built for the kind of training that actually progresses.',
  },
  {
    icon: Camera,
    title: 'AI meal photo macros',
    blurb:
      'Snap your plate. AI returns calories + protein + carbs + fat across 7 named meal slots a day. No food database lookups.',
  },
  {
    icon: Timer,
    title: 'Smart rest timer',
    blurb:
      'Auto-fires after every non-warmup set. Persistent overlay so you can lock the phone and breathe.',
  },
  {
    icon: Trophy,
    title: 'PR detection',
    blurb:
      'Automatic — any time you beat a previous 1RM, e1RM, or volume record on a lift, it lights up. No spreadsheet math.',
  },
  {
    icon: Calendar,
    title: 'Routines + weeks + days',
    blurb:
      'Structured programs. Day-N tracking. Switch routines without losing history. Active-routine card on the home tab.',
  },
  {
    icon: Flame,
    title: 'Streaks that matter',
    blurb:
      'Log a workout OR a meal — streak counts. Misses don\'t shame; gentle nudge instead of guilt-bait.',
  },
  {
    icon: LineChart,
    title: 'Insights worth reading',
    blurb:
      'Volume trends, weight charts, body-metric correlation, plateau radar. The chart shows you which lift stalled, not whether.',
  },
  {
    icon: MessageSquareText,
    title: 'Ask your data',
    blurb:
      'Natural language. "Why did my bench drop last week?" "Show macros for the days I hit a PR." Honest answers from your own logs.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    blurb:
      'Your data sits on our server in Mumbai. No ads, no analytics SDKs, no third-party sharing. Export or delete in one tap.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            Everything that matters
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            A training app that respects your time.
          </h2>
          <p className="mt-4 text-lg text-muted dark:text-muted-dark">
            LiftTrack skips the data-entry tax. Every feature here is a knife — sharp, single-purpose, instantly usable.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-edge bg-paper p-7 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-card dark:border-edge-dark dark:bg-night-surface dark:hover:border-brand-light/40"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted dark:text-muted-dark">{f.blurb}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
