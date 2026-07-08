## 2024-05-18 - Icon-Only Buttons Accessibility
**Learning:** Icon-only buttons without accessible names (like `aria-label`) are a common accessibility issue across the different game modes' component structures (e.g., `RegisterScreen.tsx`). Screen readers cannot announce the purpose of these buttons without these attributes.
**Action:** When creating or reviewing components with icon-only buttons (like Back, Add, Remove), always ensure an `aria-label` attribute is added in Portuguese to describe the button's action clearly to assistive technologies.
