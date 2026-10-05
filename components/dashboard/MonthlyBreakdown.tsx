'use client';

import type { Transaction } from '@/lib/transactions/types';

interface MonthlyBreakdownProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const PALETTE = [
  '#7C3AED',
  '#A78BFA',
  '#6D28D9',
  '#C4B5FD',
  '#5B21B6',
  '#DDD6FE',
  '#8B5CF6',
  '#EDE9FE',
];

// ─── Data helpers ─────────────────────────────────────────────────────────────

interface CategorySlice {
  category: string;
  total: number;
  color: string;
}

interface MonthBar {
  label: string;
  expenses: number;
}

function buildCategorySlices(transactions: Transaction[]): CategorySlice[] {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === 'EXPENSE') {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, total], i) => ({
      category,
      total,
      color: PALETTE[i % PALETTE.length],
    }));
}

function buildMonthBars(transactions: Transaction[]): MonthBar[] {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === 'EXPENSE') {
      const ym = t.date.slice(0, 7);
      map.set(ym, (map.get(ym) ?? 0) + t.amount);
    }
  }
  const sorted = Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const last6 = sorted.slice(-6);
  return last6.map(([ym, expenses]) => {
    const [year, month] = ym.split('-').map(Number);
    const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleString('en-US', {
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC',
    });
    return { label, expenses };
  });
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
// Uses strokeDasharray/strokeDashoffset on a circle — much more reliable than arc paths.

function DonutChart({ slices }: { slices: CategorySlice[] }) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const R = 58;          // radius of stroke centre
  const strokeW = 28;    // ring thickness
  const circumference = 2 * Math.PI * R;
  const total = slices.reduce((s, c) => s + c.total, 0);
  const GAP_DEG = slices.length > 1 ? 3 : 0;
  const gap = (GAP_DEG / 360) * circumference;

  if (total === 0) {
    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-40 h-40 shrink-0" aria-hidden>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E9D5FF" strokeWidth={strokeW} />
      </svg>
    );
  }

  // Build segments using stroke-dasharray trick, rotated to start at top (-90°)
  let offset = 0;
  const segments: { dashArray: string; dashOffset: number; color: string; rotation: number }[] = [];

  for (const slice of slices) {
    const segLen = (slice.total / total) * circumference - gap;
    const rotation = (offset / circumference) * 360 - 90;
    segments.push({
      dashArray: `${Math.max(segLen, 0)} ${circumference}`,
      dashOffset: 0,
      color: slice.color,
      rotation,
    });
    offset += (slice.total / total) * circumference;
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-40 h-40 shrink-0" aria-hidden>
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeW}
          strokeDasharray={seg.dashArray}
          strokeDashoffset={seg.dashOffset}
          strokeLinecap="butt"
          transform={`rotate(${seg.rotation} ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function BarChart({ bars }: { bars: MonthBar[] }) {
  const W = 300;
  const H = 180;
  const padL = 38;
  const padB = 30;
  const padT = 10;
  const padR = 8;
  const chartW = W - padL - padR;
  const chartH = H - padB - padT;

  const maxVal = Math.max(...bars.map((b) => b.expenses), 1);
  const steps = 5;
  const yLines = Array.from({ length: steps + 1 }, (_, i) => (i * maxVal) / steps);
  const gap = chartW / (bars.length || 1);
  const barW = Math.max(12, gap * 0.55);

  function yPos(val: number) {
    return padT + chartH - (val / maxVal) * chartH;
  }

  function fmtY(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return String(Math.round(n));
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" aria-hidden>
      {/* Gridlines */}
      {yLines.map((v, i) => {
        const y = yPos(v);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#E9D5FF" strokeWidth="0.75" strokeDasharray={i === 0 ? '0' : '3 3'} />
            <text x={padL - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="#9CA3AF">
              {fmtY(v)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {bars.map((b, i) => {
        const x = padL + i * gap + gap / 2 - barW / 2;
        const bH = Math.max((b.expenses / maxVal) * chartH, 2);
        const y = padT + chartH - bH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bH} rx="4" fill="#7C3AED" />
            <text x={x + barW / 2} y={H - padB + 14} textAnchor="middle" fontSize="8" fill="#6B7280">
              {b.label}
            </text>
          </g>
        );
      })}

      {/* Axis baseline */}
      <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#D1D5DB" strokeWidth="1" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MonthlyBreakdown({ transactions, isLoading = false }: MonthlyBreakdownProps) {
  const slices = buildCategorySlices(transactions);
  const bars   = buildMonthBars(transactions);

  // White card style — matches the rest of the dashboard
  const card = 'rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col gap-4';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className={`${card} min-h-[220px]`}>
            <div className="h-4 w-44 bg-slate-100 rounded animate-pulse" />
            <div className="flex-1 bg-slate-50 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* ── Expenses by Category ── */}
      <div className={card}>
        {/* Header */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-violet-600 shrink-0" aria-hidden>
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-4.75a.75.75 0 0 0 1.5 0V8.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L6.2 9.74a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z" clipRule="evenodd" />
          </svg>
          <h3 className="text-sm font-semibold text-slate-800">Expenses by Category</h3>
        </div>

        {slices.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center py-8 gap-2">
            <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-violet-300">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-medium">No expense data yet</p>
            <p className="text-xs text-slate-400">Add expense transactions to see the chart.</p>
          </div>
        ) : (
          /* Donut + legend */
          <div className="flex items-center gap-6">
            <DonutChart slices={slices} />
            <ul className="flex flex-col gap-2.5 min-w-0 flex-1">
              {slices.slice(0, 7).map((s) => (
                <li key={s.category} className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-8 h-3.5 rounded shrink-0"
                    style={{ background: s.color }}
                    aria-hidden
                  />
                  <span className="text-xs text-slate-600 truncate font-medium">{s.category}</span>
                </li>
              ))}
              {slices.length > 7 && (
                <li className="text-xs text-slate-400">+{slices.length - 7} more</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ── Monthly Trends ── */}
      <div className={card}>
        {/* Header */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-violet-600 shrink-0" aria-hidden>
            <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3ZM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7ZM11 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3Z" />
          </svg>
          <h3 className="text-sm font-semibold text-slate-800">Monthly Trends</h3>
        </div>

        {bars.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center py-8 gap-2">
            <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-violet-300">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-medium">No trend data yet</p>
            <p className="text-xs text-slate-400">Add expense transactions to see monthly trends.</p>
          </div>
        ) : (
          /* Bar chart */
          <div className="flex-1 h-48">
            <BarChart bars={bars} />
          </div>
        )}
      </div>

    </div>
  );
}
