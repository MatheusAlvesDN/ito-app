## 2025-05-18 - Monolithic App Component
**Learning:** The entire application logic, including large static datasets (`QUESTIONS_DB`), was contained within a single `App.tsx` file. This forces the user to download all game logic and data just to see the home screen.
**Action:** Identified `GameScreen` as the largest independent module. Extracted it along with its data into a separate chunk using `React.lazy`. Future features should follow this pattern of screen-level code splitting.
