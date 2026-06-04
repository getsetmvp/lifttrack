import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How LiftTrack collects, stores, shares, and deletes your data. Plain English. Last updated 2026-06-05.',
  alternates: { canonical: '/privacy' },
};

const LAST_UPDATED = '2026-06-05';

export default function PrivacyPage() {
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
              <span>Privacy policy</span>
            </nav>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">LiftTrack Privacy Policy</h1>
            <p className="mt-3 text-sm text-muted dark:text-muted-dark">
              Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Plain English · No dark patterns.
            </p>
          </Container>
        </section>

        <Container>
          <article className="prose-content mx-auto max-w-3xl pb-20">
            <p>
              LiftTrack (&quot;the app&quot;) is a personal fitness + nutrition tracker developed and operated by
              Yash Gupta (&quot;we&quot;, &quot;us&quot;). This policy explains what data the app collects, how
              it is stored, who it is shared with, and how to delete it.
            </p>
            <p>
              Contact: <a href="mailto:yash.gupta.developer@gmail.com">yash.gupta.developer@gmail.com</a>.
            </p>

            <h2>1. Data we collect</h2>
            <p>When you create a LiftTrack account we collect:</p>
            <ul>
              <li><strong>Email address</strong> (required) — login identifier + account recovery.</li>
              <li><strong>Display name</strong> (optional) — shown in the app UI; leave blank if you prefer.</li>
              <li><strong>Body metrics</strong> you choose to log — weight, body-fat %, waist, chest, arm, thigh, calf, neck — each timestamped. All optional. You decide which to track.</li>
              <li><strong>Onboarding profile</strong> — height, age range, biological sex (for macro defaults only), training goal (bulk / cut / maintain), preferred unit (kg / lb).</li>
              <li><strong>Workout data</strong> — routines you build, weeks, days, exercises selected, sets logged (weight, reps, drop-set flags, warm-up flags), rest timer intervals, PR markers, free-text workout notes.</li>
              <li><strong>Nutrition data</strong> — meals you log (calories, protein, carbs, fat, meal slot, timestamp, optional attached photo), macro overrides you make.</li>
              <li><strong>Meal photos</strong> — only when you tap the meal camera. Downscaled to 640px on-device before upload.</li>
            </ul>
            <p>LiftTrack <strong>does not</strong> collect:</p>
            <ul>
              <li>Your location.</li>
              <li>Your contacts.</li>
              <li>Your device advertising ID.</li>
              <li>Your browsing history.</li>
              <li>Any third-party app data.</li>
              <li>Biometric data (fingerprints, face data, etc.).</li>
              <li>Health data from Apple Health / Google Fit / Health Connect (not integrated).</li>
            </ul>

            <h2>2. How AI meal photos work</h2>
            <ul>
              <li><strong>On-device prep:</strong> when you tap the meal camera, the image is captured at native resolution, then immediately downscaled to a 640px-wide JPEG at quality 0.45 (typical size: 50-120 KB) before any upload happens.</li>
              <li><strong>Upload:</strong> the downscaled image is sent over HTTPS to our server, which proxies it to an AI parsing service. The AI returns calorie + macro estimates.</li>
              <li><strong>Retention:</strong> the photo is retained on our server only to render the meal detail screen. When you delete the meal or your account, the photo is permanently erased.</li>
              <li><strong>Camera permission</strong> is requested only at the point of use and can be revoked at any time in your device&apos;s OS settings.</li>
            </ul>

            <h2>3. Where data is stored</h2>
            <ul>
              <li><strong>Provider:</strong> Oracle Cloud Infrastructure VM, region <code>Mumbai (ap-mumbai-1)</code>.</li>
              <li><strong>Database:</strong> PostgreSQL, scoped to a per-tenant <code>liftfuel</code> schema.</li>
              <li><strong>Transport:</strong> HTTPS (TLS 1.2+) for every client ↔ server call.</li>
              <li><strong>At rest:</strong> database disk volumes are encrypted by the cloud provider.</li>
              <li><strong>Image storage:</strong> meal photos are stored on Cloudflare R2 with private access — only the server can sign URLs.</li>
            </ul>
            <p>We do not use any third-party analytics, advertising, or marketing SDKs.</p>

            <h2>4. Third parties</h2>
            <table>
              <thead>
                <tr><th>Sub-processor</th><th>Purpose</th><th>Data shared</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>AI parsing service (server-side)</td>
                  <td>Meal photo macro extraction + Ask-AI query answering</td>
                  <td>The downscaled meal image OR the text of your question + a redacted snapshot of your own logs. The provider does not retain or train on this data per its terms.</td>
                </tr>
                <tr>
                  <td>Cloudflare R2</td>
                  <td>Meal photo blob storage</td>
                  <td>The downscaled meal JPEG only. Private bucket; no public URLs.</td>
                </tr>
              </tbody>
            </table>
            <p>We do not sell or rent your data. We do not share it with advertisers.</p>

            <h2>5. Your rights</h2>
            <ul>
              <li><strong>Export your data:</strong> in-app, <em>Settings → Privacy &amp; data → Export data</em>. Produces a JSON file with every workout, set, meal, body metric, and routine you&apos;ve logged.</li>
              <li><strong>Delete your account:</strong> in-app, <em>Settings → Privacy &amp; data → Delete account</em> — or via the public <Link href="/account-deletion">deletion page</Link>. Server data is wiped within 7 days; backups within 30.</li>
              <li><strong>Request a copy of any data we hold on you:</strong> email <a href="mailto:yash.gupta.developer@gmail.com">yash.gupta.developer@gmail.com</a>.</li>
              <li><strong>Correct inaccurate data:</strong> edit it directly in the app, or email us.</li>
            </ul>

            <h2>6. Retention</h2>
            <ul>
              <li>Active account data: retained as long as the account exists.</li>
              <li>Deleted account data: erased from primary database within 7 days; erased from backups within 30 days.</li>
              <li>Server access logs (nginx): 14-day rolling retention. Used only for abuse / DDoS detection. Not tied to your account identity.</li>
            </ul>

            <h2>7. Children&apos;s privacy</h2>
            <p>LiftTrack is not directed to children under 18 and we do not knowingly collect data from them. If you believe a child has provided us data, contact <a href="mailto:yash.gupta.developer@gmail.com">yash.gupta.developer@gmail.com</a> and we will delete it.</p>

            <h2>8. Security</h2>
            <ul>
              <li>TLS in transit, encryption at rest.</li>
              <li>Passwords are stored hashed (bcrypt).</li>
              <li>Auth tokens (JWT, short-lived) are kept in the device secure enclave (<code>expo-secure-store</code>), never in plain <code>AsyncStorage</code>.</li>
              <li>Server access is restricted to the developer; no third-party operator has shell access to the database.</li>
            </ul>
            <p>We cannot guarantee absolute security; no online service can. We commit to disclosing any confirmed breach affecting your data within 72 hours of confirmation.</p>

            <h2>9. International transfers</h2>
            <p>Our server is hosted in India (Mumbai). If you use the app from outside India, your data will be transferred to and stored in India. We do not transfer data to any other jurisdiction.</p>

            <h2>10. Changes to this policy</h2>
            <p>We will update the &quot;Last updated&quot; date above when we change this policy. Material changes will be surfaced in-app via a notice on next launch.</p>

            <h2>11. Contact</h2>
            <p>Questions, requests, or complaints: <a href="mailto:yash.gupta.developer@gmail.com">yash.gupta.developer@gmail.com</a>.</p>
            <p>Postal address available on request.</p>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
