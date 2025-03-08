
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import Scene from '@/components/Scene';
import RenderControls from '@/components/RenderControls';
import LoadingTransition from '@/components/LoadingTransition';
import { ShapeType, getShapeById } from '@/lib/shapes';
import { Button } from '@/components/ui/button';

const ShapeViewer: React.FC = () => {
  const { shapeId = 'cube' } = useParams<{ shapeId: ShapeType }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(false);
  
  // Rendering states
  const [wireframe, setWireframe] = useState(false);
  const [ambient, setAmbient] = useState(true);
  const [diffuse, setDiffuse] = useState(true);
  const [specular, setSpecular] = useState(false);
  const [renderingMode, setRenderingMode] = useState('phong');
  const [shapeColor, setShapeColor] = useState('#ffffff');
  const [background, setBackground] = useState('space');

  useEffect(() => {
    try {
      // Validate shape ID
      getShapeById(shapeId as ShapeType);
      
      // Simulate loading time only on initial load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Invalid shape ID:', error);
      navigate('/');
    }
  }, [shapeId, navigate]);

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

  return (
    <LoadingTransition isLoading={isLoading}>
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
            {shapeId && getShapeById(shapeId as ShapeType).name}
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
          <Scene
            shapeId={shapeId as ShapeType}
            wireframe={wireframe}
            ambient={ambient}
            diffuse={diffuse}
            specular={specular}
            renderingMode={renderingMode}
            shapeColor={shapeColor}
            background={background}
          />
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
          onBack={handleGoBack}
        />
      </div>
    </LoadingTransition>
  );
};

export default ShapeViewer;
