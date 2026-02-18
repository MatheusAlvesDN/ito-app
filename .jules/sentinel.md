## 2025-02-18 - Unused Security Utilities
**Vulnerability:** The application was using `Math.random()` for critical game mechanics (player numbers, question selection) despite having a `getSecureRandomInt` utility available in the codebase.
**Learning:** Developers may overlook existing security utilities and default to insecure standard library functions if they are not enforced or widely used.
**Prevention:** Enforce the use of security utilities via linting rules or code reviews. Regularly audit the codebase for usage of insecure functions like `Math.random()` when a secure alternative exists.
