## 2024-05-23 - Optimizing List Re-renders in React Forms
**Learning:** In a React component with controlled inputs (`inputValue`), rendering a list inline (using `map`) causes all list items to re-render on every keystroke, even if list state (`items`) hasn't changed. This is a common performance bottleneck in forms.
**Action:** Extract list items into a `memo`ized component (e.g., `PlayerItem`). Ensure callback props (like `onRemove`) are stable using `useCallback` to prevent breaking memoization. This isolates the list items from parent state updates unrelated to them.
