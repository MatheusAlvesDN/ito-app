## 2025-04-02 - Extracting State to Prevent Re-renders
**Learning:** In React, inline high-frequency state updates (like text inputs updating on every keystroke) within a parent component that contains complex sibling UI (like a list) will unnecessarily re-render the entire parent and sibling structure, creating a performance bottleneck.
**Action:** Extract the input component and its state into an isolated child component, passing a stable callback for the submit action.

## 2025-04-02 - Purifying Randomized State Initialization
**Learning:** Using `Math.random()` directly within the render body of a component violates React purity rules and causes `@typescript-eslint` or `react-hooks/purity` errors, leading to build failures.
**Action:** Always wrap random initializations (like visual particle generation) in a `useState` lazy initializer function `useState(() => ...)` to ensure the state is generated only once and complies with React's strict purity guidelines.