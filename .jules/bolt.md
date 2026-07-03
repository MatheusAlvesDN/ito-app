## 2024-07-03 - Memory: Wrap list items in React.memo
**Learning:** To optimize performance in draggable lists (e.g., when using `@dnd-kit/sortable`), wrap individual list item components in `React.memo` to prevent expensive re-renders of the entire list during drag-and-drop interactions. Always add `displayName` when using anonymous functions.
**Action:** Always wrap draggable items and use React.memo().
