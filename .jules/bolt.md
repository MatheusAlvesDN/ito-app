## 2024-06-30 - Optimizing DND Kit Sortable Items
**Learning:** In lists implemented with `@dnd-kit/sortable`, individual sortable items can suffer from significant, unnecessary re-renders during drag operations if their props haven't changed, leading to noticeable UI jank, especially on mobile devices.
**Action:** Always wrap individual list item components rendered inside a `SortableContext` with `React.memo` (and assign `.displayName`) to prevent expensive re-renders when the parent `DndContext` state updates during dragging.
