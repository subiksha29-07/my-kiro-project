# Requirements Document

## Introduction

This spec covers the Dashboard and Balance Calculation feature of the Smart Expense Tracker. The dashboard provides users with an at-a-glance financial summary: total income, total expenses, and current balance derived from all recorded transactions. It is a read-only computed view that reacts to changes in the transaction list.

## Glossary

- **Dashboard**: The main summary view of the application showing key financial metrics.
- **Balance_Calculator**: The business logic module that computes financial summaries from a list of transactions.
- **TotalIncome**: The sum of the `amount` field for all transactions with `type === 'INCOME'`.
- **TotalExpenses**: The sum of the `amount` field for all transactions with `type === 'EXPENSE'`.
- **Balance**: The value equal to `TotalIncome − TotalExpenses`. May be negative.
- **Transaction**: Defined in the Transaction Management spec.
- **UI**: The Next.js / React front-end presentation layer.
- **SummaryCard**: A UI component that displays a single computed metric (income, expenses, or balance).

---

## Requirements

### Requirement 1: Display Total Income

**User Story:** As a user, I want to see my total income, so that I know how much money I have earned across all recorded transactions.

#### Acceptance Criteria

1. WHEN the Balance_Calculator receives a transaction list, THE Balance_Calculator SHALL compute TotalIncome as the sum of `amount` for all transactions where `type === 'INCOME'`.
2. IF there are no INCOME transactions, THEN THE Balance_Calculator SHALL return a TotalIncome of zero.
3. WHEN TotalIncome is computed, THE UI SHALL display it on the Dashboard in a SummaryCard labelled "Total Income".
4. WHEN TotalIncome is displayed, THE UI SHALL format it as a currency value with a currency symbol and exactly two decimal places (e.g., `$1,234.56`).

---

### Requirement 2: Display Total Expenses

**User Story:** As a user, I want to see my total expenses, so that I know how much money I have spent across all recorded transactions.

#### Acceptance Criteria

1. WHEN the Balance_Calculator receives a transaction list, THE Balance_Calculator SHALL compute TotalExpenses as the sum of `amount` for all transactions where `type === 'EXPENSE'`.
2. IF there are no EXPENSE transactions, THEN THE Balance_Calculator SHALL return a TotalExpenses of zero.
3. WHEN TotalExpenses is computed, THE UI SHALL display it on the Dashboard in a SummaryCard labelled "Total Expenses".
4. WHEN TotalExpenses is displayed, THE UI SHALL format it as a currency value with a currency symbol and exactly two decimal places.

---

### Requirement 3: Display Current Balance

**User Story:** As a user, I want to see my current balance, so that I can understand my net financial position.

#### Acceptance Criteria

1. WHEN the Balance_Calculator receives a transaction list, THE Balance_Calculator SHALL compute Balance as `TotalIncome − TotalExpenses`, where TotalIncome is the sum of all INCOME transaction amounts and TotalExpenses is the sum of all EXPENSE transaction amounts.
2. IF there are no transactions or all transaction amounts are zero, THEN THE Balance_Calculator SHALL return a Balance of zero.
3. WHEN Balance is computed, THE UI SHALL display it on the Dashboard in a SummaryCard labelled "Current Balance".
4. IF Balance is negative, THEN THE UI SHALL render the SummaryCard with a red colour scheme to alert the user.
5. IF Balance is zero or positive, THEN THE UI SHALL render the SummaryCard with a distinct positive colour scheme (e.g., green), visually different from the negative state.
6. WHEN Balance is displayed, THE UI SHALL format it as a currency value with a currency symbol and exactly two decimal places, including a minus sign for negative values (e.g., `−$123.45`).
7. WHEN Balance is being loaded or calculated, THE UI SHALL display a loading indicator in place of the value until the calculation completes.

---

### Requirement 4: Real-time Dashboard Updates

**User Story:** As a user, I want the dashboard to update immediately when I add, edit, or delete a transaction, so that the summary always reflects my current financial state.

#### Acceptance Criteria

1. WHEN a transaction is created, THE Dashboard SHALL recalculate and display updated TotalIncome, TotalExpenses, and Balance within 1 second, without requiring a page reload.
2. WHEN a transaction is updated, THE Dashboard SHALL recalculate and display updated TotalIncome, TotalExpenses, and Balance within 1 second, without requiring a page reload.
3. WHEN a transaction is deleted, THE Dashboard SHALL recalculate and display updated TotalIncome, TotalExpenses, and Balance within 1 second, without requiring a page reload.
4. IF the recalculation fails, THEN THE Dashboard SHALL display an error message and retain the last known good values until a successful recalculation occurs.

---

### Requirement 5: Empty State

**User Story:** As a user, I want to see meaningful values on the dashboard when no transactions exist, so that the application is not confusing on first launch.

#### Acceptance Criteria

1. WHEN the transaction list is empty, THE Dashboard SHALL display TotalIncome as `$0.00`, TotalExpenses as `$0.00`, and Balance as `$0.00`.
2. WHEN the transaction list is empty, THE Dashboard SHALL display a visible call-to-action message prompting the user to add their first transaction.
