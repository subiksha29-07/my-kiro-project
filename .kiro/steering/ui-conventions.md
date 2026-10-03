---
inclusion: always
---

# UI Conventions

## Framework

- Next.js 14 with App Router. All pages and components are `'use client'` for this demo (no server components needed since all data comes from `localStorage`).
- Tailwind CSS for all styling. No CSS Modules, no styled-components, no inline `style` props except for dynamic values (e.g., progress bar width percentage).

## Component Rules

- One component per file.
- Component files export a single default React functional component.
- Props interfaces are defined in the same file, named `{ComponentName}Props`.
- Do not use class components.

## Colour Semantics

Consistent across the entire application:

| Meaning | Tailwind class examples |
|---|---|
| Income / positive / success | `text-green-600`, `bg-green-50`, `border-green-200` |
| Expense / negative / danger | `text-red-600`, `bg-red-50`, `border-red-200` |
| Warning / approaching limit | `text-yellow-600`, `bg-yellow-50`, `border-yellow-200` |
| Neutral / no data | `text-gray-500`, `bg-gray-50`, `border-gray-200` |
| Primary action | `bg-blue-600 hover:bg-blue-700 text-white` |

## Layout

- Use `max-w-4xl mx-auto px-4` as the main content wrapper.
- Dashboard uses a 3-column responsive grid for summary cards: `grid grid-cols-1 sm:grid-cols-3 gap-4`.
- Transaction list uses a stacked card layout: one card per transaction.
- Use `gap-4` or `gap-6` between sections.

## Forms

- All form inputs use a consistent style: `border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`.
- Error messages are rendered below the field in `text-red-500 text-sm`.
- Required fields are marked with a red asterisk: `<span className="text-red-500">*</span>`.
- Submit buttons use the primary action colour. Cancel/secondary buttons use `bg-gray-100 hover:bg-gray-200 text-gray-700`.

## Feedback

- Success notifications: brief toast or inline message in `text-green-600`.
- Error notifications: inline message in `text-red-600`.
- Loading states: show a spinner or "Loading…" text while data loads from `localStorage` on mount.
- Confirmation dialogs (e.g., delete): a simple modal overlay with Confirm (red) and Cancel (grey) buttons.

## Accessibility

- All interactive elements must have accessible labels (`aria-label` or associated `<label>`).
- Colour is never the sole indicator of state; pair colour with text or icons.
- Use semantic HTML: `<button>` for actions, `<form>` for forms, `<nav>` for navigation, `<main>` for main content.
- Ensure sufficient colour contrast (WCAG AA minimum).

## Icons

- Use inline SVG or Heroicons (if installed). Do not add an icon library solely for this demo.
- Keep icons small (16–20px) and paired with visible text labels for clarity.

## Navigation

- A simple top navigation bar with links to Dashboard (`/`) and Transactions (`/transactions`).
- The active route link is visually distinguished with `font-semibold` or an underline.
