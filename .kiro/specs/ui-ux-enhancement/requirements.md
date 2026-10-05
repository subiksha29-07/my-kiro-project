# Requirements Document

## Introduction

This feature enhances the UI/UX of the Smart Expense Tracker Next.js application by introducing
glassmorphism visual effects, entrance animations, hover/interaction animations, and smooth
page and state transitions. The goal is to elevate the application from a functional but plain
Tailwind CSS layout into a polished, visually engaging personal finance experience — while
maintaining full accessibility, performance, and existing functionality.

The changes affect the Sidebar, Dashboard page (BalanceSummary, SummaryCard, MonthlyBreakdown,
BudgetWidget), Transactions page (TransactionList, TransactionItem, TransactionForm,
TransactionFilter, DeleteConfirmDialog), and the AuthModal.

---

## Glossary

- **Animation_System**: The set of CSS keyframes, Tailwind animation utilities, and utility classes
  responsible for entrance, exit, and interaction animations across the application.
- **Glassmorphism_Style**: A visual treatment combining a frosted-glass background (semi-transparent
  with backdrop-filter: blur), a subtle translucent border, and a soft drop shadow.
- **Entrance_Animation**: A one-shot animation that plays when a component first mounts or becomes
  visible, typically a fade-in combined with a short upward translate.
- **Hover_Effect**: A CSS transition applied to interactive elements (cards, buttons, nav items,
  transaction rows) when the user's pointer moves over them.
- **Page_Transition**: An animation sequence that plays when the user navigates between routes,
  providing visual continuity between the Dashboard and Transactions pages.
- **State_Transition**: A smooth visual change triggered by application state updates, such as
  loading → loaded, empty → populated, or form open → form closed.
- **Stagger_Animation**: A technique where a list of sibling elements animate in sequentially with
  a small delay between each item, creating a cascading effect.
- **Reduced_Motion_Mode**: The operating state of the application when the user's system preference
  `prefers-reduced-motion: reduce` is active, in which all non-essential animations are disabled
  or replaced with instant transitions.
- **Dashboard_Page**: The `/dashboard` route rendered by `app/(app)/dashboard/page.tsx`.
- **Transactions_Page**: The `/transactions` route rendered by `app/(app)/transactions/page.tsx`.
- **Sidebar**: The persistent left-hand navigation component at `components/layout/Sidebar.tsx`.
- **SummaryCard**: The metric card component at `components/dashboard/SummaryCard.tsx`.
- **TransactionItem**: The individual transaction row component at
  `components/transactions/TransactionItem.tsx`.
- **AuthModal**: The authentication dialog component at `components/auth/AuthModal.tsx`.

---

## Requirements

### Requirement 1: Glassmorphism Design Tokens and Tailwind Integration

**User Story:** As a developer, I want a centralised set of glassmorphism design tokens and Tailwind
CSS utility classes, so that every component can apply frosted-glass effects consistently without
duplicating CSS rules.

#### Acceptance Criteria

1. THE Animation_System SHALL expose at least three glassmorphism utility classes —
   `glass-card`, `glass-sidebar`, and `glass-modal` — defined in `app/globals.css` under
   `@layer components`.
2. THE Animation_System SHALL define each glassmorphism class within `@layer components` with
   `backdrop-filter: blur(12px)`, a background using `rgba` with an opacity between 0.6 and 0.85,
   a 1 px border using `rgba(255,255,255,0.2)`, and a `box-shadow` with at least one rgba layer
   whose blur radius is greater than 0 px.
3. THE Animation_System SHALL extend `tailwind.config.ts` with at minimum the following custom
   keyframes: `fadeInUp`, `fadeInDown`, `fadeInLeft`, `scaleIn`, and `shimmer`.
4. THE Animation_System SHALL register the custom keyframes as the following named Tailwind
   `animation` utilities — `animate-fade-in-up`, `animate-fade-in-down`, `animate-fade-in-left`,
   `animate-scale-in`, and `animate-shimmer` — accessible in all component class lists.
5. WHEN the `prefers-reduced-motion: reduce` media query is active, THE Animation_System SHALL
   completely disable all animations and transitions tied to `glass-card`, `glass-sidebar`,
   `glass-modal`, `animate-fade-in-up`, `animate-fade-in-down`, `animate-fade-in-left`,
   `animate-scale-in`, and `animate-shimmer` by setting both `animation-duration` and
   `transition-duration` to `0.01ms`, leaving no perceptible motion.

---

### Requirement 2: Sidebar Glassmorphism and Navigation Animations

**User Story:** As a user, I want the sidebar to have a premium frosted-glass look with smooth hover
and active-state animations, so that navigation feels polished and modern.

#### Acceptance Criteria

1. THE Sidebar SHALL apply the `glass-sidebar` utility class — which provides
   `backdrop-filter: blur(12px)`, a semi-transparent background with rgba opacity between
   0.6 and 0.85, and a 1 px rgba border — replacing the current flat `bg-white border-r
   border-slate-100` treatment.
2. WHEN a navigation link in the Sidebar receives a hover interaction, THE Sidebar SHALL
   transition the link background, text colour, and a left-border accent from their default
   state to their hover state within 200 ms using an ease-in-out curve.
3. WHEN a navigation link in the Sidebar is in the active state, THE Sidebar SHALL display a
   filled pill background using `bg-violet-600` with a 2 px left-border accent also in
   `violet-600`, scaled to `1.02` on the x-axis using a CSS transform.
4. WHEN the Sidebar first renders, THE Sidebar SHALL animate in from the left using the
   `animate-fade-in-left` utility — translating from `translateX(-100%)` to `translateX(0)` at
   `opacity: 1` — with a duration of 300 ms.
5. WHEN the Sidebar logo area receives a hover interaction, THE Sidebar logo area SHALL apply a
   `scale(1.05)` transform within 200 ms using an ease-in-out curve, with transform-origin set
   to left center.

---

### Requirement 3: Dashboard Page Entrance Animations and Card Effects

**User Story:** As a user, I want dashboard sections to animate in gracefully when I open the page,
so that the layout feels dynamic and premium rather than static.

#### Acceptance Criteria

1. WHEN the Dashboard_Page mounts, THE Dashboard_Page SHALL apply the `animate-fade-in-down`
   class to the page header with a duration of 400 ms and a 0 ms delay.
2. WHEN the Dashboard_Page mounts, THE Dashboard_Page SHALL apply the `animate-fade-in-up`
   class to the BalanceSummary section with a duration of 500 ms and a 100 ms delay.
3. WHEN the Dashboard_Page mounts, THE Dashboard_Page SHALL apply the `animate-fade-in-up`
   class to the BudgetWidget and Quick Actions panel each with a duration of 500 ms and a 200 ms
   delay.
4. WHEN the Dashboard_Page mounts, THE Dashboard_Page SHALL apply the `animate-fade-in-up`
   class to the MonthlyBreakdown section with a duration of 500 ms and a 300 ms delay.
5. WHEN the user hovers over a SummaryCard, THE SummaryCard SHALL apply a `translateY(-4px)`
   transform and transition its box-shadow from `shadow-sm` to `shadow-lg` within 200 ms using
   an ease-in-out curve.
6. THE SummaryCard SHALL apply the `glass-card` utility class — which provides
   `backdrop-filter: blur(12px)` and a semi-transparent rgba background — replacing the current
   flat `bg-*-50 border-*-100` solid background treatment.
7. WHEN `isLoading` is true, THE SummaryCard SHALL display an animated shimmer effect using the
   `animate-shimmer` class on the `div[aria-busy="true"]` placeholder element, replacing the
   current static `animate-pulse` class.

---

### Requirement 4: Transaction List Stagger Animations and Item Interactions

**User Story:** As a user, I want transactions to animate in with a staggered cascade effect and
react to hover interactions, so that the list feels lively and interactive.

#### Acceptance Criteria

1. WHEN the TransactionList renders its items, THE TransactionList SHALL apply the
   `animate-fade-in-up` class to each TransactionItem with a stagger delay computed as
   `Math.min(index * 40, 400)` ms, so that items animate in sequentially and the maximum
   delay for any item never exceeds 400 ms.
2. WHEN the user hovers over a TransactionItem, THE TransactionItem SHALL apply a
   `translateY(-2px)` transform and transition its box-shadow from `shadow-sm` to `shadow-md`
   within 150 ms using an ease-in-out curve.
3. THE TransactionItem SHALL apply the `glass-card` utility class so each row has a subtle
   translucent background consistent with the glassmorphism design system.
4. WHEN a TransactionItem is deleted, THE TransactionItem SHALL apply a `scale(0)` transform
   and transition its opacity from 1 to 0 over 200 ms before the DOM node is removed, so the
   visual transition completes fully before unmount.
5. WHEN the TransactionList is empty, THE TransactionList empty-state container SHALL animate
   in using the `animate-scale-in` class with a duration of 300 ms.

---

### Requirement 5: AuthModal Glassmorphism and Mount Animation

**User Story:** As a user, I want the authentication modal to use a frosted-glass panel over a
blurred backdrop so that it feels visually cohesive with the rest of the application.

#### Acceptance Criteria

1. WHEN the AuthModal opens, THE AuthModal SHALL animate the backdrop from `opacity: 0` to
   `opacity: 1` over 200 ms using an ease-out curve.
2. WHEN the AuthModal opens, THE AuthModal SHALL animate the modal panel using the `animate-scale-in`
   class — starting at `scale(0.95)` and `opacity: 0` — arriving at `scale(1)` and `opacity: 1`
   over 250 ms with an ease-out curve.
3. WHEN the AuthModal is dismissed via the close button, backdrop click, or Escape key, THE
   AuthModal SHALL animate the modal panel from `scale(1)` and `opacity: 1` to `scale(0.95)` and
   `opacity: 0` over 200 ms with an ease-in curve, and SHALL simultaneously transition the
   backdrop from `opacity: 1` to `opacity: 0` over 200 ms, before removing both elements from
   the DOM.
4. THE AuthModal panel SHALL apply the `glass-modal` utility class — providing
   `backdrop-filter: blur(12px)`, a semi-transparent rgba background with opacity between 0.6
   and 0.85, a 1 px `rgba(255,255,255,0.2)` border, and a box-shadow with a non-zero blur
   radius — replacing the current flat `bg-white` treatment.
5. THE AuthModal backdrop SHALL maintain `backdrop-blur-sm` and use `bg-black/50` as the overlay
   colour to provide sufficient contrast against the glass panel.

---

### Requirement 6: Form and Button Micro-Interactions

**User Story:** As a user, I want form inputs and buttons to respond visually to my interactions
with subtle feedback animations, so that the interface feels responsive and tactile.

#### Acceptance Criteria

1. WHEN a form input in TransactionForm or AuthModal receives focus, THE input element SHALL
   transition its `border-color` and `box-shadow` from the default state to the focused state
   within 150 ms using an ease-in-out curve, additive to the existing `focus:ring-2` utility.
2. WHEN a primary action button (submit, save, confirm) in any colour variant (violet, emerald,
   or rose) receives a hover interaction, THE button SHALL apply a `translateY(-1px)` transform
   and transition its box-shadow from `shadow-sm` to `shadow-md` within 150 ms.
3. WHEN a primary action button is in the active (pressed) state, THE button SHALL apply a
   `translateY(0)` transform and revert its box-shadow from `shadow-md` to `shadow-sm` within
   80 ms.
4. WHILE the AuthModal submit button is in the loading state (disabled with spinner), THE button
   SHALL display the existing `animate-spin` spinner and SHALL cycle the button text opacity
   between 1 and 0.4 with a 600 ms period using an ease-in-out timing function.
5. WHEN a destructive action button in TransactionItem, DeleteConfirmDialog, or Sidebar receives
   a hover interaction, THE button SHALL transition its background and icon colour (via
   `fill="currentColor"` inheritance) to the danger palette (`bg-rose-50`, `text-rose-600`)
   with an explicit `transition-duration` of 200 ms.

---

### Requirement 7: Page-Level Transition Continuity

**User Story:** As a user, I want navigating between Dashboard and Transactions to feel seamless
with a smooth visual transition, so that the application does not feel like a series of hard
page loads.

#### Acceptance Criteria

1. WHEN any route within the application changes, THE layout at `app/(app)/layout.tsx` SHALL
   trigger a re-render of its `children` slot with a new React `key` derived from the current
   pathname, so that the entrance animation replays on every navigation.
2. THE `tailwind.config.ts` SHALL define the `fadeInUp` keyframe as: `0% { opacity: 0;
   transform: translateY(16px); }` `100% { opacity: 1; transform: translateY(0); }` and SHALL
   register it as the `animate-fade-in-up` utility with a default duration of 350 ms and an
   ease-out timing function.
3. WHEN any route within the application mounts, THE page root element SHALL have the
   `animate-fade-in-up` class applied, so that the entrance animation plays on every route
   change without requiring per-page opt-in.
4. WHEN the `prefers-reduced-motion: reduce` media query is active, THE layout SHALL set the
   `animation-duration` of `animate-fade-in-up` to `0.01ms`, ensuring no page-transition motion
   is perceptible.

---

### Requirement 8: Accessibility and Performance Constraints

**User Story:** As a developer, I want all animation and visual enhancements to respect user
accessibility preferences and maintain smooth rendering, so that no user is excluded and
performance is not degraded.

#### Acceptance Criteria

1. THE Animation_System SHALL implement `@media (prefers-reduced-motion: reduce)` rules in
   `app/globals.css` that completely disable all animations and transitions — including
   `animate-fade-in-up`, `animate-fade-in-down`, `animate-fade-in-left`, `animate-scale-in`,
   `animate-shimmer`, `animate-pulse`, and all glassmorphism utility transitions — by setting
   `animation-duration` and `transition-duration` to `0.01ms`, ensuring no motion is perceptible
   when the user has opted for reduced motion.
2. IF `backdrop-filter` is not supported by the browser, THE Animation_System SHALL automatically
   apply a fallback background with an rgba opacity of at least 0.85 to each `glass-card`,
   `glass-sidebar`, and `glass-modal` surface via a `@supports not (backdrop-filter: blur(1px))`
   rule, such that the surface maintains a WCAG 2.1 AA contrast ratio (≥ 4.5:1 for normal text,
   ≥ 3:1 for large text) against its foreground text.
3. WHEN the application renders glassmorphism surfaces, THE Animation_System SHALL ensure that
   text contrast on glass backgrounds meets WCAG 2.1 AA standard (minimum contrast ratio of
   4.5:1 for normal text, 3:1 for large text).
4. THE Animation_System SHALL ensure all animations use only `transform` and `opacity` CSS
   properties, and that no more than 5 elements animate simultaneously at any point during
   entrance, hover, or page-transition sequences, to remain compositor-only and avoid layout
   repaints.
5. WHEN a glassmorphism surface is rendered, THE root layout SHALL provide a gradient mesh or
   subtle background texture behind all glass surfaces such that the glass effect achieves a
   minimum contrast ratio of 4.5:1 for normal text against the glass panel on plain backgrounds
   (e.g., `bg-slate-50`).
