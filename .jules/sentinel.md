## 2026-03-15 - Missing maxLength Validation (DoS Risk)
**Vulnerability:** Unbounded array updates via user inputs (adding unlimited names). This allows a user to spam arrays leading to memory exhaustion or denial of service on the client.
**Learning:** React state arrays driven by user inputs must have explicit length limits directly associated with them to prevent unbounded DOM / React updates that freeze the browser.
**Prevention:** Always use `maxLength` on input fields AND enforce state array maximum sizes.
