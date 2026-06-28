## 2024-06-28 - Optimizing dnd-kit SortableItems
**Learning:** `dnd-kit`'s `SortableContext` causes parent re-renders during drag operations, which propagate down to all items in the list if they aren't memoized. Unmemoized `SortablePlayerItem` components cause measurable performance degradation during dragging, as every item re-evaluates its render cycle unnecessarily.
**Action:** Always wrap individual draggable list item components (like `SortablePlayerItem`) with `React.memo`, explicitly providing `displayName` to prevent ESLint errors, to ensure smooth 60fps drag-and-drop interactions.
