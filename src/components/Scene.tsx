
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ShapeType, getShapeById } from '@/lib/shapes';
import { createMaterial, lightingOptions, backgroundOptions } from '@/lib/lighting';
import { getBuiltinTextureUrl } from '@/lib/textures';

interface SceneProps {
  shapeId: ShapeType;
  wireframe: boolean;
  ambient: boolean;
  diffuse: boolean;
  specular: boolean;
  renderingMode: string;
  shapeColor: string;
  background: string;
  ambientLightColor?: string;
  diffuseLightColor?: string;
  specularLightColor?: string;
  showLightHelpers?: boolean;
  customModel?: THREE.Object3D | null;
  textureOption?: string;
  customTextureUrl?: string | null;
}

const Shape: React.FC<{ 
  shapeId: ShapeType;
  wireframe: boolean;
  renderingMode: string;
  shapeColor: string;
  customModel?: THREE.Object3D | null;
  textureOption?: string;
  customTextureUrl?: string | null;
}> = ({ 
  shapeId, 
  wireframe, 
  renderingMode, 
  shapeColor, 
  customModel,
  textureOption = 'none',
  customTextureUrl = null
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Determine which texture to use
  const textureUrl = useMemo(() => {
    if (textureOption === 'custom' && customTextureUrl) {
      return customTextureUrl;
    } else if (textureOption !== 'none') {
      return getBuiltinTextureUrl(textureOption);
    }
    return null;
  }, [textureOption, customTextureUrl]);
  
  // Handle custom model if provided
  if (shapeId === 'customModel' && customModel) {
    console.log('Rendering custom model:', customModel);
    
    // Apply material to custom model
    useEffect(() => {
      if (!customModel) return;
      
      const material = createMaterial(
        wireframe ? 'wireframe' : renderingMode, 
        shapeColor,
        textureUrl
      );
      
      customModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Store original material to avoid memory leaks
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }
          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      return () => {
        // Restore original materials when component unmounts
        customModel.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.originalMaterial) {
            child.material = child.userData.originalMaterial;
          }
        });
      };
    }, [customModel, wireframe, renderingMode, shapeColor, textureUrl]);
    
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.005;
      }
    });

    // Fix TypeScript errors with explicit typing
    useEffect(() => {
      if (!customModel || !groupRef.current) return;
      
      // Calculate bounding box to center the model
      const box = new THREE.Box3().setFromObject(customModel);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      // Calculate scale to normalize the model size
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      
      // Apply transformations to the group
      if (groupRef.current) {
        groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        groupRef.current.scale.set(scale, scale, scale);
      }
    }, [customModel]);

    return (
      <group ref={groupRef}>
        <primitive object={customModel} />
      </group>
    );
  }
  
  // Regular shape rendering
  const shape = getShapeById(shapeId);
  const geometry = useMemo(() => shape.geometry(), [shapeId]);
  
  const effectiveRenderMode = wireframe ? 'wireframe' : renderingMode;
  const material = useMemo(() => 
    createMaterial(effectiveRenderMode, shapeColor, textureUrl), 
    [effectiveRenderMode, shapeColor, textureUrl]
  );

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
      position={[shape.defaultPosition[0], shape.defaultPosition[1], shape.defaultPosition[2]]}
      rotation={[shape.defaultRotation[0], shape.defaultRotation[1], shape.defaultRotation[2]]}
      scale={[shape.defaultScale[0], shape.defaultScale[1], shape.defaultScale[2]]}
      castShadow
      receiveShadow
    >
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const SpaceBackground: React.FC = () => {
  return (
    <Stars 
      radius={100} 
      depth={50} 
      count={5000} 
      factor={4} 
      saturation={0} 
      fade
      speed={1}
    />
  );
};

const LightHelper: React.FC<{
  position: [number, number, number];
  color: string;
  type: 'directional' | 'point';
}> = ({ position, color, type }) => {
  const size = type === 'directional' ? 1 : 0.5;
  
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size * 0.2, 16, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {type === 'directional' && (
        <group>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const length = 2 + Math.random() * 2;
            const width = 0.1;
            
            return (
              <mesh key={i} position={[Math.sin(angle) * length * 0.5, Math.cos(angle) * length * 0.5, 0]}>
                <planeGeometry args={[width, length]} />
                <meshBasicMaterial 
                  color={color} 
                  transparent={true} 
                  opacity={0.4}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </group>
      )}
      {type === 'point' && (
        <group>
          {[...Array(12)].map((_, i) => {
            const phi = Math.acos(-1 + (2 * i) / 12);
            const theta = Math.sqrt(12 * Math.PI) * phi;
            const length = 1 + Math.random();
            
            return (
              <mesh key={i} position={[
                length * Math.sin(phi) * Math.cos(theta) * 0.5,
                length * Math.sin(phi) * Math.sin(theta) * 0.5,
                length * Math.cos(phi) * 0.5
              ]}>
                <boxGeometry args={[0.05, 0.05, length]} />
                <meshBasicMaterial 
                  color={color} 
                  transparent={true} 
                  opacity={0.4}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
};

const Lights: React.FC<{ 
  ambient: boolean;
  diffuse: boolean;
  specular: boolean;
  ambientColor?: string;
  diffuseColor?: string;
  specularColor?: string;
  showHelpers?: boolean;
}> = React.memo(({ 
  ambient, 
  diffuse, 
  specular, 
  ambientColor = lightingOptions.ambientLight.defaultColor,
  diffuseColor = lightingOptions.diffuseLight.defaultColor,
  specularColor = lightingOptions.specularLight.defaultColor,
  showHelpers = false
}) => {
  return (
    <>
      {ambient && (
        <ambientLight 
          color={new THREE.Color(ambientColor)}
          intensity={lightingOptions.ambientLight.defaultIntensity}
        />
      )}
      
      {diffuse && (
        <>
          <directionalLight
            color={new THREE.Color(diffuseColor)}
            intensity={lightingOptions.diffuseLight.defaultIntensity}
            position={lightingOptions.diffuseLight.defaultPosition}
            castShadow
          />
          {showHelpers && (
            <LightHelper 
              position={lightingOptions.diffuseLight.defaultPosition} 
              color={diffuseColor}
              type="directional"
            />
          )}
        </>
      )}
      
      {specular && (
        <>
          <pointLight
            color={new THREE.Color(specularColor)}
            intensity={lightingOptions.specularLight.defaultIntensity}
            position={lightingOptions.specularLight.defaultPosition}
            castShadow
          />
          {showHelpers && (
            <LightHelper 
              position={lightingOptions.specularLight.defaultPosition} 
              color={specularColor}
              type="point"
            />
          )}
        </>
      )}
    </>
  );
});

Lights.displayName = 'Lights';

const CanvasContainer: React.FC<SceneProps> = ({ 
  shapeId, 
  wireframe, 
  ambient, 
  diffuse, 
  specular, 
  renderingMode, 
  shapeColor, 
  background,
  ambientLightColor = lightingOptions.ambientLight.defaultColor,
  diffuseLightColor = lightingOptions.diffuseLight.defaultColor,
  specularLightColor = lightingOptions.specularLight.defaultColor,
  showLightHelpers = true,
  customModel,
  textureOption = 'none',
  customTextureUrl = null
}) => {
  const bgColor = useMemo(() => {
    const bgOption = backgroundOptions.find(option => option.id === background);
    return bgOption ? bgOption.color : '#000000';
  }, [background]);

  const showStars = background === 'space';

  return (
    <Canvas shadows dpr={[1, 2]} className="shape-canvas">
      <color attach="background" args={[bgColor]} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      
      {showStars && <SpaceBackground />}
      
      <Lights 
        ambient={ambient} 
        diffuse={diffuse} 
        specular={specular}
        ambientColor={ambientLightColor}
        diffuseColor={diffuseLightColor}
        specularColor={specularLightColor}
        showHelpers={showLightHelpers}
      />
      
      <Shape 
        shapeId={shapeId} 
        wireframe={wireframe}
        renderingMode={renderingMode}
        shapeColor={shapeColor}
        customModel={customModel}
        textureOption={textureOption}
        customTextureUrl={customTextureUrl}
      />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={20}
        zoomSpeed={1}
      />
      
      <Environment preset="sunset" />
    </Canvas>
  );
};

const Scene: React.FC<SceneProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-full">
      <CanvasContainer {...props} />
    </div>
  );
};

export default Scene;
