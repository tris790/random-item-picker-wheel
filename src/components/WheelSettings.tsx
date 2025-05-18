
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
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="spin-duration">Spin Duration: {settings.spinDuration}s</Label>
          </div>
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
        
        <div className="flex items-center justify-between">
          <Label htmlFor="remove-on-pick">Remove item after selection</Label>
          <Switch
            id="remove-on-pick"
            checked={settings.removeOnPick}
            disabled={isSpinning}
            onCheckedChange={(checked) => onUpdateSettings({ removeOnPick: checked })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="multiple-rolls">Number of consecutive spins</Label>
          <Input
            id="multiple-rolls"
            type="number"
            min={1}
            max={10}
            value={settings.multipleRolls}
            disabled={isSpinning}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0 && value <= 10) {
                onUpdateSettings({ multipleRolls: value });
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WheelSettings;
