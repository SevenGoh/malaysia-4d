import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Malaysia 4D",
  description: "Privacy policy for the MY 4D results app",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 pb-12 pt-6">
      <header className="mb-8">
        <Link href="/" className="text-sm text-amber-400 hover:text-amber-300">
          ← Back to results
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-400">Last updated: 25 June 2026</p>
      </header>

      <article className="prose prose-invert prose-sm max-w-none space-y-6 text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <p>
            MY 4D (&quot;Malaysia 4D Results&quot;) is an informational app that displays
            lottery draw results. We are not affiliated with Magnum, Da Ma Cai,
            Sports Toto, Grand Dragon, or any lottery operator. This app does not
            sell tickets or facilitate gambling.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Information we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>My Numbers (optional):</strong> If you save numbers you
              purchased, they are stored only on your device (browser or app
              local storage). We do not upload these numbers to our servers.
            </li>
            <li>
              <strong>Usage data:</strong> Our hosting provider (Vercel) may
              process standard web server logs (IP address, user agent, request
              time) for security and performance. We do not use this to identify
              you personally.
            </li>
            <li>
              <strong>No account required:</strong> We do not ask for your name,
              email, phone number, or payment details to use the app.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">How we use information</h2>
          <p>
            Saved numbers stay on your device to highlight matching results.
            Draw results are fetched from public sources and cached in our
            database to improve load times. We do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Advertising</h2>
          <p>
            This app displays ads through Google AdSense (linked to Google AdMob
            for mobile). Google and its partners may use cookies or advertising
            identifiers to show personalized or non-personalized ads, measure ad
            performance, and prevent fraud. You can manage ad personalization in
            your Google account settings or device advertising settings.
          </p>
          <p className="mt-3">
            Learn more:{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              className="text-amber-400 hover:text-amber-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Google uses data in advertising
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Third-party services</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Vercel — app hosting</li>
            <li>Turso — cached draw result storage (no personal data)</li>
            <li>Google AdSense / AdMob — advertising</li>
            <li>Official and public lottery result sources</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Children</h2>
          <p>
            This app is not directed at children under 13. Lottery-related
            content is intended for adults where permitted by local law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Your choices</h2>
          <p>
            You can delete saved numbers anytime in the app. Clearing app data
            or uninstalling removes local storage. For cached server data, we do
            not store identifiable personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>
            Questions about this policy:{" "}
            <a
              href="mailto:sevengoh328@gmail.com"
              className="text-amber-400 hover:text-amber-300"
            >
              sevengoh328@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Disclaimer</h2>
          <p>
            Results are provided for convenience only. Always verify winning
            numbers on official operator websites before claiming prizes.
          </p>
        </section>
      </article>
    </main>
  );
}
