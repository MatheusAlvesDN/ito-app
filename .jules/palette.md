## 2024-05-19 - Focus States vs Mouse Clicks
**Learning:** Adding Tailwind `focus-visible` states along with `focus-visible:outline-none` provides a solid keyboard accessibility indicator without producing double rings from the browser default or unwanted persistent rings when mouse-clicking.
**Action:** Use `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500` (or similar colors) consistently instead of plain `focus:ring-2` to improve keyboard UX while leaving mouse interaction clean.

## 2024-05-19 - React Linter Impurity Warnings
**Learning:** `Math.random()` inside a functional component's render body triggers React's strict linter for impure functions.
**Action:** Always wrap non-deterministic initialization, like random particle generation, inside a `useState` lazy initializer function: `useState(() => Array.from(...))` to satisfy React hooks purity.
