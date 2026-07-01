## 2024-05-14 - Prevent List Re-renders on Drag
**Learning:** In React components using `@dnd-kit/sortable`, dragging an item triggers frequent re-renders of the parent list component (and all its children) as the layout changes continuously. This is especially true when `SortablePlayerItem` isn't memoized, causing the entire list to re-render for every drag update.
**Action:** Always wrap the sortable item component with `React.memo` to prevent unnecessary re-renders of the list items while dragging. Remember to add the `displayName` when using an anonymous function with `memo`.
