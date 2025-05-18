export interface RandomSelector {
  selectRandomItem: <T>(items: T[]) => { item: T; targetAngle: number };
}

export const createRandomSelector = (random = Math.random): RandomSelector => ({
  selectRandomItem: <T>(items: T[]) => {
    if (items.length === 0) {
      throw new Error('Cannot select from an empty array');
    }

    // Pick a random index directly
    const targetIndex = Math.floor(random() * items.length);

    // Each slice spans this many degrees
    const segmentAngle = 360 / items.length;

    // We want the wheel to land at the center of that slice:
    // (index + 0.5) * segmentAngle gives the mid-angle of the slice
    const midSliceAngle = (targetIndex + 0.5) * segmentAngle;

    // Convert to clockwise-from-top (0° at top, increasing clockwise)
    // and ensure it’s in [0, 360)
    const targetAngle = (360 - midSliceAngle + 360) % 360;

    return {
      item: items[targetIndex],
      targetAngle
    };
  }
});

// default export
export default createRandomSelector();
