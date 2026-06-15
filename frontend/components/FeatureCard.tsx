interface FeatureCardProps {
  feature: { title: string; description: string; badge: string };
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-6 transition hover:-translate-y-1 hover:border-cyan-400">
      <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-cyan-300">{feature.badge}</span>
      <h3 className="mt-5 text-2xl font-semibold text-white">{feature.title}</h3>
      <p className="mt-4 text-slate-400">{feature.description}</p>
    </article>
  );
}
