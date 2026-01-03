import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, RotateCcw, Play } from "lucide-react";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";

interface ControlsProps {
    onSpin: () => void;
    onReset: () => void;
    spinning: boolean;
    removeAfterPick: boolean;
    onToggleRemove: () => void;
    duration: number;
    onDurationChange: (val: number) => void;
    itemsRemoved: number;
}

export function Controls({
    onSpin,
    onReset,
    spinning,
    removeAfterPick,
    onToggleRemove,
    duration,
    onDurationChange,
    itemsRemoved
}: ControlsProps) {
    return (
        <div className="flex flex-col gap-6 p-6 bg-card/80 backdrop-blur-md rounded-xl border border-white/10 shadow-xl">
            {/* Main Spin Action */}
            <div className="w-full">
                <Button
                    size="lg"
                    onClick={onSpin}
                    disabled={spinning}
                    className="w-full text-xl font-black tracking-wide bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-[0_0_20px_-5px_var(--primary)] hover:shadow-[0_0_25px_-5px_var(--primary)] transition-all h-16 uppercase border border-white/10"
                >
                    {spinning ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Play className="mr-2 h-6 w-6 fill-current" />}
                    {spinning ? "Spinning..." : "SPIN!"}
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {/* Remove Winner & Reset Section */}
                <div className="flex flex-col gap-3 p-4 rounded-lg bg-black/40 border border-white/10 shadow-inner">
                    <SimpleTooltip side="top" content="If checked, winners are removed from the wheel so they can't be picked again.">
                        <div className="flex items-center justify-between gap-2 w-full cursor-pointer">
                            <Label htmlFor="remove-mode" className="cursor-pointer font-bold text-slate-100 text-base">Remove winner</Label>
                            <div className="flex items-center justify-center p-1">
                                <input
                                    id="remove-mode"
                                    type="checkbox"
                                    checked={removeAfterPick}
                                    onChange={onToggleRemove}
                                    disabled={spinning}
                                    className="w-5 h-5 accent-primary rounded cursor-pointer bg-white/10 border-white/20 transition-transform active:scale-90"
                                />
                            </div>
                        </div>
                    </SimpleTooltip>

                    {itemsRemoved > 0 && (
                        <div className="pt-2 mt-1 border-t border-white/5 animate-in slide-in-from-top-1 fade-in duration-300">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onReset}
                                disabled={spinning}
                                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 group cursor-pointer"
                            >
                                <RotateCcw className="w-3 h-3 mr-2 group-hover:-rotate-180 transition-transform duration-500" />
                                Reset List ({itemsRemoved})
                            </Button>
                        </div>
                    )}
                </div>

                {/* Duration Control */}
                <div className="flex flex-col justify-center gap-4 p-4 rounded-lg bg-black/40 border border-white/10 shadow-inner">
                    <div className="flex justify-between items-center">
                        <Label className="font-bold text-slate-100 text-base">Duration</Label>
                        <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-slate-300">{duration}s</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={duration}
                        onChange={(e) => onDurationChange(parseFloat(e.target.value))}
                        disabled={spinning}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-primary hover:accent-primary/80 transition-all"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-1">
                        <span>Fast</span>
                        <span>Slow</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
