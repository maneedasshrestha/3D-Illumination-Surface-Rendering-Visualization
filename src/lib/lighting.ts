import * as THREE from 'three';

export interface LightingOption {
  id: string;
  name: string;
  description: string;
  create: (color: string, intensity: number, visible: boolean) => THREE.Light;
  defaultPosition: [number, number, number];
  defaultIntensity: number;
  defaultColor: string;
  visibleHelper?: boolean;
}

export const lightingOptions: Record<string, LightingOption> = {
  ambientLight: {
    id: 'ambientLight',
    name: 'Ambient Light',
    description: 'Illuminates all objects equally without casting shadows',
    create: (color: string, intensity: number) => new THREE.AmbientLight(color, intensity),
    defaultPosition: [0, 0, 0],
    defaultIntensity: 0.5,
    defaultColor: '#ffffff',
  },
  diffuseLight: {
    id: 'diffuseLight',
    name: 'Diffuse Light',
    description: 'Scattered light that creates soft shadows',
    create: (color: string, intensity: number, visible: boolean) => {
      const light = new THREE.DirectionalLight(color, intensity);
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      return light;
    },
    defaultPosition: [5, 5, 5],
    defaultIntensity: 0.8,
    defaultColor: '#ffffff',
    visibleHelper: true,
  },
  specularLight: {
    id: 'specularLight',
    name: 'Specular Light',
    description: 'Creates bright highlights on shiny surfaces',
    create: (color: string, intensity: number, visible: boolean) => {
      const light = new THREE.PointLight(color, intensity);
      light.castShadow = true;
      return light;
    },
    defaultPosition: [2, 2, 2],
    defaultIntensity: 1,
    defaultColor: '#ffffff',
    visibleHelper: true,
  }
};

export interface RenderingOption {
  id: string;
  name: string;
  description: string;
}

export const renderingOptions: RenderingOption[] = [
  {
    id: 'constant',
    name: 'Constant',
    description: 'Flat shading with no lighting calculations',
  },
  {
    id: 'gouraud',
    name: 'Gouraud',
    description: 'Smooth shading with per-vertex lighting calculations',
  },
  {
    id: 'phong',
    name: 'Phong',
    description: 'Advanced shading with per-pixel lighting calculations',
  },
  {
    id: 'fastPhong',
    name: 'Fast Phong',
    description: 'Optimized version of Phong shading for better performance',
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    description: 'Display shape as a wireframe',
  },
];

export interface BackgroundOption {
  id: string;
  name: string;
  color: string;
}

export const backgroundOptions: BackgroundOption[] = [
  {
    id: 'space',
    name: 'Space',
    color: '#000000',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    color: '#f8fafc',
  },
  {
    id: 'dark',
    name: 'Dark',
    color: '#09090b',
  },
  {
    id: 'blue',
    name: 'Blue',
    color: '#0c4a6e',
  },
  {
    id: 'green',
    name: 'Green',
    color: '#14532d',
  },
];

export function createMaterial(type: string, color: string = '#ffffff'): THREE.Material {
  switch (type) {
    case 'wireframe':
      return new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color), 
        wireframe: true 
      });
    case 'constant':
      return new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color)
      });
    case 'gouraud':
      return new THREE.MeshLambertMaterial({ 
        color: new THREE.Color(color)
      });
    case 'phong':
      return new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(color),
        shininess: 100,
        specular: new THREE.Color("#ffffff")
      });
    case 'fastPhong':
      return new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(color),
        shininess: 30,
        specular: new THREE.Color("#333333")
      });
    default:
      return new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(color) 
      });
  }
}
