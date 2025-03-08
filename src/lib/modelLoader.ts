
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

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
          resolve(object);
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(fileURL);
          reject(error);
        }
      );
    } else if (format === 'gltf' || format === 'glb') {
      const loader = new GLTFLoader();
      loader.load(
        fileURL,
        (gltf) => {
          URL.revokeObjectURL(fileURL);
          resolve(gltf.scene);
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(fileURL);
          reject(error);
        }
      );
    } else if (format === 'stl') {
      const loader = new STLLoader();
      loader.load(
        fileURL,
        (geometry) => {
          URL.revokeObjectURL(fileURL);
          const material = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });
          const mesh = new THREE.Mesh(geometry, material);
          resolve(mesh);
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(fileURL);
          reject(error);
        }
      );
    }
  });
}
