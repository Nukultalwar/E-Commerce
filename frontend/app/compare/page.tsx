import Link from 'next/link';

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/90 p-10 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Smart compare engine</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Compare everything from specs to resale predictions.</h1>
          <p className="mt-4 max-w-3xl text-slate-400">Choose the best product with transparent data on performance, warranty, sustainability, repairability, and realistic ownership costs.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <h2 className="text-2xl font-semibold text-white">Live product comparison</h2>
            <p className="mt-3 text-slate-400">Upload your shortlist or paste product links. SmartDeal AI highlights the true winner and surfaces hidden tradeoffs.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <p className="text-slate-300">Want to try a quick demo? Start with a sample comparison below.</p>
            <Link className="mt-6 inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400" href="/product/neon-edge-gaming-laptop">View sample comparison</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
