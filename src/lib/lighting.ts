import * as THREE from 'three';

// Lighting options
export const lightingOptions = {
  ambientLight: {
    defaultColor: '#404040',
    defaultIntensity: 0.5,
  },
  diffuseLight: {
    defaultColor: '#ffffff',
    defaultIntensity: 0.5,
    defaultPosition: [1, 1, 1] as [number, number, number],
  },
  specularLight: {
    defaultColor: '#ffffff',
    defaultIntensity: 0.3,
    defaultPosition: [-1, -1, -1] as [number, number, number],
  },
};

// Custom light sources
export const additionalLightOptions = [
  {
    id: 'purple',
    name: 'Purple',
    color: '#9b87f5',
    defaultIntensity: 0.6,
    defaultPosition: [3, 2, 1] as [number, number, number],
  },
  {
    id: 'orange',
    name: 'Orange',
    color: '#F97316',
    defaultIntensity: 0.5,
    defaultPosition: [-2, 3, 2] as [number, number, number],
  },
  {
    id: 'blue',
    name: 'Blue',
    color: '#0EA5E9',
    defaultIntensity: 0.4,
    defaultPosition: [0, -3, 2] as [number, number, number],
  },
  {
    id: 'green',
    name: 'Green',
    color: '#10B981',
    defaultIntensity: 0.4,
    defaultPosition: [2, -1, -3] as [number, number, number],
  },
];

// Update rendering options to reorder and remove toon shading
export const renderingOptions = [
  {
    id: 'flat',
    name: 'Flat Shading',
    description: 'Renders each polygon with a single color, creating a faceted look.',
  },
  {
    id: 'gouraud',
    name: 'Gouraud Shading',
    description: 'Calculates lighting at vertices only, showing mach bands at polygon edges.',
  },
  {
    id: 'phong',
    name: 'Phong Shading',
    description: 'Smooth shading with highlights, calculates lighting per pixel.',
  },
  {
    id: 'fastphong',
    name: 'Fast Phong',
    description: 'Simplified Phong shading for better performance with similar visual quality.',
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    description: 'Displays only the edges of each polygon.',
  },
];

// Lighting presets
export const lightingPresets = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard lighting setup with ambient, diffuse, and specular lights.',
    ambientColor: '#404040',
    diffuseColor: '#ffffff',
    specularColor: '#ffffff',
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Subtle lighting with a focus on ambient and diffuse illumination.',
    ambientColor: '#505050',
    diffuseColor: '#a0a0a0',
    specularColor: '#303030',
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bright and colorful lighting to enhance the shape\'s details.',
    ambientColor: '#606060',
    diffuseColor: '#f0f0f0',
    specularColor: '#707070',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Dim lighting to create a moody and dramatic effect.',
    ambientColor: '#202020',
    diffuseColor: '#404040',
    specularColor: '#101010',
  },
  {
    id: 'interference',
    name: 'Interference',
    description: 'Multiple light sources creating interesting interference patterns.',
    ambientColor: '#303030',
    diffuseColor: '#e0e0e0',
    specularColor: '#ffffff',
  },
];

// Custom light definitions - set all default colors to white
export const customLights = [
  {
    id: 'custom1',
    name: 'Custom Light 1',
    defaultColor: '#ffffff', // Changed to white
    defaultIntensity: 0.6,
    defaultPosition: [3, 2, 1] as [number, number, number],
  },
  {
    id: 'custom2',
    name: 'Custom Light 2',
    defaultColor: '#ffffff', // Changed to white
    defaultIntensity: 0.5,
    defaultPosition: [-2, 3, 2] as [number, number, number],
  },
  {
    id: 'custom3',
    name: 'Custom Light 3',
    defaultColor: '#ffffff', // Changed to white
    defaultIntensity: 0.4,
    defaultPosition: [0, -3, 2] as [number, number, number],
  },
];

// Background options
export const backgroundOptions = [
  { id: 'white', name: 'White', color: '#ffffff' },
  { id: 'gray', name: 'Gray', color: '#808080' },
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'space', name: 'Space', color: '#000000' },
];

// Enhanced createMaterial function to support textures and control shading parameters
export const createMaterial = (
  type: string, 
  color: string, 
  textureUrl: string | null = null,
  shininess: number = 30
): THREE.Material => {
  const colorObject = new THREE.Color(color);
  
  if (type === 'wireframe') {
    return new THREE.MeshBasicMaterial({ 
      color: colorObject, 
      wireframe: true 
    });
  }
  
  const hasTexture = textureUrl && textureUrl !== 'none';
  let material: THREE.Material;
  
  switch (type) {
    case 'flat':
      material = new THREE.MeshPhongMaterial({ 
        color: colorObject,
        flatShading: true,
        shininess: shininess
      });
      break;
      
    case 'phong':
      // Pure Phong with smooth shading and higher shininess for contrast with Gouraud
      material = new THREE.MeshPhongMaterial({ 
        color: colorObject,
        flatShading: false,
        shininess: shininess * 2, // Higher shininess for more defined highlights
        specular: new THREE.Color(0x444444) // More visible specular component
      });
      break;
      
    case 'fastphong':
      // Fast phong is a simplified version with lower quality but better performance
      material = new THREE.MeshPhongMaterial({ 
        color: colorObject,
        shininess: shininess / 2,
        specular: new THREE.Color(0x111111)
      });
      break;
      
    case 'gouraud':
      // For Gouraud shading, enhance mach bands by using more contrasting lighting
      material = new THREE.MeshLambertMaterial({ 
        color: colorObject,
        // Increase contrast to make mach bands more visible
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.2,
        reflectivity: 1.0
      });
      break;
      
    default:
      material = new THREE.MeshStandardMaterial({ 
        color: colorObject
      });
  }
  
  // Apply texture if provided
  if (hasTexture && (material as any).map !== undefined) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureUrl, (texture) => {
      (material as THREE.MeshStandardMaterial).map = texture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      material.needsUpdate = true;
    });
  }
  
  return material;
};
