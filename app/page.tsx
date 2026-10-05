import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">

      {/* ── Top Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-sm group-hover:bg-violet-500 transition-colors shrink-0">
              <span className="text-white font-extrabold text-base leading-none select-none" aria-hidden>$</span>
            </div>
            <span className="font-extrabold text-white text-base tracking-tight group-hover:text-violet-300 transition-colors">
              Smart Expense Tracker
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path d="M1 2.75A.75.75 0 0 1 1.75 2h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 2.75Zm8 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.75ZM1 8a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 1 8Zm4 0a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 5 8Zm-4 5.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm8 0a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path fillRule="evenodd" d="M1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v2A1.5 1.5 0 0 1 13.5 7h-11A1.5 1.5 0 0 1 1 5.5v-2Zm1.5 0v2h11v-2h-11ZM1 10.5A1.5 1.5 0 0 1 2.5 9h11a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-2Zm1.5 0v2h11v-2h-11Z" clipRule="evenodd" />
              </svg>
              Transactions
            </Link>
            <Link
              href="/dashboard"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Enter App →
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(10,10,20,0.60) 0%, rgba(10,10,20,0.75) 100%),
            url("/hero-bg.jpg")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
        }}
      >

        {/* Content */}
        <div className="relative mx-auto max-w-5xl px-6 lg:px-10 py-24 text-center flex flex-col items-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-violet-300 mb-8 tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden />
            Personal Finance Tracker
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            Take Control of
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Your Finances
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-xl text-base sm:text-lg text-slate-300/80 leading-relaxed mb-10">
            Track every dollar in and out, set a monthly budget, and watch your
            balance update in real time — all from one clean, fast dashboard.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500 hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Open Dashboard
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/transactions"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              View Transactions
            </Link>
          </div>

          {/* Floating stat badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Total Balance', value: '$2,480.00', color: 'text-emerald-400', icon: '💰' },
              { label: 'This Month', value: '-$300.00', color: 'text-rose-400', icon: '📊' },
              { label: 'Budget Left', value: '$4,700.00', color: 'text-violet-400', icon: '🎯' },
            ].map(({ label, value, color, icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 shadow-xl"
              >
                <span className="text-xl" aria-hidden>{icon}</span>
                <div className="text-left">
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-100" aria-label="Key metrics">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {[
              { value: '3',  label: 'Core features',   bg: 'bg-violet-100', iconColor: 'text-violet-600',
                icon: <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 0 1.1 1.677A.75.75 0 0 1 13.26 18H6.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 0 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5ZM10 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd"/> },
              { value: '22', label: 'Property tests',  bg: 'bg-violet-100', iconColor: 'text-violet-600',
                icon: <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd"/> },
              { value: '0',  label: 'Backend needed', bg: 'bg-rose-100',   iconColor: 'text-rose-500',
                icon: <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd"/> },
            ].map(({ value, label, bg, iconColor, icon }) => (
              <div key={label} className="flex items-center justify-center gap-4 px-4 sm:px-6 py-4">
                <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${iconColor}`} aria-hidden>{icon}</svg>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">{value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20 px-6" aria-label="Features">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-xs font-semibold text-violet-700 uppercase tracking-widest mb-3">Everything you need</span>
            <h2 className="text-3xl font-bold text-slate-900">Built for real budgeting</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Balance at a Glance', desc: 'Total income, expenses, and balance — calculated instantly in colour-coded cards that update in real time.', tags: ['Real-time', 'Auto-calc'], tc: ['bg-violet-50 text-violet-700 border-violet-100', 'bg-slate-50 text-slate-600 border-slate-200'], ib: 'bg-violet-50', hb: 'hover:border-violet-200' },
              { title: 'Transaction Management', desc: 'Add, edit, delete, and filter by type or category. Stale-update protection prevents silent overwrites.', tags: ['Full CRUD', 'Persistent'], tc: ['bg-blue-50 text-blue-700 border-blue-100', 'bg-slate-50 text-slate-600 border-slate-200'], ib: 'bg-blue-50', hb: 'hover:border-blue-200' },
              { title: 'Monthly Budget', desc: 'Set a spending limit and watch a progress bar shift from green to amber to red. Overspend alerts included.', tags: ['Visual progress', 'Alerts'], tc: ['bg-amber-50 text-amber-700 border-amber-100', 'bg-slate-50 text-slate-600 border-slate-200'], ib: 'bg-amber-50', hb: 'hover:border-amber-200' },
            ].map(({ title, desc, tags, tc, ib, hb }) => (
              <div key={title} className={`bg-white rounded-2xl p-7 border border-slate-100 shadow-sm ${hb} hover:shadow-md transition-all`}>
                <div className={`w-12 h-12 rounded-xl ${ib} flex items-center justify-center mb-5`}>
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#7C3AED" strokeWidth="1.5"/>
                    <path d="M3 9h18M7 13h4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                <div className="mt-5 flex gap-2 flex-wrap">
                  {tags.map((tag, i) => (
                    <span key={tag} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tc[i]}`}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="relative bg-violet-600 py-16 px-6 text-center text-white overflow-hidden" aria-label="Call to action">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '22px 22px' }} aria-hidden/>
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to start tracking?</h2>
          <p className="mt-2 text-violet-100 text-sm">No setup. No sign-up. Just open and go.</p>
          <Link href="/dashboard" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-violet-700 shadow hover:bg-violet-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-600">
            Open Dashboard
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-slate-900 py-8 px-6">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
              <span className="text-white font-extrabold text-sm leading-none select-none" aria-hidden>$</span>
            </div>
            <span className="text-sm font-semibold text-white">Smart Expense Tracker</span>
          </div>
          <p className="text-xs text-slate-500 text-center">Built with Next.js 14 · TypeScript · Tailwind CSS · Kiro University</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/transactions" className="text-xs text-slate-400 hover:text-white transition-colors">Transactions</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
