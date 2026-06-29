## 2025-06-29 - React.memo Optimization for Draggable Lists
**Learning:** Wrapping complex list item components used within drag-and-drop contexts (like `@dnd-kit/sortable`) with `React.memo` is crucial for preventing expensive, cascading re-renders across the entire list during rapid interaction phases.
**Action:** Always wrap `Sortable` item components with `memo` when implementing draggable lists to ensure a smoother, more performant UI during dragging events. Remember to append `.displayName` to satisfy ESLint.
