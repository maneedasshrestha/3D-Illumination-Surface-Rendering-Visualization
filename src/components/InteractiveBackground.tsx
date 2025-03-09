
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingParticles = () => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height * 2,
        (Math.random() - 2) * 5
      ],
      scale: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
      rotation: Math.random() * Math.PI,
      color: i % 2 === 0 ? '#5865F2' : '#80DEEA'
    }));
  }, [viewport]);

  useFrame(({ mouse, viewport }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.z += 0.0005;
      
      // Subtle movement following mouse
      const x = (mouse.x * viewport.width) / 50;
      const y = (mouse.y * viewport.height) / 50;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        y * 0.05,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        x * 0.05,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh 
          key={i} 
          position={particle.position as [number, number, number]}
          scale={particle.scale}
        >
          <Sphere args={[1, 8, 8]}>
            <MeshDistortMaterial
              color={particle.color}
              speed={0.5}
              distort={0.3}
              radius={1}
              opacity={0.6}
              transparent
            />
          </Sphere>
        </mesh>
      ))}
    </group>
  );
};

const InteractiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-50">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
};

export default InteractiveBackground;
