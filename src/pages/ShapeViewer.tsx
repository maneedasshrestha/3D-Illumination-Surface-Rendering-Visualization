
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import Scene from '@/components/Scene';
import RenderControls from '@/components/RenderControls';
import LoadingTransition from '@/components/LoadingTransition';
import { ShapeType, getShapeById } from '@/lib/shapes';
import { Button } from '@/components/ui/button';
import { lightingOptions, lightingPresets } from '@/lib/lighting';
import { loadModel, loadTexture } from '@/lib/modelLoader';
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
  
  // Light presets and individual light colors
  const [lightingPreset, setLightingPreset] = useState('default');
  const [ambientLightColor, setAmbientLightColor] = useState(lightingPresets[0].ambientColor);
  const [diffuseLightColor, setDiffuseLightColor] = useState(lightingPresets[0].diffuseColor);
  const [specularLightColor, setSpecularLightColor] = useState(lightingPresets[0].specularColor);
  const [showLightHelpers, setShowLightHelpers] = useState(true);
  
  // Custom model state
  const [customModel, setCustomModel] = useState<THREE.Object3D | null>(null);
  const [customModelLoading, setCustomModelLoading] = useState(false);
  
  // Texture state
  const [textureImage, setTextureImage] = useState<string | null>(null);

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

  // Handle render control changes with callbacks to prevent re-renders
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
  
  const handleTextureUpload = useCallback(async (file: File | null) => {
    if (!file) {
      setTextureImage(null);
      return;
    }
    
    try {
      const textureURL = await loadTexture(file);
      setTextureImage(textureURL);
      toast({
        title: "Texture applied",
        description: `"${file.name}" applied successfully!`,
      });
    } catch (error) {
      console.error('Error loading texture:', error);
      toast({
        title: "Error loading texture",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const clearTexture = useCallback(() => {
    if (textureImage) {
      URL.revokeObjectURL(textureImage);
      setTextureImage(null);
      toast({
        title: "Texture removed",
        description: "Texture has been removed from the shape",
      });
    }
  }, [textureImage, toast]);

  // Get the display name for the current shape
  const shapeDisplayName = shapeId === 'customModel' 
    ? sessionStorage.getItem('customModelName') || 'Custom Model' 
    : (shapeId && getShapeById(shapeId as ShapeType).name);

  // Show loading if custom model is still loading
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
          
          <h1 className="text-xl font-medium bg-white/80 px-4 py-1 rounded-full">
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
              textureImage={textureImage}
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
          onTextureUpload={handleTextureUpload}
          onTextureClear={clearTexture}
          hasTexture={!!textureImage}
          onBack={handleGoBack}
        />
      </div>
    </LoadingTransition>
  );
};

export default ShapeViewer;
