
import * as THREE from 'three';

export interface LightingOption {
  id: string;
  name: string;
  description: string;
  create: () => THREE.Light;
  defaultPosition: [number, number, number];
  defaultIntensity: number;
  defaultColor: string;
}

export const lightingOptions: Record<string, LightingOption> = {
  ambientLight: {
    id: 'ambientLight',
    name: 'Ambient Light',
    description: 'Illuminates all objects equally without casting shadows',
    create: () => new THREE.AmbientLight(0xffffff, 0.5),
    defaultPosition: [0, 0, 0],
    defaultIntensity: 0.5,
    defaultColor: '#ffffff',
  },
  directionalLight: {
    id: 'directionalLight',
    name: 'Directional Light',
    description: 'Light rays travel in parallel from a specific direction',
    create: () => {
      const light = new THREE.DirectionalLight(0xffffff, 0.8);
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      return light;
    },
    defaultPosition: [5, 5, 5],
    defaultIntensity: 0.8,
    defaultColor: '#ffffff',
  },
  pointLight: {
    id: 'pointLight',
    name: 'Point Light',
    description: 'Emits light in all directions from a single point',
    create: () => {
      const light = new THREE.PointLight(0xffffff, 1);
      light.castShadow = true;
      return light;
    },
    defaultPosition: [2, 2, 2],
    defaultIntensity: 1,
    defaultColor: '#ffffff',
  },
  spotLight: {
    id: 'spotLight',
    name: 'Spot Light',
    description: 'Emits light in a cone shape from a specific point',
    create: () => {
      const light = new THREE.SpotLight(0xffffff, 1);
      light.castShadow = true;
      light.angle = Math.PI / 6;
      light.penumbra = 0.3;
      return light;
    },
    defaultPosition: [3, 3, 3],
    defaultIntensity: 1,
    defaultColor: '#ffffff',
  },
};

export interface RenderingOption {
  id: string;
  name: string;
  description: string;
}

export const renderingOptions: RenderingOption[] = [
  {
    id: 'wireframe',
    name: 'Wireframe',
    description: 'Display shape as a wireframe',
  },
  {
    id: 'solid',
    name: 'Solid',
    description: 'Render with a solid material',
  },
  {
    id: 'phong',
    name: 'Phong',
    description: 'Use Phong shading for realistic lighting',
  },
  {
    id: 'lambert',
    name: 'Lambert',
    description: 'Use Lambert shading for diffuse surfaces',
  },
  {
    id: 'standard',
    name: 'PBR',
    description: 'Physically-based rendering for realistic materials',
  },
];

export function createMaterial(type: string, color: string = '#ffffff'): THREE.Material {
  switch (type) {
    case 'wireframe':
      return new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color), 
        wireframe: true 
      });
    case 'solid':
      return new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color) 
      });
    case 'phong':
      return new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(color),
        shininess: 100,
        specular: new THREE.Color("#ffffff")
      });
    case 'lambert':
      return new THREE.MeshLambertMaterial({ 
        color: new THREE.Color(color) 
      });
    case 'standard':
      return new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(color),
        roughness: 0.3,
        metalness: 0.2
      });
    default:
      return new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(color) 
      });
  }
}
