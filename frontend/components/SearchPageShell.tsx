'use client';

import { useState } from 'react';
import { Search, Mic, ImagePlus } from 'lucide-react';
import { searchRecommendations } from '@/lib/mockData';

export default function SearchPageShell() {
  const [query, setQuery] = useState('best gaming laptop under ₹70,000 for coding and video editing');
  const [results, setResults] = useState(searchRecommendations);
  const [voiceActive, setVoiceActive] = useState(false);

  const handleSearch = () => {
    setResults(searchRecommendations.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.note.toLowerCase().includes(query.toLowerCase())));
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-12 lg:px-20">
      <section className="mx-auto max-w-6xl rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-glow">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Search intelligence</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Search with your voice, images, or natural language.</h1>
            <p className="mt-4 max-w-2xl text-slate-400">SmartDeal AI understands intent, not just keywords. Ask for the best product for your workflow and get personalized results instantly.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <button className="rounded-3xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-sm transition hover:border-cyan-400">Text search</button>
            <button className="rounded-3xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-sm transition hover:border-cyan-400">Voice command</button>
            <button className="rounded-3xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-sm transition hover:border-cyan-400">Image upload</button>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                placeholder="Search products, styles, budgets, or compatibility"
              />
            </div>
            <button onClick={() => setVoiceActive(!voiceActive)} className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              <Mic className="h-4 w-4" />
              {voiceActive ? 'Listening...' : 'Use voice'}
            </button>
            <button onClick={handleSearch} className="inline-flex items-center gap-2 rounded-3xl bg-slate-100/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-100/20">
              <ImagePlus className="h-4 w-4" />
              Run search
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <article key={item.title} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 transition hover:-translate-y-1 hover:border-cyan-400">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.type}</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-slate-400">{item.note}</p>
              <p className="mt-5 text-sm text-slate-500">Suggested budget: {item.value}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
