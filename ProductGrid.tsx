'use client';

import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import Link from 'next/link';

interface Product {
  slug: string;
  title: string;
  shortDescription?: string;
  currentPrice: number;
  mrp?: number;
  rating?: number;
  reviewCount?: number;
  sellerTrustScore?: number;
  images?: string[];
  badge?: string;
  inStock?: boolean;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onQuickView?: (slug: string) => void;
  className?: string;
}

export default function ProductGrid({ products, loading, onQuickView, className = '' }: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[280px] animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 py-16">
        <p className="text-2xl mb-2">🔍</p>
        <h3 className="text-lg font-semibold text-white">No products found</h3>
        <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {products.map((product) => {
        const discount = product.mrp
          ? Math.round(((product.mrp - product.currentPrice) / product.mrp) * 100)
          : 0;

        return (
          <article
            key={product.slug}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-glow"
          >
            {/* Badge */}
            {product.badge && (
              <span className="absolute right-3 top-3 rounded-full bg-cyan-500/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-medium text-emerald-300">
                -{discount}%
              </span>
            )}

            {/* Image Placeholder */}
            <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-slate-950/50">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.title} className="h-full w-full rounded-xl object-cover" />
              ) : (
                <div className="text-4xl">📦</div>
              )}
            </div>

            {/* Content */}
            <Link href={`/product/${product.slug}`}>
              <h3 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">
                {product.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                {product.shortDescription ?? 'Premium quality product'}
              </p>
            </Link>

            {/* Rating */}
            {product.rating && (
              <div className="mt-3 flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-xs text-slate-500">({product.reviewCount})</span>
                )}
              </div>
            )}

            {/* Price & Actions */}
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-bold text-white">
                  ₹{product.currentPrice.toLocaleString()}
                </p>
                {product.mrp && product.mrp > product.currentPrice && (
                  <p className="text-xs text-slate-500 line-through">₹{product.mrp.toLocaleString()}</p>
                )}
                {product.sellerTrustScore && (
                  <p className="mt-1 text-[10px] text-emerald-400">
                    Trust Score: {product.sellerTrustScore}%
                  </p>
                )}
              </div>
              <div className="flex gap-1.5">
                {onQuickView && (
                  <button
                    onClick={() => onQuickView(product.slug)}
                    className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-300"
                    title="Quick view"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <Link
                  href={`/product/${product.slug}`}
                  className="rounded-xl bg-cyan-500 p-2 text-slate-950 transition hover:bg-cyan-400"
                  title="View details"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

