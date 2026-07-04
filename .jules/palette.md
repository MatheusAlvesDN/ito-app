## 2024-05-24 - Form labels accessibility
**Learning:** Found a pattern across multiple setup/register screens where inputs are missing `id` and labels are missing `htmlFor`, and some icon-only buttons are missing `aria-label`.
**Action:** Always associate labels with inputs using `htmlFor` and `id`, and add `aria-label` to icon buttons across all similar screens (impostor, ito, whoami, lobby).
