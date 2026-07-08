## 2024-05-18 - Drag and drop performance

**Learning:** Sortable items in `@dnd-kit/sortable` cause re-renders of the whole list while dragging, hurting performance especially on mobile browsers.
**Action:** Always wrap sortable list item components in `React.memo()` to prevent expensive re-renders during drag operations.
