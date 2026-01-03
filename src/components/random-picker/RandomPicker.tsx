import { useState, useCallback } from "react";
import { Wheel } from "./Wheel";
import { Controls } from "./Controls";
import { ListManager } from "./ListManager";
import { usePickerState } from "@/hooks/usePickerState";
import { getRandomIndex } from "@/lib/random";

export function RandomPicker() {
    const {
        state,
        activeList,
        addList,
        deleteList,
        setActiveList,
        toggleRemoveAfterPick,
        setAnimationDuration,
        removeItemFromList,
        resetListItems
    } = usePickerState();

    const [spinning, setSpinning] = useState(false);
    const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
    const [lastWinner, setLastWinner] = useState<string | null>(null);

    const handleSpin = useCallback(() => {
        if (activeList.items.length === 0) return;

        setSpinning(true);
        setLastWinner(null);
        const index = getRandomIndex(activeList.items.length);
        setWinnerIndex(index);
        // The Wheel component handles the timing
    }, [activeList.items]);

    const handleSpinComplete = useCallback(() => {
        setSpinning(false);
        if (winnerIndex !== null && activeList) {
            const winner = activeList.items[winnerIndex];
            if (winner) {
                setLastWinner(winner);

                // Handle removal if needed
                if (state.removeAfterPick) {
                    removeItemFromList(activeList.id, winner);
                }
            }
        }
    }, [winnerIndex, activeList, state.removeAfterPick, removeItemFromList]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-start">
            {/* Left Column: Wheel & Results */}
            <div className="lg:col-span-8 flex flex-col items-center gap-8">
                <div className="relative w-full flex justify-center py-8">
                    <Wheel
                        items={activeList.items}
                        spinning={spinning}
                        winnerIndex={winnerIndex}
                        duration={state.animationDuration}
                        onSpinComplete={handleSpinComplete}
                        onSpin={handleSpin}
                    />

                    {/* Winner Overlay */}
                    {!spinning && lastWinner && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-500 rounded-[3rem]">
                            <div className="bg-card p-8 rounded-2xl shadow-2xl text-center border-2 border-primary/50 ring-4 ring-primary/20 transform animate-in zoom-in-50 duration-300 max-w-sm mx-4">
                                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">We have a winner!</div>
                                <div className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-purple-400 mb-8 drop-shadow-sm leading-tight py-2">
                                    {lastWinner}
                                </div>
                                <button
                                    onClick={() => setLastWinner(null)}
                                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 active:scale-95"
                                >
                                    Awesome!
                                </button>
                            </div>
                        </div>
                    )}
                </div>


            </div>

            {/* Right Column: List Management & Controls */}
            <div className="lg:col-span-4 w-full flex flex-col gap-4">
                <ListManager
                    lists={state.lists}
                    activeListId={state.activeListId}
                    onSelectList={setActiveList}
                    onAddList={addList}
                    onDeleteList={deleteList}
                    onRemoveItem={removeItemFromList}
                />

                <Controls
                    onSpin={handleSpin}
                    onReset={() => resetListItems(activeList.id)}
                    spinning={spinning}
                    removeAfterPick={state.removeAfterPick}
                    onToggleRemove={toggleRemoveAfterPick}
                    duration={state.animationDuration}
                    onDurationChange={setAnimationDuration}
                    itemsRemoved={activeList.originalItems ? activeList.originalItems.length - activeList.items.length : 0}
                />
            </div>
        </div>
    );
}
