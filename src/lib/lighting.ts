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
    defaultPosition: [1, 1, 1],
  },
  specularLight: {
    defaultColor: '#ffffff',
    defaultIntensity: 0.3,
    defaultPosition: [-1, -1, -1],
  },
};

// Update rendering options to include Gouraud shading with visible mach bands
export const renderingOptions = [
  {
    id: 'flat',
    name: 'Flat Shading',
    description: 'Renders each polygon with a single color, creating a faceted look.',
  },
  {
    id: 'phong',
    name: 'Phong Shading',
    description: 'Smooth shading with highlights, calculates lighting per pixel.',
  },
  {
    id: 'gouraud',
    name: 'Gouraud Shading',
    description: 'Calculates lighting at vertices only, showing mach bands at polygon edges.',
  },
  {
    id: 'toon',
    name: 'Toon Shading',
    description: 'Cartoon-like rendering with stepped shading.',
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
      material = new THREE.MeshPhongMaterial({ 
        color: colorObject,
        shininess: shininess
      });
      break;
      
    case 'gouraud':
      // For Gouraud shading, we use LambertMaterial with specific parameters
      // to make mach bands more visible
      material = new THREE.MeshLambertMaterial({ 
        color: colorObject,
        // Lambert material doesn't use shininess, but we create high contrast
        // by using a material that computes lighting at vertices only
      });
      break;
      
    case 'toon':
      material = new THREE.MeshToonMaterial({ 
        color: colorObject,
        gradientMap: null
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
