/**
 * Generates a cryptographically secure random integer between min and max (inclusive).
 * Uses window.crypto.getRandomValues for randomness to prevent prediction attacks.
 *
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns A secure random integer.
 */
export function getSecureRandomInt(min: number, max: number): number {
  if (min > max) {
    throw new Error('Min must be less than or equal to Max');
  }

  const range = max - min + 1;
  // Calculate the largest multiple of range that fits in uint32 to avoid modulo bias
  const maxSafeValue = Math.floor(4294967296 / range) * range;

  let randomValue: number;
  do {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= maxSafeValue); // Rejection sampling

  return min + (randomValue % range);
}
