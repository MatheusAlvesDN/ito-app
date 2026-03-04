## 2025-02-14 - Unrestrained Client-Side State DoS
**Vulnerability:** Found an unrestrained text input for adding players in RegisterScreen, allowing potential memory exhaustion or application crash if extremely large strings were continuously pasted.
**Learning:** Client-side React state is vulnerable to Denial of Service if input sizes are not artificially bounded, especially when the state is preserved across screen transitions or synchronized heavily.
**Prevention:** Always enforce `maxLength` on text inputs and perform a length validation check within the component's event handler before updating critical or shared React state arrays.
