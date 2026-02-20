/**
 * Generates a cryptographically secure random integer between min and max (inclusive).
 * Uses crypto.getRandomValues to ensure better randomness than Math.random().
 * Compatible with both browser (window.crypto) and Node.js (globalThis.crypto).
 * 
 * @param min The minimum value (inclusive).
 * @param max The maximum value (inclusive).
 * @returns A random integer between min and max.
 */
export function getSecureRandomInt(min: number, max: number): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }

  const range = max - min + 1;
  const array = new Uint32Array(1);
  
  // To avoid modulo bias, we use a simple rejection sampling method.
  // We only accept values that fall within the largest multiple of 'range' 
  // that fits within the Uint32 space.
  const maxValid = Math.floor(0xFFFFFFFF / range) * range;
  
  // Get the crypto object securely
  const crypto = typeof window !== 'undefined' && window.crypto
    ? window.crypto
    : (typeof globalThis !== 'undefined' ? (globalThis as { crypto?: Crypto }).crypto : undefined);

  if (!crypto || typeof crypto.getRandomValues !== 'function') {
    throw new Error('Secure random number generator not available');
  }

  let randomValue: number;
  do {
    crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= maxValid);
  
  return min + (randomValue % range);
}
