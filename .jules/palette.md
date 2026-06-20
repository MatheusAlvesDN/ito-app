## 2024-06-20 - Form Accessibility
**Learning:** React fragments or generic labels without `htmlFor` and inputs without `id`s degrade the accessibility of core configuration screens like `LobbySetupScreen`.
**Action:** Always pair `<label>` and `<input>` with matching `htmlFor` and `id` attributes. Additionally, ensure icon-only buttons like the back button have an `aria-label`.
