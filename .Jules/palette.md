# Palette's Journal

This journal records critical UX and accessibility learnings.

## Learning Log

## 2024-05-22 - Accessibility & Performance
**Learning:** Icon-only buttons were pervasive without accessible labels, making navigation difficult for screen readers. Additionally, visual effects like Confetti were causing re-render performance issues and lint errors due to impure calculations.
**Action:** Always audit icon-only buttons for `aria-label`. Use `useState` or `useMemo` for random visual data generation to ensure stability and purity.
