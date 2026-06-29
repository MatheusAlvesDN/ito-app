## 2024-06-29 - Memoizing Sortable Items in DND-Kit
**Learning:** In dragging contexts like `@dnd-kit/sortable`, child list items re-render constantly as coordinates update. Without memoization on the individual components representing the list items, the entire tree can suffer from significant layout recalculation blocking the main thread.
**Action:** When implementing sortable lists, always wrap the custom item components with `React.memo` (and set `displayName` to satisfy React DevTools and linters) to ensure fast drag-and-drop interactions.
