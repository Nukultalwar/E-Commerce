'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { sampleAssistantResponses } from '@/lib/mockData';

export default function AiAssistantShell() {
  const [query, setQuery] = useState('Help me find a premium lifestyle phone bundle for photography and travel.');
  const [response, setResponse] = useState(sampleAssistantResponses[0]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResponse({
      prompt: query,
      recommendation: 'A camera-first phone with a travel-friendly power bank, protective case, and an AI photo-editing subscription is ideal.',
      insights: [
        'Choose the premium sensor for low-light travel photography.',
        'Match it with a certified fast charger and a rugged yet lightweight case.',
        'Add the subscription only if you plan to edit and publish frequently.',
      ],
      followUp: 'Want me to compare top camera phones now?',
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-10 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-glow">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">AI shopping consultant</p>
          <h1 className="text-4xl font-semibold text-white">Ask SmartDeal AI anything about your next purchase.</h1>
          <p className="text-slate-400">Receive tailored recommendations, compatibility tips, buying advice, and the best payment options in a conversational flow.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <label className="text-sm text-slate-300">Try natural language search</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="flex-1 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              placeholder="E.g. best gaming laptop under ₹75,000 for streaming and editing"
            />
            <button type="submit" className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              <Send className="mr-2 h-4 w-4" /> Ask AI
            </button>
          </div>
        </form>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Recommendation</p>
            <h2 className="text-2xl font-semibold text-white">{response.recommendation}</h2>
            <div className="space-y-3 text-slate-300">
              {response.insights.map((insight) => (
                <p key={insight}>• {insight}</p>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Follow-up</p>
            <p className="mt-3 text-slate-300">{response.followUp}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
