import React, { useRef, useState, useEffect } from 'react';
import { Item } from '../types';
import { ArrowDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RouletteWheelProps {
  items: Item[];
  onItemSelected: (item: Item) => void;
  spinDuration: number;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const WHEEL_COLORS = [
  'bg-wheel-red',
  'bg-wheel-blue',
  'bg-wheel-yellow',
  'bg-wheel-green',
  'bg-wheel-purple',
  'bg-wheel-pink',
  'bg-wheel-orange',
];

const RouletteWheel: React.FC<RouletteWheelProps> = ({ 
  items, 
  onItemSelected, 
  spinDuration,
  isSpinning,
  setIsSpinning
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--spin-duration', `${spinDuration}s`);
  }, [spinDuration]);

  const spin = () => {
    if (items.length === 0) {
      toast({
        title: "Can't spin the wheel",
        description: "Please add some items to the list first.",
        variant: "destructive"
      });
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedItem(null);
    
    // Choose a random item
    const randomIndex = Math.floor(Math.random() * items.length);
    const chosen = items[randomIndex];
    
    // Calculate the rotation angle
    // We want to make multiple rotations plus the position of the chosen item
    const segmentAngle = 360 / items.length;
    const itemPosition = segmentAngle * randomIndex;
    
    // Make sure we rotate at least 2 complete turns plus the item position
    // We reverse the rotation to match the item position with the pointer at top
    const minRotation = 2 * 360;
    const rotation = minRotation + (360 - itemPosition);
    
    // Set rotation CSS variables
    const root = document.documentElement;
    root.style.setProperty('--spin-degrees', `${rotation}deg`);

    // Update rotation state to keep track of wheel position
    setRotationAngle(rotation);

    // Wait for animation to finish
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedItem(chosen);
      onItemSelected(chosen);
    }, spinDuration * 1000);
  };

  // Calculate segment angle based on number of items
  const segmentAngle = 360 / (items.length || 1);

  return (
    <div className="wheel-container relative flex flex-col items-center justify-center">
      {/* Pointer triangle at top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <ArrowDown className="text-primary h-10 w-10 drop-shadow-lg" />
      </div>
      
      {/* The wheel itself */}
      <div 
        ref={wheelRef}
        className={`relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-8 border-gray-800 shadow-xl overflow-hidden
                   ${isSpinning ? 'animate-spin-wheel' : ''}`}
        style={{transformOrigin: 'center center', cursor: isSpinning ? 'default' : 'pointer'}}
        onClick={() => !isSpinning && spin()}
      >
        {items.length > 0 ? (
          items.map((item, index) => {
            const rotation = segmentAngle * index;
            const bgColorIndex = index % WHEEL_COLORS.length;
            
            return (
              <div 
                key={item.id} 
                className={`absolute w-full h-full ${WHEEL_COLORS[bgColorIndex]} origin-center`}
                style={{ 
                  transform: `rotate(${rotation}deg) skew(${90 - segmentAngle}deg)`,
                  transformOrigin: '50% 50%',
                }}
              >
                <div 
                  className="absolute left-1/2 w-full text-center font-bold text-white drop-shadow-md truncate px-4"
                  style={{ 
                    transform: `
                      translateX(-50%)
                      rotate(${segmentAngle / 2}deg)
                      skew(${-(90 - segmentAngle)}deg)
                      translateY(20px)
                    `,
                    maxWidth: '70%',
                  }}
                >
                  {item.name}
                </div>
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-600">
            Add items to spin
          </div>
        )}
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full z-10 shadow-inner" />
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
