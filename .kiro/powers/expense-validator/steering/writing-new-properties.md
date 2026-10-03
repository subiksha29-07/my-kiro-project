# Writing New Properties for a Requirement

## Goal

Identify whether a new acceptance criterion can be tested as a property, and implement it using fast-check.

## Decision Process

Ask these questions about the criterion:

1. **Does the behaviour vary meaningfully with input?** If no → write an example-based unit test, not a property.
2. **Are you testing your own code or an external service?** If external → integration test.
3. **Would 100 random inputs find more bugs than 2–3 fixed examples?** If no → unit test.
4. **Is the cost of 100 iterations justified?** If the function is pure and in-memory → property test.

For the Smart Expense Tracker, all functions in `lib/` are pure and in-memory, so they are excellent candidates for property-based testing.

## Property Pattern Catalogue

Use these patterns to find properties for a new requirement:

### Invariant

Something that is always true regardless of input.

```typescript
// "balance is always income minus expenses"
fc.assert(fc.property(fc.array(arbitraryTransaction()), (txns) => {
  const { totalIncome, totalExpenses, balance } = calculateSummary(txns);
  return Math.abs(balance - (totalIncome - totalExpenses)) < 1e-9;
}));
```

### Round-Trip

Encode then decode returns the original value.

```typescript
// "save then load returns equivalent transactions"
fc.assert(fc.property(fc.array(arbitraryTransaction()), (txns) => {
  saveTransactions(txns);
  const loaded = loadTransactions();
  expect(loaded).toEqual(txns);
}));
```

### Subset / Metamorphic

A filtered result is always a subset of the unfiltered result.

```typescript
// "filter result is a subset of the full list"
fc.assert(fc.property(fc.array(arbitraryTransaction()), arbitraryFilterOptions(), (txns, filters) => {
  const filtered = getTransactions(txns, filters);
  return filtered.every(t => txns.some(orig => orig.id === t.id));
}));
```

### Monotonic Change

An operation always changes a value in a specific direction.

```typescript
// "adding an EXPENSE always increases total expenses"
fc.assert(fc.property(fc.array(arbitraryTransaction()), arbitraryExpenseInput(), (txns, input) => {
  const before = calculateSummary(txns).totalExpenses;
  const { store } = addTransaction(txns, input);
  const after = calculateSummary(store).totalExpenses;
  return Math.abs(after - (before + input.amount)) < 1e-9;
}));
```

### Idempotence

Applying an operation twice gives the same result as applying it once.

```typescript
// "calculating summary twice on the same list gives the same result"
fc.assert(fc.property(fc.array(arbitraryTransaction()), (txns) => {
  const first = calculateSummary(txns);
  const second = calculateSummary(txns);
  expect(first).toEqual(second);
}));
```

## Template

```typescript
// __tests__/{module}/{module}.pbt.ts

import * as fc from 'fast-check';
import { describe, it } from 'vitest';
import { /* function under test */ } from '@/lib/{module}/{module}';
import { arbitraryTransactionInput, arbitraryAmount } from '../arbitraries';

describe('{ModuleName} - Property-Based Tests', () => {
  it('[property name]: [one-line description]', () => {
    fc.assert(
      fc.property(
        /* arbitraries */,
        (generatedValue) => {
          // arrange
          // act
          // assert
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

## Checklist Before Submitting

- [ ] Property is named clearly and describes the invariant, not the test mechanics
- [ ] `numRuns` is set to at least 100
- [ ] Arbitraries generate realistic values (use the shared arbitraries from `__tests__/arbitraries.ts`)
- [ ] Property uses `toBeCloseTo` for floating-point comparisons, not strict equality
- [ ] Property file is in `__tests__/{module}/` matching the module under test
- [ ] Property passes when run with `npm run test`
