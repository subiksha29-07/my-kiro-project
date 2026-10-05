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

            {/* Brand — purple $ icon + name */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
            >
              {/* Logo: violet rounded-xl with $ */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-sm group-hover:bg-violet-700 transition-colors shrink-0">
                <span className="text-white font-extrabold text-lg leading-none select-none" aria-hidden>
                  $
                </span>
              </div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-violet-600 transition-colors">
                Smart Expense Tracker
              </span>
            </Link>

            {/* Nav — links removed, logo only */}
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
