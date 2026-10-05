import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Smart Expense Tracker',
  description: 'Track your income, expenses, and monthly budget — no account required.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen`}>
        {/* ── Navbar ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-sm group-hover:bg-violet-700 transition-colors">
                <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4" aria-hidden>
                  <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.255-.414.384-.833.384-1.253 0-.41-.123-.827-.368-1.249a3.96 3.96 0 0 0-1.154-.68ZM8.5 12.89c.347.51.886.903 1.619 1.18V12.11c-.34.14-.64.34-.894.59-.473.46-.725.948-.725 1.19Z" />
                  <path fillRule="evenodd" d="M9.25 3.5a.75.75 0 0 1 1.5 0V4c1.147.113 2.19.667 2.888 1.538l-1.21.907A2.28 2.28 0 0 0 11 5.625V7.87a4.97 4.97 0 0 1 1.816 1.1c.59.552.934 1.207.934 1.902 0 .697-.345 1.352-.934 1.903A4.97 4.97 0 0 1 11 13.876v2.374a.75.75 0 0 1-1.5 0v-2.264c-1.188-.256-2.14-.9-2.725-1.806l1.222-.88c.378.528.955.905 1.503 1.065v-2.385a4.97 4.97 0 0 1-1.816-1.1C7.095 8.33 6.75 7.675 6.75 6.98c0-.697.345-1.352.934-1.903A4.97 4.97 0 0 1 9.25 3.876V3.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-violet-600 transition-colors">
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

        {children}
      </body>
    </html>
  );
}
