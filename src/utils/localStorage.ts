
import { AppState, Preset } from '../types';

const STORAGE_KEY = 'roulette-wheel-app-state';

export const saveToLocalStorage = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

export const loadFromLocalStorage = (): AppState | null => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;
    return JSON.parse(storedData) as AppState;
  } catch (error) {
    console.error('Error loading from local storage:', error);
    return null;
  }
};

export const getDefaultPresets = (): Preset[] => {
  const rotmgCharacters = [
    'Archer', 'Assassin', 'Bard', 'Huntress', 'Kensei', 'Knight', 'Mystic',
    'Necromancer', 'Ninja', 'Paladin', 'Priest', 'Rogue', 'Samurai',
    'Sorcerer', 'Summoner', 'Trickster', 'Warrior', 'Wizard'
  ];
  
  return [
    {
      id: 'rotmg-characters',
      name: 'Rotmg Character Selection',
      items: rotmgCharacters.map((name, index) => ({
        id: `rotmg-${index}`,
        name,
      })),
    },
  ];
};

export const getInitialState = (): AppState => {
  const savedState = loadFromLocalStorage();
  
  if (savedState) {
    return savedState;
  }

  return {
    items: [],
    presets: getDefaultPresets(),
    currentPresetId: null,
    wheelSettings: {
      spinDuration: 5,
      removeOnPick: false,
      multipleRolls: 1,
    },
    selectedItems: [],
  };
};
