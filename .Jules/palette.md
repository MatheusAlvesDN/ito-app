## 2025-02-18 - Accessibility Gaps in Icon-Only Buttons
**Learning:** This application heavily relies on icon-only buttons (using Lucide icons) for navigation and actions without providing accessible names. This makes the app difficult to navigate for screen reader users.
**Action:** When creating or modifying icon-only buttons, always include an `aria-label` describing the action (e.g., "Voltar", "Adicionar jogador").

## 2025-02-18 - React Strict Mode Purity
**Learning:** Using `Math.random()` during render (e.g., for initializing `useState` or `useMemo`) violates React's purity rules and is flagged by linters, especially for client-side visual effects like confetti.
**Action:** Move random generation for visual effects into `useEffect` to ensure deterministic rendering and satisfy purity requirements.
