/**
 * Currency formatting utility for the Smart Expense Tracker.
 * Pure function — no side effects, no React, no browser dependencies.
 */

/**
 * Formats a number as USD currency with exactly 2 decimal places.
 *
 * Negative values use the Unicode minus sign U+2212 (−) rather than
 * the ASCII hyphen-minus (-) to satisfy the display requirement
 * (e.g. formatCurrency(-123.45) → "−$123.45").
 *
 * `Math.abs` is applied before formatting so `Intl.NumberFormat` never
 * inserts its own sign character, then the Unicode minus is prepended
 * for negative values.
 *
 * @param value - The numeric amount to format (may be negative for balance display).
 * @returns A formatted currency string, e.g. "$1,234.56" or "−$123.45".
 */
export function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  // Prepend Unicode minus sign (U+2212) for negative values, not ASCII hyphen.
  return value < 0 ? `\u2212${formatted}` : formatted;
}
