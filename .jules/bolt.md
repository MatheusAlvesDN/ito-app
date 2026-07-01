## 2024-05-14 - Memoizing Draggable Lists
**Learning:** Found an unmemoized component `SortablePlayerItem` being rendered inside a draggable list (`@dnd-kit/sortable`). This causes unnecessary re-renders of the entire list of items during drag-and-drop interactions, significantly degrading performance, especially on mobile devices where this app is targeted.
**Action:** Always check draggable lists or any list with high-frequency updates and memoize the individual list items using `React.memo` to optimize performance.
