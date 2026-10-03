# Requirements Document

## Introduction

This spec covers the Monthly Budget feature of the Smart Expense Tracker. Users can set a monthly spending budget. The application compares the current month's total EXPENSE transactions against the budget and shows whether the user is within or above their budget. The budget is persisted in `localStorage`.

## Glossary

- **Budget**: A positive numeric threshold representing the maximum amount the user intends to spend in a calendar month.
- **Budget_Manager**: The business logic module responsible for setting, retrieving, and evaluating the monthly budget.
- **Budget_Store**: The persistence layer that reads and writes the budget to `localStorage`.
- **MonthlyExpenses**: The sum of `amount` for all transactions where `type === 'EXPENSE'` and `date` falls in the current calendar month (YYYY-MM).
- **BudgetStatus**: An enumeration with three values: `WITHIN_BUDGET` (MonthlyExpenses ≤ Budget), `OVER_BUDGET` (MonthlyExpenses > Budget), and `NO_BUDGET` (no budget set or budget ≤ 0).
- **CurrentMonth**: The calendar month corresponding to the device's local date at the time of evaluation.
- **UI**: The Next.js / React front-end presentation layer.
- **BudgetWidget**: The UI component on the Dashboard that displays budget information.

---

## Requirements

### Requirement 1: Set a Monthly Budget

**User Story:** As a user, I want to set a monthly spending budget, so that I have a financial target to stay within each month.

#### Acceptance Criteria

1. THE UI SHALL provide a budget input control where the user can enter a budget amount as a positive number.
2. THE Budget_Manager SHALL require the budget amount to be a finite number greater than zero and at most 999,999,999.99.
3. IF the budget amount is zero or negative, THEN THE Budget_Manager SHALL return a validation error with a human-readable message (e.g., "Budget must be greater than zero").
4. IF the budget amount is not a finite number (e.g., NaN, Infinity), THEN THE Budget_Manager SHALL return a validation error with a human-readable message.
5. WHEN the user saves a valid budget, THE Budget_Store SHALL persist it to `localStorage` under the key `smart-expense-tracker-budget`.
6. WHEN the user saves a valid budget, THE UI SHALL display a confirmation message and update the BudgetWidget immediately.
7. IF the `localStorage` write fails when saving the budget, THEN THE UI SHALL display an error message and retain the previously displayed budget value.

---

### Requirement 2: Retrieve the Monthly Budget

**User Story:** As a user, I want the application to remember my budget between sessions, so that I do not have to re-enter it every time I open the application.

#### Acceptance Criteria

1. WHEN the application loads, THE Budget_Store SHALL read the budget from `localStorage` under the key `smart-expense-tracker-budget`.
2. IF no budget has been saved, THE Budget_Store SHALL return `null` to indicate no budget is set.
3. IF the stored value does not parse to a finite number, THEN THE Budget_Store SHALL return `null` and call `console.warn` with a descriptive message.
4. IF the stored value parses to a finite number that is zero or negative, THEN THE Budget_Store SHALL return `null` and call `console.warn` with a descriptive message.

---

### Requirement 3: Calculate Monthly Expenses

**User Story:** As a user, I want to see how much I have spent in the current month, so that I can compare it against my budget.

#### Acceptance Criteria

1. WHEN a computation is requested, THE Budget_Manager SHALL compute MonthlyExpenses as the sum of `amount` for all transactions where `type === 'EXPENSE'` and the year-month portion of `date` equals the CurrentMonth in `YYYY-MM` format, where CurrentMonth is determined from the user's local device time.
2. IF there are no EXPENSE transactions in the current month, THEN THE Budget_Manager SHALL return a MonthlyExpenses of zero.
3. WHEN MonthlyExpenses is computed, THE UI SHALL display it on the BudgetWidget formatted as a currency value with a currency symbol and exactly two decimal places.
4. IF a transaction has a malformed or missing `date` field, THEN THE Budget_Manager SHALL exclude that transaction from the MonthlyExpenses sum without raising an error.

---

### Requirement 4: Evaluate Budget Status

**User Story:** As a user, I want to know whether I am within or above my monthly budget, so that I can adjust my spending accordingly.

#### Acceptance Criteria

1. WHEN a budget greater than zero is set and MonthlyExpenses is less than or equal to Budget, THE Budget_Manager SHALL return a BudgetStatus of `WITHIN_BUDGET`.
2. WHEN a budget greater than zero is set and MonthlyExpenses is greater than Budget, THE Budget_Manager SHALL return a BudgetStatus of `OVER_BUDGET`.
3. WHEN no budget has been set or the stored budget is zero or negative, THE Budget_Manager SHALL return a BudgetStatus of `NO_BUDGET`.
4. THE UI SHALL display the BudgetStatus with a visual indicator: green for `WITHIN_BUDGET`, red for `OVER_BUDGET`, and neutral grey for `NO_BUDGET`.
5. WHEN BudgetStatus is `WITHIN_BUDGET`, THE UI SHALL display the remaining amount (Budget − MonthlyExpenses, the sum of all expenses recorded in the current calendar month) rounded to two decimal places.
6. WHEN BudgetStatus is `OVER_BUDGET`, THE UI SHALL display the overspend amount (MonthlyExpenses − Budget, the sum of all expenses recorded in the current calendar month) rounded to two decimal places.

---

### Requirement 5: Budget Progress Indicator

**User Story:** As a user, I want to see a visual progress bar showing how close I am to my budget limit, so that I can track my spending at a glance.

#### Acceptance Criteria

1. WHERE a budget greater than zero is set, THE BudgetWidget SHALL display a horizontal progress bar representing `MonthlyExpenses / Budget` as a percentage.
2. IF Budget is zero, THEN THE BudgetWidget SHALL not render the progress bar to prevent division by zero.
3. IF the percentage is greater than 0% and at most 75%, THEN THE BudgetWidget SHALL render the progress bar in green.
4. IF the percentage is greater than 75% and at most 100%, THEN THE BudgetWidget SHALL render the progress bar in amber.
5. IF the percentage exceeds 100%, THEN THE BudgetWidget SHALL render the progress bar at full visual width (capped at 100%) in red.
6. THE BudgetWidget SHALL display the percentage value as a whole number (using `Math.floor`) next to the progress bar.

---

### Requirement 6: Real-time Budget Updates

**User Story:** As a user, I want the budget status to update automatically when I add, edit, or delete transactions, so that the information is always current.

#### Acceptance Criteria

1. WHEN a transaction is created, updated, or deleted, THE BudgetWidget SHALL recalculate MonthlyExpenses and BudgetStatus within 1 second, without requiring a page reload.
2. WHEN the user confirms a change to the budget amount, THE BudgetWidget SHALL recalculate BudgetStatus within 1 second.
3. IF a recalculation fails, THEN THE BudgetWidget SHALL display an error message and retain the last known BudgetStatus and MonthlyExpenses values until a successful recalculation occurs.
