import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import ProductCard from '@/components/ProductCard';
import RecommendationPanel from '@/components/RecommendationPanel';
import { recommendations, features, trendingProducts } from '@/lib/mockData';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 lg:px-12">
      <HeroSection />
      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </section>
      <section className="mt-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Daily intelligence</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Today&rsquo;s personalized marketplace</h2>
          </div>
          <button className="rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2 text-sm text-slate-100 transition hover:bg-slate-800">
            Refresh insights
          </button>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          <RecommendationPanel title="AI deal radar" description="See which products are hot, stable, or likely to fall in price." items={recommendations} />
          <RecommendationPanel title="Bundle optimizer" description="Auto-curated packages with compatible accessories and savings." items={recommendations.slice(0, 3)} />
          <RecommendationPanel title="Trust & transparency" description="Seller reliability, authenticity checks, and sustainability scores." items={recommendations.slice(1, 4)} />
        </div>
      </section>
      <section className="mt-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Top picks</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Products tailored for your journey</h2>
          </div>
          <a className="text-sm text-sky-400 hover:text-sky-200" href="/search">Explore all</a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {trendingProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
