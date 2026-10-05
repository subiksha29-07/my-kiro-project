/**
 * Smoke tests for the SummaryCard component.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';

describe('SummaryCard', () => {
  it('renders the label', () => {
    render(<SummaryCard label="Total Income" value={1000} variant="income" />);
    expect(screen.getByText('Total Income')).toBeDefined();
  });

  it('shows a skeleton placeholder when isLoading is true', () => {
    render(<SummaryCard label="Total Income" value={1000} variant="income" isLoading />);
    expect(screen.queryByText('$1,000.00')).toBeNull();
    expect(screen.getByLabelText('Loading Total Income')).toBeDefined();
  });

  it('shows the formatted currency value when not loading', () => {
    render(<SummaryCard label="Total Income" value={1234.56} variant="income" />);
    expect(screen.getByText('$1,234.56')).toBeDefined();
  });

  it('applies emerald/green colour scheme for income variant', () => {
    const { container } = render(
      <SummaryCard label="Total Income" value={500} variant="income" />,
    );
    // New design uses emerald-50 / emerald-500
    expect(container.innerHTML).toContain('emerald');
  });

  it('applies rose/red colour scheme for expense variant', () => {
    const { container } = render(
      <SummaryCard label="Total Expenses" value={200} variant="expense" />,
    );
    // New design uses rose-50 / rose-500
    expect(container.innerHTML).toContain('rose');
  });

  it('applies a positive colour for balance variant when value >= 0', () => {
    const { container } = render(
      <SummaryCard label="Current Balance" value={300} variant="balance" />,
    );
    // Positive balance uses indigo (not red/rose)
    expect(container.innerHTML).not.toMatch(/bg-rose-\d+/);
  });

  it('applies rose colour for balance variant when value < 0', () => {
    const { container } = render(
      <SummaryCard label="Current Balance" value={-50} variant="balance" />,
    );
    // Negative balance icon uses rose-500
    expect(container.innerHTML).toContain('rose-500');
  });
});
