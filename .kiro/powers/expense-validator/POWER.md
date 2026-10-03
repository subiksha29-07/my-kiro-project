# Expense Validator Power

## Overview

The **Expense Validator Power** is a Kiro Power that assists with testing and validation tasks specific to the Smart Expense Tracker application. It provides guided workflows for:

- Running property-based tests and interpreting fast-check output
- Validating transaction business rules
- Checking budget evaluation logic
- Generating test arbitraries and regression test stubs from failing examples

## Keywords

expense, tracker, transaction, validation, fast-check, property-based, budget, balance, income, testing, vitest

## When to Activate

Activate this power when you need help with any of the following:

- Writing or debugging property-based tests in `__tests__/**/*.pbt.ts`
- Understanding fast-check shrinkage output and creating regression tests from failing examples
- Verifying that a new business rule in `lib/` is covered by a property
- Generating `fc.Arbitrary` definitions for new transaction-related types
- Checking that all EARS acceptance criteria from the specs have corresponding test coverage
- Running and interpreting the full test suite

## Capabilities

### 1. Run Tests

Run the test suite and report results:

```bash
npm run test
```

For coverage:

```bash
npm run test:coverage
```

For a single test file:

```bash
npx vitest run __tests__/transactions/manager.pbt.ts
```

### 2. Validate Transaction Business Rules

Key invariants the power enforces and can help you test:

| Rule | Location |
|---|---|
| `amount > 0` for all valid transactions | `lib/transactions/validator.ts` |
| `balance = totalIncome - totalExpenses` | `lib/dashboard/calculator.ts` |
| Filter result is always a subset of input | `lib/transactions/manager.ts` |
| Adding EXPENSE increases total expenses by exactly `amount` | `lib/transactions/manager.ts` |
| Deleting a transaction decreases count by exactly 1 | `lib/transactions/manager.ts` |
| `monthlyExpenses >= 0` always | `lib/budget/manager.ts` |
| `WITHIN_BUDGET` iff `monthlyExpenses <= budget` | `lib/budget/manager.ts` |
| Round-trip: `loadTransactions(saveTransactions(list))` ≡ `list` | `lib/transactions/store.ts` |

### 3. Generate Arbitraries

The shared arbitraries file is at `__tests__/arbitraries.ts`. Use it in all `*.pbt.ts` files:

```typescript
import {
  arbitraryTransactionInput,
  arbitraryAmount,
  arbitraryDate,
  arbitraryTransactionType,
  arbitraryCategory,
} from '../arbitraries';
```

### 4. Regression Test Stub

When fast-check reports a failing example, create a regression unit test:

```typescript
// Example failing output from fast-check:
// Counterexample: [{ title: 'x', amount: 0.001, type: 'EXPENSE', ... }]

it('regression: amount 0.001 is valid (fast-check counterexample 2024-01-15)', () => {
  const result = validateTransaction({ title: 'x', amount: 0.001, type: 'EXPENSE', category: 'Food', date: '2024-01-15' });
  expect(result.valid).toBe(true);
});
```

## Workflows

See the steering files for step-by-step guides:

- `running-pbt-tests.md` — how to run and interpret property-based tests
- `writing-new-properties.md` — how to identify and write new properties for a requirement
- `regression-from-counterexample.md` — how to turn a fast-check counterexample into a regression test

## Quick Reference

```bash
# Run all tests once
npm run test

# Run only property-based tests
npx vitest run --reporter=verbose __tests__/**/*.pbt.ts

# Run with increased numRuns (override in test file or via env)
FAST_CHECK_NUM_RUNS=1000 npm run test

# Show coverage
npm run test:coverage
```
