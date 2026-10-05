'use client';

import { useState } from 'react';
import AuthModal from './AuthModal';

/**
 * Login / Register button pair + modal.
 * Used in the navbar (layout.tsx) and optionally in the landing hero.
 */
export function AuthButtons({ variant = 'nav' }: { variant?: 'nav' | 'hero' }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');

  function openLogin()    { setTab('login');    setOpen(true); }
  function openRegister() { setTab('register'); setOpen(true); }

  if (variant === 'hero') {
    return (
      <>
        <button
          type="button"
          onClick={openLogin}
          className="inline-flex items-center justify-center rounded-xl border-2 border-violet-300 bg-white px-6 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={openRegister}
          className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
          Get Started Free
        </button>
        <AuthModal isOpen={open} defaultTab={tab} onClose={() => setOpen(false)} />
      </>
    );
  }

  // nav variant
  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={openLogin}
          className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={openRegister}
          className="px-3.5 py-2 rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          Register
        </button>
      </div>
      <AuthModal isOpen={open} defaultTab={tab} onClose={() => setOpen(false)} />
    </>
  );
}
