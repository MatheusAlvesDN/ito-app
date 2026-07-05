## 2024-05-30 - Memoization of drag and drop items
**Learning:** Components used as sortable items in libraries like `@dnd-kit/sortable` (e.g. `SortablePlayerItem`) re-render very frequently during drag operations, leading to significant performance degradation on mobile if not memoized.
**Action:** Always wrap draggable list items and sibling visual effects (like particle systems e.g. `Confetti`) in `React.memo()` with explicit `displayName`s to prevent expensive layout recalculations during DND interactions.
