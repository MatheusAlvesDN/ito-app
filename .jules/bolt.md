## 2024-06-30 - Optimize Draggable Lists
**Learning:** In draggable lists using `@dnd-kit/sortable`, individual list item components must be wrapped in `React.memo` to prevent expensive re-renders of the entire list during drag-and-drop interactions. React DevTools shows that the `GameScreen` component frequently re-renders child items in `SortablePlayerItem` due to drag events if not memoized, causing lag.
**Action:** Wrap the `SortablePlayerItem` definition in `React.memo` and add an explicit `displayName` to prevent React DevTools warnings.
