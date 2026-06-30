## 2024-05-24 - Missing ARIA labels in secondary game modes
**Learning:** Found an accessibility pattern where icon-only buttons (like 'Voltar', 'Adicionar jogador', 'Remover') were fully labeled in the primary game mode (`ito/RegisterScreen.tsx`) but lacked ARIA labels in identical components across other game modes (`impostor`, `whoami`) and mode selection menus.
**Action:** Always verify corresponding components in secondary game modes when fixing an accessibility issue in one mode's component structure to ensure systemic compliance.
