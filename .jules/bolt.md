## 2024-05-22 - Optimizing React List Rendering
**Learning:** Extracting list items into memoized components prevents O(N) re-renders when parent state changes (like typing in an input).
**Action:** Look for inline `map` renderings in forms or interactive components and extract them to memoized components.
