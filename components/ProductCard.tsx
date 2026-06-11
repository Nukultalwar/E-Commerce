import Link from 'next/link';

interface ProductCardProps {
  product: {
    title: string;
    subtitle: string;
    price: number;
    discount: number;
    badge: string;
    slug: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group block overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-white">{product.title}</h3>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{product.badge}</span>
      </div>
      <p className="mt-4 text-slate-400">{product.subtitle}</p>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold text-white">₹{product.price.toLocaleString()}</p>
          <p className="text-sm text-slate-500">Save {product.discount}% with smart bundles</p>
        </div>
        <div className="rounded-3xl bg-slate-950 px-4 py-2 text-sm text-cyan-300">AI verified</div>
      </div>
    </Link>
  );
}
