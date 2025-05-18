import React, { useState } from 'react';
import { Preset } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Trash2, Plus, Edit, Save, RotateCw } from 'lucide-react';

interface PresetManagerProps {
  presets: Preset[];
  currentPresetId: string | null;
  onCreatePreset: (name: string) => void;
  onLoadPreset: (id: string) => void;
  onDeletePreset: (id: string) => void;
  onRenamePreset: (id: string, newName: string) => void;
  onSaveCurrentAsPreset: () => void;
  isSpinning: boolean;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  currentPresetId,
  onCreatePreset,
  onLoadPreset,
  onDeletePreset,
  onRenamePreset,
  onSaveCurrentAsPreset,
  isSpinning
}) => {
  const [newPresetName, setNewPresetName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [presetToRename, setPresetToRename] = useState<Preset | null>(null);
  const [newName, setNewName] = useState('');

  const handleCreatePreset = () => {
    if (newPresetName.trim()) {
      onCreatePreset(newPresetName.trim());
      setNewPresetName('');
      setIsCreateDialogOpen(false);
      toast({
        title: "Preset Created",
        description: `"${newPresetName}" preset has been created.`
      });
    } else {
      toast({
        title: "Can't create preset",
        description: "Please enter a name for the preset.",
        variant: "destructive"
      });
    }
  };

  const handleRenamePreset = () => {
    if (presetToRename && newName.trim()) {
      onRenamePreset(presetToRename.id, newName.trim());
      setIsRenameDialogOpen(false);
      setPresetToRename(null);
      setNewName('');
      toast({
        title: "Preset Renamed",
        description: `Preset renamed to "${newName}".`
      });
    }
  };

  const handleDeletePreset = (preset: Preset) => {
    if (confirm(`Are you sure you want to delete the preset "${preset.name}"?`)) {
      onDeletePreset(preset.id);
      toast({
        title: "Preset Deleted",
        description: `"${preset.name}" preset has been deleted.`
      });
    }
  };

  const getCurrentPreset = () => {
    if (!currentPresetId) return null;
    return presets.find(preset => preset.id === currentPresetId) || null;
  };

  const currentPreset = getCurrentPreset();

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Presets</h2>
        <div className="flex space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isSpinning}>
                <Plus className="h-4 w-4 mr-1" /> New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Preset</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Enter preset name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                autoFocus
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreatePreset}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSaveCurrentAsPreset}
            disabled={isSpinning}
          >
            <Save className="h-4 w-4 mr-1" /> Save Current
          </Button>
        </div>
      </div>

      {presets.length > 0 ? (
        <div>
          <div className="flex items-center space-x-2">
            <Select
              value={currentPresetId || ''}
              onValueChange={onLoadPreset}
              disabled={isSpinning}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              disabled={isSpinning}
              onClick={() => {
                if (currentPresetId) {
                  onLoadPreset(currentPresetId);
                }
              }}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          {currentPreset && (
            <div className="flex space-x-2 mt-2">
              <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSpinning}
                    onClick={() => {
                      setPresetToRename(currentPreset);
                      setNewName(currentPreset.name);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Rename
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Preset</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Enter new name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRenamePreset}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                disabled={isSpinning}
                onClick={() => handleDeletePreset(currentPreset)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-4 border rounded-md">
          No presets available
        </div>
      )}
    </div>
  );
};

export default PresetManager;
