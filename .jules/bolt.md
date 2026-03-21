## 2024-05-20 - Extracting isolated inputs prevents expensive array/list re-renders
**Learning:** In React, typing into a text input managed by the same component that renders a large or expensive list (like a dynamic array of items or complex UI elements) causes the *entire list* to re-render on every single keystroke. This causes severe typing latency on slower devices.
**Action:** Always isolate text inputs that require high-frequency updates (e.g., `onChange` keystroke handlers) into their own distinct `PlayerInput` or `SearchInput` child components that encapsulate their local state. Pass the final value back up via an `onAdd` or `onSubmit` callback.

## 2024-05-20 - Using useState lazy initializer for random values prevents purity errors
**Learning:** Calling `Math.random()` during a React component's render body (e.g., to create random positions or colors for particles) is an impure operation that can lead to linter errors (`react-hooks/purity`) and visual flickering on re-renders. Using `useMemo` isn't recommended for this because React may throw away memoized values.
**Action:** Use a `useState` lazy initializer function (`const [state] = useState(() => Math.random())`) to safely generate random values exactly once during component mount without violating React's purity rules.
