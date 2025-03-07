
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
  const [directional, setDirectional] = useState(true);
  const [point, setPoint] = useState(false);
  const [renderingMode, setRenderingMode] = useState('standard');

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

  const handleDirectionalChange = useCallback((value: boolean) => {
    setDirectional(value);
  }, []);

  const handlePointChange = useCallback((value: boolean) => {
    setPoint(value);
  }, []);

  const handleRenderingModeChange = useCallback((value: string) => {
    setRenderingMode(value);
  }, []);

  return (
    <LoadingTransition isLoading={isLoading}>
      <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-50">
        <header className="absolute top-0 left-0 right-0 z-10 px-4 py-4 sm:px-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleGoBack}
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-medium">
            {shapeId && getShapeById(shapeId as ShapeType).name}
          </h1>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleControls}
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/20"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        
        <div className="h-screen w-screen">
          <Scene
            shapeId={shapeId as ShapeType}
            wireframe={wireframe}
            ambient={ambient}
            directional={directional}
            point={point}
            renderingMode={renderingMode}
          />
        </div>
        
        <RenderControls
          isOpen={controlsOpen}
          onClose={() => setControlsOpen(false)}
          wireframe={wireframe}
          setWireframe={handleWireframeChange}
          ambient={ambient}
          setAmbient={handleAmbientChange}
          directional={directional}
          setDirectional={handleDirectionalChange}
          point={point}
          setPoint={handlePointChange}
          renderingMode={renderingMode}
          setRenderingMode={handleRenderingModeChange}
          onBack={handleGoBack}
        />
      </div>
    </LoadingTransition>
  );
};

export default ShapeViewer;
