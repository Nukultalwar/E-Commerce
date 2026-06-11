'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const sessions = [
  { device: 'MacBook Pro', location: 'Bengaluru, India', ip: '139.59.12.34', status: 'Trusted', active: true },
  { device: 'iPhone 15', location: 'Delhi, India', ip: '103.71.54.87', status: 'Under review', active: false },
  { device: 'Windows PC', location: 'Mumbai, India', ip: '45.56.145.11', status: 'Trusted', active: false },
];

export default function AccountSecurityPanel() {
  const [showAlert, setShowAlert] = useState(true);
  const suspiciousSessions = useMemo(() => sessions.filter((item) => item.status !== 'Trusted'), []);

  return (
    <section className="grid gap-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-glow lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Security alert</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Instant insights when your account changes</h2>
            </div>
            <ShieldAlert className="h-10 w-10 text-cyan-300" />
          </div>
          {showAlert && (
            <div className="mt-6 rounded-3xl bg-slate-950/80 p-5 text-slate-100">
              <p className="font-semibold">Suspicious login detected</p>
              <p className="mt-2 text-sm text-slate-400">A login from a new device was detected in Delhi. Review active sessions and revoke access if needed.</p>
              <button type="button" onClick={() => setShowAlert(false)} className="mt-4 rounded-full bg-slate-800 px-4 py-2 text-sm text-cyan-300 hover:bg-slate-700">Dismiss</button>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Active sessions</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Manage devices and sessions</h3>
            </div>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-slate-300">{sessions.length} devices</span>
          </div>
          <div className="mt-6 space-y-4">
            {sessions.map((session) => (
              <div key={session.ip} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{session.device}</p>
                    <p className="text-sm text-slate-400">{session.location} • {session.ip}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${session.status === 'Trusted' ? 'bg-green-500/15 text-green-300' : 'bg-amber-500/10 text-amber-300'}`}>{session.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <aside className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <h3 className="text-2xl font-semibold text-white">Fast actions</h3>
        <div className="space-y-4">
          <button className="w-full rounded-3xl bg-slate-800 px-5 py-4 text-left text-sm text-slate-100 transition hover:bg-slate-700">Enable two-factor authentication</button>
          <button className="w-full rounded-3xl bg-slate-800 px-5 py-4 text-left text-sm text-slate-100 transition hover:bg-slate-700">Review recent login history</button>
          <button className="w-full rounded-3xl bg-amber-500 px-5 py-4 text-left text-sm font-semibold text-slate-950 transition hover:bg-amber-400">Lock suspicious devices</button>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-5 text-sm leading-6 text-slate-300">
          <p className="font-semibold text-white">Security score</p>
          <p className="mt-2">Your account has a strong security posture, but enabling 2FA and removing unknown devices will make it even more resilient.</p>
          <div className="mt-4 rounded-3xl bg-slate-800 p-3 text-center text-slate-100">92 / 100</div>
        </div>
      </aside>
    </section>
  );
}
