---
inclusion: always
---

# Testing Conventions

## Test Runner

- **Vitest** with jsdom environment for all tests.
- Run all tests once: `npm run test` (configured as `vitest --run`).
- Watch mode (development): `npm run test:watch` (configured as `vitest`).
- Coverage: `npm run test:coverage` (configured as `vitest --coverage`).

## Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

## `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom';
```

## File Naming

| Type | Pattern | Example |
|---|---|---|
| Unit test | `*.test.ts` | `validator.test.ts` |
| Property-based test | `*.pbt.ts` | `manager.pbt.ts` |
| Component test | `*.test.tsx` | `SummaryCard.test.tsx` |

All test files live in `__tests__/` mirroring the `lib/` structure.

## Unit Test Conventions

- One `describe` block per module function.
- Test names follow the pattern: `"given [context], when [action], then [outcome]"` or `"[function name] - [scenario]"`.
- Use `beforeEach` to reset mocks and shared state.
- Mock `localStorage` via `vi.stubGlobal('localStorage', localStorageMock)`.
- Do not test React component internals; test behaviour and rendered output.

### localStorage Mock

```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});
```

## Property-Based Test Conventions

Use **fast-check** (`fc`) for all property-based tests.

### Import

```typescript
import * as fc from 'fast-check';
```

### Structure

```typescript
describe('PropertyName', () => {
  it('property description', () => {
    fc.assert(
      fc.property(arbitraries, (generatedValues) => {
        // arrange
        // act
        // assert (return true or use expect())
      }),
      { numRuns: 100 }
    );
  });
});
```

### Arbitraries for This Project

```typescript
// Reusable in __tests__/arbitraries.ts
import * as fc from 'fast-check';
import type { TransactionInput, TransactionType } from '@/lib/transactions/types';

export const arbitraryTransactionType = (): fc.Arbitrary<TransactionType> =>
  fc.constantFrom('INCOME', 'EXPENSE');

export const arbitraryAmount = (): fc.Arbitrary<number> =>
  fc.float({ min: 0.01, max: 1_000_000, noNaN: true, noDefaultInfinity: true });

export const arbitraryCategory = (): fc.Arbitrary<string> =>
  fc.constantFrom('Food', 'Salary', 'Rent', 'Transport', 'Freelance', 'Entertainment');

export const arbitraryDate = (): fc.Arbitrary<string> =>
  fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
    .map(d => d.toISOString().slice(0, 10));

export const arbitraryTransactionInput = (): fc.Arbitrary<TransactionInput> =>
  fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    amount: arbitraryAmount(),
    type: arbitraryTransactionType(),
    category: arbitraryCategory(),
    date: arbitraryDate(),
    description: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
  });
```

### Rules for Property Tests

1. Each property test focuses on **one invariant**.
2. Always set `numRuns: 100` minimum. Use `numRuns: 1000` for critical business rules.
3. If a property fails, fast-check will shrink and report the minimal failing example — record it in a regression unit test.
4. Property tests live in `*.pbt.ts` files, not mixed with unit tests.
5. Do not use `Date.now()` inside properties; inject the current date as a parameter.

## What to Test

| Layer | Test type | Coverage goal |
|---|---|---|
| `validator.ts` | Unit | All fields, boundaries, error messages |
| `manager.ts` | Unit + PBT | CRUD correctness + invariants |
| `store.ts` | Unit | Save/load round-trip, error recovery |
| `calculator.ts` | Unit + PBT | Balance identity, edge cases |
| `budget/manager.ts` | Unit + PBT | Monthly filter, status logic, invariants |
| React components | Unit (RTL) | Optional for demo; focus on lib tests |

## Coverage

Run `npm run test:coverage`. Aim for >80% line coverage on `lib/`. Component coverage is a nice-to-have for the 2-day demo.
