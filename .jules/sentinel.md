## 2026-02-13 - Unused Security Utilities
**Vulnerability:** Game logic used insecure `Math.random()` despite `secureRandom.ts` existing in the codebase.
**Learning:** Security utilities were present but commented out, likely due to forgotten refactoring or lack of enforcement.
**Prevention:** Always check for existing security utilities before implementing new ones, and ensure they are used where appropriate.
