## 2025-02-20 - Memoizing draggable list items
**Learning:** During drag-and-drop interactions (like in `@dnd-kit/sortable`), if list items are not memoized, any parent state update (even optimistic reordering) forces all items in the list to re-render. This causes expensive DOM recalculations and drops frames, especially on mobile devices.
**Action:** Always wrap individual list item components rendered inside a draggable list in `React.memo` to ensure only the items whose props change (e.g. index) re-render. Remember to add the `displayName` when using memoization inside a block.
