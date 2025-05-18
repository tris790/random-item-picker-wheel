
import React from 'react';
import { WheelSettings as WheelSettingsType } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface WheelSettingsProps {
  settings: WheelSettingsType;
  onUpdateSettings: (settings: Partial<WheelSettingsType>) => void;
  isSpinning: boolean;
}

const WheelSettings: React.FC<WheelSettingsProps> = ({ 
  settings, 
  onUpdateSettings,
  isSpinning
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Wheel Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-2 space-y-1">
            <Label htmlFor="spin-duration" className="text-xs font-medium text-gray-600">
              Duration: {settings.spinDuration}s
            </Label>
            <Slider
              id="spin-duration"
              value={[settings.spinDuration]}
              min={2}
              max={10}
              step={0.5}
              disabled={isSpinning}
              onValueChange={([value]) => onUpdateSettings({ spinDuration: value })}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="multiple-rolls" className="text-xs font-medium text-gray-600">
              Spins
            </Label>
            <Input
              id="multiple-rolls"
              type="number"
              min={1}
              max={10}
              value={settings.multipleRolls}
              disabled={isSpinning}
              className="h-8 text-sm"
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0 && value <= 10) {
                  onUpdateSettings({ multipleRolls: value });
                }
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <Label htmlFor="remove-on-pick" className="text-sm">
            Remove after selection
          </Label>
          <Switch
            id="remove-on-pick"
            checked={settings.removeOnPick}
            disabled={isSpinning}
            onCheckedChange={(checked) => onUpdateSettings({ removeOnPick: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WheelSettings;
