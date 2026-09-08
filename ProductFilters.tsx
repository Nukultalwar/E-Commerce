'use client';

import { useState } from 'react';
import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';

interface FilterState {
  minPrice: number;
  maxPrice: number;
  rating: number;
  inStock: boolean;
  sort: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
];

const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

export default function ProductFilters({ onFilterChange, className = '' }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: Infinity,
    rating: 0,
    inStock: true,
    sort: 'rating',
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      minPrice: 0,
      maxPrice: Infinity,
      rating: 0,
      inStock: true,
      sort: 'rating',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount = [
    filters.minPrice > 0,
    filters.maxPrice < Infinity,
    filters.rating > 0,
    filters.sort !== 'rating',
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <div
        className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 ${
          mobileOpen ? 'block' : 'hidden'
        } lg:block ${className}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Filters</h3>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 transition hover:text-cyan-300"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sort by</h4>
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-400"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Price Range</h4>
          <div className="space-y-1">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => updateFilter('minPrice', range.min === filters.minPrice ? 0 : range.min)}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  filters.minPrice === range.min && filters.maxPrice === range.max
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Minimum Rating</h4>
          <div className="flex gap-1">
            {[0, 3, 3.5, 4, 4.5].map((rating) => (
              <button
                key={rating}
                onClick={() => updateFilter('rating', rating)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                  filters.rating === rating
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {rating === 0 ? 'Any' : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => updateFilter('inStock', !filters.inStock)}
              className={`flex h-5 w-9 rounded-full transition ${
                filters.inStock ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition ${
                  filters.inStock ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-sm text-slate-300">In Stock Only</span>
          </label>
        </div>
      </div>
    </>
  );
}

