import React, { useRef, useState, useEffect } from 'react';
import { Item } from '../types';
import { ArrowDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createRandomSelector } from '../utils/randomSelector';

interface RouletteWheelProps {
  items: Item[];
  onItemSelected: (item: Item) => void;
  spinDuration: number;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  spinsRemaining?: number; // Made optional since it's not used in this component
  onSpinStart: () => void;
}

const WHEEL_COLORS = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#F59E0B', // yellow
  '#10B981', // green
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#F97316', // orange
];

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  items,
  onItemSelected,
  spinDuration,
  isSpinning,
  setIsSpinning,
  spinsRemaining,
  onSpinStart
}) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const animationRef = useRef<number>();
  
  // Function to get a color that's different from adjacent slices
  const getWheelColor = (index: number, total: number): string => {
    if (total <= 1) return WHEEL_COLORS[0];
    return WHEEL_COLORS[index % WHEEL_COLORS.length];
  };
  
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--spin-duration', `${spinDuration}s`);
  }, [spinDuration]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const spin = () => {
    if (items.length === 0) {
      toast({
        title: "Can't spin the wheel",
        description: "Please add some items to the list first.",
        variant: "destructive"
      });
      return;
    }

    if (isSpinning || isAnimating) return;

    // Set initial states
    setIsSpinning(true);
    setIsAnimating(true);
    setSelectedItem(null);
    onSpinStart();
    
    try {
      // Use the random selector to choose an item and get its target angle
      const { item: chosen, targetAngle: targetRotation } = createRandomSelector().selectRandomItem(items);
      
      // Add randomness to the number of full rotations (between 5 and 10)
      const minRotations = 5;
      const maxRotations = 100;
      const fullRotations = minRotations + Math.floor(Math.random() * (maxRotations - minRotations + 1));
      
      // Calculate the current rotation normalized to 0-360
      const currentNormalizedRotation = ((rotationAngle % 360) + 360) % 360;
      
      // Calculate the total rotation needed
      // We want to ensure we always spin at least 'fullRotations' times plus the angle to the target
      // The targetRotation is the angle from the top (0 degrees) to the target segment
      let rotation = (fullRotations * 360) + targetRotation;
      
      // Add the remaining rotation to complete the current full circle
      // This ensures we always spin in the same direction (clockwise)
      rotation += (360 - currentNormalizedRotation);
      
      // Add some randomness to the spin timing (80-120% of original duration)
      const durationVariation = 0.8 + Math.random() * 0.4;
      const actualDuration = spinDuration * durationVariation * 1000; // Convert to ms
      
      // Animation start time
      const startTime = performance.now();
      const startRotation = rotationAngle;
      
      // Animation loop
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / actualDuration, 1);
        
        // Ease-out function for smooth deceleration
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        
        // Calculate current rotation
        const currentRotation = startRotation + (rotation * easeOutProgress);
        setRotationAngle(currentRotation);
        
        // Log the current progress for debugging
        if (progress > 0.99 && progress < 1) {
          console.log('Final rotation:', currentRotation % 360, 'Target:', targetRotation);
        }
        
        // If animation is still in progress, continue
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          setRotationAngle(prev => prev % 360); // Normalize to 0-359
          setIsSpinning(false);
          setIsAnimating(false);
          onItemSelected(chosen);
          setSelectedItem(chosen);
        }
      };
      
      // Start the animation
      animationRef.current = requestAnimationFrame(animate);
      
    } catch (error) {
      console.error('Error during spin:', error);
      setIsSpinning(false);
      setIsAnimating(false);
      toast({
        title: 'Error',
        description: 'An error occurred while spinning the wheel.',
        variant: 'destructive',
      });
    }
  };

  // Calculate segment angle based on number of items
  const segmentAngle = 360 / (items.length || 1);
  const wheelSize = 588; // Increased by 40% from 420px to 588px
  const center = wheelSize / 2;

  return (
    <div className="wheel-container relative flex flex-col items-center justify-center" style={{ perspective: '1000px' }}>
      {/* The wheel wrapper - maintains rotation state */}
      <div className="relative" style={{
        transformStyle: 'preserve-3d',
        transform: `rotate(${rotationAngle}deg)`,
        width: `${wheelSize}px`,
        height: `${wheelSize}px`,
        willChange: 'transform',
        transition: 'none', // We handle the transition in the animation loop
      }}>
        {/* The wheel */}
        <div 
          ref={wheelRef}
          className="relative rounded-full border-4 border-gray-800 shadow-xl overflow-hidden"
          style={{
            width: '100%',
            height: '100%',
            transform: 'rotateX(0deg)',
            transformOrigin: 'center center',
            cursor: isSpinning ? 'default' : 'pointer',
          }}
          onClick={() => !isSpinning && spin()}
        >
          {items.length > 0 ? (
            <svg width="100%" height="100%" viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
              {items.map((item, index) => {
                const startAngle = (index * segmentAngle) * (Math.PI / 180);
                const endAngle = ((index + 1) * segmentAngle) * (Math.PI / 180);
                const largeArcFlag = segmentAngle <= 180 ? 0 : 1;
                
                // Calculate start and end points
                const x1 = center + center * Math.cos(startAngle);
                const y1 = center + center * Math.sin(startAngle);
                const x2 = center + center * Math.cos(endAngle);
                const y2 = center + center * Math.sin(endAngle);
                
                // Create the path for the slice
                const pathData = [
                  `M ${center} ${center}`,
                  `L ${x1} ${y1}`,
                  `A ${center} ${center} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                const bgColor = getWheelColor(index, items.length);
                
                // Calculate text position (middle of the arc)
                const textAngle = (startAngle + endAngle) / 2;
                const textRadius = center * 0.5; // Position text at 50% of the radius
                const textX = center + textRadius * Math.cos(textAngle);
                const textY = center + textRadius * Math.sin(textAngle);
                const textRotation = (textAngle * 180 / Math.PI);
                const isUpsideDown = textAngle > Math.PI/2 && textAngle < 3*Math.PI/2;
                
                return (
                  <g key={item.id}>
                    <path 
                      d={pathData} 
                      fill={bgColor}
                      stroke="#1f2937"
                      strokeWidth="1"
                    />
                    <g transform={`translate(${textX}, ${textY}) rotate(${textRotation + (isUpsideDown ? 180 : 0)})`}>
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white font-bold text-xl"
                        style={{
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                          pointerEvents: 'none',
                          maxWidth: `${center * 0.8}px`,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                          transform: isUpsideDown ? 'rotate(180deg)' : 'none'
                        }}
                      >
                        {item.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-600">
              Add items to spin
            </div>
          )}
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-gray-800 rounded-full z-10 shadow-inner" />
        </div>
      </div>
      
      {/* Pointer triangle at top - positioned outside the rotating container */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-0 h-0 border-l-12 border-r-12 border-b-16 border-l-transparent border-r-transparent border-b-primary drop-shadow-lg" />
      </div>
      
      {/* Display selected item */}
      {selectedItem && !isSpinning && (
        <div className="mt-8 text-center animate-bounce-in">
          <h2 className="text-2xl font-bold text-primary">Selected:</h2>
          <p className="text-3xl font-extrabold mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {selectedItem.name}
          </p>
        </div>
      )}
      
      {!isSpinning && items.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Click the wheel to spin!
        </div>
      )}
    </div>
  );
};

export default RouletteWheel;
