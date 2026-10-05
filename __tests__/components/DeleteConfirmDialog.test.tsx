/**
 * Component tests for DeleteConfirmDialog
 * Tests: renders confirmation, Cancel callback, Delete callback, loading state.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmDialog from '@/components/transactions/DeleteConfirmDialog';
import type { Transaction } from '@/lib/transactions/types';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const TX: Transaction = {
  id: 'tx-del-001',
  title: 'Grocery run',
  amount: 55.5,
  type: 'EXPENSE',
  category: 'Food',
  date: '2024-06-15',
  createdAt: '2024-06-15T10:00:00.000Z',
  updatedAt: '2024-06-15T10:00:00.000Z',
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderDialog(
  props: Partial<React.ComponentProps<typeof DeleteConfirmDialog>> = {}
) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  render(
    <DeleteConfirmDialog
      isOpen={true}
      transaction={TX}
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    />
  );
  return { onConfirm, onCancel };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DeleteConfirmDialog', () => {
  describe('renders confirmation', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(
        <DeleteConfirmDialog
          isOpen={false}
          transaction={TX}
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when transaction is null', () => {
      const { container } = render(
        <DeleteConfirmDialog
          isOpen={true}
          transaction={null}
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders the dialog with role="dialog" when open', () => {
      renderDialog();
      expect(screen.getByRole('dialog')).toBeDefined();
    });

    it('shows the heading "Delete Transaction"', () => {
      renderDialog();
      expect(screen.getByRole('heading', { name: /delete transaction/i })).toBeDefined();
    });

    it('shows the confirmation question', () => {
      renderDialog();
      expect(screen.getByText(/permanently delete this transaction/i)).toBeDefined();
    });

    it('displays the transaction title in the summary', () => {
      renderDialog();
      expect(screen.getAllByText(/grocery run/i).length).toBeGreaterThan(0);
    });

    it('displays the formatted amount in the summary', () => {
      renderDialog();
      // Amount shown with − and 55.50
      expect(screen.getByText(/55\.50/)).toBeDefined();
    });

    it('displays the date in the summary', () => {
      renderDialog();
      expect(screen.getByText(/june 15, 2024/i)).toBeDefined();
    });

    it('renders both Cancel and Delete buttons', () => {
      renderDialog();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /^delete$/i })).toBeDefined();
    });
  });

  describe('Cancel callback', () => {
    it('calls onCancel when Cancel button is clicked', () => {
      const { onCancel } = renderDialog();
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('calls onCancel when Escape key is pressed', () => {
      const { onCancel } = renderDialog();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('does not call onConfirm when Cancel is clicked', () => {
      const { onConfirm } = renderDialog();
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Delete callback', () => {
    it('calls onConfirm when Delete button is clicked', () => {
      const { onConfirm } = renderDialog();
      fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it('does not call onCancel when Delete is clicked', () => {
      const { onCancel } = renderDialog();
      fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('disabled/loading state', () => {
    it('disables both buttons when isDeleting is true', () => {
      renderDialog({ isDeleting: true });
      const cancelBtn = screen.getByRole('button', {
        name: /cancel/i,
      }) as HTMLButtonElement;
      const deleteBtn = screen.getByRole('button', {
        name: /deleting/i,
      }) as HTMLButtonElement;
      expect(cancelBtn.disabled).toBe(true);
      expect(deleteBtn.disabled).toBe(true);
    });

    it('shows "Deleting…" on the Delete button when isDeleting is true', () => {
      renderDialog({ isDeleting: true });
      expect(screen.getByRole('button', { name: /deleting/i })).toBeDefined();
    });

    it('does not call onCancel on Escape when isDeleting is true', () => {
      const { onCancel } = renderDialog({ isDeleting: true });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('does not call onCancel on backdrop click when isDeleting is true', () => {
      const { onCancel } = renderDialog({ isDeleting: true });
      // Click the backdrop (the outer div with role=presentation)
      const backdrop = screen.getByRole('presentation');
      fireEvent.click(backdrop);
      expect(onCancel).not.toHaveBeenCalled();
    });
  });
});
