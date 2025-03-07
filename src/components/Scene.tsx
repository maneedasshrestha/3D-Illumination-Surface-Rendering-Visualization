
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ShapeType, getShapeById } from '@/lib/shapes';
import { createMaterial, lightingOptions } from '@/lib/lighting';

interface SceneProps {
  shapeId: ShapeType;
  wireframe: boolean;
  ambient: boolean;
  directional: boolean;
  point: boolean;
  renderingMode: string;
}

const Shape: React.FC<{ 
  shapeId: ShapeType;
  wireframe: boolean;
  renderingMode: string;
}> = ({ shapeId, wireframe, renderingMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shape = getShapeById(shapeId);
  const geometry = shape.geometry();
  
  const effectiveRenderMode = wireframe ? 'wireframe' : renderingMode;
  const material = createMaterial(effectiveRenderMode);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh 
      ref={meshRef}
      geometry={geometry}
      position={new THREE.Vector3(...shape.defaultPosition)}
      rotation={new THREE.Euler(...shape.defaultRotation)}
      scale={new THREE.Vector3(...shape.defaultScale)}
      castShadow
      receiveShadow
    >
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Lights: React.FC<{ 
  ambient: boolean;
  directional: boolean;
  point: boolean;
}> = ({ ambient, directional, point }) => {
  return (
    <>
      {ambient && (
        <ambientLight 
          color={new THREE.Color(lightingOptions.ambientLight.defaultColor)}
          intensity={lightingOptions.ambientLight.defaultIntensity}
        />
      )}
      
      {directional && (
        <directionalLight
          color={new THREE.Color(lightingOptions.directionalLight.defaultColor)}
          intensity={lightingOptions.directionalLight.defaultIntensity}
          position={lightingOptions.directionalLight.defaultPosition}
          castShadow
        />
      )}
      
      {point && (
        <pointLight
          color={new THREE.Color(lightingOptions.pointLight.defaultColor)}
          intensity={lightingOptions.pointLight.defaultIntensity}
          position={lightingOptions.pointLight.defaultPosition}
          castShadow
        />
      )}
    </>
  );
};

const Scene: React.FC<SceneProps> = ({ 
  shapeId, 
  wireframe, 
  ambient, 
  directional, 
  point,
  renderingMode 
}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} className="shape-canvas">
        <color attach="background" args={['#f8f9fa']} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
        
        <Lights 
          ambient={ambient} 
          directional={directional} 
          point={point} 
        />
        
        <Shape 
          shapeId={shapeId} 
          wireframe={wireframe}
          renderingMode={renderingMode}
        />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default Scene;
