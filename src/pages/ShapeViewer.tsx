import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import Scene from '@/components/Scene';
import RenderControls from '@/components/RenderControls';
import LoadingTransition from '@/components/LoadingTransition';
import { ShapeType, getShapeById } from '@/lib/shapes';
import { Button } from '@/components/ui/button';
import { lightingOptions, lightingPresets, customLights } from '@/lib/lighting';
import { loadModel } from '@/lib/modelLoader';
import { createTextureFromFile } from '@/lib/textures';
import { useToast } from '@/hooks/use-toast';

const ShapeViewer: React.FC = () => {
  const { shapeId = 'cube' } = useParams<{ shapeId: ShapeType }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(false);
  const { toast } = useToast();
  
  // Rendering states
  const [wireframe, setWireframe] = useState(false);
  const [ambient, setAmbient] = useState(true);
  const [diffuse, setDiffuse] = useState(true);
  const [specular, setSpecular] = useState(false);
  const [renderingMode, setRenderingMode] = useState('phong');
  const [shapeColor, setShapeColor] = useState('#ffffff');
  const [background, setBackground] = useState('space');
  
  // Texture states
  const [textureOption, setTextureOption] = useState('none');
  const [customTextureUrl, setCustomTextureUrl] = useState<string | null>(null);
  
  // Light presets and individual light colors
  const [lightingPreset, setLightingPreset] = useState('default');
  const [ambientLightColor, setAmbientLightColor] = useState(lightingPresets[0].ambientColor);
  const [diffuseLightColor, setDiffuseLightColor] = useState(lightingPresets[0].diffuseColor);
  const [specularLightColor, setSpecularLightColor] = useState(lightingPresets[0].specularColor);
  const [showLightHelpers, setShowLightHelpers] = useState(false);
  
  // Custom model state
  const [customModel, setCustomModel] = useState<THREE.Object3D | null>(null);
  const [customModelLoading, setCustomModelLoading] = useState(false);
  
  // Custom light states
  const [customLightColors, setCustomLightColors] = useState<[string, string, string]>(
    customLights.map(light => light.defaultColor) as [string, string, string]
  );
  
  const [customLightPositions, setCustomLightPositions] = useState<[[number, number, number], [number, number, number], [number, number, number]]>(
    customLights.map(light => light.defaultPosition) as [[number, number, number], [number, number, number], [number, number, number]]
  );

  // Update light colors when preset changes
  useEffect(() => {
    const preset = lightingPresets.find(p => p.id === lightingPreset);
    if (preset) {
      setAmbientLightColor(preset.ambientColor);
      setDiffuseLightColor(preset.diffuseColor);
      setSpecularLightColor(preset.specularColor);
    }
  }, [lightingPreset]);

  useEffect(() => {
    const loadCustomModel = async () => {
      if (shapeId !== 'customModel') return;
      
      const isCustomModelUploaded = sessionStorage.getItem('customModelUploaded');
      const modelURL = sessionStorage.getItem('customModelURL');
      const modelName = sessionStorage.getItem('customModelName');
      
      if (isCustomModelUploaded !== 'true' || !modelURL || !modelName) {
        toast({
          title: "No model found",
          description: "Please upload a model first",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      try {
        setCustomModelLoading(true);
        console.log('Loading custom model from URL:', modelURL);
        
        // Fetch the file from the stored URL
        const response = await fetch(modelURL);
        const blob = await response.blob();
        
        // Create a File object to pass to loadModel
        const file = new File([blob], modelName, {
          type: blob.type || 'application/octet-stream'
        });
        
        // Load the model
        const loadedModel = await loadModel(file);
        console.log('Custom model loaded:', loadedModel);
        setCustomModel(loadedModel);
      } catch (error) {
        console.error('Error loading custom model:', error);
        toast({
          title: "Error loading model",
          description: "Failed to load the custom model",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setCustomModelLoading(false);
        setIsLoading(false);
      }
    };

    try {
      // Check if this is a custom model
      if (shapeId === 'customModel') {
        loadCustomModel();
      } else {
        // Validate shape ID
        getShapeById(shapeId as ShapeType);
        
        // Simulate loading time only on initial load
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Invalid shape ID:', error);
      navigate('/');
    }
  }, [shapeId, navigate, toast]);

  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const toggleControls = useCallback(() => {
    setControlsOpen(prev => !prev);
  }, []);

  const handleWireframeChange = useCallback((value: boolean) => {
    setWireframe(value);
  }, []);

  const handleAmbientChange = useCallback((value: boolean) => {
    setAmbient(value);
  }, []);

  const handleDiffuseChange = useCallback((value: boolean) => {
    setDiffuse(value);
  }, []);

  const handleSpecularChange = useCallback((value: boolean) => {
    setSpecular(value);
  }, []);

  const handleRenderingModeChange = useCallback((value: string) => {
    setRenderingMode(value);
  }, []);

  const handleShapeColorChange = useCallback((value: string) => {
    setShapeColor(value);
  }, []);

  const handleBackgroundChange = useCallback((value: string) => {
    setBackground(value);
  }, []);
  
  const handleLightingPresetChange = useCallback((value: string) => {
    setLightingPreset(value);
  }, []);
  
  const handleShowLightHelpersChange = useCallback((value: boolean) => {
    setShowLightHelpers(value);
  }, []);
  
  const handleTextureOptionChange = useCallback((value: string) => {
    setTextureOption(value);
  }, []);
  
  const handleTextureUpload = useCallback(async (file: File) => {
    try {
      const textureUrl = await createTextureFromFile(file);
      setCustomTextureUrl(textureUrl);
      setTextureOption('custom');
    } catch (error) {
      console.error('Error uploading texture:', error);
      toast({
        title: "Error uploading texture",
        description: "Failed to process the texture image",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleCustomLightColorChange = useCallback((index: number, color: string) => {
    setCustomLightColors(prev => {
      const newColors = [...prev] as [string, string, string];
      newColors[index] = color;
      return newColors;
    });
  }, []);
  
  const handleCustomLightPositionChange = useCallback((index: number, axis: 'x' | 'y' | 'z', value: number) => {
    setCustomLightPositions(prev => {
      const newPositions = JSON.parse(JSON.stringify(prev)) as [[number, number, number], [number, number, number], [number, number, number]];
      const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      newPositions[index][axisIndex] = value;
      return newPositions;
    });
  }, []);

  const shapeDisplayName = shapeId === 'customModel' 
    ? sessionStorage.getItem('customModelName') || 'Custom Model' 
    : (shapeId && getShapeById(shapeId as ShapeType).name);

  const showLoading = isLoading || (shapeId === 'customModel' && customModelLoading);

  return (
    <LoadingTransition isLoading={showLoading}>
      <div className="relative min-h-screen bg-background">
        <header className="absolute top-0 left-0 right-0 z-10 px-4 py-4 sm:px-6 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleGoBack}
            className="h-10 w-10 rounded-full border"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-medium">
            {shapeDisplayName}
          </h1>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleControls}
            className="h-10 w-10 rounded-full border"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        
        <div className="h-screen w-screen">
          {(shapeId !== 'customModel' || (shapeId === 'customModel' && customModel)) && (
            <Scene
              shapeId={shapeId as ShapeType}
              wireframe={wireframe}
              ambient={ambient}
              diffuse={diffuse}
              specular={specular}
              renderingMode={renderingMode}
              shapeColor={shapeColor}
              background={background}
              ambientLightColor={ambientLightColor}
              diffuseLightColor={diffuseLightColor}
              specularLightColor={specularLightColor}
              showLightHelpers={showLightHelpers}
              customModel={customModel}
              textureOption={textureOption}
              customTextureUrl={customTextureUrl}
              customLightColors={customLightColors}
              customLightPositions={customLightPositions}
            />
          )}
        </div>
        
        <RenderControls
          isOpen={controlsOpen}
          onClose={() => setControlsOpen(false)}
          wireframe={wireframe}
          setWireframe={handleWireframeChange}
          ambient={ambient}
          setAmbient={handleAmbientChange}
          diffuse={diffuse}
          setDiffuse={handleDiffuseChange}
          specular={specular}
          setSpecular={handleSpecularChange}
          renderingMode={renderingMode}
          setRenderingMode={handleRenderingModeChange}
          shapeColor={shapeColor}
          setShapeColor={handleShapeColorChange}
          background={background}
          setBackground={handleBackgroundChange}
          lightingPreset={lightingPreset}
          setLightingPreset={handleLightingPresetChange}
          showLightHelpers={showLightHelpers}
          setShowLightHelpers={handleShowLightHelpersChange}
          textureOption={textureOption}
          setTextureOption={handleTextureOptionChange}
          onTextureUpload={handleTextureUpload}
          onBack={handleGoBack}
          customLightColors={customLightColors}
          setCustomLightColor={handleCustomLightColorChange}
          customLightPositions={customLightPositions}
          setCustomLightPosition={handleCustomLightPositionChange}
        />
      </div>
    </LoadingTransition>
  );
};

export default ShapeViewer;
