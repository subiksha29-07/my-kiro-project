import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">

      {/* ── Top Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-sm group-hover:bg-violet-700 transition-colors shrink-0">
              <span className="text-white font-extrabold text-lg leading-none select-none" aria-hidden>$</span>
            </div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-violet-600 transition-colors">
              Smart Expense Tracker
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path d="M1 2.75A.75.75 0 0 1 1.75 2h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 2.75Zm8 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.75ZM1 8a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 1 8Zm4 0a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 5 8Zm-4 5.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm8 0a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path fillRule="evenodd" d="M1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v2A1.5 1.5 0 0 1 13.5 7h-11A1.5 1.5 0 0 1 1 5.5v-2Zm1.5 0v2h11v-2h-11ZM1 10.5A1.5 1.5 0 0 1 2.5 9h11a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-2Zm1.5 0v2h11v-2h-11Z" clipRule="evenodd" />
              </svg>
              Transactions
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section aria-label="Hero" className="relative bg-white">
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-1/2"
          style={{ background: 'radial-gradient(ellipse 90% 80% at 0% 50%, rgba(221,214,254,0.55) 0%, rgba(255,255,255,0) 70%)' }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-0 lg:min-h-[520px] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center w-full">

            {/* LEFT */}
            <div className="flex flex-col items-start py-0 lg:py-16 lg:pr-10 z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-700 mb-8 tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden />
                Your money. Your goals.
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Take control of
                <br />
                <span className="text-violet-500">your finances</span>
              </h1>

              <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-sm">
                Track every dollar in and out, set a monthly budget, and
                watch your balance update in real time — all from one clean,
                fast dashboard.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                  View Dashboard
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/transactions"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                  </svg>
                  Add Transaction
                </Link>
              </div>
            </div>

            {/* RIGHT — laptop illustration */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(221,214,254,0.4) 0%, transparent 70%)' }}
                aria-hidden
              />
              <div className="relative w-full max-w-[560px]">
                <svg viewBox="0 0 620 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" aria-label="Smart Expense Tracker dashboard preview" role="img">
                  <rect x="0" y="340" width="620" height="100" fill="#F5EFE6" />
                  <rect x="0" y="338" width="620" height="6" fill="#E8DDD0" />
                  <ellipse cx="78" cy="344" rx="28" ry="8" fill="#D4C5B0" />
                  <rect x="50" y="270" width="56" height="76" rx="10" fill="#E8E0D5" />
                  <rect x="54" y="274" width="48" height="68" rx="8" fill="#F0EAE2" />
                  <path d="M106 290 Q120 296 106 310" stroke="#D4C5B0" strokeWidth="5" fill="none" strokeLinecap="round"/>
                  <ellipse cx="78" cy="274" rx="24" ry="6" fill="#D4C5B0" />
                  <path d="M68 265 Q70 258 68 252" stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                  <path d="M78 262 Q80 255 78 249" stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                  <path d="M88 265 Q90 258 88 252" stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
                  <rect x="560" y="300" width="40" height="42" rx="6" fill="#D97706" opacity="0.7"/>
                  <ellipse cx="576" cy="288" rx="14" ry="22" fill="#22C55E" transform="rotate(10 576 288)" opacity="0.85"/>
                  <ellipse cx="590" cy="294" rx="12" ry="18" fill="#16A34A" transform="rotate(30 590 294)" opacity="0.8"/>
                  <rect x="148" y="322" width="340" height="14" rx="7" fill="#94A3B8" />
                  <rect x="162" y="314" width="312" height="12" rx="4" fill="#CBD5E1" />
                  <rect x="152" y="48" width="316" height="272" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2"/>
                  <rect x="152" y="48" width="316" height="30" rx="12" fill="#1E293B"/>
                  <rect x="152" y="66" width="316" height="14" fill="#1E293B"/>
                  <circle cx="174" cy="63" r="4" fill="#FC8181"/>
                  <circle cx="188" cy="63" r="4" fill="#FBBF24"/>
                  <circle cx="202" cy="63" r="4" fill="#4ADE80"/>
                  <circle cx="310" cy="56" r="3" fill="#334155"/>
                  <rect x="154" y="80" width="68" height="238" fill="#F1F5F9"/>
                  <rect x="162" y="90" width="20" height="20" rx="5" fill="#7C3AED"/>
                  {[110, 136, 162, 188].map((y, i) => (
                    <g key={y}>
                      <rect x="162" y={y} width="8" height="8" rx="2" fill={i === 0 ? '#7C3AED' : '#CBD5E1'}/>
                      <rect x="174" y={y + 1} width={i === 0 ? 32 : 26} height="6" rx="2" fill={i === 0 ? '#DDD6FE' : '#E2E8F0'}/>
                    </g>
                  ))}
                  <rect x="224" y="104" width="50" height="6" rx="2" fill="#CBD5E1"/>
                  <rect x="224" y="116" width="90" height="16" rx="3" fill="#0F172A"/>
                  <rect x="324" y="116" width="48" height="16" rx="8" fill="#DCFCE7"/>
                  <rect x="330" y="120" width="36" height="8" rx="2" fill="#22C55E"/>
                  <rect x="224" y="142" width="68" height="44" rx="6" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1"/>
                  <rect x="230" y="157" width="50" height="8" rx="2" fill="#16A34A"/>
                  <rect x="300" y="142" width="68" height="44" rx="6" fill="#FFF1F2" stroke="#FECDD3" strokeWidth="1"/>
                  <rect x="306" y="157" width="50" height="8" rx="2" fill="#E11D48"/>
                  <rect x="376" y="142" width="68" height="44" rx="6" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1"/>
                  <rect x="382" y="157" width="50" height="8" rx="2" fill="#2563EB"/>
                  <rect x="224" y="198" width="72" height="7" rx="2" fill="#94A3B8"/>
                  <rect x="372" y="198" width="32" height="7" rx="2" fill="#7C3AED"/>
                  {[214, 236, 258].map((y, i) => {
                    const colors = ['#22C55E', '#E11D48', '#F59E0B'];
                    return (
                      <g key={y}>
                        <rect x="224" y={y} width="220" height="18" rx="4" fill="white"/>
                        <circle cx="232" cy={y + 9} r="3" fill={colors[i]}/>
                        <rect x="242" y={y + 4} width={30 + i * 8} height="5" rx="1.5" fill="#374151"/>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating balance badge */}
                <div className="absolute top-[10%] left-[-4%] hidden lg:flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 min-w-[130px]">
                  <span className="text-xs text-slate-400 font-medium">Total Balance</span>
                  <span className="text-lg font-extrabold text-slate-900 mt-0.5">$2,480.00</span>
                  <span className="text-xs text-violet-500 font-semibold mt-0.5">↑ +12% vs last month</span>
                </div>
              </div>
            </div>

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
