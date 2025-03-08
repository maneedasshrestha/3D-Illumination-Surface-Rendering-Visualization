
import * as THREE from 'three';

export interface LightingOption {
  defaultColor: string;
  defaultIntensity: number;
  defaultPosition: [number, number, number];
}

export interface LightingOptions {
  ambientLight: LightingOption;
  diffuseLight: LightingOption;
  specularLight: LightingOption;
}

export const lightingOptions: LightingOptions = {
  ambientLight: {
    defaultColor: '#ffffff',
    defaultIntensity: 0.5,
    defaultPosition: [0, 0, 0]
  },
  diffuseLight: {
    defaultColor: '#ffffff',
    defaultIntensity: 1.0,
    defaultPosition: [5, 5, 5]
  },
  specularLight: {
    defaultColor: '#ffffff',
    defaultIntensity: 1.0,
    defaultPosition: [-5, 5, -5]
  }
};

export interface RenderingOption {
  id: string;
  name: string;
  description: string;
}

export const renderingOptions: RenderingOption[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Simple flat shading without reflections or lighting effects'
  },
  {
    id: 'lambert',
    name: 'Lambert',
    description: 'Matte surfaces with diffuse lighting'
  },
  {
    id: 'phong',
    name: 'Phong',
    description: 'Glossy surfaces with specular highlights'
  },
  {
    id: 'physical',
    name: 'Physical',
    description: 'Physically-based rendering with realistic materials'
  },
  {
    id: 'toon',
    name: 'Toon',
    description: 'Cartoon-like cel shading with discrete color steps'
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    description: 'Display only the edges of the geometry'
  }
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
    color: '#000000'
  },
  {
    id: 'white',
    name: 'White',
    color: '#ffffff'
  },
  {
    id: 'gray',
    name: 'Gray',
    color: '#2a2a2a'
  },
  {
    id: 'blue',
    name: 'Blue',
    color: '#1a2b4a'
  }
];

export interface LightingPreset {
  id: string;
  name: string;
  description: string;
  ambientColor: string;
  diffuseColor: string;
  specularColor: string;
}

export const lightingPresets: LightingPreset[] = [
  {
    id: 'default',
    name: 'White (Default)',
    description: 'Clean white lighting for accurate color representation',
    ambientColor: '#ffffff',
    diffuseColor: '#ffffff',
    specularColor: '#ffffff'
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Warm golden lighting for a cozy atmosphere',
    ambientColor: '#ffe0b2',
    diffuseColor: '#ffcc80',
    specularColor: '#ffb74d'
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Cool blue lighting for a sterile, modern look',
    ambientColor: '#bbdefb',
    diffuseColor: '#90caf9',
    specularColor: '#64b5f6'
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast with dark ambient and bright key light',
    ambientColor: '#263238',
    diffuseColor: '#ffffff',
    specularColor: '#b0bec5'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and purple lighting like a sunset',
    ambientColor: '#4a148c',
    diffuseColor: '#ff6f00',
    specularColor: '#e65100'
  },
  {
    id: 'disco',
    name: 'Disco',
    description: 'Colorful RGB lighting for a party atmosphere',
    ambientColor: '#880e4f',
    diffuseColor: '#00e676',
    specularColor: '#2979ff'
  }
];

// Function to create materials based on rendering mode
export function createMaterial(
  renderingMode: string, 
  color: string = '#ffffff', 
  texture: THREE.Texture | null = null
): THREE.Material {
  const colorObj = new THREE.Color(color);
  const params: Record<string, any> = { color: colorObj };
  
  // Add texture if provided
  if (texture) {
    params.map = texture;
  }
  
  switch (renderingMode) {
    case 'wireframe':
      return new THREE.MeshBasicMaterial({
        ...params,
        wireframe: true,
      });
      
    case 'basic':
      return new THREE.MeshBasicMaterial(params);
      
    case 'lambert':
      return new THREE.MeshLambertMaterial(params);
      
    case 'phong':
      return new THREE.MeshPhongMaterial({
        ...params,
        shininess: 100,
        specular: new THREE.Color(0x111111),
      });
      
    case 'physical':
      return new THREE.MeshStandardMaterial({
        ...params,
        roughness: 0.3,
        metalness: 0.7,
      });
      
    case 'toon':
      const toonMaterial = new THREE.MeshToonMaterial(params);
      return toonMaterial;
      
    default:
      return new THREE.MeshPhongMaterial(params);
  }
}
