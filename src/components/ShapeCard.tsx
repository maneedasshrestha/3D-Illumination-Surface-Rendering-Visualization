
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ShapeDefinition } from '@/lib/shapes';
import { createMaterial } from '@/lib/lighting';
import { Card, CardContent } from '@/components/ui/card';

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
    scene.background = new THREE.Color('#09090b');
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

    // Add stars to background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
    });

    const starsVertices = [];
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

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
      stars.rotation.x += 0.0002;
      stars.rotation.y += 0.0002;
      
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
      className="block"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'backwards'
      }}
    >
      <Card className="overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden bg-black">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
        <CardContent className="p-4 bg-white">
          <h3 className="text-lg font-medium text-foreground">
            {shape.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore lighting and rendering
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ShapeCard;
