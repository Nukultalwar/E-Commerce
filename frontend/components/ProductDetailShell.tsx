'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { sampleProduct } from '@/lib/mockData';

type ProductLike = typeof sampleProduct;

type DealAnalyzerLike = {
  decision?: string;
  confidence?: number;
  reasons?: string[];
};

interface ProductDetailShellProps {
  slug: string;
}

const variantLabels = ['Core i5, 512GB SSD', 'Core i7, 1TB SSD', 'Ryzen 7, 1TB SSD'];

export default function ProductDetailShell({ slug }: ProductDetailShellProps) {
  const [product, setProduct] = useState<ProductLike>(sampleProduct);
  const [deal, setDeal] = useState<DealAnalyzerLike | null>(null);
  const [activeVariant, setActiveVariant] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

        // Fetch product.
        const productRes = await fetch(`${apiBase}/products/${slug}`);
        if (productRes.ok) {
          const productData = await productRes.json();
          const p = productData?.product as Partial<ProductLike> | undefined;
          if (p && typeof p.title === 'string' && typeof p.shortDescription === 'string') {
            if (!cancelled) setProduct(p as ProductLike);
          }
        }

        // Fetch deal analyzer.
        const dealRes = await fetch(`${apiBase}/products/${slug}/deal-analyzer`);
        if (dealRes.ok) {
          const dealData = await dealRes.json();
          if (!cancelled) setDeal(dealData as DealAnalyzerLike);
        }
      } catch {
        // mock fallback: keep sampleProduct + null deal
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const variant = useMemo(() => product.variants[activeVariant] ?? product.variants[0], [activeVariant, product]);

  const dealDecisionLabel = useMemo(() => {
    const d = deal?.decision;
    if (d === 'buy_now') return 'Buy now';
    if (d === 'wait') return 'Wait';
    if (d === 'alternative') return 'Alternative';
    return null;
  }, [deal]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-sm text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
                <span>Verified seller trust score • Transparent price history</span>
              </div>
              <h1 className="text-4xl font-semibold text-white">{product.title}</h1>
              <p className="max-w-2xl text-slate-400">{product.shortDescription}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Current deal</p>
                  <p className="mt-3 text-4xl font-semibold text-white">₹{(product.currentPrice + variant.priceDelta).toLocaleString()}</p>
                  <p className="mt-2 text-sm text-slate-500">Estimated delivery in {variant.deliveryDays} days</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Seller reliability</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{product.sellerTrustScore}%</p>
                  <p className="mt-2 text-sm text-slate-500">Based on delivery, support, and authenticity.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Select your variant</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {variantLabels.map((label, index) => (
                    <button
                      key={label}
                      onClick={() => setActiveVariant(index)}
                      className={`rounded-3xl border px-4 py-3 text-sm transition ${
                        index === activeVariant
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                          : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI deal analyzer</p>
                <p className="mt-4 text-lg text-white">
                  {dealDecisionLabel
                    ? `${dealDecisionLabel} — confidence ${((deal?.confidence ?? 0) * 100) | 0}%`
                    : 'Buy now or wait?'}
                </p>
                <div className="mt-6 space-y-3 text-slate-300">
                  {deal?.reasons?.length ? (
                    <ul className="list-none space-y-2">
                      {deal.reasons.slice(0, 3).map((r) => (
                        <li key={r} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      <p>
                        Current price is {product.currentPrice < product.mrp ? 'below average' : 'within expected range'} for this
                        category.
                      </p>
                      <p>Price history shows {product.priceHistory.length} trend points over the last year.</p>
                      <p className="flex items-center gap-2 text-cyan-300">
                        <Sparkles className="h-4 w-4" />Recommended: purchase with a matched warranty and accessory bundle.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Trusted community</p>
                <p className="mt-4 text-slate-300">Users love the balanced performance and minimal heating for long video editing sessions.</p>
                <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                  Explore community reviews <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-40 rounded-3xl border border-slate-800 bg-slate-900/80 animate-pulse" />
            ))}
          </div>
        ) : (
          <section className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <h2 className="text-xl font-semibold text-white">Key features</h2>
              <ul className="mt-4 space-y-3 text-slate-400">
                {product.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <h2 className="text-xl font-semibold text-white">Price history</h2>
              <div className="mt-6 space-y-4">
                {product.priceHistory.slice(-4).map((point) => (
                  <div key={String(point.timestamp)} className="flex items-center justify-between text-sm text-slate-300">
                    <span>{new Date(point.timestamp).toLocaleDateString()}</span>
                    <span>₹{point.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <h2 className="text-xl font-semibold text-white">Compatibility</h2>
              <p className="mt-4 text-slate-400">Automatically maps to recommended docks, monitors, and extended protection plans based on the selected variant.</p>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}

