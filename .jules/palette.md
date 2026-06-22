## 2025-06-22 - Add ARIA labels to icon-only back buttons
**Learning:** Found that multiple `<button>` tags with just an SVG icon (`<ChevronLeft>`) were missing `aria-label` attributes across multiple screens. This is a common pattern in the app's navigation headers.
**Action:** When adding new screens with navigation, always ensure `aria-label` is present on back buttons to improve screen reader accessibility.
