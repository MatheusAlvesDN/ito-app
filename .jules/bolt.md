## 2024-05-22 - Component Extraction for State Isolation
**Learning:** In `App.tsx`, high-frequency state updates (like typing in `RegisterScreen`) cause re-renders of the entire screen component, including potentially expensive lists. Extracting the input into a separate component `AddPlayerInput` isolates the re-renders.
**Action:** Whenever input fields are part of a larger component that renders lists or complex UI, extract the input logic into a dedicated component to prevent unnecessary parent re-renders.
