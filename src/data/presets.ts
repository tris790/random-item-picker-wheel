export const PRESETS_VERSION = 1;

export type Preset = {
    id: string;
    name: string;
    items: string[];
    originalItems?: string[]; // Used for restoring the list
    isDefault?: boolean; // Whether this is a built-in preset
};

export const DEFAULT_PRESETS: Preset[] = [
    {
        id: "rotmg-classes",
        name: "RotMG Classes",
        items: [
            "Rogue", "Archer", "Assassin", "Huntress", "Trickster",
            "Bard", "Summoner", "Druid", "Warrior", "Knight", "Paladin",
            "Samurai", "Kensei", "Wizard", "Priest", "Necromancer",
            "Mystic", "Sorcerer", "Ninja"
        ],
        originalItems: [
            "Rogue", "Archer", "Assassin", "Huntress", "Trickster",
            "Bard", "Summoner", "Druid", "Warrior", "Knight", "Paladin",
            "Samurai", "Kensei", "Wizard", "Priest", "Necromancer",
            "Mystic", "Sorcerer", "Ninja"
        ],
        isDefault: true,
    },
    {
        id: "dinner",
        name: "What's for Dinner?",
        items: ["Pizza", "Sushi", "Burgers", "Salad", "Tacos", "Pasta", "Steak", "Curry"],
        originalItems: ["Pizza", "Sushi", "Burgers", "Salad", "Tacos", "Pasta", "Steak", "Curry"],
        isDefault: true,
    },
    {
        id: "yes-no",
        name: "Yes or No",
        items: ["Yes", "No"],
        originalItems: ["Yes", "No"],
        isDefault: true,
    },
    {
        id: "dice",
        name: "Roll a Die",
        items: ["1", "2", "3", "4", "5", "6"],
        originalItems: ["1", "2", "3", "4", "5", "6"],
        isDefault: true,
    }
];
