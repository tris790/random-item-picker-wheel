
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RouletteWheel from '../components/RouletteWheel';
import ItemList from '../components/ItemList';
import PresetManager from '../components/PresetManager';
import WheelSettings from '../components/WheelSettings';
import { AppState, Item, Preset, WheelSettings as WheelSettingsType } from '../types';
import { getInitialState, saveToLocalStorage } from '../utils/localStorage';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [state, setState] = useState<AppState>(getInitialState);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rollQueue, setRollQueue] = useState<number>(0);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  // Process the roll queue
  useEffect(() => {
    if (rollQueue > 0 && !isSpinning && state.items.length > 0) {
      // Start next spin
      handleSpinWheel();
      setRollQueue(prev => prev - 1);
    }
  }, [rollQueue, isSpinning, state.items]);

  const handleSpinWheel = useCallback(() => {
    if (state.items.length === 0) {
      toast({
        title: "Can't spin the wheel",
        description: "Please add some items to the list first.",
        variant: "destructive"
      });
      return;
    }
    
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

  const handleStartRolls = useCallback(() => {
    if (state.wheelSettings.multipleRolls > 1) {
      setRollQueue(state.wheelSettings.multipleRolls - 1);
    }
  }, [state.wheelSettings.multipleRolls]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wheel of Fortune Roulette
          </h1>
          <p className="text-gray-600 mt-2">Spin the wheel to pick a random item!</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main wheel area */}
          <div className="flex-grow flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
            <RouletteWheel 
              items={state.items} 
              onItemSelected={(item) => {
                handleItemSelected(item);
                handleStartRolls();
              }}
              spinDuration={state.wheelSettings.spinDuration}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80 flex flex-col space-y-6">
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
            
            <WheelSettings 
              settings={state.wheelSettings}
              onUpdateSettings={handleUpdateWheelSettings}
              isSpinning={isSpinning}
            />
            
            <div className="flex-grow">
              <ItemList 
                items={state.items}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                selectedItems={state.selectedItems}
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
