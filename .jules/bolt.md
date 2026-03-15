## 2024-05-24 - Prevent DOM Thrashing on Transient UI States
**Learning:** Returning early to render full-screen transient states (like modals, alerts, or 'viewingPlayer' states) completely unmounts the underlying main component tree. When the state clears, the main view remounts entirely. For views with lists, complex hooks, or heavy SVGs, this causes massive DOM thrashing and CPU spikes.
**Action:** Always render modals and transient states as absolute-positioned overlays on top of the persistent main DOM tree instead of early returning and replacing it entirely.
