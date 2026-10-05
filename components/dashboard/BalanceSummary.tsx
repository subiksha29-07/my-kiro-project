'use client';

import type { FinancialSummary } from '@/lib/dashboard/calculator';
import { SummaryCard } from './SummaryCard';

export interface BalanceSummaryProps {
  summary: FinancialSummary;
  isLoading?: boolean;
}

export function BalanceSummary({ summary, isLoading = false }: BalanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryCard label="Total Income"     value={summary.totalIncome}    variant="income"  isLoading={isLoading} />
      <SummaryCard label="Total Expenses"   value={summary.totalExpenses}  variant="expense" isLoading={isLoading} />
      <SummaryCard label="Current Balance"  value={summary.balance}        variant="balance" isLoading={isLoading} />
    </div>
  );
}
