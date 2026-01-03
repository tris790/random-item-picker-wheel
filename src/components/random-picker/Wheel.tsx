import { useRef, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface WheelProps {
    items: string[];
    spinning: boolean;
    winnerIndex: number | null;
    duration: number; // Seconds
    onSpinComplete: () => void;
    className?: string;
    onSpin?: () => void;
}

const COLORS = [
    "#ef4444", // red-500
    "#f97316", // orange-500
    "#f59e0b", // amber-500
    "#84cc16", // lime-500
    "#10b981", // emerald-500
    "#06b6d4", // cyan-500
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
    "#d946ef", // fuchsia-500
    "#f43f5e", // rose-500
];

export function Wheel({ items, spinning, winnerIndex, duration, onSpinComplete, className, onSpin }: WheelProps) {
    const wheelRef = useRef<SVGGElement>(null);
    // We track the total rotation to ensure smooth transitions between spins
    const [currentRotation, setCurrentRotation] = useState(0);

    // Generate segment data
    const segments = useMemo(() => {
        const total = items.length;
        const anglePerSegment = 360 / total;

        return items.map((item, i) => {
            const startAngle = i * anglePerSegment;
            const endAngle = (i + 1) * anglePerSegment;
            const color = COLORS[i % COLORS.length];

            // Calculate path d for the wedge
            // Convert to radians for Math.cos/sin
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            // Radius of the wheel content
            const r = 50;

            // Points (centered at 50,50)
            const x1 = 50 + r * Math.cos(startRad);
            const y1 = 50 + r * Math.sin(startRad);
            const x2 = 50 + r * Math.cos(endRad);
            const y2 = 50 + r * Math.sin(endRad);

            // Path command
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            const d = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
                `Z`
            ].join(" ");

            // Text calculations: Center angle of the segment
            const centerAngle = startAngle + anglePerSegment / 2;

            return {
                d,
                color,
                item,
                centerAngle
            };
        });
    }, [items]);

    useEffect(() => {
        if (spinning && winnerIndex !== null) {
            const spins = 5; // Minimum full rotations

            // Calculate the angle where the winner starts
            // SVG 0deg is at 3 o'clock. 
            // We want the winner center to land at 0deg (3 o'clock).

            const winnerCenterAngle = segments[winnerIndex].centerAngle;

            // Target equation:
            // (FinalRotation + winnerCenterAngle) % 360 = 0
            // FinalRotation = 0 - winnerCenterAngle + (N * 360)

            const targetBase = -winnerCenterAngle;

            // Find the closest future rotation that matches targetBase
            const currentMod = currentRotation % 360;

            // We want to go from currentMod to targetBase (forward)
            // diff = targetBase - currentMod
            // If diff > 0, we rotate forward by diff
            // If diff < 0, we rotate forward by (360 + diff)
            // BUT, targetBase might be negative (e.g. -120). currentMod is usually +/-.
            // Let's normalize everything to 0-360 for calculation

            const normTarget = (targetBase % 360 + 360) % 360;
            const normCurrent = (currentMod + 360) % 360;

            let dist = normTarget - normCurrent;
            if (dist <= 0) dist += 360;

            // Add minimum spins
            const totalSpin = dist + (spins * 360);

            const nextRotation = currentRotation + totalSpin;
            setCurrentRotation(nextRotation);

            const timeout = setTimeout(() => {
                onSpinComplete();
            }, duration * 1000);

            return () => clearTimeout(timeout);
        }
    }, [spinning, winnerIndex, items, duration, onSpinComplete, segments]);


    if (items.length === 0) return null;

    return (
        <div
            className={cn(
                "relative w-full flex justify-center items-center p-12 transition-transform",
                !spinning && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                className
            )}
            onClick={() => !spinning && onSpin?.()}
        >
            {/* Main Wheel Container */}
            <div className="relative w-full aspect-square" style={{ maxWidth: '800px' }}>

                {/* Outer Rim Shadow/Bezel */}
                <div className="absolute -inset-4 rounded-full bg-black/80 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] skew-y-0 backdrop-blur-sm" />
                <div className="absolute -inset-2 rounded-full border-4 border-white/10 bg-zinc-900/90 ring-1 ring-white/5" />

                {/* The SVG Wheel */}
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full relative z-10 filter drop-shadow-xl"
                    style={{ overflow: 'visible' }}
                >
                    <g
                        ref={wheelRef}
                        style={{
                            transform: `rotate(${currentRotation}deg)`,
                            transformOrigin: "50px 50px",
                            transition: spinning ? `transform ${duration}s cubic-bezier(0.2, 0, 0.2, 1)` : "none"
                        }}
                    >
                        {segments.map((seg, i) => (
                            <g key={i}>
                                <path d={seg.d} fill={seg.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                                <g transform={`rotate(${seg.centerAngle}, 50, 50)`}>
                                    <text
                                        x="88"
                                        y="50.5"
                                        fill="white"
                                        fontSize="4"
                                        fontWeight="700"
                                        textAnchor="end"
                                        dominantBaseline="middle"
                                        style={{
                                            userSelect: "none",
                                            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
                                        }}
                                    >
                                        {seg.item.length > 20 ? seg.item.substring(0, 18) + '...' : seg.item}
                                    </text>
                                </g>
                            </g>
                        ))}
                    </g>

                    {/* No Inner Hub */}

                </svg>

                {/* Pointer */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-20 h-16 bg-gradient-to-l from-red-600 to-red-700 shadow-lg"
                        style={{
                            clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)',
                            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// Keeping the helper for reference if needed, though unused now due to fixed palette
function getRandomColor(index: number) {
    const colors = [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef',
    ];
    return colors[index % colors.length];
}
