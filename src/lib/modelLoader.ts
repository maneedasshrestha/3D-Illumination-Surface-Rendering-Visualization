
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

export type ModelFormat = 'obj' | 'gltf' | 'glb' | 'stl';

export function getModelFormat(filename: string): ModelFormat | null {
  const extension = filename.split('.').pop()?.toLowerCase();
  if (extension === 'obj') return 'obj';
  if (extension === 'gltf') return 'gltf';
  if (extension === 'glb') return 'glb';
  if (extension === 'stl') return 'stl';
  return null;
}

export function loadModel(file: File): Promise<THREE.Object3D> {
  return new Promise((resolve, reject) => {
    const format = getModelFormat(file.name);
    if (!format) {
      reject(new Error('Unsupported file format'));
      return;
    }

    const fileURL = URL.createObjectURL(file);
    
    if (format === 'obj') {
      const loader = new OBJLoader();
      loader.load(
        fileURL,
        (object) => {
          URL.revokeObjectURL(fileURL);
          console.log('OBJ model loaded successfully', object);
          resolve(object);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          URL.revokeObjectURL(fileURL);
          console.error('Error loading OBJ model:', error);
          reject(error);
        }
      );
    } else if (format === 'gltf' || format === 'glb') {
      const loader = new GLTFLoader();
      loader.load(
        fileURL,
        (gltf) => {
          URL.revokeObjectURL(fileURL);
          console.log('GLTF/GLB model loaded successfully', gltf.scene);
          resolve(gltf.scene);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          URL.revokeObjectURL(fileURL);
          console.error('Error loading GLTF/GLB model:', error);
          reject(error);
        }
      );
    } else if (format === 'stl') {
      const loader = new STLLoader();
      loader.load(
        fileURL,
        (geometry) => {
          URL.revokeObjectURL(fileURL);
          console.log('STL geometry loaded successfully');
          const material = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });
          const mesh = new THREE.Mesh(geometry, material);
          resolve(mesh);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          URL.revokeObjectURL(fileURL);
          console.error('Error loading STL model:', error);
          reject(error);
        }
      );
    }
  });
}

// Function to load a texture from a file
export function loadTexture(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Unsupported file format. Please upload an image file.'));
      return;
    }
    
    try {
      const fileURL = URL.createObjectURL(file);
      resolve(fileURL);
    } catch (error) {
      reject(new Error('Error creating URL for texture image'));
    }
  });
}
