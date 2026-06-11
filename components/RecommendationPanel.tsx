interface RecommendationPanelProps {
  title: string;
  description: string;
  items: Array<{ title: string; note: string; value: string }>;
}

export default function RecommendationPanel({ title, description, items }: RecommendationPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">{title}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{description}</h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4">
            <p className="text-sm text-slate-400">{item.note}</p>
            <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
            <p className="mt-2 text-sm text-slate-300">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
