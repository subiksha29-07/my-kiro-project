import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════
          HERO — two-column, soft mint left, photo right
          Matches the reference: white/light bg, green accent
      ════════════════════════════════════════════════════════════ */}
      <section aria-label="Hero" className="relative bg-white">
        {/* Soft mint blob — left background wash, exactly like reference */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-1/2"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at 0% 50%, rgba(209,250,229,0.55) 0%, rgba(255,255,255,0) 70%)',
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-0 lg:min-h-[520px] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center w-full">

            {/* ── LEFT: copy ── */}
            <div className="flex flex-col items-start py-0 lg:py-16 lg:pr-10 z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 mb-8 tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                Your money. Your goals.
              </div>

              {/* Headline — matches reference typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Take control of
                <br />
                <span className="text-emerald-500">your finances</span>
              </h1>

              {/* Sub-copy */}
              <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-sm">
                Track every dollar in and out, set a monthly budget, and
                watch your balance update in real time — all from one clean,
                fast dashboard.
              </p>

              {/* CTAs — matches reference button style exactly */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  View Dashboard
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/transactions"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                  </svg>
                  Add Transaction
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Dashboard mockup SVG (looks like a laptop photo) ── */}
            <div className="relative flex items-center justify-center lg:justify-end">
              {/* Outer glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(209,250,229,0.4) 0%, transparent 70%)',
                }}
                aria-hidden
              />

              <div className="relative w-full max-w-[600px] lg:max-w-none">
                {/* Laptop-style dashboard mockup */}
                <svg
                  viewBox="0 0 620 440"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  aria-label="Smart Expense Tracker dashboard preview"
                  role="img"
                >
                  {/* ── Desk surface ── */}
                  <rect x="0" y="340" width="620" height="100" fill="#F5EFE6" />
                  <rect x="0" y="338" width="620" height="6" fill="#E8DDD0" />

                  {/* ── Coffee mug (left) ── */}
                  <ellipse cx="78" cy="344" rx="28" ry="8" fill="#D4C5B0" />
                  <rect x="50" y="270" width="56" height="76" rx="10" fill="#E8E0D5" />
                  <rect x="54" y="274" width="48" height="68" rx="8" fill="#F0EAE2" />
                  <path d="M106 290 Q120 296 106 310" stroke="#D4C5B0" strokeWidth="5" fill="none" strokeLinecap="round"/>
                  <ellipse cx="78" cy="274" rx="24" ry="6" fill="#D4C5B0" />
                  {/* steam */}
                  <path d="M68 265 Q70 258 68 252" stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                  <path d="M78 262 Q80 255 78 249" stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                  <path d="M88 265 Q90 258 88 252" stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>

                  {/* ── Notebook ── */}
                  <rect x="130" y="320" width="90" height="26" rx="3" fill="#E2E8F0" transform="rotate(-3 130 320)" />
                  <rect x="132" y="322" width="86" height="22" rx="2" fill="#F8FAFC" transform="rotate(-3 130 320)" />
                  <line x1="138" y1="330" x2="208" y2="328" stroke="#CBD5E1" strokeWidth="1" transform="rotate(-3 130 320)"/>
                  <line x1="138" y1="335" x2="195" y2="333" stroke="#CBD5E1" strokeWidth="1" transform="rotate(-3 130 320)"/>

                  {/* ── Plant (right) ── */}
                  <rect x="560" y="300" width="40" height="42" rx="6" fill="#D97706" opacity="0.7"/>
                  <rect x="563" y="303" width="34" height="36" rx="4" fill="#F59E0B" opacity="0.5"/>
                  {/* leaves */}
                  <ellipse cx="564" cy="295" rx="14" ry="22" fill="#16A34A" transform="rotate(-20 564 295)" opacity="0.85"/>
                  <ellipse cx="576" cy="288" rx="14" ry="22" fill="#22C55E" transform="rotate(10 576 288)" opacity="0.85"/>
                  <ellipse cx="590" cy="294" rx="12" ry="18" fill="#16A34A" transform="rotate(30 590 294)" opacity="0.8"/>
                  <ellipse cx="580" cy="280" rx="10" ry="16" fill="#4ADE80" transform="rotate(-5 580 280)" opacity="0.75"/>

                  {/* ── Phone (bottom right) ── */}
                  <rect x="520" y="330" width="36" height="20" rx="5" fill="#1E293B" />
                  <rect x="522" y="332" width="32" height="16" rx="3.5" fill="#334155" />
                  <rect x="524" y="334" width="28" height="12" rx="2.5" fill="#475569" />

                  {/* ── Laptop base ── */}
                  <rect x="148" y="322" width="340" height="14" rx="7" fill="#94A3B8" />
                  <rect x="162" y="314" width="312" height="12" rx="4" fill="#CBD5E1" />

                  {/* ── Laptop screen body ── */}
                  <rect x="152" y="48" width="316" height="272" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2"/>
                  {/* screen bezel top */}
                  <rect x="152" y="48" width="316" height="30" rx="12" fill="#1E293B"/>
                  <rect x="152" y="66" width="316" height="14" fill="#1E293B"/>
                  {/* traffic lights */}
                  <circle cx="174" cy="63" r="4" fill="#FC8181"/>
                  <circle cx="188" cy="63" r="4" fill="#FBBF24"/>
                  <circle cx="202" cy="63" r="4" fill="#4ADE80"/>
                  {/* webcam */}
                  <circle cx="310" cy="56" r="3" fill="#334155"/>

                  {/* ── Screen content ── */}
                  {/* Sidebar */}
                  <rect x="154" y="80" width="68" height="238" fill="#F1F5F9"/>
                  {/* sidebar logo */}
                  <rect x="162" y="90" width="20" height="20" rx="5" fill="#22C55E"/>
                  <rect x="164" y="92" width="16" height="16" rx="3" fill="#16A34A"/>
                  {/* sidebar nav items */}
                  {[110, 136, 162, 188].map((y, i) => (
                    <g key={y}>
                      <rect x="162" y={y} width="8" height="8" rx="2" fill={i === 0 ? '#22C55E' : '#CBD5E1'}/>
                      <rect x="174" y={y + 1} width={i === 0 ? 32 : 26} height="6" rx="2" fill={i === 0 ? '#86EFAC' : '#E2E8F0'}/>
                    </g>
                  ))}

                  {/* ── Main content area ── */}
                  {/* Header */}
                  <rect x="224" y="88" width="230" height="8" rx="3" fill="#F1F5F9"/>
                  <rect x="224" y="88" width="80" height="8" rx="3" fill="#94A3B8"/>
                  {/* Total balance hero number */}
                  <rect x="224" y="104" width="50" height="6" rx="2" fill="#CBD5E1"/>
                  <rect x="224" y="116" width="90" height="16" rx="3" fill="#0F172A"/>
                  {/* up badge */}
                  <rect x="324" y="116" width="48" height="16" rx="8" fill="#DCFCE7"/>
                  <rect x="330" y="120" width="36" height="8" rx="2" fill="#22C55E"/>

                  {/* ── 3 mini stat cards ── */}
                  {/* Income */}
                  <rect x="224" y="142" width="68" height="44" rx="6" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1"/>
                  <rect x="230" y="148" width="28" height="5" rx="1.5" fill="#86EFAC"/>
                  <rect x="230" y="157" width="50" height="8" rx="2" fill="#16A34A"/>
                  <rect x="230" y="169" width="36" height="5" rx="1.5" fill="#BBF7D0"/>
                  {/* Expenses */}
                  <rect x="300" y="142" width="68" height="44" rx="6" fill="#FFF1F2" stroke="#FECDD3" strokeWidth="1"/>
                  <rect x="306" y="148" width="32" height="5" rx="1.5" fill="#FDA4AF"/>
                  <rect x="306" y="157" width="50" height="8" rx="2" fill="#E11D48"/>
                  <rect x="306" y="169" width="40" height="5" rx="1.5" fill="#FECDD3"/>
                  {/* Budget */}
                  <rect x="376" y="142" width="68" height="44" rx="6" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1"/>
                  <rect x="382" y="148" width="26" height="5" rx="1.5" fill="#93C5FD"/>
                  <rect x="382" y="157" width="50" height="8" rx="2" fill="#2563EB"/>
                  <rect x="382" y="169" width="36" height="5" rx="1.5" fill="#BFDBFE"/>

                  {/* ── Recent Transactions label ── */}
                  <rect x="224" y="198" width="72" height="7" rx="2" fill="#94A3B8"/>
                  <rect x="372" y="198" width="32" height="7" rx="2" fill="#22C55E"/>

                  {/* Transaction rows */}
                  {[
                    { y: 214, icon: '#22C55E', label: 38, cat: 28, amt: '#22C55E', date: 24 },
                    { y: 236, icon: '#E11D48', label: 30, cat: 22, amt: '#E11D48', date: 24 },
                    { y: 258, icon: '#F59E0B', label: 34, cat: 26, amt: '#F59E0B', date: 24 },
                  ].map(({ y, icon, label, cat, amt, date }) => (
                    <g key={y}>
                      <rect x="224" y={y} width="220" height="18" rx="4" fill="white"/>
                      <circle cx="232" cy={y + 9} r="5" fill={icon} opacity="0.2"/>
                      <circle cx="232" cy={y + 9} r="3" fill={icon}/>
                      <rect x="242" y={y + 4} width={label} height="5" rx="1.5" fill="#374151"/>
                      <rect x="242" y={y + 11} width={cat} height="4" rx="1.5" fill="#CBD5E1"/>
                      <rect x={390} y={y + 5} width={date} height="5" rx="1.5" fill="#E2E8F0"/>
                      <rect x={390} y={y + 12} width={date - 2} height="4" rx="1.5" fill={amt} opacity="0.8"/>
                    </g>
                  ))}

                  {/* window reflection/glare */}
                  <rect x="156" y="82" width="4" height="232" fill="white" opacity="0.08" rx="2"/>
                </svg>

                {/* Floating badge — "Total Balance" card overlay */}
                <div className="absolute top-[10%] left-[-8%] hidden lg:flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 min-w-[130px]">
                  <span className="text-xs text-slate-400 font-medium">Total Balance</span>
                  <span className="text-lg font-extrabold text-slate-900 mt-0.5">$2,480.00</span>
                  <span className="text-xs text-emerald-500 font-semibold mt-0.5">↑ +12% vs last month</span>
                </div>

                {/* Floating badge — savings */}
                <div className="absolute bottom-[18%] right-[-4%] hidden lg:flex items-center gap-2 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-emerald-600" aria-hidden>
                      <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm9-3.25a.75.75 0 0 0-1.5 0V8c0 .27.144.518.378.651l2.5 1.5a.75.75 0 1 0 .744-1.302L9 7.596V4.75Z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Budget on track</p>
                    <p className="text-xs text-slate-400">72% used this month</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS BAR — horizontal with icons, matches reference exactly
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-100" aria-label="Key metrics">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {[
              {
                value: '3',
                label: 'Core features',
                bg: 'bg-emerald-100',
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-600" aria-hidden>
                    <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 0 1.1 1.677A.75.75 0 0 1 13.26 18H6.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 0 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5ZM10 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd"/>
                  </svg>
                ),
              },
              {
                value: '22',
                label: 'Property tests',
                bg: 'bg-violet-100',
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-violet-600" aria-hidden>
                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd"/>
                  </svg>
                ),
              },
              {
                value: '0',
                label: 'Backend needed',
                bg: 'bg-rose-100',
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-500" aria-hidden>
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd"/>
                  </svg>
                ),
              },
            ].map(({ value, label, bg, icon }) => (
              <div key={label} className="flex items-center justify-center gap-4 px-6 py-2 sm:py-0">
                <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  {icon}
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

      {/* ════════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 px-6" aria-label="Features">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-3">
              Everything you need
            </span>
            <h2 className="text-3xl font-bold text-slate-900">Built for real budgeting</h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto text-base">
              Three focused features, zero bloat. Runs entirely in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Balance at a Glance',
                desc: 'Total income, expenses, and balance — calculated instantly in colour-coded cards that update in real time.',
                tags: ['Real-time', 'Auto-calc'],
                tagColors: ['bg-emerald-50 text-emerald-700 border-emerald-100', 'bg-slate-50 text-slate-600 border-slate-200'],
                iconBg: 'bg-emerald-50',
                hoverBorder: 'hover:border-emerald-200',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden>
                    <path d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.727 12.727.707.707M3 12h1m16 0h1M4.22 19.78l.707-.707m12.727-12.727.707-.707" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="4" stroke="#10b981" strokeWidth="1.5"/>
                  </svg>
                ),
              },
              {
                title: 'Transaction Management',
                desc: 'Add, edit, delete, and filter by type or category. Stale-update protection prevents silent overwrites.',
                tags: ['Full CRUD', 'Persistent'],
                tagColors: ['bg-blue-50 text-blue-700 border-blue-100', 'bg-slate-50 text-slate-600 border-slate-200'],
                iconBg: 'bg-blue-50',
                hoverBorder: 'hover:border-blue-200',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.5"/>
                    <path d="M3 9h18M7 13h4M7 16h2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: 'Monthly Budget',
                desc: 'Set a spending limit and watch a progress bar shift from green to amber to red. Overspend alerts included.',
                tags: ['Visual progress', 'Alerts'],
                tagColors: ['bg-amber-50 text-amber-700 border-amber-100', 'bg-slate-50 text-slate-600 border-slate-200'],
                iconBg: 'bg-amber-50',
                hoverBorder: 'hover:border-amber-200',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" stroke="#f59e0b" strokeWidth="1.5"/>
                    <path d="M12 6v6l4 2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
            ].map(({ title, desc, tags, tagColors, iconBg, hoverBorder, icon }) => (
              <div key={title} className={`bg-white rounded-2xl p-7 border border-slate-100 shadow-sm ${hoverBorder} hover:shadow-md transition-all`}>
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
                  {icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                <div className="mt-5 flex gap-2 flex-wrap">
                  {tags.map((tag, i) => (
                    <span key={tag} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagColors[i]}`}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="relative bg-emerald-600 py-16 px-6 text-center text-white overflow-hidden" aria-label="Call to action">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '22px 22px' }} aria-hidden/>
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to start tracking?</h2>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base">No setup. No sign-up. Just open and go.</p>
          <Link
            href="/dashboard"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-emerald-700 shadow hover:bg-emerald-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-600"
          >
            Open Dashboard
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-900 py-8 px-6">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
              <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4" aria-hidden>
                <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.255-.414.384-.833.384-1.253 0-.41-.123-.827-.368-1.249a3.96 3.96 0 0 0-1.154-.68ZM8.5 12.89c.347.51.886.903 1.619 1.18V12.11c-.34.14-.64.34-.894.59-.473.46-.725.948-.725 1.19Z"/>
                <path fillRule="evenodd" d="M9.25 3.5a.75.75 0 0 1 1.5 0V4c1.147.113 2.19.667 2.888 1.538l-1.21.907A2.28 2.28 0 0 0 11 5.625V7.87a4.97 4.97 0 0 1 1.816 1.1c.59.552.934 1.207.934 1.902 0 .697-.345 1.352-.934 1.903A4.97 4.97 0 0 1 11 13.876v2.374a.75.75 0 0 1-1.5 0v-2.264c-1.188-.256-2.14-.9-2.725-1.806l1.222-.88c.378.528.955.905 1.503 1.065v-2.385a4.97 4.97 0 0 1-1.816-1.1C7.095 8.33 6.75 7.675 6.75 6.98c0-.697.345-1.352.934-1.903A4.97 4.97 0 0 1 9.25 3.876V3.5Z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Smart Expense Tracker</span>
          </div>
          <p className="text-xs text-slate-500 text-center">Built with Next.js 14 · TypeScript · Tailwind CSS · Kiro University</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded">Dashboard</Link>
            <Link href="/transactions" className="text-xs text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded">Transactions</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
