
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ShapeDefinition } from '@/lib/shapes';
import { createMaterial } from '@/lib/lighting';

interface ShapeCardProps {
  shape: ShapeDefinition;
  index: number;
}

const ShapeCard: React.FC<ShapeCardProps> = ({ shape, index }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 3);
    cameraRef.current = camera;

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Mesh
    const geometry = shape.geometry();
    const material = createMaterial('phong', '#ffffff');
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(...shape.defaultPosition);
    mesh.rotation.set(...shape.defaultRotation);
    mesh.scale.set(...shape.defaultScale);
    
    scene.add(mesh);
    meshRef.current = mesh;

    // Animation
    let animationId: number;
    const animate = () => {
      if (!meshRef.current) return;
      
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [shape]);

  return (
    <Link 
      to={`/view/${shape.id}`} 
      className="shape-card group"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'backwards'
      }}
    >
      <div className="relative h-52 w-full overflow-hidden rounded-lg bg-black/5">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {shape.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Explore lighting and rendering techniques
        </p>
      </div>
    </Link>
  );
};

export default ShapeCard;
