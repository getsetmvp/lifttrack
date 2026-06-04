import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Account & Data Deletion',
  description:
    'How to delete your LiftTrack account and all associated data. In-app one-tap delete or email request.',
  alternates: { canonical: '/account-deletion' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '2026-06-05';

const SUBJECT = 'Delete my LiftTrack account';
const BODY = `Please delete my LiftTrack account and all associated data.

Account email (the email I used to sign up for LiftTrack):
[required — fill in your account email]

I understand:
- All workouts, sets, routines, weeks, days, exercises, meals, meal photos, body metrics, macro overrides, and onboarding profile data tied to this account will be permanently erased from the production database within 7 days.
- Server backups containing this data will be purged within 30 days.
- This action cannot be undone.

Thank you.`;

const mailto = `mailto:${site.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

export default function AccountDeletionPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pb-16 pt-12 md:pt-16">
          <div className="radial-fade absolute inset-0 -z-10" />
          <Container>
            <nav className="text-xs text-muted dark:text-muted-dark">
              <Link href="/" className="hover:text-ink dark:hover:text-ink-inverse">Home</Link>
              <span className="mx-2">/</span>
              <span>Account &amp; data deletion</span>
            </nav>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Delete your LiftTrack account
            </h1>
            <p className="mt-3 text-sm text-muted dark:text-muted-dark">
              Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
            </p>
          </Container>
        </section>

        <Container>
          <article className="prose-content mx-auto max-w-3xl pb-20">
            <p>
              You can request deletion of your LiftTrack account and every piece of personal data
              tied to it at any time. There are two paths — pick whichever is easier for you.
            </p>

            <h2>Option 1 — Delete from inside the app (fastest)</h2>
            <ol className="mb-4 list-decimal space-y-2 pl-6 text-ink/85 dark:text-ink-inverse/85">
              <li>Open LiftTrack on your phone.</li>
              <li>
                Go to <strong>Settings → Privacy &amp; data → Delete account</strong>.
              </li>
              <li>Confirm. Your account is queued for deletion immediately.</li>
            </ol>
            <p>
              Server data is wiped within 7 days; backups within 30 days. You will be logged out
              and the app will return to the welcome screen.
            </p>

            <h2>Option 2 — Email request (if you can&apos;t open the app)</h2>
            <p>
              Email{' '}
              <a href={`mailto:${site.email}`} className="font-semibold">
                {site.email}
              </a>{' '}
              with the subject line{' '}
              <code>Delete my LiftTrack account</code> and include the email address you used to
              sign up. We&apos;ll acknowledge within 48 hours and delete within 7 days.
            </p>
            <div className="my-6">
              <a
                href={mailto}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-inverse hover:opacity-95 dark:bg-ink-inverse dark:text-ink"
              >
                Open pre-filled email
              </a>
            </div>

            <h2>What gets deleted</h2>
            <ul>
              <li>Your email address, display name, account preferences (theme, unit, goal).</li>
              <li>Onboarding profile — height, age range, biological sex (used for macro defaults), training goal, preferred unit.</li>
              <li>Every workout — routine, week, day, exercise, every logged set (weight, reps, drop flags, warm-up flags), workout notes, PR markers.</li>
              <li>Every meal — calories, protein, carbs, fat, slot, notes, attached photos.</li>
              <li>All body metrics — weight, body-fat %, waist, chest, arm, thigh, calf, neck.</li>
              <li>Macro overrides + custom routines + custom exercises.</li>
              <li>Hashed password and authentication tokens.</li>
              <li>Server-side meal photo files in our R2 bucket.</li>
            </ul>

            <h2>What gets kept (and for how long)</h2>
            <ul>
              <li>
                <strong>Server access logs (nginx):</strong> IP + timestamp + URL path — 14 days rolling.
                Used for abuse / DDoS detection only, not tied to your account identity.
              </li>
              <li>
                <strong>Encrypted database backups:</strong> 30-day rolling. Your row is gone from the
                live database within 7 days but lingers in backups until they age out at 30
                days. No backup is ever restored except for disaster recovery.
              </li>
            </ul>

            <h2>Timeline summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>When deleted</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account, workouts, meals, photos, body metrics (live database)</td>
                  <td>≤ 7 days from request</td>
                </tr>
                <tr>
                  <td>Meal photo files in R2</td>
                  <td>≤ 7 days from request</td>
                </tr>
                <tr>
                  <td>Server backups</td>
                  <td>≤ 30 days from request</td>
                </tr>
                <tr>
                  <td>nginx access logs</td>
                  <td>≤ 14 days</td>
                </tr>
              </tbody>
            </table>

            <h2>Need an export before deletion?</h2>
            <p>
              In-app: <strong>Settings → Privacy &amp; data → Export data</strong> produces a JSON
              file of every workout, set, meal, body metric, and routine you&apos;ve logged. Save it
              to Drive, email, or any share target. Or email{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a> and we&apos;ll send a copy of your
              data before deleting.
            </p>

            <h2>Questions</h2>
            <p>
              Anything unclear — email <a href={`mailto:${site.email}`}>{site.email}</a>. See
              also the full{' '}
              <Link href="/privacy">Privacy Policy</Link> and{' '}
              <Link href="/terms">Terms of Service</Link>.
            </p>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
