import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            No account required · 100% local storage
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Take control of
            <br />
            <span className="text-yellow-300">your finances</span>
          </h1>

          <p className="mt-6 max-w-xl mx-auto text-lg text-indigo-100 text-balance">
            Track every dollar in and out, set a monthly budget, and watch your
            balance update in real time — all from one clean, fast dashboard.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
            >
              View Dashboard
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/transactions"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
              Add Transaction
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200" aria-label="Key stats">
        <div className="mx-auto max-w-5xl px-6 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '3', label: 'Core features' },
            { value: '22', label: 'Property tests' },
            { value: '0', label: 'Backend needed' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-indigo-600">{value}</p>
              <p className="mt-0.5 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="flex-1 bg-slate-50 py-20 px-6" aria-label="Features">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Everything you need</p>
            <h2 className="text-3xl font-bold text-slate-900">Built for real budgeting</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
                  <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2Z" stroke="#10b981" strokeWidth="1.5" />
                  <path d="M10 6v4l3 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Balance at a Glance</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Your total income, expenses, and balance — calculated instantly and displayed in colour-coded cards that update as you type.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Real-time</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Auto-calc</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="#6366f1" strokeWidth="1.5" />
                  <path d="M2 8h16" stroke="#6366f1" strokeWidth="1.5" />
                  <path d="M6 12h2M10 12h4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Transaction Management</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add, edit, delete, and filter by type or category. Stale-update protection means concurrent edits never silently overwrite each other.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">Full CRUD</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Persistent</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
                  <circle cx="10" cy="10" r="8" stroke="#f59e0b" strokeWidth="1.5" />
                  <path d="M10 6v4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="13.5" r="0.75" fill="#f59e0b" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Monthly Budget</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Set a spending limit and watch a progress bar shift from green to amber to red. Overspend detection with exact amounts shown.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Visual progress</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 py-14 px-6 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to start tracking?</h2>
        <p className="mt-2 text-indigo-200 text-sm">No setup. No sign-up. Just open and go.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-indigo-700 shadow hover:shadow-md hover:bg-indigo-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Open Dashboard
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
          </svg>
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-5 px-6 text-center text-xs text-slate-400">
        Smart Expense Tracker · Built with Next.js 14, TypeScript &amp; Tailwind CSS · Kiro University
      </footer>
    </div>
  );
}
