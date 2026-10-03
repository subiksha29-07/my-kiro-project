/**
 * Unit tests for lib/utils/currency.ts — formatCurrency()
 * Covers: positive integers, positive decimals, zero, large values, negatives.
 * Requirements: 2.3 (currency symbol + two decimal places)
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils/currency';

describe('formatCurrency', () => {
  it('formats a positive integer with two decimal places and dollar sign', () => {
    const result = formatCurrency(1234);
    expect(result).toBe('$1,234.00');
  });

  it('formats a positive decimal with two decimal places', () => {
    const result = formatCurrency(1234.5);
    expect(result).toContain('1,234.50');
    expect(result).toContain('$');
  });

  it('formats zero as $0.00', () => {
    const result = formatCurrency(0);
    expect(result).toBe('$0.00');
  });

  it('formats a large value with thousands separators', () => {
    const result = formatCurrency(999_999_999.99);
    expect(result).toContain('999,999,999.99');
    expect(result).toContain('$');
  });

  it('formats a small positive amount', () => {
    const result = formatCurrency(0.01);
    expect(result).toBe('$0.01');
  });

  it('formats a negative value with Unicode minus sign U+2212, not ASCII hyphen', () => {
    const result = formatCurrency(-123.45);
    // Must start with Unicode minus (U+2212), not ASCII hyphen-minus (U+002D)
    expect(result.charCodeAt(0)).toBe(0x2212);
    expect(result).toContain('$123.45');
  });

  it('formats negative value as −$123.45 (full string check)', () => {
    const result = formatCurrency(-123.45);
    // U+2212 followed immediately by $123.45
    expect(result).toBe('\u2212$123.45');
  });

  it('formats a negative integer correctly', () => {
    const result = formatCurrency(-500);
    expect(result.charCodeAt(0)).toBe(0x2212);
    expect(result).toContain('$500.00');
  });
});
