
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
  | 'icosahedron';

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
];

export const getShapeById = (id: ShapeType): ShapeDefinition => {
  const shape = shapes.find(s => s.id === id);
  if (!shape) {
    throw new Error(`Shape with id ${id} not found`);
  }
  return shape;
};
