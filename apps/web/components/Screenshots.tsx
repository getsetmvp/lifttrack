import { Container } from './Container';
import { PhoneFrame } from './PhoneFrame';

const SHOTS = [
  { src: '/screenshots/today.png', label: 'Today', desc: 'Routine, streak, macro rings, active workout — all in one tap.' },
  { src: '/screenshots/workout.png', label: 'Workout', desc: 'Set logger with decimal weights, drop sets, kg / lb.' },
  { src: '/screenshots/meal-camera.png', label: 'Meal photo', desc: 'Camera FAB. Snap. AI extracts macros.' },
  { src: '/screenshots/fuel-day.png', label: 'Fuel day', desc: 'Seven meal slots. Macro ring. Date nav.' },
  { src: '/screenshots/stats.png', label: 'Stats', desc: 'Volume trends, PR detection, plateau radar.' },
  { src: '/screenshots/ai-chat.png', label: 'Ask AI', desc: 'Natural-language queries over your logs.' },
];

export function Screenshots() {
  return (
    <section id="screens" className="relative py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">Screens</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Designed to disappear.
          </h2>
          <p className="mt-4 text-lg text-muted dark:text-muted-dark">
            Soft-dark canvas. Teal + orange brand pair. Inter type set with subtle motion. Built mobile-first.
          </p>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {SHOTS.map((s) => (
            <figure key={s.src} className="flex flex-col items-center text-center">
              <PhoneFrame src={s.src} alt={s.label} width={240} />
              <figcaption className="mt-5">
                <p className="text-base font-semibold tracking-tight">{s.label}</p>
                <p className="mt-1 text-sm text-muted dark:text-muted-dark">{s.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
