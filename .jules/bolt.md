## 2024-06-27 - DND Kit Sortable Item Re-rendering
**Learning:** `useSortable` items in `@dnd-kit` trigger expensive re-renders across the whole list whenever any single item is dragged.
**Action:** Always wrap components rendered inside `SortableContext` with `React.memo` and define a `displayName` to prevent massive re-renders during drag-and-drop actions.
