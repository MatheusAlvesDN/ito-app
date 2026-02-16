/**
 * Generates a cryptographically secure random integer between min and max (inclusive).
 * Uses Web Crypto API (window.crypto or globalThis.crypto) to ensure better randomness than Math.random().
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

  // Ensure range fits within Uint32 to avoid issues with getRandomValues
  if (range > 0xFFFFFFFF) {
     throw new Error('Range is too large for Uint32');
  }

  const array = new Uint32Array(1);
  
  // Determine which crypto object to use
  let cryptoObj: Crypto | undefined;

  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    cryptoObj = globalThis.crypto;
  } else if (typeof window !== 'undefined' && window.crypto) {
    cryptoObj = window.crypto;
  }

  if (!cryptoObj) {
    throw new Error('Crypto API not available in this environment');
  }

  // To avoid modulo bias, we use a simple rejection sampling method.
  // We only accept values that fall within the largest multiple of 'range' 
  // that fits within the Uint32 space.
  const maxValid = Math.floor(0xFFFFFFFF / range) * range;
  
  let randomValue: number;
  do {
    cryptoObj.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= maxValid);
  
  return min + (randomValue % range);
}
