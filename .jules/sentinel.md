## 2024-05-24 - Unbounded Text Input Causes Potential DoS Array Growth
**Vulnerability:** A text input used to build an array `localPlayers` had no boundaries, which allows an attacker/user to infinitely add players and memory exhaustion leading to DoS.
**Learning:** Client-side React arrays can crash the browser if a user creates an infinite loop or spam-clicks an unbounded array input.
**Prevention:** Always enforce a maximum length on inputs (`maxLength`) and cap the maximum array elements before pushing to the array.