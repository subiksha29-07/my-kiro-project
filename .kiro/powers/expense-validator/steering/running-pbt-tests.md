# Running Property-Based Tests

## Goal

Run the fast-check property-based tests for the Smart Expense Tracker and interpret the results.

## Steps

### 1. Ensure Dependencies Are Installed

```bash
npm install
```

Verify `fast-check` and `vitest` are in `devDependencies`:

```bash
npm ls fast-check vitest
```

### 2. Run All Tests

```bash
npm run test
```

This runs `vitest --run` (single pass, no watch mode). All `*.test.ts` and `*.pbt.ts` files are discovered automatically.

### 3. Run Only Property-Based Tests

```bash
npx vitest run __tests__/transactions/manager.pbt.ts
npx vitest run __tests__/dashboard/calculator.pbt.ts
npx vitest run __tests__/budget/manager.pbt.ts
```

### 4. Interpret Passing Output

A passing property test looks like:

```
✓ __tests__/transactions/manager.pbt.ts > Balance invariant > balance always equals income minus expenses
```

fast-check runs `numRuns` (default 100) random examples. If all pass, the property holds for those inputs.

### 5. Interpret a Failing Output

A failing property test produces a counterexample:

```
✗ __tests__/transactions/manager.pbt.ts > Balance invariant > balance always equals income minus expenses

Property failed after 23 tests
Shrunk 4 times
Counterexample: [
  [
    { id: "...", title: "a", amount: 0.1, type: "INCOME", category: "Food", date: "2024-01-01", createdAt: "...", updatedAt: "..." },
    { id: "...", title: "b", amount: 0.2, type: "EXPENSE", category: "Food", date: "2024-01-01", createdAt: "...", updatedAt: "..." }
  ]
]
```

This tells you: with this specific input, the property failed. The shrinkage ensures the example is as small as possible.

### 6. Create a Regression Test

Copy the counterexample and create a named unit test in the corresponding `*.test.ts` file:

```typescript
it('regression [fast-check 2024-01-15]: balance with 0.1 income and 0.2 expense', () => {
  const transactions: Transaction[] = [
    { id: '1', title: 'a', amount: 0.1, type: 'INCOME', category: 'Food', date: '2024-01-01', createdAt: '', updatedAt: '' },
    { id: '2', title: 'b', amount: 0.2, type: 'EXPENSE', category: 'Food', date: '2024-01-01', createdAt: '', updatedAt: '' },
  ];
  const summary = calculateSummary(transactions);
  expect(summary.balance).toBeCloseTo(0.1 - 0.2, 10);
});
```

### 7. Increase Run Count for Critical Properties

For the balance invariant and round-trip property, use 1000 runs:

```typescript
fc.assert(fc.property(...), { numRuns: 1000 });
```

Or use an environment variable:

```typescript
const numRuns = process.env.FAST_CHECK_NUM_RUNS ? parseInt(process.env.FAST_CHECK_NUM_RUNS) : 100;
fc.assert(fc.property(...), { numRuns });
```

Run with: `FAST_CHECK_NUM_RUNS=1000 npm run test`
