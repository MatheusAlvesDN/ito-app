## 2024-03-24 - Form Label Association
**Learning:** In configuration screens like LobbySetupScreen, inputs lacked explicit programmatic associations with their labels, impairing screen reader context for critical setup fields.
**Action:** Always verify and enforce that `<label>` elements are associated with their corresponding `<input>` elements using matching `htmlFor` and `id` attributes to maintain accessibility standards.
