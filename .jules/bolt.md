## 2025-05-15 - React.memo on Drag-and-Drop Sortable Items
**Learning:** Found that draggable list items (`SortablePlayerItem`) in `src/ito/GameScreen.tsx` using `@dnd-kit/sortable` were not memoized. In draggable lists, rendering can be a performance bottleneck during drag interactions because state updates might trigger renders for the entire list.
**Action:** Wrap draggable list item components with `React.memo()` to prevent expensive re-renders of non-dragged items when drag interactions trigger state updates.
