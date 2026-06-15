import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartDeal AI',
  description: 'A future-ready AI-powered shopping ecosystem for confident decisions and premium buying experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
