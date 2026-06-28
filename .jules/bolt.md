## 2025-06-28 - Optimize draggable list rendering
**Learning:** In `@dnd-kit/sortable` implementations (e.g., in `src/ito/GameScreen.tsx`), frequent drag actions cause the entire parent list context to re-render constantly. List items without memoization will needlessly re-render every frame, tanking FPS on mobile devices.
**Action:** Always wrap individual draggable list item components (like `SortablePlayerItem`) with `React.memo()`, and assign a `displayName` to ensure they only re-render when their specific props (or DND internal state) actually change.
