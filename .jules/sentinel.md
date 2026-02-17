## 2025-02-14 - Information Leak in Game Phase Transition
**Vulnerability:** The `isRevealed` state (controlling whether a player's number is visible) was not reset when switching players via grid selection, allowing subsequent players to see numbers without explicit revelation.
**Learning:** React state persistence can lead to stale UI states across different conceptual "screens" or "items" if not explicitly reset during transitions.
**Prevention:** Always reset UI control flags (like `isRevealed`) when changing the primary data subject (like `viewingPlayer`).
