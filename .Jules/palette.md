# Palette's Journal

## 2025-02-18 - Client-Side Only Animations
**Learning:** Pure random generation in React render phase causes hydration mismatches and jank on re-renders.
**Action:** Move client-side only visual effects (like confetti) to `useEffect` with state to ensure stability and React purity.

## 2025-02-18 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without explicit labels.
**Action:** Always add `aria-label` describing the action (e.g., "Voltar", "Remover Player 1") to buttons that rely solely on icons.
