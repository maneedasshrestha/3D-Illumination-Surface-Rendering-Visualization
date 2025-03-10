
import * as THREE from 'three';

// Default texture options
export const defaultTextureOptions = [
  { id: 'none', name: 'No Texture' },
  { id: 'checkerboard', name: 'Checkerboard Pattern' },
  { id: 'brick', name: 'Brick Wall' },
  { id: 'wood', name: 'Wood Grain' },
  { id: 'metal', name: 'Metal Surface' },
];

// Texture loader utility
export const textureLoader = new THREE.TextureLoader();

// Cache for loaded textures to avoid multiple loads
const textureCache = new Map<string, THREE.Texture>();

// Load a texture from a URL
export const loadTexture = (url: string): Promise<THREE.Texture> => {
  if (textureCache.has(url)) {
    return Promise.resolve(textureCache.get(url)!);
  }

  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        textureCache.set(url, texture);
        resolve(texture);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
        reject(error);
      }
    );
  });
};

// Get builtin texture URL
export const getBuiltinTextureUrl = (textureId: string): string => {
  switch (textureId) {
    case 'checkerboard':
      return '/textures/checkerboard.png';
    case 'brick':
      return '/textures/brick.jpg';
    case 'wood':
      return '/textures/wood.jpg';
    case 'metal':
      return '/textures/metal.jpg';
    default:
      return '';
  }
};

// Create file blob URL for custom uploaded textures
export const createTextureFromFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(URL.createObjectURL(file));
      }
    };
    reader.readAsDataURL(file);
  });
};
