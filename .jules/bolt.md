## 2024-05-24 - React Input Re-renders
**Learning:** In React, placing a controlled text input inside a large parent component (like `RegisterScreen` with a list of players) causes the entire parent to re-render on every keystroke. This is a common performance bottleneck specific to how React handles state updates bubbling up.
**Action:** Always extract high-frequency state updates (like text inputs) into isolated child components. Manage the state locally and only invoke the parent's callback when the final action (e.g., submitting the form) occurs.

## 2024-05-24 - Impure Functions in Render
**Learning:** The React Compiler/linter strictly enforces purity. Calling `Math.random()` directly inside the render body (e.g., when initializing a list of particles for Confetti) throws an "impure function during render" error.
**Action:** Use a `useState` lazy initializer function (e.g., `useState(() => Array.from(...))`) to generate random initial state safely, ensuring it only runs once per component mount and satisfies React's purity rules without triggering re-renders.
