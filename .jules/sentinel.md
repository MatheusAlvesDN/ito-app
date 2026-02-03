# Sentinel's Journal

## 2025-05-18 - [App Initiation]
**Vulnerability:** N/A
**Learning:** Initial setup of security journal.
**Prevention:** N/A

## 2025-05-18 - [Insecure Randomness in Game Logic]
**Vulnerability:** Usage of `Math.random()` for generating hidden player numbers in a game where secrecy is critical. `Math.random()` is not cryptographically secure and can be predictable.
**Learning:** Even in casual games, if the core mechanic relies on secrecy or fairness, `Math.random()` is insufficient. Use `window.crypto.getRandomValues` (via `getSecureRandomInt`) to prevent predictability.
**Prevention:** Always use `getSecureRandomInt` for game mechanics involving hidden information or chance that affects the outcome. Leave `Math.random()` for visual effects only (confetti, etc.).
