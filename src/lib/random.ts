/**
 * Selects a random item from a list of choices.
 * Uses Crypto.getRandomValues for better randomness than Math.random() if available,
 * though Math.random is generally sufficient for non-crypto use cases.
 * Here we stick to Math.random() for simplicity but ensure it's wrapped for mockability.
 */
export function getRandomIndex(length: number): number {
    if (length <= 0) return -1;
    return Math.floor(Math.random() * length);
}

export function getRandomItem<T>(items: T[]): T | null {
    if (items.length === 0) return null;
    const index = getRandomIndex(items.length);
    return items[index] ?? null;
}

/**
 * Validates fairness by running a simulation.
 * Returns the distribution logic.
 */
export function simulateDistribution(itemCount: number, iterations: number = 10000): Record<number, number> {
    const counts: Record<number, number> = {};
    for (let i = 0; i < itemCount; i++) counts[i] = 0;

    for (let i = 0; i < iterations; i++) {
        const index = getRandomIndex(itemCount);
        if (index !== -1) {
            counts[index] = (counts[index] ?? 0) + 1;
        }
    }
    return counts;
}
