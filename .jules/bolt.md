## 2025-02-12 - Prevent Expensive Re-renders in Drag-and-Drop Lists
**Learning:** In React applications using `@dnd-kit/sortable`, individual list items can re-render unnecessarily on every drag event (e.g., coordinates changing) if they are not memoized, causing significant performance degradation on long lists.
**Action:** Always wrap individual sortable list components (like `SortablePlayerItem`) in `React.memo` to ensure they only re-render when their specific props change, rather than on every parent list update.
