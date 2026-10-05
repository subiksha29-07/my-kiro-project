/**
 * Component tests for TransactionList
 * Tests: renders multiple transactions, renders empty state, passes actions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionList from '@/components/transactions/TransactionList';
import type { Transaction } from '@/lib/transactions/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeTx(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: crypto.randomUUID(),
    title: 'Test transaction',
    amount: 10,
    type: 'EXPENSE',
    category: 'Food',
    date: '2024-06-01',
    createdAt: '2024-06-01T09:00:00.000Z',
    updatedAt: '2024-06-01T09:00:00.000Z',
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TransactionList', () => {
  describe('renders multiple transactions', () => {
    it('renders a TransactionItem for each transaction in the list', () => {
      const txs = [
        makeTx({ id: 'id-1', title: 'Rent' }),
        makeTx({ id: 'id-2', title: 'Groceries' }),
        makeTx({ id: 'id-3', title: 'Salary', type: 'INCOME' }),
      ];
      render(<TransactionList transactions={txs} onEdit={vi.fn()} onDelete={vi.fn()} />);
      expect(screen.getByText('Rent')).toBeDefined();
      expect(screen.getByText('Groceries')).toBeDefined();
      expect(screen.getByText('Salary')).toBeDefined();
    });

    it('shows a count of transactions', () => {
      const txs = [makeTx(), makeTx()];
      render(<TransactionList transactions={txs} onEdit={vi.fn()} onDelete={vi.fn()} />);
      // Count text: "2 transactions total"
      expect(screen.getByText(/2 transactions/i)).toBeDefined();
    });
  });

  describe('renders empty state', () => {
    it('shows "No transactions recorded yet" when list is empty and no filter', () => {
      render(
        <TransactionList transactions={[]} onEdit={vi.fn()} onDelete={vi.fn()} isFiltered={false} />
      );
      expect(screen.getByText(/no transactions recorded yet/i)).toBeDefined();
    });

    it('shows filter-specific message when list is empty with active filter', () => {
      render(
        <TransactionList transactions={[]} onEdit={vi.fn()} onDelete={vi.fn()} isFiltered={true} />
      );
      // New wording: "No matches for this filter"
      expect(screen.getByText(/no matches for this filter/i)).toBeDefined();
    });

    it('does not render a list element when transactions is empty', () => {
      render(<TransactionList transactions={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
      expect(screen.queryByRole('list')).toBeNull();
    });
  });

  describe('passes actions correctly', () => {
    it('calls onEdit with the correct transaction when Edit is clicked', () => {
      const onEdit = vi.fn();
      const tx = makeTx({ id: 'edit-id', title: 'My transaction' });
      render(<TransactionList transactions={[tx]} onEdit={onEdit} onDelete={vi.fn()} />);
      fireEvent.click(screen.getByLabelText(/edit my transaction/i));
      expect(onEdit).toHaveBeenCalledWith(tx);
    });

    it('calls onDelete with the correct id when Delete is clicked', () => {
      const onDelete = vi.fn();
      const tx = makeTx({ id: 'del-id', title: 'To delete' });
      render(<TransactionList transactions={[tx]} onEdit={vi.fn()} onDelete={onDelete} />);
      fireEvent.click(screen.getByLabelText(/delete to delete/i));
      expect(onDelete).toHaveBeenCalledWith('del-id');
    });
  });
});
