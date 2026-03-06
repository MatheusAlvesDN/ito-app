## 2024-03-06 - App Client-Side DoS Vulnerability
**Vulnerability:** The application was vulnerable to client-side DoS and memory exhaustion. The addPlayer function allowed adding an unlimited number of players, which would crash the browser via an infinite loop in GameScreen.tsx (random number assignment). Additionally, the player name input lacked a maximum length limit, allowing massive strings to be stored in state.
**Learning:** Client-side arrays and strings are just as vulnerable to unbounded growth as server-side ones. Unrestricted state limits combined with specific logic (like `do { ... } while()`) can cause complete application lockup on the user device.
**Prevention:** Always set `maxLength` on text inputs and enforce maximum limits on items added to client-side state lists.
