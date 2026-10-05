'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthModalProps {
  isOpen: boolean;
  defaultTab?: 'login' | 'register';
  onClose: () => void;
}

const INPUT =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all';
const LABEL = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

export default function AuthModal({ isOpen, defaultTab = 'login', onClose }: AuthModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens / tab changes
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setName('');
      setEmail('');
      setPassword('');
      setLoading(false);
      setTimeout(() => firstInputRef.current?.focus(), 60);
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate a brief loading state, then navigate to dashboard
    setTimeout(() => {
      onClose();
      router.push('/dashboard');
    }, 700);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label={tab === 'login' ? 'Sign in' : 'Create account'}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-5 flex items-start justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 mb-3">
              <svg viewBox="0 0 20 20" fill="white" className="w-5 h-5" aria-hidden>
                <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.255-.414.384-.833.384-1.253 0-.41-.123-.827-.368-1.249a3.96 3.96 0 0 0-1.154-.68ZM8.5 12.89c.347.51.886.903 1.619 1.18V12.11c-.34.14-.64.34-.894.59-.473.46-.725.948-.725 1.19Z" />
                <path fillRule="evenodd" d="M9.25 3.5a.75.75 0 0 1 1.5 0V4c1.147.113 2.19.667 2.888 1.538l-1.21.907A2.28 2.28 0 0 0 11 5.625V7.87a4.97 4.97 0 0 1 1.816 1.1c.59.552.934 1.207.934 1.902 0 .697-.345 1.352-.934 1.903A4.97 4.97 0 0 1 11 13.876v2.374a.75.75 0 0 1-1.5 0v-2.264c-1.188-.256-2.14-.9-2.725-1.806l1.222-.88c.378.528.955.905 1.503 1.065v-2.385a4.97 4.97 0 0 1-1.816-1.1C7.095 8.33 6.75 7.675 6.75 6.98c0-.697.345-1.352.934-1.903A4.97 4.97 0 0 1 9.25 3.876V3.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {tab === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {tab === 'login'
                ? 'Sign in to your Smart Expense Tracker'
                : 'Start tracking your finances today'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
              <path d="M2.22 2.22a.75.75 0 0 1 1.06 0L6 4.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L7.06 6l2.72 2.72a.75.75 0 1 1-1.06 1.06L6 7.06 3.28 9.78a.75.75 0 0 1-1.06-1.06L4.94 6 2.22 3.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* ── Tab toggle ── */}
        <div className="px-6 mb-5">
          <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none ${
                  tab === t
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

          {/* Name (register only) */}
          {tab === 'register' && (
            <div>
              <label htmlFor="auth-name" className={LABEL}>Full name</label>
              <input
                id="auth-name"
                ref={tab === 'register' ? firstInputRef : undefined}
                type="text"
                autoComplete="name"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="auth-email" className={LABEL}>Email address</label>
            <input
              id="auth-email"
              ref={tab === 'login' ? firstInputRef : undefined}
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="auth-password" className={LABEL} style={{ marginBottom: 0 }}>Password</label>
              {tab === 'login' && (
                <button type="button" className="text-xs text-violet-600 hover:text-violet-700 focus:outline-none">
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="auth-password"
              type="password"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={INPUT}
            />
            {tab === 'register' && (
              <p className="mt-1 text-xs text-slate-400">Minimum 6 characters</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                  <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {tab === 'login' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              tab === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          {/* Switch hint */}
          <p className="text-center text-xs text-slate-500">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
              className="text-violet-600 font-semibold hover:underline focus:outline-none"
            >
              {tab === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>

          {/* Demo note */}
          <p className="text-center text-xs text-slate-400 border-t border-slate-100 pt-3">
            Demo app · All data stored locally in your browser
          </p>
        </form>
      </div>
    </div>
  );
}
