import React from "react";
import { cn } from "@/lib/utils";

interface SimpleTooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
}

export function SimpleTooltip({ content, children, side = "top", className }: SimpleTooltipProps) {
    return (
        <div className="relative group inline-flex items-center justify-center">
            {children}
            <div
                className={cn(
                    "absolute z-50 px-3 py-2 text-xs font-medium text-white bg-zinc-900 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/10 pointer-events-none w-max max-w-[200px] text-center",
                    // Positioning
                    side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
                    side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
                    side === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
                    side === "right" && "left-full top-1/2 -translate-y-1/2 ml-2",
                    // Animation
                    side === "top" && "group-hover:-translate-y-1",
                    side === "bottom" && "group-hover:translate-y-1",
                    side === "left" && "group-hover:-translate-x-1",
                    side === "right" && "group-hover:translate-x-1",
                    className
                )}
            >
                {content}
                {/* Simple Arrow */}
                <div
                    className={cn(
                        "absolute w-2 h-2 bg-zinc-900 rotate-45 border-white/10",
                        side === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b",
                        side === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2 border-l border-t",
                        side === "left" && "right-[-4px] top-1/2 -translate-y-1/2 border-t border-r",
                        side === "right" && "left-[-4px] top-1/2 -translate-y-1/2 border-b border-l"
                    )}
                />
            </div>
        </div>
    );
}
