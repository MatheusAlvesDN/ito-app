## 2024-05-19 - Impure Function Call During Render Error

**Learning:** When using `Math.random()` to generate values for components inside the main render loop, React linter will report `Cannot call impure function during render` errors, causing build pipelines to fail. Furthermore, the objects created will be destroyed and re-instantiated on every rerender.

**Action:** Whenever generating random visual effects like particles or confetti, always use a `useState` lazy initializer function, avoiding direct execution in the component's body.
