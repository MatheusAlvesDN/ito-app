## 2024-05-24 - Memoize Draggable List Items
**Learning:** In draggable lists using `@dnd-kit/sortable`, individual list item components re-render extensively during drag-and-drop interactions, causing significant performance overhead if the entire list updates on every move.
**Action:** Wrap individual list item components in `React.memo` (or `memo`) to prevent expensive re-renders of the entire list during drag-and-drop interactions.
