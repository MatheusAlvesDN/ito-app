## 2024-05-16 - Add ARIA Labels to Back Buttons
**Learning:** This app extensively uses icon-only `ChevronLeft` navigation buttons across almost all its screen components. Most were missing `aria-label` attributes, which makes navigation inaccessible to screen readers.
**Action:** Always verify icon-only interactive elements for `aria-label` when creating or reviewing navigation structures. Consider a reusable `<BackButton>` component to enforce this pattern globally in the future.
