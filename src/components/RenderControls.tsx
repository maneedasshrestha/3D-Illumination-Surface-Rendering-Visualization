
import React, { useCallback } from 'react';
import { X, Upload, Pause, Play } from 'lucide-react';
import { renderingOptions, backgroundOptions, lightingPresets, customLights } from '@/lib/lighting';
import { defaultTextureOptions } from '@/lib/textures';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

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
  lightingPreset: string;
  setLightingPreset: (value: string) => void;
  showLightHelpers: boolean;
  setShowLightHelpers: (value: boolean) => void;
  textureOption: string;
  setTextureOption: (value: string) => void;
  onTextureUpload: (file: File) => void;
  onBack: () => void;
  customLightColors?: [string, string, string];
  setCustomLightColor?: (index: number, color: string) => void;
  customLightPositions?: [[number, number, number], [number, number, number], [number, number, number]];
  setCustomLightPosition?: (index: number, axis: 'x' | 'y' | 'z', value: number) => void;
  rotationPaused?: boolean;
  setRotationPaused?: (value: boolean) => void;
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
  lightingPreset,
  setLightingPreset,
  showLightHelpers,
  setShowLightHelpers,
  textureOption,
  setTextureOption,
  onTextureUpload,
  onBack,
  customLightColors = customLights.map(light => light.defaultColor) as [string, string, string],
  setCustomLightColor,
  customLightPositions = customLights.map(light => light.defaultPosition) as [[number, number, number], [number, number, number], [number, number, number]],
  setCustomLightPosition,
  rotationPaused = false,
  setRotationPaused,
}) => {
  const { toast } = useToast();
  
  const handleRenderingModeChange = useCallback((value: string) => {
    setRenderingMode(value);
  }, [setRenderingMode]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setShapeColor(e.target.value);
  }, [setShapeColor]);

  const handleBackgroundChange = useCallback((value: string) => {
    setBackground(value);
  }, [setBackground]);

  const handleLightingPresetChange = useCallback((value: string) => {
    setLightingPreset(value);
  }, [setLightingPreset]);
  
  const handleTextureOptionChange = useCallback((value: string) => {
    setTextureOption(value);
  }, [setTextureOption]);
  
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      onTextureUpload(file);
      toast({
        title: "Texture uploaded",
        description: `Applied texture: ${file.name}`,
      });
    }
  }, [onTextureUpload, toast]);

  const handleLightColorChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (setCustomLightColor) {
      setCustomLightColor(index, e.target.value);
    }
  }, [setCustomLightColor]);
  
  const handleLightPositionChange = useCallback((index: number, axis: 'x' | 'y' | 'z', value: number) => {
    if (setCustomLightPosition) {
      setCustomLightPosition(index, axis, value);
    }
  }, [setCustomLightPosition]);

  const handleRotationToggle = useCallback(() => {
    if (setRotationPaused) {
      setRotationPaused(!rotationPaused);
    }
  }, [rotationPaused, setRotationPaused]);

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
          
          <div className="flex items-center justify-between">
            <Label htmlFor="rotation" className="cursor-pointer">Shape Rotation</Label>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleRotationToggle}
            >
              {rotationPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              )}
            </Button>
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
          
          <div className="space-y-2">
            <Label htmlFor="texture">Texture</Label>
            <Select value={textureOption} onValueChange={handleTextureOptionChange}>
              <SelectTrigger id="texture">
                <SelectValue placeholder="Select texture" />
              </SelectTrigger>
              <SelectContent>
                {defaultTextureOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
                {textureOption === 'custom' && (
                  <SelectItem value="custom">
                    Custom Texture
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <div className="mt-2">
              <Label htmlFor="textureUpload" className="cursor-pointer w-full">
                <div className="flex items-center gap-2 border border-border p-2 rounded-md hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  <span>Upload custom texture</span>
                </div>
                <Input
                  id="textureUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Lighting Options</h3>
          
          <div className="space-y-2">
            <Label htmlFor="lightingPreset">Lighting Preset</Label>
            <Select value={lightingPreset} onValueChange={handleLightingPresetChange}>
              <SelectTrigger id="lightingPreset">
                <SelectValue placeholder="Select lighting preset" />
              </SelectTrigger>
              <SelectContent>
                {lightingPresets.map(preset => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {lightingPreset && (
              <p className="text-xs text-muted-foreground">
                {lightingPresets.find(p => p.id === lightingPreset)?.description}
              </p>
            )}
          </div>
          
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ambient" className="cursor-pointer">Ambient Illumination</Label>
              <Switch
                id="ambient"
                checked={ambient}
                onCheckedChange={setAmbient}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="diffuse" className="cursor-pointer">Diffuse Reflection</Label>
              <Switch
                id="diffuse"
                checked={diffuse}
                onCheckedChange={setDiffuse}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="specular" className="cursor-pointer">Specular Reflection</Label>
              <Switch
                id="specular"
                checked={specular}
                onCheckedChange={setSpecular}
              />
            </div>
            
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
          <h3 className="text-lg font-medium">Custom Light Sources</h3>
          
          {customLights.map((light, index) => (
            <div key={light.id} className="space-y-3 bg-accent/20 p-3 rounded-md">
              <h4 className="font-medium">{light.name}</h4>
              
              <div className="space-y-2">
                <Label htmlFor={`light-${index}-color`}>Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`light-${index}-color`}
                    type="color"
                    value={customLightColors[index]}
                    onChange={(e) => handleLightColorChange(index, e)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={customLightColors[index]}
                    onChange={(e) => handleLightColorChange(index, e)}
                    className="flex-1"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Position</Label>
                
                <div className="grid grid-cols-[30px_1fr] gap-2 items-center">
                  <span className="text-sm font-medium">X:</span>
                  <div className="flex gap-2 items-center">
                    <Slider
                      value={[customLightPositions[index][0]]}
                      min={-10}
                      max={10}
                      step={0.1}
                      onValueChange={(value) => handleLightPositionChange(index, 'x', value[0])}
                    />
                    <span className="w-10 text-right text-sm">{customLightPositions[index][0].toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-[30px_1fr] gap-2 items-center">
                  <span className="text-sm font-medium">Y:</span>
                  <div className="flex gap-2 items-center">
                    <Slider
                      value={[customLightPositions[index][1]]}
                      min={-10}
                      max={10}
                      step={0.1}
                      onValueChange={(value) => handleLightPositionChange(index, 'y', value[0])}
                    />
                    <span className="w-10 text-right text-sm">{customLightPositions[index][1].toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-[30px_1fr] gap-2 items-center">
                  <span className="text-sm font-medium">Z:</span>
                  <div className="flex gap-2 items-center">
                    <Slider
                      value={[customLightPositions[index][2]]}
                      min={-10}
                      max={10}
                      step={0.1}
                      onValueChange={(value) => handleLightPositionChange(index, 'z', value[0])}
                    />
                    <span className="w-10 text-right text-sm">{customLightPositions[index][2].toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
