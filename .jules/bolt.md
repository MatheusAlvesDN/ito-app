## 2024-05-24 - Optimize drag-and-drop re-renders
**Learning:** React components acting as individual sortable list items in `@dnd-kit/sortable` cause expensive and unnecessary whole-list re-renders during drag operations if not properly memoized.
**Action:** Always wrap individual sortable list item components in `React.memo()` to prevent expensive re-renders during drag operations.
