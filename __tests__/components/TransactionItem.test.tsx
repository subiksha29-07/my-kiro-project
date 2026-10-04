/**
 * Component tests for TransactionItem
 * Tests: renders transaction info, calls edit callback, calls delete callback.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionItem from '@/components/transactions/TransactionItem';
import type { Transaction } from '@/lib/transactions/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const EXPENSE_TX: Transaction = {
  id: 'abc-123',
  title: 'Grocery run',
  amount: 55.5,
  type: 'EXPENSE',
  category: 'Food',
  date: '2024-06-15',
  createdAt: '2024-06-15T10:00:00.000Z',
  updatedAt: '2024-06-15T10:00:00.000Z',
};

const INCOME_TX: Transaction = {
  id: 'def-456',
  title: 'Monthly salary',
  amount: 3000,
  type: 'INCOME',
  category: 'Salary',
  date: '2024-07-01',
  description: 'July paycheck',
  createdAt: '2024-07-01T08:00:00.000Z',
  updatedAt: '2024-07-01T08:00:00.000Z',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TransactionItem', () => {
  describe('renders transaction information', () => {
    it('displays the transaction title', () => {
      render(
        <TransactionItem transaction={EXPENSE_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      expect(screen.getByText('Grocery run')).toBeDefined();
    });

    it('displays the formatted amount with − prefix for expenses', () => {
      render(
        <TransactionItem transaction={EXPENSE_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      // Amount label contains the formatted string
      const amountEl = screen.getByLabelText(/amount/i);
      expect(amountEl.textContent).toMatch(/\u2212/); // Unicode minus
      expect(amountEl.textContent).toMatch(/55\.50/);
    });

    it('displays the + prefix for income', () => {
      render(
        <TransactionItem transaction={INCOME_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      const amountEl = screen.getByLabelText(/amount/i);
      expect(amountEl.textContent).toMatch(/^\+/);
      expect(amountEl.textContent).toMatch(/3,000\.00/);
    });

    it('displays the category', () => {
      render(
        <TransactionItem transaction={EXPENSE_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      expect(screen.getByText(/food/i)).toBeDefined();
    });

    it('displays the date in human-readable format', () => {
      render(
        <TransactionItem transaction={EXPENSE_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      expect(screen.getByText(/june 15, 2024/i)).toBeDefined();
    });

    it('shows the INCOME type badge for income transactions', () => {
      render(
        <TransactionItem transaction={INCOME_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      expect(screen.getByLabelText(/type: income/i)).toBeDefined();
    });

    it('shows the EXPENSE type badge for expense transactions', () => {
      render(
        <TransactionItem transaction={EXPENSE_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      expect(screen.getByLabelText(/type: expense/i)).toBeDefined();
    });

    it('displays description when present', () => {
      render(
        <TransactionItem transaction={INCOME_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      expect(screen.getByText('July paycheck')).toBeDefined();
    });

    it('does not render description section when description is absent', () => {
      render(
        <TransactionItem transaction={EXPENSE_TX} onEdit={vi.fn()} onDelete={vi.fn()} />
      );
      expect(screen.queryByText(/paycheck/i)).toBeNull();
    });
  });

  describe('calls edit callback', () => {
    it('calls onEdit with the full transaction when Edit is clicked', () => {
      const onEdit = vi.fn();
      render(
        <TransactionItem transaction={EXPENSE_TX} onEdit={onEdit} onDelete={vi.fn()} />
      );
      fireEvent.click(screen.getByLabelText(/edit grocery run/i));
      expect(onEdit).toHaveBeenCalledOnce();
      expect(onEdit).toHaveBeenCalledWith(EXPENSE_TX);
    });
  });

  describe('calls delete callback', () => {
    it('calls onDelete with the transaction id when Delete is clicked', () => {
      const onDelete = vi.fn();
      render(
        <TransactionItem
          transaction={EXPENSE_TX}
          onEdit={vi.fn()}
          onDelete={onDelete}
        />
      );
      fireEvent.click(screen.getByLabelText(/delete grocery run/i));
      expect(onDelete).toHaveBeenCalledOnce();
      expect(onDelete).toHaveBeenCalledWith('abc-123');
    });
  });
});
