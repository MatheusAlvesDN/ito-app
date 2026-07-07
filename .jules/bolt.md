## 2024-06-03 - Optimize DND Kit Sortable Re-renders
**Learning:** Drag-and-drop features utilizing `@dnd-kit/sortable` can trigger expensive and unnecessary whole-list re-renders during drag operations.
**Action:** Always wrap the individual sortable list item components (e.g., `SortablePlayerItem`) in `React.memo()` to prevent these re-renders.
