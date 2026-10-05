'use client';

import type { Transaction } from '@/lib/transactions/types';

interface MonthlyBreakdownProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

// ─── Palette (violet shades, matches app theme) ──────────────────────────────
const PALETTE = [
  '#7C3AED', // violet-600
  '#A78BFA', // violet-400
  '#6D28D9', // violet-700
  '#C4B5FD', // violet-300
  '#5B21B6', // violet-800
  '#DDD6FE', // violet-200
  '#8B5CF6', // violet-500
  '#EDE9FE', // violet-100
];

// ─── Data helpers ─────────────────────────────────────────────────────────────

interface CategorySlice {
  category: string;
  total: number;
  color: string;
}

interface MonthBar {
  label: string;  // e.g. "Oct 26"
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
  // Last 6 months ascending
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

// ─── Donut chart (SVG) ────────────────────────────────────────────────────────

function DonutChart({ slices }: { slices: CategorySlice[] }) {
  const cx = 80;
  const cy = 80;
  const R = 60;   // outer radius
  const r = 38;   // inner radius (hole)
  const total = slices.reduce((s, c) => s + c.total, 0);

  if (slices.length === 0 || total === 0) {
    // Empty ring
    return (
      <svg viewBox="0 0 160 160" className="w-36 h-36 shrink-0">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#2D3748" strokeWidth={R - r} />
      </svg>
    );
  }

  // Build arc paths
  let angle = -Math.PI / 2; // start at top
  const paths: { d: string; color: string }[] = [];

  for (const slice of slices) {
    const sweep = (slice.total / total) * 2 * Math.PI;
    // Gap between slices
    const gap = slices.length > 1 ? 0.03 : 0;
    const startAngle = angle + gap / 2;
    const endAngle = angle + sweep - gap / 2;

    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);
    const x3 = cx + r * Math.cos(endAngle);
    const y3 = cy + r * Math.sin(endAngle);
    const x4 = cx + r * Math.cos(startAngle);
    const y4 = cy + r * Math.sin(startAngle);

    const largeArc = sweep - gap >= Math.PI ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${r} ${r} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    paths.push({ d, color: slice.color });
    angle += sweep;
  }

  return (
    <svg viewBox="0 0 160 160" className="w-36 h-36 shrink-0">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} />
      ))}
    </svg>
  );
}

// ─── Bar chart (SVG) ──────────────────────────────────────────────────────────

function BarChart({ bars }: { bars: MonthBar[] }) {
  const W = 320;
  const H = 180;
  const padL = 36;
  const padB = 28;
  const padT = 12;
  const padR = 8;
  const chartW = W - padL - padR;
  const chartH = H - padB - padT;

  const maxVal = Math.max(...bars.map((b) => b.expenses), 1);

  // Y-axis gridlines
  const steps = 5;
  const stepVal = maxVal / steps;
  const yLines = Array.from({ length: steps + 1 }, (_, i) => i * stepVal);

  const barCount = bars.length || 6;
  const barW = Math.max(16, (chartW / barCount) * 0.5);
  const gap = chartW / barCount;

  function yPos(val: number) {
    return padT + chartH - (val / maxVal) * chartH;
  }

  function formatLabel(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return String(Math.round(n));
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {/* Grid lines */}
      {yLines.map((v, i) => {
        const y = yPos(v);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#2D3748" strokeWidth="1" />
            <text x={padL - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="#718096">
              {formatLabel(v)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {bars.map((b, i) => {
        const x = padL + i * gap + gap / 2 - barW / 2;
        const barH = (b.expenses / maxVal) * chartH;
        const y = padT + chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill="#7C3AED" />
            {/* X label */}
            <text
              x={x + barW / 2}
              y={H - padB + 14}
              textAnchor="middle"
              fontSize="8.5"
              fill="#A0AEC0"
            >
              {b.label}
            </text>
          </g>
        );
      })}

      {/* Bottom axis line */}
      <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#2D3748" strokeWidth="1" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MonthlyBreakdown({ transactions, isLoading = false }: MonthlyBreakdownProps) {
  const slices = buildCategorySlices(transactions);
  const bars = buildMonthBars(transactions);
  const hasExpenses = slices.length > 0;

  // Card base style — dark navy, matching reference
  const card = 'rounded-2xl bg-[#0F172A] border border-[#1E293B] p-5 flex flex-col gap-4';
  const title = 'flex items-center gap-2 text-sm font-semibold text-white';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className={`${card} min-h-[200px]`}>
            <div className="h-4 w-40 bg-slate-700 rounded animate-pulse" />
            <div className="flex-1 bg-slate-800 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ── Expenses by Category ── */}
      <div className={card}>
        <div className={title}>
          {/* donut icon */}
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-violet-400" aria-hidden>
            <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" clipRule="evenodd" />
          </svg>
          Expenses by Category
        </div>

        {!hasExpenses ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-slate-400">No expense data yet</p>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <DonutChart slices={slices} />
            {/* Legend */}
            <ul className="flex flex-col gap-2 min-w-0">
              {slices.slice(0, 6).map((s) => (
                <li key={s.category} className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: s.color }}
                    aria-hidden
                  />
                  <span className="text-xs text-slate-300 truncate">{s.category}</span>
                </li>
              ))}
              {slices.length > 6 && (
                <li className="text-xs text-slate-500">+{slices.length - 6} more</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ── Monthly Trends ── */}
      <div className={card}>
        <div className={title}>
          {/* bar chart icon */}
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-violet-400" aria-hidden>
            <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3ZM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7ZM11 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3Z" />
          </svg>
          Monthly Trends
        </div>

        {bars.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-slate-400">No trend data yet</p>
          </div>
        ) : (
          <div className="flex-1 h-44">
            <BarChart bars={bars} />
          </div>
        )}
      </div>
    </div>
  );
}
