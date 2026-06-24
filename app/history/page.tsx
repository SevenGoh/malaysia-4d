import { ResultsDashboard } from "@/components/ResultsDashboard";

export default function HistoryPage() {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 pb-12 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Draw History</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Browse past results by date
        </p>
      </header>

      <ResultsDashboard />
    </main>
  );
}
