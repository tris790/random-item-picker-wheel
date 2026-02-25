import { useState, useEffect } from "react";
import { DEFAULT_PRESETS, PRESETS_VERSION, type Preset } from "../data/presets";

const STORAGE_KEY = "random-picker-state-v2";

export type PickerState = {
    lists: Preset[];
    activeListId: string;
    removeAfterPick: boolean;
    animationDuration: number; // in seconds
    version: number;
};

const DEFAULT_STATE: PickerState = {
    lists: DEFAULT_PRESETS,
    activeListId: DEFAULT_PRESETS[0]?.id || "",
    removeAfterPick: false,
    animationDuration: 3,
    version: PRESETS_VERSION,
};

export function usePickerState() {
    const [state, setState] = useState<PickerState>(() => {
        // Load from local storage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Simple migration/validation: ensure activeListId exists
                    if (!parsed.lists || parsed.lists.length === 0) return DEFAULT_STATE;

                    // Check version: if stored version is older, reset default presets
                    const storedVersion = parsed.version || 0;
                    if (storedVersion < PRESETS_VERSION) {
                        console.log(`Preset version outdated (${storedVersion} < ${PRESETS_VERSION}), resetting default presets...`);
                        // Keep user-created lists (those without isDefault flag)
                        const userLists = parsed.lists.filter((l: Preset) => !l.isDefault);
                        return {
                            ...DEFAULT_STATE,
                            lists: [...DEFAULT_PRESETS, ...userLists],
                            activeListId: DEFAULT_PRESETS[0]?.id || "",
                        };
                    }

                    return parsed;
                } catch (e) {
                    console.error("Failed to parse saved state", e);
                }
            }
        }
        return DEFAULT_STATE;
    });

    // Persist changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const activeList = state.lists.find(l => l.id === state.activeListId) || state.lists[0] || { id: 'fallback', name: 'Fallback', items: [] };

    const addList = (name: string, items: string[]) => {
        const newList: Preset = {
            id: crypto.randomUUID(),
            name,
            items: [...items],
            originalItems: [...items],
            isDefault: false,
        };
        setState(prev => ({
            ...prev,
            lists: [...prev.lists, newList],
            activeListId: newList.id,
        }));
    };

    const deleteList = (id: string) => {
        if (state.lists.length <= 1) return; // Prevent deleting the last list
        const newLists = state.lists.filter(l => l.id !== id);
        setState(prev => ({
            ...prev,
            lists: newLists,
            activeListId: newLists[0]?.id || prev.activeListId,
        }));
    };

    const updateList = (id: string, updates: Partial<Preset>) => {
        setState(prev => ({
            ...prev,
            lists: prev.lists.map(l => (l.id === id ? { ...l, ...updates } : l)),
        }));
    };

    const setActiveList = (id: string) => {
        setState(prev => ({ ...prev, activeListId: id }));
    };

    const toggleRemoveAfterPick = () => {
        setState(prev => ({ ...prev, removeAfterPick: !prev.removeAfterPick }));
    };

    const setAnimationDuration = (duration: number) => {
        setState(prev => ({ ...prev, animationDuration: duration }));
    };

    const removeItemFromList = (listId: string, item: string) => {
        setState(prev => {
            const list = prev.lists.find(l => l.id === listId);
            if (!list) return prev;

            const newItems = list.items.filter(i => i !== item);
            return {
                ...prev,
                lists: prev.lists.map(l => l.id === listId ? { ...l, items: newItems } : l)
            }
        });
    };

    const resetListItems = (listId: string) => {
        setState(prev => {
            const list = prev.lists.find(l => l.id === listId);
            // Fallback to current items if originalItems is missing (shouldn't happen with new lists)
            const original = list?.originalItems || list?.items || [];

            if (!list) return prev;

            return {
                ...prev,
                lists: prev.lists.map(l => l.id === listId ? { ...l, items: [...original] } : l)
            };
        });
    };

    // Helper to ensure originalItems are synced when user edits the list definition itself (not just picking)
    // This might be needed if we add "Edit List" feature later.

    return {
        state,
        activeList,
        addList,
        deleteList,
        updateList,
        setActiveList,
        toggleRemoveAfterPick,
        setAnimationDuration,
        removeItemFromList,
        resetListItems
    };
}
