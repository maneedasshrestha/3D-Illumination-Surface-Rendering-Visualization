
import * as THREE from 'three';

export type ShapeType = 
  | 'cube' 
  | 'sphere' 
  | 'cone' 
  | 'torus' 
  | 'cylinder' 
  | 'tetrahedron' 
  | 'octahedron' 
  | 'dodecahedron' 
  | 'icosahedron'
  | 'torusKnot'
  | 'heart'
  | 'trefoil'
  | 'spiral'
  | 'customModel';

export interface ShapeDefinition {
  id: ShapeType;
  name: string;
  geometry: () => THREE.BufferGeometry;
  defaultPosition: [number, number, number];
  defaultRotation: [number, number, number];
  defaultScale: [number, number, number];
}

export const shapes: ShapeDefinition[] = [
  {
    id: 'cube',
    name: 'Cube',
    geometry: () => new THREE.BoxGeometry(1, 1, 1),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0.5, 0.5, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'sphere',
    name: 'Sphere',
    geometry: () => new THREE.SphereGeometry(0.7, 32, 32),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'cone',
    name: 'Cone',
    geometry: () => new THREE.ConeGeometry(0.7, 1.5, 32),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'torus',
    name: 'Torus',
    geometry: () => new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    defaultPosition: [0, 0, 0],
    defaultRotation: [Math.PI / 2, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'cylinder',
    name: 'Cylinder',
    geometry: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'tetrahedron',
    name: 'Tetrahedron',
    geometry: () => new THREE.TetrahedronGeometry(0.8),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'octahedron',
    name: 'Octahedron',
    geometry: () => new THREE.OctahedronGeometry(0.8),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'dodecahedron',
    name: 'Dodecahedron',
    geometry: () => new THREE.DodecahedronGeometry(0.8),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'icosahedron',
    name: 'Icosahedron',
    geometry: () => new THREE.IcosahedronGeometry(0.8),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'torusKnot',
    name: 'Torus Knot',
    geometry: () => new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16),
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'heart',
    name: 'Heart',
    geometry: () => {
      // Create a heart shape
      const heartShape = new THREE.Shape();
      const x = 0, y = 0;
      
      heartShape.moveTo(x, y + 0.25);
      heartShape.bezierCurveTo(x, y + 0.25, x - 0.25, y, x - 0.25, y);
      heartShape.bezierCurveTo(x - 0.25, y - 0.25, x, y - 0.25, x, y - 0.25);
      heartShape.bezierCurveTo(x + 0.25, y - 0.25, x + 0.25, y, x + 0.25, y);
      heartShape.bezierCurveTo(x + 0.25, y + 0.25, x, y + 0.25, x, y + 0.25);
      
      const extrudeSettings = {
        depth: 0.2,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
      };
      
      return new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    },
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'trefoil',
    name: 'Trefoil Knot',
    geometry: () => {
      // Create a trefoil knot
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0.5, 0.5, 0.5),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(-0.5, 0.5, -0.5),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-0.5, -0.5, 0.5),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0.5, -0.5, -0.5)
      ]);
      curve.closed = true;
      
      return new THREE.TubeGeometry(curve, 100, 0.15, 8, true);
    },
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
  {
    id: 'spiral',
    name: 'Spiral',
    geometry: () => {
      // Create a spiral
      const points = [];
      const numPoints = 100;
      const radiusStart = 0.1;
      const radiusEnd = 0.5;
      const height = 1.0;
      
      for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const angle = t * Math.PI * 6;
        const radius = radiusStart + (radiusEnd - radiusStart) * t;
        const x = radius * Math.cos(angle);
        const y = height * t - height / 2;
        const z = radius * Math.sin(angle);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      return new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
    },
    defaultPosition: [0, 0, 0],
    defaultRotation: [0, 0, 0],
    defaultScale: [1, 1, 1],
  },
];

export const getShapeById = (id: ShapeType): ShapeDefinition => {
  const shape = shapes.find(s => s.id === id);
  if (!shape) {
    throw new Error(`Shape with id ${id} not found`);
  }
  return shape;
};
