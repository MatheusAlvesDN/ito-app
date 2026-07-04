## 2024-05-15 - React.memo on Drag-and-Drop Sortable Items
**Learning:** Using `@dnd-kit/sortable` with large/complex lists in React can cause expensive re-renders across the entire list when an item is dragged.
**Action:** Wrap the individual sortable item component (e.g., `SortablePlayerItem`) in `React.memo` to prevent expensive re-renders of non-dragged items. Ensure `displayName` is set to avoid ESLint warnings.
