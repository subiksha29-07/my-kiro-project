/**
 * Component tests for TransactionFilter
 * Tests: type filter changes, category filter changes, clear/reset.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionFilter from '@/components/transactions/TransactionFilter';
import type { FilterOptions } from '@/lib/transactions/types';

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderFilter(
  filters: FilterOptions = {},
  onChange = vi.fn()
) {
  render(<TransactionFilter filters={filters} onChange={onChange} />);
  return { onChange };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TransactionFilter', () => {
  describe('type filter', () => {
    it('renders the type select with "All Types" default', () => {
      renderFilter();
      const select = screen.getByLabelText(/filter by type/i) as HTMLSelectElement;
      expect(select.value).toBe('');
    });

    it('reflects the current type filter value', () => {
      renderFilter({ type: 'INCOME' });
      const select = screen.getByLabelText(/filter by type/i) as HTMLSelectElement;
      expect(select.value).toBe('INCOME');
    });

    it('calls onChange with type: INCOME when Income is selected', () => {
      const { onChange } = renderFilter();
      fireEvent.change(screen.getByLabelText(/filter by type/i), {
        target: { value: 'INCOME' },
      });
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange.mock.calls[0][0]).toMatchObject({ type: 'INCOME' });
    });

    it('calls onChange with type: EXPENSE when Expense is selected', () => {
      const { onChange } = renderFilter();
      fireEvent.change(screen.getByLabelText(/filter by type/i), {
        target: { value: 'EXPENSE' },
      });
      expect(onChange.mock.calls[0][0]).toMatchObject({ type: 'EXPENSE' });
    });

    it('calls onChange with type: undefined when All Types is selected', () => {
      const { onChange } = renderFilter({ type: 'INCOME' });
      fireEvent.change(screen.getByLabelText(/filter by type/i), {
        target: { value: '' },
      });
      const called = onChange.mock.calls[0][0] as FilterOptions;
      expect(called.type).toBeUndefined();
    });
  });

  describe('category filter', () => {
    it('renders the category select with "All Categories" default', () => {
      renderFilter();
      const select = screen.getByLabelText(/filter by category/i) as HTMLSelectElement;
      expect(select.value).toBe('');
    });

    it('reflects the current category filter value', () => {
      renderFilter({ category: 'Food' });
      const select = screen.getByLabelText(/filter by category/i) as HTMLSelectElement;
      expect(select.value).toBe('Food');
    });

    it('calls onChange with the selected category', () => {
      const { onChange } = renderFilter();
      fireEvent.change(screen.getByLabelText(/filter by category/i), {
        target: { value: 'Salary' },
      });
      expect(onChange.mock.calls[0][0]).toMatchObject({ category: 'Salary' });
    });

    it('calls onChange with category: undefined when All Categories is selected', () => {
      const { onChange } = renderFilter({ category: 'Food' });
      fireEvent.change(screen.getByLabelText(/filter by category/i), {
        target: { value: '' },
      });
      const called = onChange.mock.calls[0][0] as FilterOptions;
      expect(called.category).toBeUndefined();
    });
  });

  describe('clear/reset', () => {
    it('does not render Clear Filters button when no filters are active', () => {
      renderFilter({});
      expect(screen.queryByLabelText(/clear all filters/i)).toBeNull();
    });

    it('renders Clear Filters button when type filter is active', () => {
      renderFilter({ type: 'INCOME' });
      expect(screen.getByLabelText(/clear all filters/i)).toBeDefined();
    });

    it('renders Clear Filters button when category filter is active', () => {
      renderFilter({ category: 'Food' });
      expect(screen.getByLabelText(/clear all filters/i)).toBeDefined();
    });

    it('calls onChange with empty object when Clear Filters is clicked', () => {
      const { onChange } = renderFilter({ type: 'EXPENSE', category: 'Food' });
      fireEvent.click(screen.getByLabelText(/clear all filters/i));
      expect(onChange).toHaveBeenCalledWith({});
    });
  });
});
