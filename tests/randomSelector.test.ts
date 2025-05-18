import { createRandomSelector } from '../src/utils/randomSelector';

describe('RandomSelector', () => {
  describe('selectRandomItem', () => {
    it('should select an item with a valid target angle', () => {
      // Mock random to always return 0.5 (which would be 180 degrees)
      const mockRandom = jest.fn().mockReturnValue(0.5);
      const selector = createRandomSelector(mockRandom);
      const items = ['a', 'b', 'c', 'd'];
      
      const result = selector.selectRandomItem(items);
      
      // With 4 items, each segment is 90 degrees
      // 180 degrees should be in the middle of the 3rd segment (index 2)
      expect(result.item).toBe('c');
      // The target angle should be 360 - (2 * 90 + 45) = 135
      expect(result.targetAngle).toBe(135);
    });

    it('should handle edge case at 0 degrees', () => {
      // Mock random to return just above 0 (0.001)
      const mockRandom = jest.fn().mockReturnValue(0.0001);
      const selector = createRandomSelector(mockRandom);
      const items = ['a', 'b', 'c'];
      
      const result = selector.selectRandomItem(items);
      
      // Should select first item (index 0)
      expect(result.item).toBe('a');
    });

    it('should handle edge case just below 360 degrees', () => {
      // Mock random to return just below 1.0
      const mockRandom = jest.fn().mockReturnValue(0.9999);
      const selector = createRandomSelector(mockRandom);
      const items = ['a', 'b', 'c'];
      
      const result = selector.selectRandomItem(items);
      
      // Should select last item (index 2)
      expect(result.item).toBe('c');
    });

    it('should throw an error for empty array', () => {
      const selector = createRandomSelector();
      expect(() => selector.selectRandomItem([])).toThrow('Cannot select from an empty array');
    });
  });

  describe('distribution', () => {
    it('should have even distribution with enough samples', () => {
      const items = ['a', 'b', 'c', 'd'];
      const results = { a: 0, b: 0, c: 0, d: 0 };
      const trials = 10000;
      const selector = createRandomSelector();
      
      for (let i = 0; i < trials; i++) {
        const { item } = selector.selectRandomItem(items);
        results[item as keyof typeof results]++;
      }
      
      // Check that each item was selected roughly 25% of the time
      // With 10,000 trials, we expect about 2500 per item
      const expected = trials / items.length;
      const margin = expected * 0.1; // 10% margin of error
      
      for (const [item, count] of Object.entries(results)) {
        expect(count).toBeGreaterThanOrEqual(expected - margin);
        expect(count).toBeLessThanOrEqual(expected + margin);
      }
    });
  });
});
