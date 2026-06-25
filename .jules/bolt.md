## 2024-05-18 - Drag and Drop List Re-renders
**Learning:** In React components using `@dnd-kit/sortable`, individual list items re-render constantly during drag operations by default because the parent list component's state changes.
**Action:** Always wrap individual draggable list item components (like `SortablePlayerItem`) with `React.memo` to prevent expensive re-renders of the entire list during drag-and-drop interactions, only allowing re-renders for the items directly affected by the state change.
