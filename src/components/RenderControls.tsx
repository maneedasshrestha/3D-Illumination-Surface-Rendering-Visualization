
import React, { useCallback } from 'react';
import { X } from 'lucide-react';
import { renderingOptions, backgroundOptions } from '@/lib/lighting';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RenderControlsProps {
  isOpen: boolean;
  onClose: () => void;
  wireframe: boolean;
  setWireframe: (value: boolean) => void;
  ambient: boolean;
  setAmbient: (value: boolean) => void;
  diffuse: boolean;
  setDiffuse: (value: boolean) => void;
  specular: boolean;
  setSpecular: (value: boolean) => void;
  renderingMode: string;
  setRenderingMode: (value: string) => void;
  shapeColor: string;
  setShapeColor: (value: string) => void;
  background: string;
  setBackground: (value: string) => void;
  ambientLightColor: string;
  setAmbientLightColor: (value: string) => void;
  diffuseLightColor: string;
  setDiffuseLightColor: (value: string) => void;
  specularLightColor: string;
  setSpecularLightColor: (value: string) => void;
  showLightHelpers: boolean;
  setShowLightHelpers: (value: boolean) => void;
  onBack: () => void;
}

const RenderControls: React.FC<RenderControlsProps> = ({
  isOpen,
  onClose,
  wireframe,
  setWireframe,
  ambient,
  setAmbient,
  diffuse,
  setDiffuse,
  specular,
  setSpecular,
  renderingMode,
  setRenderingMode,
  shapeColor,
  setShapeColor,
  background,
  setBackground,
  ambientLightColor,
  setAmbientLightColor,
  diffuseLightColor,
  setDiffuseLightColor,
  specularLightColor,
  setSpecularLightColor,
  showLightHelpers,
  setShowLightHelpers,
  onBack,
}) => {
  // Use callbacks to prevent unnecessary re-renders
  const handleRenderingModeChange = useCallback((value: string) => {
    setRenderingMode(value);
  }, [setRenderingMode]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setShapeColor(e.target.value);
  }, [setShapeColor]);

  const handleBackgroundChange = useCallback((value: string) => {
    setBackground(value);
  }, [setBackground]);

  const handleAmbientLightColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmbientLightColor(e.target.value);
  }, [setAmbientLightColor]);

  const handleDiffuseLightColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDiffuseLightColor(e.target.value);
  }, [setDiffuseLightColor]);

  const handleSpecularLightColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecularLightColor(e.target.value);
  }, [setSpecularLightColor]);

  return (
    <aside
      className={`fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-background shadow-lg border-l border-border p-6 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
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
          
          <div className="space-y-2">
            <Label htmlFor="shapeColor">Shape Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="shapeColor"
                type="color"
                value={shapeColor}
                onChange={handleColorChange}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={shapeColor}
                onChange={handleColorChange}
                className="flex-1"
                placeholder="#ffffff"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background">Background</Label>
            <Select value={background} onValueChange={handleBackgroundChange}>
              <SelectTrigger id="background">
                <SelectValue placeholder="Select background" />
              </SelectTrigger>
              <SelectContent>
                {backgroundOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: option.color }}
                      />
                      {option.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Lighting Options</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="ambient" className="cursor-pointer">Ambient Illumination</Label>
              <Switch
                id="ambient"
                checked={ambient}
                onCheckedChange={setAmbient}
              />
            </div>
            
            {ambient && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="ambientLightColor">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="ambientLightColor"
                    type="color"
                    value={ambientLightColor}
                    onChange={handleAmbientLightColorChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={ambientLightColor}
                    onChange={handleAmbientLightColorChange}
                    className="flex-1"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="diffuse" className="cursor-pointer">Diffuse Reflection</Label>
              <Switch
                id="diffuse"
                checked={diffuse}
                onCheckedChange={setDiffuse}
              />
            </div>
            
            {diffuse && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="diffuseLightColor">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="diffuseLightColor"
                    type="color"
                    value={diffuseLightColor}
                    onChange={handleDiffuseLightColorChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={diffuseLightColor}
                    onChange={handleDiffuseLightColorChange}
                    className="flex-1"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="specular" className="cursor-pointer">Specular Reflection</Label>
              <Switch
                id="specular"
                checked={specular}
                onCheckedChange={setSpecular}
              />
            </div>
            
            {specular && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="specularLightColor">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="specularLightColor"
                    type="color"
                    value={specularLightColor}
                    onChange={handleSpecularLightColorChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={specularLightColor}
                    onChange={handleSpecularLightColorChange}
                    className="flex-1"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showLightHelpers" className="cursor-pointer">Visible Light Sources</Label>
              <Switch
                id="showLightHelpers"
                checked={showLightHelpers}
                onCheckedChange={setShowLightHelpers}
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
