import { ResultsDashboard } from "@/components/ResultsDashboard";
import { getTodayIso } from "@/lib/dates";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 pb-12 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Malaysia 4D</h1>
        <p className="mt-1 text-sm text-zinc-400">
          万能 · 大马彩 · 多多 · 金龙
        </p>
      </header>

      <ResultsDashboard initialDate={getTodayIso()} />

      <footer className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
        <p>For informational purposes only. Not affiliated with any lottery operator.</p>
        <p className="mt-1">
          Verify results on official operator websites before claiming prizes.
        </p>
      </footer>
    </main>
  );
}
