## 2024-06-23 - Prevent re-renders in draggable list
**Learning:** In a draggable list (e.g. using @dnd-kit/sortable), rendering un-memoized components for each list item causes expensive full-list re-renders during drag operations.
**Action:** Wrap individual list item components in React.memo (e.g. \`const SortablePlayerItem = React.memo((props) => ...)\`) to prevent re-renders of unmodified items when parent state or other items' order changes.
