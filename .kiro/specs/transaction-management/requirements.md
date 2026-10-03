# Requirements Document

## Introduction

This spec covers the Expense/Income Transaction Management feature of the Smart Expense Tracker web application. Users can create, read, update, and delete financial transactions. Each transaction has a title, amount, type (INCOME or EXPENSE), category, date, and an optional description. Transactions are persisted locally via `localStorage` for demo purposes. This is a core domain feature upon which the Dashboard and Budget features depend.

## Glossary

- **Transaction**: A single financial event recorded by the user, classified as either INCOME or EXPENSE.
- **Transaction_Manager**: The business logic layer responsible for creating, reading, updating, and deleting transactions.
- **Transaction_Store**: The persistence layer that reads and writes transactions to `localStorage`.
- **Transaction_Validator**: The validation layer that checks transaction fields before they are persisted.
- **TransactionType**: An enumeration with two values: `INCOME` and `EXPENSE`.
- **Category**: A string label grouping transactions by purpose (e.g., "Food", "Salary", "Rent").
- **Amount**: A positive numeric value representing the monetary value of a transaction, expressed in the user's local currency.
- **UI**: The Next.js / React front-end presentation layer.

---

## Requirements

### Requirement 1: Add a Transaction

**User Story:** As a user, I want to add a new income or expense transaction with all relevant details, so that I can keep a complete record of my financial activity.

#### Acceptance Criteria

1. WHEN the user submits the transaction form with a valid title, amount, transaction type, category, and date, THE Transaction_Manager SHALL create a new transaction and persist it via the Transaction_Store.
2. THE Transaction_Validator SHALL require the title field to be a non-empty string of at most 100 characters.
3. THE Transaction_Validator SHALL require the amount field to be a number greater than zero, at most 999,999,999.99, and with no more than two decimal places.
4. THE Transaction_Validator SHALL require the transaction type to be exactly one of the values `INCOME` or `EXPENSE`.
5. THE Transaction_Validator SHALL require the category field to be a non-empty string of at most 100 characters.
6. THE Transaction_Validator SHALL require the date field to be a valid calendar date in ISO 8601 format (`YYYY-MM-DD`) within the range January 1, 1900 to December 31, 2100.
7. WHERE the user provides a description, THE Transaction_Validator SHALL accept a string of at most 500 characters.
8. IF any required field fails validation, THEN THE Transaction_Validator SHALL return a structured error object identifying each invalid field and a human-readable message.
9. WHEN a transaction is successfully created, THE Transaction_Manager SHALL assign it a unique identifier (UUID v4).
10. WHEN a transaction is successfully created, THE UI SHALL display a success notification for at least 3 seconds and reset all form fields to their initial empty or default state.
11. IF the Transaction_Store fails to persist the transaction, THEN THE UI SHALL display an error message and retain the submitted form values so the user can retry.

---

### Requirement 2: View All Transactions

**User Story:** As a user, I want to view a list of all my recorded transactions, so that I can review my financial history.

#### Acceptance Criteria

1. WHEN the transaction list is requested, THE Transaction_Manager SHALL retrieve all transactions from the Transaction_Store and return them sorted by date in descending order, with transactions sharing the same date sorted by the order they were recorded (most recently recorded first).
2. WHEN the transaction list is empty, THE UI SHALL display an empty-state message indicating that no transactions have been recorded yet.
3. WHEN transactions exist, THE UI SHALL render each transaction showing title, amount (with currency symbol and two decimal places, prefixed with "+" for income and "−" for expense), type, category, and date (in human-readable format: Month DD, YYYY).
4. WHEN the application starts, THE Transaction_Store SHALL load all persisted transactions and make them available to the UI without requiring a page reload.
5. IF the Transaction_Store fails to load persisted transactions on application startup, THEN THE UI SHALL display an error message indicating that transactions could not be loaded and prompt the user to retry.

---

### Requirement 3: Edit a Transaction

**User Story:** As a user, I want to edit an existing transaction, so that I can correct mistakes or update outdated information.

#### Acceptance Criteria

1. WHEN the user selects a transaction for editing, THE UI SHALL pre-populate the edit form with the existing transaction values.
2. WHEN the user submits the edit form with valid data, THE Transaction_Manager SHALL update the existing transaction in the Transaction_Store while preserving the original transaction identifier.
3. THE Transaction_Validator SHALL apply the same validation rules for editing as for creating (see Requirement 1, criteria 2–8).
4. IF the transaction identifier provided during an edit does not match any stored transaction, THEN THE Transaction_Manager SHALL return an error indicating the transaction was not found.
5. WHEN a transaction is successfully updated, THE UI SHALL reflect the updated values in the transaction list within 1 second of receiving confirmation from the Transaction_Manager, and only after confirmed success.
6. IF the Transaction_Manager receives an edit request for a transaction that has been modified since it was last loaded, THEN THE Transaction_Manager SHALL reject the stale update and preserve the stored transaction unchanged, returning an error to the UI.

---

### Requirement 4: Delete a Transaction

**User Story:** As a user, I want to delete a transaction, so that I can remove incorrect or unwanted records.

#### Acceptance Criteria

1. WHEN the user confirms the deletion of a transaction, THE Transaction_Manager SHALL remove the transaction from the Transaction_Store by its unique identifier.
2. IF the transaction identifier provided for deletion does not match any stored transaction, THEN THE Transaction_Manager SHALL return an error indicating the transaction was not found.
3. WHEN a transaction is successfully deleted, THE UI SHALL remove it from the displayed list within 500 milliseconds.
4. WHEN the user initiates a delete action, THE UI SHALL display a confirmation prompt exposing a Confirm and a Cancel option before executing the deletion.
5. WHEN the user selects Cancel on the confirmation prompt, THE UI SHALL dismiss the prompt and leave the transaction list unchanged.

---

### Requirement 5: Filter Transactions

**User Story:** As a user, I want to filter my transactions by type and/or category, so that I can quickly focus on a specific subset of my financial activity.

#### Acceptance Criteria

1. WHEN the user selects a transaction type filter (`INCOME` or `EXPENSE`), THE Transaction_Manager SHALL return only transactions matching that type, sorted by date descending.
2. WHEN the user selects a category filter, THE Transaction_Manager SHALL return only transactions matching that category, sorted by date descending.
3. WHEN the user applies both a type filter and a category filter simultaneously, THE Transaction_Manager SHALL return only transactions matching both criteria, sorted by date descending.
4. WHEN the user clears all filters, THE Transaction_Manager SHALL return the complete list of transactions sorted by date descending.
5. THE Transaction_Manager SHALL apply filters without modifying the underlying stored data.
6. IF no transactions match the applied filters, THEN THE Transaction_Manager SHALL return an empty list, and THE UI SHALL display a message indicating no transactions match the selected filter.

---

### Requirement 6: Data Persistence

**User Story:** As a user, I want my transactions to persist across browser sessions, so that my data is not lost when I close or refresh the application.

#### Acceptance Criteria

1. WHEN a transaction is created, updated, or deleted, THE Transaction_Store SHALL serialize all transactions as a JSON array and write to `localStorage` under the key `smart-expense-tracker-transactions`.
2. WHEN the application loads, THE Transaction_Store SHALL read and deserialize transactions from `localStorage` under the key `smart-expense-tracker-transactions`.
3. IF the `localStorage` entry is absent or contains malformed JSON, THEN THE Transaction_Store SHALL initialise with an empty transaction list and log a warning to the browser console.
4. IF the `localStorage` entry contains valid JSON that is not an array, THEN THE Transaction_Store SHALL treat it as malformed, initialise with an empty transaction list, and log a warning to the browser console.
5. IF a `localStorage` write fails due to a quota error, THEN THE Transaction_Store SHALL retain the current in-memory transaction list, discard the failed write, and display an error message to the user.
