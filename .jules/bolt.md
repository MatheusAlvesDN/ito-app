## 2024-05-24 - Input Latency in Large Lists
**Learning:** Updating a parent component's state (e.g., input field) causes all children (e.g., list items) to re-render unless memoized. In `RegisterScreen`, typing in the input caused O(N) re-renders of the player list, creating noticeable lag as N grows.
**Action:** Always extract list items into `React.memo` components when the parent has high-frequency state updates like text inputs. Use `useCallback` for event handlers passed to these items.
