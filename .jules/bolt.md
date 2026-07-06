## 2024-07-06 - Optimize drag-and-drop elements with React.memo
**Learning:** During drag-and-drop operations with `@dnd-kit/sortable`, individual list items can re-render unnecessarily on each frame, causing severe performance degradation. This is specifically critical in dynamic rendering architectures involving large lists and complex items.
**Action:** Always wrap individual sortable list item components (like `SortablePlayerItem`) in `React.memo()` with `displayName` to prevent expensive and unnecessary whole-list re-renders during drag operations.
