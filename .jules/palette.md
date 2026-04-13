## 2024-04-13 - Focus Styles on Icon-only Buttons
**Learning:** Adding focus-visible rings with outline-none is a robust pattern for custom keyboard accessibility, but aria-labels must translate to Portuguese to match the app context.
**Action:** Always apply `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400` alongside Portuguese `aria-label`s for interactive icons without visible text.
