'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { label: 'Personalized insights', value: 'AI-driven' },
  { label: 'Verified sellers', value: '99.7% trust' },
  { label: 'Smart alerts', value: 'Price drop ready' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-glow md:p-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">SmartDeal AI</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight text-white sm:text-6xl">The future of shopping is not a marketplace. It&rsquo;s a trusted ecosystem.</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">Experience real-time recommendations, intelligent deal analysis, verified seller transparency, and purchase guidance that helps you shop with confidence.</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/search" className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Discover products
          </Link>
          <Link href="/assistant" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-8 py-3 text-sm text-slate-100 transition hover:border-cyan-400 hover:text-white">
            Ask the AI assistant
          </Link>
        </div>
      </motion.div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {stats.map((item, index) => (
          <motion.div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-glow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * index, duration: 0.5 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
