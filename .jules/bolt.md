## 2026-07-03 - Added React.memo to prevent list rerenders
**Learning:** Wrapping complex, interactive list items (like ones driven by @dnd-kit) in `React.memo` is critical to prevent entire list re-renders when a single item is interacted with or during sorting.
**Action:** Always identify long lists or draggable/interactive lists and evaluate if individual items can be memoized to limit render boundaries.
