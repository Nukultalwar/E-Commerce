import AccountSecurityPanel from '@/components/AccountSecurityPanel';

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/90 p-10 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Security center</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Real-time session monitoring and account protection</h1>
          <p className="mt-4 max-w-3xl text-slate-400">Review your active devices, suspicious logins, and secure your account from any mobile or desktop with instant alerts.</p>
        </header>
        <AccountSecurityPanel />
      </div>
    </main>
  );
}
