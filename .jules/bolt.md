## 2026-03-26 - [Impure Functions & React Purity Rule]
**Learning:** Initializing array values (like particles with random numbers) dynamically during render causes the `react-hooks/purity` linter to fail because `Math.random()` is an impure function. Also, recalculating these during re-render causes unneeded thrashing and allocations.
**Action:** Use a `useState(() => ...)` lazy initializer block to set up random or complex states on component mount. This resolves lint errors and prevents costly re-computation or unwanted side-effects on subsequent renders.
