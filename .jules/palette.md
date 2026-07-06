## 2024-05-15 - ARIA Labels on Icon-Only Buttons
**Learning:** React/Vite codebases using icon libraries like `lucide-react` often contain icon-only `<button>` tags without any accessible name (no text nodes inside). This makes them unreadable by screen readers.
**Action:** When working on accessibility, systematically search for `<button>` tags that contain only an icon component (e.g., `<ChevronLeft />`, `<Plus />`, `<Trash2 />`, `<X />`) and ensure they have an appropriate `aria-label` attribute in the correct language.
