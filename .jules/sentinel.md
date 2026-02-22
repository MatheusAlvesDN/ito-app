## 2025-02-18 - Avoiding Security Theater in Visual Effects
**Vulnerability:** Weak Random Number Generation (Math.random) used in game logic.
**Learning:** While replacing `Math.random` with a CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) is crucial for game fairness (player numbers, card draws), applying it to purely visual effects like confetti colors constitutes "security theater". It adds unnecessary computational overhead without any tangible security benefit.
**Prevention:** Distinguish between security-critical logic (outcomes, secrets, auth) and visual/cosmetic logic. Use secure RNGs only where unpredictability materially affects the application's integrity or fairness.
