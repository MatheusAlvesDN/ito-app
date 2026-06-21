## 2024-06-21 - Optimizing DND list item
**Learning:** In a draggable list with React, child items that aren't wrapped in React.memo re-render on every drag update, causing jank on longer lists.
**Action:** When using sortable list components, always wrap individual item components in React.memo.
