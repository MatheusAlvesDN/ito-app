
## 2026-03-31 - Fix React Impure Function Warning
**Learning:** When generating randomized visual elements (like confetti),  inside the component body violates React's purity rules (react-hooks/purity). Even simple properties like animation duration need to be stable.
**Action:** Use a `useState` lazy initializer (`useState(() => ...)`) to generate random properties only once on mount, keeping the component pure and preventing re-renders from randomizing the UI.
## 2024-03-24 - Accessibility and Focus Visible
**Learning:** Icon-only buttons lacking ARIA labels hide core functionality from screen reader users, while missing outline styles make keyboard navigation difficult to track.
**Action:** Pair `focus-visible:ring-2` with `focus-visible:outline-none` and add descriptive `aria-label` attributes to ensure robust keyboard usability and accessibility.
