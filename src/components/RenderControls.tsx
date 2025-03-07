
import React, { useCallback } from 'react';
import { X } from 'lucide-react';
import { renderingOptions } from '@/lib/lighting';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RenderControlsProps {
  isOpen: boolean;
  onClose: () => void;
  wireframe: boolean;
  setWireframe: (value: boolean) => void;
  ambient: boolean;
  setAmbient: (value: boolean) => void;
  directional: boolean;
  setDirectional: (value: boolean) => void;
  point: boolean;
  setPoint: (value: boolean) => void;
  renderingMode: string;
  setRenderingMode: (value: string) => void;
  onBack: () => void;
}

const RenderControls: React.FC<RenderControlsProps> = ({
  isOpen,
  onClose,
  wireframe,
  setWireframe,
  ambient,
  setAmbient,
  directional,
  setDirectional,
  point,
  setPoint,
  renderingMode,
  setRenderingMode,
  onBack,
}) => {
  // Use callbacks to prevent unnecessary re-renders
  const handleRenderingModeChange = useCallback((value: string) => {
    setRenderingMode(value);
  }, [setRenderingMode]);

  return (
    <aside
      className={`fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-lg p-6 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Rendering Controls</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Shape Display</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="wireframe" className="cursor-pointer">Wireframe</Label>
            <Switch
              id="wireframe"
              checked={wireframe}
              onCheckedChange={setWireframe}
            />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Lighting Options</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="ambient" className="cursor-pointer">Ambient Light</Label>
              <Switch
                id="ambient"
                checked={ambient}
                onCheckedChange={setAmbient}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="directional" className="cursor-pointer">Directional Light</Label>
              <Switch
                id="directional"
                checked={directional}
                onCheckedChange={setDirectional}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="point" className="cursor-pointer">Point Light</Label>
              <Switch
                id="point"
                checked={point}
                onCheckedChange={setPoint}
              />
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Rendering Mode</h3>
          <RadioGroup value={renderingMode} onValueChange={handleRenderingModeChange} className="space-y-2">
            {renderingOptions.filter(option => option.id !== 'wireframe').map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <div className="grid gap-0.5">
                  <Label htmlFor={option.id} className="cursor-pointer">{option.name}</Label>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="my-4" />
        
        <Button 
          onClick={onBack}
          className="w-full"
          variant="outline"
        >
          Back to Shapes
        </Button>
      </div>
    </aside>
  );
};

export default React.memo(RenderControls);
