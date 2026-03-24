## 2024-03-24 - Extract High-Frequency State in RegisterScreen
**Learning:** In screens where a list is displayed alongside a text input (like RegisterScreen), updating the input state in the parent component causes the entire list to re-render on every keystroke. This is a common React anti-pattern that severely degrades typing performance as the list grows.
**Action:** Always extract high-frequency state updates (like text inputs) into isolated child components, preventing unnecessary re-renders of sibling elements and expensive parent components.
