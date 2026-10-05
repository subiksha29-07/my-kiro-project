/**
 * Component tests for TransactionForm
 * Tests: renders required fields, displays validation errors,
 * submits valid data, supports edit initial values, cancel callback.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionForm from '@/components/transactions/TransactionForm';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderForm(props: Partial<React.ComponentProps<typeof TransactionForm>> = {}) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(<TransactionForm onSubmit={onSubmit} onCancel={onCancel} {...props} />);
  return { onSubmit, onCancel };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TransactionForm', () => {
  describe('renders required fields', () => {
    it('renders a Title input', () => {
      renderForm();
      expect(screen.getByLabelText(/title/i)).toBeDefined();
    });

    it('renders an Amount input', () => {
      renderForm();
      expect(screen.getByLabelText(/amount/i)).toBeDefined();
    });

    it('renders Income and Expense type buttons', () => {
      renderForm();
      // Type is now a pill toggle — two buttons
      expect(screen.getByRole('button', { name: /income/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /expense/i })).toBeDefined();
    });

    it('renders a Category select', () => {
      renderForm();
      expect(screen.getByLabelText(/category/i)).toBeDefined();
    });

    it('renders a Date input', () => {
      renderForm();
      expect(screen.getByLabelText(/date/i)).toBeDefined();
    });

    it('renders a Description textarea', () => {
      renderForm();
      expect(screen.getByLabelText(/description/i)).toBeDefined();
    });

    it('renders the submit button with "Add Transaction" label in create mode', () => {
      renderForm();
      expect(screen.getByRole('button', { name: /add transaction/i })).toBeDefined();
    });

    it('renders Cancel button when onCancel is provided', () => {
      renderForm();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDefined();
    });
  });

  describe('displays validation errors', () => {
    it('shows an error when title is empty and form is submitted', async () => {
      renderForm();
      fireEvent.submit(screen.getByRole('form', { hidden: true }));
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeDefined();
      });
    });

    it('shows an error when amount is zero and form is submitted', async () => {
      const { onSubmit } = renderForm();
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '0' } });
      fireEvent.submit(screen.getByRole('form', { hidden: true }));
      await waitFor(() => {
        expect(screen.getByText(/greater than zero/i)).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows an error when category is not selected', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '10' } });
      fireEvent.submit(screen.getByRole('form', { hidden: true }));
      await waitFor(() => {
        expect(screen.getByText(/category is required/i)).toBeDefined();
      });
    });

    it('shows server error when serverError prop is set', () => {
      renderForm({ serverError: 'Failed to save. Please try again.' });
      expect(screen.getByRole('alert')).toBeDefined();
      expect(screen.getByText(/failed to save/i)).toBeDefined();
    });
  });

  describe('submits valid data', () => {
    it('calls onSubmit with correct TransactionInput on valid submission', async () => {
      const { onSubmit } = renderForm();

      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Salary' } });
      fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '3000' } });

      // Type is now a button group — click the Income button
      fireEvent.click(screen.getByRole('button', { name: /income/i }));

      // Category select should now show income categories
      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Salary' } });

      fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-07-01' } });

      fireEvent.submit(screen.getByRole('form', { hidden: true }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledOnce();
      });

      const [calledInput] = onSubmit.mock.calls[0];
      expect(calledInput.title).toBe('Salary');
      expect(calledInput.amount).toBe(3000);
      expect(calledInput.type).toBe('INCOME');
      expect(calledInput.category).toBe('Salary');
      expect(calledInput.date).toBe('2024-07-01');
    });

    it('does not call onSubmit when form is invalid', async () => {
      const { onSubmit } = renderForm();
      fireEvent.submit(screen.getByRole('form', { hidden: true }));
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('supports edit initial values', () => {
    it('pre-populates fields from initialValues', () => {
      renderForm({
        initialValues: {
          title: 'Grocery run',
          amount: 55.5,
          type: 'EXPENSE',
          category: 'Food',
          date: '2024-05-10',
          updatedAt: '2024-05-10T10:00:00.000Z',
        },
      });
      expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe('Grocery run');
      expect((screen.getByLabelText(/amount/i) as HTMLInputElement).value).toBe('55.5');
      expect((screen.getByLabelText(/date/i) as HTMLInputElement).value).toBe('2024-05-10');
    });

    it('renders "Save Changes" button in edit mode', () => {
      renderForm({
        initialValues: {
          title: 'Rent',
          amount: 1200,
          type: 'EXPENSE',
          category: 'Housing',
          date: '2024-06-01',
          updatedAt: '2024-06-01T08:00:00.000Z',
        },
      });
      expect(screen.getByRole('button', { name: /save changes/i })).toBeDefined();
    });

    it('passes expectedUpdatedAt to onSubmit in edit mode', async () => {
      const expectedUpdatedAt = '2024-06-01T08:00:00.000Z';
      const { onSubmit } = renderForm({
        initialValues: {
          title: 'Rent',
          amount: 1200,
          type: 'EXPENSE',
          category: 'Housing',
          date: '2024-06-01',
          updatedAt: expectedUpdatedAt,
        },
      });
      fireEvent.submit(screen.getByRole('form', { hidden: true }));
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledOnce();
      });
      const [, passedUpdatedAt] = onSubmit.mock.calls[0];
      expect(passedUpdatedAt).toBe(expectedUpdatedAt);
    });
  });

  describe('cancel callback', () => {
    it('calls onCancel when Cancel button is clicked', () => {
      const { onCancel } = renderForm();
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('does not render Cancel button when onCancel is not provided', () => {
      render(<TransactionForm onSubmit={vi.fn()} />);
      expect(screen.queryByRole('button', { name: /cancel/i })).toBeNull();
    });
  });
});
