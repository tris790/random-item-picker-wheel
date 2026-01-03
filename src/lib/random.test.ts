import { describe, expect, it } from "bun:test";
import { getRandomIndex, getRandomItem, simulateDistribution } from "./random";

describe("Random Logic", () => {
    it("should return -1 for empty list", () => {
        expect(getRandomIndex(0)).toBe(-1);
    });

    it("should return a valid index within range", () => {
        for (let i = 0; i < 100; i++) {
            const idx = getRandomIndex(5);
            expect(idx).toBeGreaterThanOrEqual(0);
            expect(idx).toBeLessThan(5);
        }
    });

    it("should pick an item from the list", () => {
        const items = ["A", "B", "C"];
        const item = getRandomItem(items);
        expect(items).toContain(item!);
    });

    it("should be reasonably fair", () => {
        const itemCount = 5;
        const iterations = 100000;
        const expectedCount = iterations / itemCount;
        const distribution = simulateDistribution(itemCount, iterations);

        // Allow for 5% variance, which is generous for 100k runs but safe for CI flakes
        const tolerance = 0.05;

        for (let i = 0; i < itemCount; i++) {
            const count = distribution[i] ?? 0;
            const diff = Math.abs(count - expectedCount);
            const diffRatio = diff / expectedCount;
            expect(diffRatio).toBeLessThan(tolerance);
        }
    });
});
