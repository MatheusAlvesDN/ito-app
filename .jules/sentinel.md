## 2025-05-27 - Weak Randomness in Game Mechanics
**Vulnerability:** Used `Math.random()` for generating secret player numbers, which is not cryptographically secure and could be predicted.
**Learning:** Even in casual games, hidden information mechanics rely on unpredictability. Using `Math.random()` undermines the 'fairness' and 'secrecy' aspect if a player can predict the sequence.
**Prevention:** Always use `crypto.getRandomValues` (Browser) or `crypto` module (Node) for any mechanic involving secrets or fairness, abstracting it into a `getSecureRandomInt` helper.
