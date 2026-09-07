'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  return (
    <nav className={`flex items-center gap-1.5 text-sm text-slate-400 ${className}`}>
      <Link href="/" className="flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-slate-800 hover:text-white">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="rounded-lg px-2 py-1 transition hover:bg-slate-800 hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <span className="rounded-lg px-2 py-1 text-white">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

