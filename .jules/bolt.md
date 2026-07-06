## 2025-02-18 - Optimized drag-and-drop lists
**Learning:** In `@dnd-kit/sortable` implementations in this codebase, entire lists re-render during drag operations if list items aren't properly memoized.
**Action:** Always wrap individual sortable list item components (like `SortablePlayerItem`) in `React.memo()` to prevent expensive and unnecessary whole-list re-renders during drag operations. Ensure to add an inline comment and `displayName` when doing so.
