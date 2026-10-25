# Mock Interview — Frontend (React/Next.js/TS)

> Use this with a friend or Pramp.com. Time: 45 min coding + 15 min behavioral.

## Part 1: Coding (45 min)

### Q1: React Component — Debounced Search
**Prompt:** Build a search input that fetches results from `/api/search?q=...` with 300ms debounce. Show loading state, error state, and "no results" state.

**What they test:** useEffect cleanup, debounce, state management, fetch handling.

**Follow-ups:**
- How would you cancel in-flight requests?
- How would you cache results?
- How would you handle race conditions (slow vs fast responses)?

### Q2: TypeScript — Type a Generic API Hook
**Prompt:** Write a generic `useFetch<T>(url: string)` hook that returns `{ data: T | null, loading: boolean, error: Error | null }`.

**What they test:** Generics, union types, async state, cleanup.

**Follow-ups:**
- How to add refetch?
- How to handle retries?
- How to type the error more specifically?

### Q3: State Management — Shopping Cart
**Prompt:** Implement a cart using React Context + useReducer. Support: add item, remove item, update quantity, clear cart, total price.

**What they test:** Reducer pattern, context, derived state, immutability.

**Follow-ups:**
- How would you persist to localStorage?
- How would you handle server sync?
- When would you use Zustand instead?

### Q4: Performance — Optimize a Slow List
**Prompt:** Given a list of 10,000 items rendering slowly, what optimizations would you apply?

**Expected answers:** React.memo, useMemo, useCallback, virtualization (react-window), key prop, avoiding inline objects, code splitting, lazy loading.

**Follow-ups:**
- How to profile with React DevTools?
- When is memoization harmful?
- Difference between useMemo and useCallback?

### Q5: Next.js — Server vs Client Components
**Prompt:** When would you use a Server Component vs a Client Component? Give examples.

**Expected answers:**
- Server: data fetching, heavy deps, no interactivity, SEO
- Client: useState, useEffect, event handlers, browser APIs
- Can pass Server Components as children to Client Components

**Follow-ups:**
- How do you share data between Server and Client?
- What is the "use client" boundary?
- How does streaming work with Suspense?

## Part 2: System Design (15 min)

### Q: Design a Product Catalog Page
**Prompt:** Design the frontend architecture for an e-commerce product listing page with filters, search, pagination, and cart.

**Expected to cover:**
- Component breakdown (ProductCard, FilterSidebar, SearchBar, Pagination)
- State management (URL params for filters, React Query for data)
- Data fetching (SSR vs CSR, caching, pagination strategy)
- Performance (lazy loading images, code splitting, memoization)
- Accessibility (keyboard nav, ARIA, focus management)
- Error/loading/empty states

## Part 3: Behavioral (STAR Format)

Prepare 5 stories:

1. **Conflict:** "Tell me about a time you disagreed with a teammate."
2. **Failure:** "Tell me about a time you made a mistake and how you fixed it."
3. **Leadership:** "Tell me about a time you took initiative."
4. **Ambiguity:** "Tell me about a time you worked with unclear requirements."
5. **Achievement:** "Tell me about your proudest technical accomplishment."

### STAR Template
- **S**ituation: Context (1-2 sentences)
- **T**ask: What was your responsibility
- **A**ction: What YOU did (specific, "I" not "we")
- **R**esult: Measurable outcome + what you learned

## Part 4: Quick-Fire (5 min)

1. Difference between `==` and `===`?
2. What is closure?
3. What is the event loop?
4. Difference between `let`, `const`, `var`?
5. What is hoisting?
6. Difference between `null` and `undefined`?
7. What is a Promise? What are `.then`, `.catch`, `.finally`?
8. What is async/await?
9. Difference between `map`, `filter`, `reduce`?
10. What is the spread operator?
11. Difference between `interface` and `type` in TypeScript?
12. What is a generic in TypeScript?
13. What is `key` prop in React lists?
14. Difference between controlled and uncontrolled components?
15. What is `useMemo` vs `useCallback`?
16. What is the virtual DOM?
17. What is `useEffect` cleanup?
18. What is React StrictMode?
19. Difference between SSR and CSR?
20. What is hydration?

## Scoring Rubric

| Category | 1 (Weak) | 3 (OK) | 5 (Strong) |
|---|---|---|---|
| Problem solving | Needs hints | Solves with minor hints | Solves independently, discusses tradeoffs |
| Code quality | Messy, no types | Clean, some types | Clean, typed, tested mentally |
| Communication | Silent, unclear | Explains when asked | Thinks aloud, explains decisions |
| Edge cases | Misses all | Catches some | Catches all + discusses |
| Performance | No awareness | Basic awareness | Deep understanding |

**Target: 3+ in all categories for a Mid role.**
