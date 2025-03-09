
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Animated particles component for the 3D background
const Particles = () => {
  const count = 1000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const [dummy] = useState(() => new THREE.Object3D());

  useFrame(() => {
    if (!mesh.current) return;
    
    // Animate particles in a gentle wave pattern
    for (let i = 0; i < count; i++) {
      const id = i;
      const time = Date.now() * 0.001;
      
      // Position
      const x = Math.sin(id + time * 0.1) * 15;
      const y = Math.cos(id + time * 0.2) * 15;
      const z = Math.sin(id * 2 + time * 0.05) * 5;
      
      dummy.position.set(x, y, z);
      
      // Scale
      const scale = 0.02 + Math.sin(id + time * 0.3) * 0.01;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      mesh.current.setMatrixAt(id, dummy.matrix);
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Animated title component
const AnimatedTitle = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [springs, api] = useSpring(() => ({
    scale: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 5, tension: 400, friction: 50 }
  }));

  useEffect(() => {
    api.start({
      scale: [1, 1, 1],
      rotation: [0, Math.PI * 2, 0],
    });
  }, [api]);

  return (
    <animated.mesh
      ref={meshRef}
      // @ts-ignore - This is a valid use case but TypeScript is having trouble with the types
      scale={springs.scale}
      // @ts-ignore - This is a valid use case but TypeScript is having trouble with the types
      rotation={springs.rotation}
      position={[0, 0, -5]}
    >
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshPhongMaterial color="#FFFFFF" />
    </animated.mesh>
  );
};

// Scene that contains all 3D elements
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Particles />
      <AnimatedTitle />
    </>
  );
};

// Main welcome page component
const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  
  const handleGetStarted = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/explore');
    }, 800); // Delay navigation to allow for exit animation
  };

  return (
    <div className={`fixed inset-0 bg-black 
                     ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <Scene />
        </Canvas>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className={`space-y-6 max-w-3xl ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`} 
             style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Surface Illumination Explorer
          </h1>
          
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the fascinating world of 3D rendering techniques and surface illumination models through interactive visualizations.
          </p>
          
          <div className="mt-10">
            <Button 
              onClick={handleGetStarted}
              className="px-8 py-6 text-lg bg-white hover:bg-gray-200 text-black shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>Get Started</span>
              <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
