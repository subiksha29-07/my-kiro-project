# Creating a Regression Test from a fast-check Counterexample

## Goal

When a property-based test fails, fast-check reports a minimal counterexample. This guide shows how to turn that counterexample into a permanent regression unit test so the bug can never regress silently.

## Steps

### 1. Capture the Counterexample

When fast-check fails, the output includes:

```
Counterexample: [<serialized inputs>]
```

Copy this entire output. The inputs are already shrunk to the smallest failing case.

### 2. Identify the Root Cause

Run the counterexample manually in your REPL or a temporary test:

```typescript
it('debug - fast-check counterexample', () => {
  // paste the counterexample values here
  const result = functionUnderTest(counterexampleValue);
  console.log(result);
  // observe the unexpected value
});
```

### 3. Fix the Bug

Update the function in `lib/` to handle the counterexample correctly.

### 4. Write the Regression Unit Test

In the corresponding `*.test.ts` file, add:

```typescript
it('regression [YYYY-MM-DD]: <short description of the bug>', () => {
  // Use the exact counterexample values
  const input = { /* counterexample */ };
  const result = functionUnderTest(input);
  expect(result).toEqual(/* expected value */);
});
```

Naming convention: prefix with `regression [YYYY-MM-DD]` so it is easy to find and audit.

### 5. Re-run Tests

```bash
npm run test
```

Both the regression unit test and the original property test should now pass.

### 6. Example: Float Precision Bug

Suppose fast-check finds that `calculateSummary` fails for:

```
Counterexample: [[
  { amount: 0.1, type: 'INCOME', ... },
  { amount: 0.2, type: 'EXPENSE', ... }
]]
Expected balance: -0.1
Actual balance:   -0.10000000000000001
```

The regression test:

```typescript
// __tests__/dashboard/calculator.test.ts
it('regression [2024-03-10]: float precision: 0.1 income - 0.2 expense', () => {
  const transactions: Transaction[] = [
    makeTransaction({ amount: 0.1, type: 'INCOME' }),
    makeTransaction({ amount: 0.2, type: 'EXPENSE' }),
  ];
  const { balance } = calculateSummary(transactions);
  expect(balance).toBeCloseTo(-0.1, 10);
});
```

The fix: use `toBeCloseTo` in the property test itself, and ensure the production formatter rounds to 2 decimal places via `Intl.NumberFormat`.

### 7. Seed Replay (Optional)

fast-check can replay a specific seed to reproduce the failure deterministically:

```typescript
fc.assert(
  fc.property(...),
  {
    numRuns: 100,
    seed: 1234567890,    // copy from the fast-check failure output
    path: '0:1:2',       // copy the path too
  }
);
```

This is useful for debugging before the fix is in place.
