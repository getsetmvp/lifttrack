'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from './Container';
import { clsx } from 'clsx';

const FAQS = [
  {
    q: 'Is LiftTrack really free?',
    a: 'Yes. v1 is free for everyone. No ads, no in-app purchases. If we introduce paid tiers later, existing accounts will keep current features at no charge.',
  },
  {
    q: 'Where is my data stored?',
    a: 'On our own server hosted in Mumbai, India (Oracle Cloud Infrastructure). Postgres, encrypted at rest, accessed only over HTTPS. We do not use third-party analytics or marketing SDKs.',
  },
  {
    q: 'How does the meal photo AI work?',
    a: 'The picture is downscaled to 640px on-device and sent to our server for AI parsing. The AI returns calories, protein, carbs, and fat estimates. The image is retained only to render the meal in the detail screen and is deleted when you delete the meal or your account.',
  },
  {
    q: 'How accurate are the AI macros?',
    a: 'Good for ballpark and trend tracking; not a replacement for a kitchen scale if you\'re competition-prepping. Every meal screen lets you tap the macros to correct them — the model treats your edits as ground truth.',
  },
  {
    q: 'Can I use kg and lb together?',
    a: 'Yes. Per-set unit override. Most barbell work in kg, sled press in lb, no problem. Conversion is exact, not rounded — the logger keeps the original number you typed.',
  },
  {
    q: 'Does it work offline?',
    a: 'Workout logging works offline and syncs when you reconnect. Meal photo AI needs network. Insights need network. Read-only history works offline.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes. Settings → Privacy & data → Export data produces a JSON file with every workout, set, meal, and body metric you\'ve logged. No format lock-in.',
  },
  {
    q: 'Can I delete my account?',
    a: 'Yes. Settings → Privacy & data → Delete account, or visit lifttrack.getsetmvp.com/account-deletion. All server data tied to you is erased within 7 days; backups roll off within 30.',
  },
  {
    q: 'Is iOS coming?',
    a: 'Planned for v1.1+. v1 ships Android first because that\'s our daily-driver platform and where the strongest demand is.',
  },
  {
    q: 'Who built this?',
    a: 'Yash Gupta — independent developer based in India. Contact: yash.gupta.developer@gmail.com.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">FAQ</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-4 text-lg text-muted dark:text-muted-dark">
            If something here doesn&apos;t cover what you need, email{' '}
            <a href="mailto:yash.gupta.developer@gmail.com" className="text-brand underline-offset-2 hover:underline">
              yash.gupta.developer@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl divide-y divide-edge rounded-2xl border border-edge bg-paper dark:divide-edge-dark dark:border-edge-dark dark:bg-night-surface">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold tracking-tight">{f.q}</span>
                  <ChevronDown
                    className={clsx('h-4 w-4 flex-shrink-0 text-muted transition-transform', isOpen && 'rotate-180')}
                  />
                </button>
                <div
                  className={clsx(
                    'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted dark:text-muted-dark">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
