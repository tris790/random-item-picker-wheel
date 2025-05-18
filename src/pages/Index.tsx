
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RouletteWheel from '../components/RouletteWheel';
import ItemList from '../components/ItemList';
import PresetManager from '../components/PresetManager';
import WheelSettings from '../components/WheelSettings';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AppState, Item, Preset, WheelSettings as WheelSettingsType } from '../types';
import { getInitialState, saveToLocalStorage } from '../utils/localStorage';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [state, setState] = useState<AppState>(getInitialState);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinQueue = useRef<number>(0);
  const spinInProgress = useRef(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  const startNewSpinSequence = useCallback(() => {
    if (spinInProgress.current) return;
    
    spinInProgress.current = true;
    spinQueue.current = state.wheelSettings.multipleRolls;
    console.log('Starting new spin sequence. Total spins:', spinQueue.current);
    
    // Start the first spin
    handleSpinWheel();
  }, [state.wheelSettings.multipleRolls]);

  const handleSpinWheel = useCallback(() => {
    if (state.items.length === 0) {
      toast({
        title: "Can't spin the wheel",
        description: "Please add some items to the list first.",
        variant: "destructive"
      });
      spinInProgress.current = false;
      return;
    }
    
    console.log('Starting spin. Remaining in queue:', spinQueue.current);
    setIsSpinning(true);
  }, [state.items]);

  const handleItemSelected = useCallback((item: Item) => {
    // Add to selected items list
    setState(prevState => ({
      ...prevState,
      selectedItems: [...prevState.selectedItems, item]
    }));
    
    // If removeOnPick is enabled, remove the item from the list
    if (state.wheelSettings.removeOnPick) {
      setState(prevState => ({
        ...prevState,
        items: prevState.items.filter(i => i.id !== item.id)
      }));
    }
  }, [state.wheelSettings.removeOnPick]);

  const handleAddItem = useCallback((name: string) => {
    setState(prevState => ({
      ...prevState,
      items: [...prevState.items, { id: uuidv4(), name }],
      // Clear current preset ID as we're modifying the list
      currentPresetId: null
    }));
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setState(prevState => ({
      ...prevState,
      items: prevState.items.filter(item => item.id !== id),
      // Clear current preset ID as we're modifying the list
      currentPresetId: null
    }));
  }, []);

  const handleCreatePreset = useCallback((name: string) => {
    const newPreset: Preset = {
      id: uuidv4(),
      name,
      items: state.items
    };
    
    setState(prevState => ({
      ...prevState,
      presets: [...prevState.presets, newPreset],
      currentPresetId: newPreset.id
    }));
  }, [state.items]);

  const handleLoadPreset = useCallback((id: string) => {
    const preset = state.presets.find(p => p.id === id);
    if (preset) {
      setState(prevState => ({
        ...prevState,
        items: [...preset.items],
        currentPresetId: id,
        selectedItems: [] // Clear selected items when loading a new preset
      }));
    }
  }, [state.presets]);

  const handleDeletePreset = useCallback((id: string) => {
    setState(prevState => ({
      ...prevState,
      presets: prevState.presets.filter(preset => preset.id !== id),
      currentPresetId: prevState.currentPresetId === id ? null : prevState.currentPresetId
    }));
  }, []);

  const handleRenamePreset = useCallback((id: string, newName: string) => {
    setState(prevState => ({
      ...prevState,
      presets: prevState.presets.map(preset => 
        preset.id === id ? { ...preset, name: newName } : preset
      )
    }));
  }, []);

  const handleSaveCurrentAsPreset = useCallback(() => {
    if (state.items.length === 0) {
      toast({
        title: "Can't save preset",
        description: "Please add some items to the list first.",
        variant: "destructive"
      });
      return;
    }
    
    const presetName = prompt("Enter a name for the preset:");
    if (presetName && presetName.trim()) {
      handleCreatePreset(presetName.trim());
    }
  }, [state.items, handleCreatePreset]);

  const handleUpdateWheelSettings = useCallback((settings: Partial<WheelSettingsType>) => {
    setState(prevState => ({
      ...prevState,
      wheelSettings: {
        ...prevState.wheelSettings,
        ...settings
      }
    }));
  }, []);

  // Handle the spin completion
  const handleSpinComplete = useCallback((item: Item) => {
    console.log('Spin complete. Selected item:', item.name);
    
    // Add to selected items list and remove from items if needed in a single state update
    setState(prevState => {
      const newState = {
        ...prevState,
        selectedItems: [...prevState.selectedItems, item]
      };
      
      // If removeOnPick is enabled, remove the item from the list
      if (prevState.wheelSettings.removeOnPick) {
        newState.items = prevState.items.filter(i => i.id !== item.id);
      }
      
      return newState;
    });

    // Decrement the spin queue
    const currentSpinQueue = spinQueue.current - 1;
    spinQueue.current = currentSpinQueue;
    
    console.log('Spins remaining in queue:', currentSpinQueue);
    
    // If we have more spins and items, queue the next spin
    if (currentSpinQueue > 0 && state.items.length > 1) {
      console.log('Queueing next spin...');
      const spinTimeout = setTimeout(() => {
        if (spinQueue.current > 0) {
          console.log('Starting next spin from queue...');
          setIsSpinning(true);
        }
      }, 2000); // 2 second delay between spins
      
      return () => clearTimeout(spinTimeout);
    } else {
      console.log('Spin sequence complete or no items left');
      spinInProgress.current = false;
      setIsSpinning(false);
    }
    
    return () => {}; // No cleanup needed if not setting a timeout
  }, [state.items.length, state.wheelSettings.removeOnPick]);

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <div className="container px-4 py-8 mx-auto flex-1 flex flex-col h-full max-w-full">
        <header className="text-center mb-8 relative flex-shrink-0">
          <div className="absolute right-4 top-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
            Wheel of Fortune Roulette
          </h1>
          <p className="text-muted-foreground mt-2">Spin the wheel to pick a random item!</p>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          {/* Main wheel area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-card text-card-foreground rounded-lg shadow-md min-h-0">
            <div className="w-full h-full flex items-center justify-center">
              <RouletteWheel
                items={state.items}
                onItemSelected={handleSpinComplete}
                spinDuration={state.wheelSettings.spinDuration}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                onSpinStart={startNewSpinSequence}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-2 overflow-y-auto pb-2">
            {/* Presets Section */}
            <div className="bg-card p-3 rounded-md shadow-sm">
              <PresetManager
                presets={state.presets}
                currentPresetId={state.currentPresetId}
                onCreatePreset={handleCreatePreset}
                onLoadPreset={handleLoadPreset}
                onDeletePreset={handleDeletePreset}
                onRenamePreset={handleRenamePreset}
                onSaveCurrentAsPreset={handleSaveCurrentAsPreset}
                isSpinning={isSpinning}
              />
            </div>

            {/* Settings Section */}
            <div className="bg-card p-3 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Wheel Settings</h2>
              <WheelSettings
                settings={state.wheelSettings}
                onUpdateSettings={handleUpdateWheelSettings}
                isSpinning={isSpinning}
              />
            </div>

            {/* Items Section */}
            <div className="bg-card p-3 rounded-md shadow-sm">
              <ItemList
                items={state.items}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                selectedItems={[]}
                isSpinning={isSpinning}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
