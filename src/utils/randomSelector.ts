export interface RandomSelector {
  selectRandomItem: <T>(items: T[]) => { item: T; targetAngle: number };
}

export const createRandomSelector = (random = Math.random): RandomSelector => {
  return {
    selectRandomItem: <T>(items: T[]) => {
      if (items.length === 0) {
        throw new Error('Cannot select from an empty array');
      }
      
      // Generate a random angle between 0 and 360 degrees
      const randomAngle = random() * 360;
      
      // Calculate which segment this angle falls into
      const segmentAngle = 360 / items.length;
      const targetIndex = Math.floor((randomAngle / 360) * items.length) % items.length;
      
      // Calculate the angle to the middle of the selected segment
      const itemAngle = (targetIndex * segmentAngle) + (segmentAngle / 2);
      
      return {
        item: items[targetIndex],
        targetAngle: 360 - itemAngle // Convert to clockwise rotation from top
      };
    }
  };
};

// Default export with Math.random
const defaultRandomSelector = createRandomSelector();
export default defaultRandomSelector;
