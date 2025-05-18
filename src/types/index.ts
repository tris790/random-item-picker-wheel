
export interface Item {
  id: string;
  name: string;
}

export interface Preset {
  id: string;
  name: string;
  items: Item[];
}

export interface WheelSettings {
  spinDuration: number;
  removeOnPick: boolean;
  multipleRolls: number;
}

export interface AppState {
  items: Item[];
  presets: Preset[];
  currentPresetId: string | null;
  wheelSettings: WheelSettings;
  selectedItems: Item[];
}
