## 2025-06-20 - Memoizing Sortable Items in DND-Kit
**Learning:** In DND-Kit drag-and-drop lists, dragging an item triggers frequent re-renders of the parent list context. Without memoizing the individual draggable item components (like `SortablePlayerItem`), every item in the list needlessly re-renders during the drag interaction, causing noticeable performance bottlenecks, especially on mobile.
**Action:** Always wrap list item components used within `<SortableContext>` with `React.memo` to ensure only the actively dragged item or items whose sort indices change will re-render.
