import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-12 lg:px-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-10 shadow-glow backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Secure onboarding</p>
          <h1 className="text-4xl font-semibold text-white">Smart verification for every login.</h1>
          <p className="max-w-2xl text-slate-400">Login instantly with email, Google, or GitHub. Enable two-factor authentication, review active sessions, and protect your account with device monitoring.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <button className="rounded-3xl bg-slate-800 px-6 py-4 text-left transition hover:bg-slate-700">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Email login</p>
            <p className="mt-2 text-lg font-semibold text-white">Continue with your email</p>
          </button>
          <button className="rounded-3xl bg-slate-800 px-6 py-4 text-left transition hover:bg-slate-700">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Social login</p>
            <p className="mt-2 text-lg font-semibold text-white">Google & GitHub support</p>
          </button>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-700 bg-slate-950/70 p-6">
          <h2 className="text-xl font-semibold text-white">Account security at a glance</h2>
          <ul className="space-y-3 text-slate-300">
            <li>• OTP-based phone verification for checkout and account recovery.</li>
            <li>• Active session dashboard with suspicious sign-in alerts.</li>
            <li>• Optional 2FA and device trust management.</li>
          </ul>
          <Link className="text-sky-400 hover:text-white" href="/account">View demo security dashboard</Link>
        </div>
      </div>
    </main>
  );
}
