export type Preset = {
    id: string;
    name: string;
    items: string[];
    originalItems?: string[]; // Used for restoring the list
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
    },
    {
        id: "dinner",
        name: "What's for Dinner?",
        items: ["Pizza", "Sushi", "Burgers", "Salad", "Tacos", "Pasta", "Steak", "Curry"],
        originalItems: ["Pizza", "Sushi", "Burgers", "Salad", "Tacos", "Pasta", "Steak", "Curry"],
    },
    {
        id: "yes-no",
        name: "Yes or No",
        items: ["Yes", "No"],
        originalItems: ["Yes", "No"],
    },
    {
        id: "dice",
        name: "Roll a Die",
        items: ["1", "2", "3", "4", "5", "6"],
        originalItems: ["1", "2", "3", "4", "5", "6"],
    }
];
