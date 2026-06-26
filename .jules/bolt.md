## 2024-05-24 - Bolt Optimization Journal

## 2024-05-24 - Memoize Drag and Drop Components
**Learning:** Using `@dnd-kit/sortable` triggers re-renders of the entire list during drag interactions if individual items are not memoized, causing potential performance bottlenecks on long lists.
**Action:** Always wrap individual list item components in `memo` (and add `displayName`) when they are used within a draggable context like `SortableContext` to prevent expensive unnecessary re-renders.
