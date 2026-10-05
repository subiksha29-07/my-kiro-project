import Link from 'next/link';

/* ─── Inline SVG: Finance dashboard illustration ───────────────────────────
   A clean, self-contained SVG that looks like a personal-finance workspace.
   No external URLs, no extra dependencies.
──────────────────────────────────────────────────────────────────────────── */
function FinanceDashboardIllustration() {
  return (
    <svg
      viewBox="0 0 520 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Finance dashboard preview"
      role="img"
      className="w-full h-auto max-w-lg drop-shadow-2xl"
    >
      {/* ── Laptop base ── */}
      <rect x="60" y="280" width="400" height="16" rx="8" fill="#CBD5E1" />
      <rect x="80" y="270" width="360" height="14" rx="4" fill="#94A3B8" />

      {/* ── Screen ── */}
      <rect x="80" y="40" width="360" height="236" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />

      {/* Screen inner chrome */}
      <rect x="80" y="40" width="360" height="28" rx="12" fill="#F1F5F9" />
      <rect x="80" y="56" width="360" height="12" fill="#F1F5F9" />
      <circle cx="100" cy="54" r="4" fill="#FC8181" />
      <circle cx="114" cy="54" r="4" fill="#F6AD55" />
      <circle cx="128" cy="54" r="4" fill="#68D391" />

      {/* ── Dashboard content area ── */}
      {/* Header bar inside screen */}
      <rect x="92" y="78" width="336" height="20" rx="4" fill="#EEF2FF" />
      <rect x="100" y="84" width="60" height="8" rx="2" fill="#A5B4FC" />
      <rect x="380" y="84" width="40" height="8" rx="2" fill="#C7D2FE" />

      {/* ── Summary cards row ── */}
      {/* Card 1 — Income (green) */}
      <rect x="92" y="108" width="100" height="52" rx="8" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1" />
      <rect x="100" y="116" width="32" height="6" rx="2" fill="#86EFAC" />
      <rect x="100" y="127" width="56" height="10" rx="2" fill="#22C55E" />
      <rect x="100" y="142" width="40" height="6" rx="2" fill="#BBF7D0" />
      {/* up arrow icon */}
      <path d="M174 118 l5-5 5 5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Card 2 — Expenses (rose) */}
      <rect x="202" y="108" width="100" height="52" rx="8" fill="#FFF1F2" stroke="#FECDD3" strokeWidth="1" />
      <rect x="210" y="116" width="36" height="6" rx="2" fill="#FDA4AF" />
      <rect x="210" y="127" width="56" height="10" rx="2" fill="#F43F5E" />
      <rect x="210" y="142" width="44" height="6" rx="2" fill="#FECDD3" />
      {/* down arrow icon */}
      <path d="M284 118 l5 5 5-5" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Card 3 — Balance (blue) */}
      <rect x="312" y="108" width="116" height="52" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
      <rect x="320" y="116" width="30" height="6" rx="2" fill="#93C5FD" />
      <rect x="320" y="127" width="64" height="10" rx="2" fill="#3B82F6" />
      <rect x="320" y="142" width="48" height="6" rx="2" fill="#BFDBFE" />

      {/* ── Bar chart ── */}
      <rect x="92" y="174" width="200" height="96" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="100" y="180" width="60" height="6" rx="2" fill="#CBD5E1" />
      {/* bars */}
      <rect x="106" y="226" width="18" height="32" rx="3" fill="#BBF7D0" />
      <rect x="132" y="216" width="18" height="42" rx="3" fill="#22C55E" />
      <rect x="158" y="208" width="18" height="50" rx="3" fill="#16A34A" />
      <rect x="184" y="220" width="18" height="38" rx="3" fill="#86EFAC" />
      <rect x="210" y="212" width="18" height="46" rx="3" fill="#22C55E" />
      {/* x-axis labels */}
      <rect x="106" y="261" width="18" height="4" rx="1" fill="#E2E8F0" />
      <rect x="132" y="261" width="18" height="4" rx="1" fill="#E2E8F0" />
      <rect x="158" y="261" width="18" height="4" rx="1" fill="#E2E8F0" />
      <rect x="184" y="261" width="18" height="4" rx="1" fill="#E2E8F0" />
      <rect x="210" y="261" width="18" height="4" rx="1" fill="#E2E8F0" />

      {/* ── Budget progress panel ── */}
      <rect x="302" y="174" width="126" height="96" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="310" y="181" width="50" height="6" rx="2" fill="#CBD5E1" />
      {/* budget label */}
      <rect x="310" y="194" width="35" height="5" rx="1.5" fill="#E2E8F0" />
      <rect x="380" y="194" width="40" height="5" rx="1.5" fill="#BBF7D0" />
      {/* progress bar track */}
      <rect x="310" y="206" width="110" height="8" rx="4" fill="#F1F5F9" />
      {/* progress bar fill — 72% */}
      <rect x="310" y="206" width="79" height="8" rx="4" fill="#22C55E" />
      {/* second row */}
      <rect x="310" y="222" width="35" height="5" rx="1.5" fill="#E2E8F0" />
      <rect x="380" y="222" width="40" height="5" rx="1.5" fill="#FECDD3" />
      <rect x="310" y="234" width="110" height="8" rx="4" fill="#F1F5F9" />
      <rect x="310" y="234" width="92" height="8" rx="4" fill="#F43F5E" />
      {/* third row */}
      <rect x="310" y="250" width="35" height="5" rx="1.5" fill="#E2E8F0" />
      <rect x="380" y="250" width="40" height="5" rx="1.5" fill="#BFDBFE" />
      <rect x="310" y="262" width="110" height="8" rx="4" fill="#F1F5F9" />
      <rect x="310" y="262" width="55" height="8" rx="4" fill="#3B82F6" />

      {/* ── Decorative floating coins ── */}
      <circle cx="460" cy="90" r="18" fill="#FEF9C3" stroke="#FDE68A" strokeWidth="1.5" />
      <text x="460" y="95" textAnchor="middle" fontSize="14" fill="#D97706" fontWeight="bold">$</text>

      <circle cx="56" cy="160" r="13" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1.5" />
      <text x="56" y="165" textAnchor="middle" fontSize="10" fill="#16A34A" fontWeight="bold">↑</text>

      <circle cx="476" cy="220" r="10" fill="#EDE9FE" stroke="#DDD6FE" strokeWidth="1.5" />
      <circle cx="44" cy="240" r="8" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />

      {/* ── Webcam dot ── */}
      <circle cx="260" cy="44" r="3" fill="#CBD5E1" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white">

      {/* ════════════════════════════════════════════════════════════
          HERO — two-column, white background, fintech premium feel
      ════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-white"
        aria-label="Hero"
      >
        {/* Subtle background shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {/* large mint circle top-right */}
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-50 opacity-70" />
          {/* smaller circle bottom-left */}
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-50 opacity-50" />
          {/* very faint grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── LEFT: copy ── */}
            <div className="flex flex-col items-start">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 mb-7 tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Your money. Your goals.
              </div>

              {/* Headline */}
              <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.12] tracking-tight text-balance">
                Take control of
                <br />
                <span className="text-emerald-500">your finances</span>
              </h1>

              {/* Sub-copy */}
              <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-md text-balance">
                Track every dollar in and out, set a monthly budget, and watch your
                balance update in real time — all from one clean, fast dashboard.
              </p>

              {/* Trust chips */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: '🔒', label: 'No account needed' },
                  { icon: '💾', label: '100% local storage' },
                  { icon: '⚡', label: 'Real-time updates' },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    <span aria-hidden>{icon}</span>
                    {label}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-9 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  View Dashboard
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/transactions"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-white px-7 py-3.5 text-base font-semibold text-emerald-600 hover:bg-emerald-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                  </svg>
                  Add Transaction
                </Link>
              </div>
            </div>

            {/* ── RIGHT: illustration ── */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Glow behind illustration */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      'radial-gradient(ellipse at 60% 40%, rgba(16,185,129,0.12) 0%, transparent 70%)',
                  }}
                  aria-hidden
                />
                <FinanceDashboardIllustration />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS — three metric cards
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 border-y border-slate-100" aria-label="Key metrics">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                value: '3',
                label: 'Core features',
                sub: 'Transactions, Dashboard, Budget',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500" aria-hidden>
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                ),
              },
              {
                value: '22',
                label: 'Property tests',
                sub: 'Verified with fast-check PBT',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500" aria-hidden>
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                ),
              },
              {
                value: '0',
                label: 'Backend needed',
                sub: 'Runs entirely in your browser',
                color: 'text-violet-600',
                bg: 'bg-violet-50',
                border: 'border-violet-100',
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-violet-500" aria-hidden>
                    <path d="M3.196 12.87l-.825.483a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .758 0l7.25-4.25a.75.75 0 0 0 0-1.294l-.825-.484-5.666 3.322a1.75 1.75 0 0 1-1.756 0L3.196 12.87Z" />
                    <path d="M3.196 8.87l-.825.483a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .758 0l7.25-4.25a.75.75 0 0 0 0-1.294l-.825-.484-5.666 3.322a1.75 1.75 0 0 1-1.756 0L3.196 8.87Z" />
                    <path d="M10.38 1.103a.75.75 0 0 0-.76 0l-7.25 4.25a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .76 0l7.25-4.25a.75.75 0 0 0 0-1.294l-7.25-4.25Z" />
                  </svg>
                ),
              },
            ].map(({ value, label, sub, color, bg, border, icon }) => (
              <div
                key={label}
                className={`flex flex-col items-center text-center rounded-2xl border ${border} ${bg} px-4 py-6 sm:px-6`}
              >
                <div className="mb-3">{icon}</div>
                <p className={`text-3xl sm:text-4xl font-extrabold ${color} leading-none`}>{value}</p>
                <p className="mt-1.5 text-sm font-semibold text-slate-700">{label}</p>
                <p className="mt-0.5 text-xs text-slate-400 hidden sm:block">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURES — three cards
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6" aria-label="Features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-3">
              Everything you need
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Built for real budgeting
            </h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto text-base">
              Three focused features, zero bloat. Everything works offline, right in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden>
                  <path d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.727 12.727.707.707M3 12h1m16 0h1M4.22 19.78l.707-.707m12.727-12.727.707-.707" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="4" stroke="#10b981" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Balance at a Glance</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Total income, expenses, and balance — calculated instantly in colour-coded cards that update in real time.
              </p>
              <div className="mt-5 flex gap-2 flex-wrap">
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Real-time</span>
                <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">Auto-calc</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M3 9h18" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M7 13h4M7 16h2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Transaction Management</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add, edit, delete, and filter by type or category. Stale-update protection prevents silent overwrites.
              </p>
              <div className="mt-5 flex gap-2 flex-wrap">
                <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Full CRUD</span>
                <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">Persistent</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" stroke="#f59e0b" strokeWidth="1.5" />
                  <path d="M12 6v6l4 2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Monthly Budget</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Set a spending limit and watch a progress bar shift from green to amber to red. Overspend alerts included.
              </p>
              <div className="mt-5 flex gap-2 flex-wrap">
                <span className="rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">Visual progress</span>
                <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA BANNER — clean mint, no purple
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-emerald-500 py-16 px-6 text-center text-white" aria-label="Call to action">
        {/* subtle pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to start tracking?</h2>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base">
            No setup. No sign-up. Just open and go.
          </p>
          <Link
            href="/dashboard"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-emerald-700 shadow hover:shadow-md hover:bg-emerald-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-500"
          >
            Open Dashboard
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-900 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
              <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4" aria-hidden>
                <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.255-.414.384-.833.384-1.253 0-.41-.123-.827-.368-1.249a3.96 3.96 0 0 0-1.154-.68ZM8.5 12.89c.347.51.886.903 1.619 1.18V12.11c-.34.14-.64.34-.894.59-.473.46-.725.948-.725 1.19Z" />
                <path fillRule="evenodd" d="M9.25 3.5a.75.75 0 0 1 1.5 0V4c1.147.113 2.19.667 2.888 1.538l-1.21.907A2.28 2.28 0 0 0 11 5.625V7.87a4.97 4.97 0 0 1 1.816 1.1c.59.552.934 1.207.934 1.902 0 .697-.345 1.352-.934 1.903A4.97 4.97 0 0 1 11 13.876v2.374a.75.75 0 0 1-1.5 0v-2.264c-1.188-.256-2.14-.9-2.725-1.806l1.222-.88c.378.528.955.905 1.503 1.065v-2.385a4.97 4.97 0 0 1-1.816-1.1C7.095 8.33 6.75 7.675 6.75 6.98c0-.697.345-1.352.934-1.903A4.97 4.97 0 0 1 9.25 3.876V3.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Smart Expense Tracker</span>
          </div>
          <p className="text-xs text-slate-500 text-center">
            Built with Next.js 14 · TypeScript · Tailwind CSS · Kiro University
          </p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded">Dashboard</Link>
            <Link href="/transactions" className="text-xs text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded">Transactions</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
