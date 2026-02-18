## 2026-02-18 - [Input Re-rendering Entire Screen]
**Learning:** The `RegisterScreen` component in `App.tsx` was re-rendering the entire player list on every keystroke because the input state was at the top level.
**Action:** Extracted `AddPlayerInput` into an isolated component to contain the high-frequency state updates, preventing unnecessary re-renders of the parent and siblings.
