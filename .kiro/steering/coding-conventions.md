---
inclusion: always
---

# Coding Conventions

## TypeScript

- Enable `strict: true` in `tsconfig.json`. No `any` types unless absolutely necessary and commented.
- Prefer `interface` over `type` for object shapes that may be extended. Use `type` for unions and primitives.
- Export types from `lib/*/types.ts`; do not define types inline in component files.
- Use `readonly` arrays (`readonly Transaction[]`) in pure functions to signal no mutation.
- Prefer named exports over default exports for all `lib/` modules.
- Default exports are acceptable for page and component files (Next.js convention).

## Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| React components | PascalCase | `TransactionForm` |
| Functions and variables | camelCase | `calculateSummary` |
| TypeScript interfaces | PascalCase | `FinancialSummary` |
| TypeScript enums/union types | PascalCase | `TransactionType` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEY` |
| Test files | `*.test.ts` or `*.pbt.ts` | `manager.test.ts` |
| CSS: use Tailwind classes only | — | `className="text-red-500"` |

## File Length

- Keep files under 200 lines where possible. Split at natural seams (e.g., separate validator from manager).

## Error Handling

- Functions that can fail return a discriminated union or a result object; they do not throw (except `localStorage` quota, which is caught internally).
- Use the pattern: `{ success: true; data: T } | { success: false; error: string }` for operations that produce user-visible errors.
- `console.warn` for recoverable issues (missing `localStorage` key, malformed JSON). `console.error` for unexpected errors.

## Imports

- Use path aliases. Configure `@/*` to resolve from the project root in `tsconfig.json` and `vitest.config.ts`.
- Import order: external packages → internal `lib/` → internal `components/` → types. Keep a blank line between groups.

## Comments

- Write JSDoc comments for all exported functions in `lib/`.
- Do not comment obvious code. Comment non-obvious business rules and edge cases.

## Functional Style in `lib/`

- All manager functions are pure: they receive the current state as a parameter and return a new state. No global mutable variables.
- Use `Array.prototype.filter`, `.map`, `.reduce` over `for` loops.
- Never mutate input arrays. Use spread (`[...arr]`) or `.filter()` to create new arrays.
