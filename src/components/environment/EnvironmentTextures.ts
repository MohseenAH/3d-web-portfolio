import * as THREE from 'three';

/**
 * ============================================================================
 * Procedural Texture Generators
 * Creates high-performance procedural textures on off-screen HTML5 canvases.
 * ============================================================================
 */

export function createAtmosphericFogTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(234, 248, 255, 0.55)');
    gradient.addColorStop(0.5, 'rgba(185, 229, 245, 0.22)');
    gradient.addColorStop(1, 'rgba(101, 185, 235, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createSoftLightRayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 128, 0);
    grad.addColorStop(0, 'rgba(234, 248, 255, 0.0)');
    grad.addColorStop(0.5, 'rgba(234, 248, 255, 0.28)');
    grad.addColorStop(1, 'rgba(234, 248, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 512);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
