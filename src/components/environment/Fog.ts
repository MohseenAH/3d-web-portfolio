import * as THREE from 'three';
import { animationConfig } from '../../config/animationConfig';
import { createAtmosphericFogTexture } from './EnvironmentTextures';

export interface FogPlaneInstance {
  mesh: THREE.Mesh;
  speed: number;
  baseY: number;
  phase: number;
}

export interface FogSystem {
  fogExp: THREE.FogExp2;
  fogPlanes: FogPlaneInstance[];
  fogTexture: THREE.CanvasTexture;
  addToScene: (scene: THREE.Scene) => void;
  update: (elapsed: number, isReduced: boolean) => void;
  setDensity: (density: number) => void;
  dispose: () => void;
}

/**
 * ============================================================================
 * Volumetric Azure Sky Fog & Drifting Atmospheric Planes
 * ============================================================================
 */
export function createFogSystem(isMobile: boolean): FogSystem {
  const { fog: fCfg } = animationConfig;
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  const fogExp = new THREE.FogExp2(0x91d4f2, fCfg.expDensityBase);
  const fogTexture = createAtmosphericFogTexture();
  disposables.push(fogTexture);

  const fogPlanes: FogPlaneInstance[] = [];
  const fogCount = isMobile ? fCfg.planeCountMobile : fCfg.planeCountDesktop;
  const fogGeo = new THREE.PlaneGeometry(fCfg.planeWidth, fCfg.planeHeight);
  disposables.push(fogGeo);

  for (let i = 0; i < fogCount; i++) {
    const mat = new THREE.MeshBasicMaterial({
      map: fogTexture,
      transparent: true,
      opacity: fCfg.planeBaseOpacity + (i % 3) * 0.06,
      depthWrite: false,
    });
    disposables.push(mat);

    const plane = new THREE.Mesh(fogGeo, mat);
    const startX = (i - fogCount / 2) * 3.2;
    const startY = -2.2 + (i % 4) * 1.3;
    const startZ = -4.2 - (i % 3) * 1.4;
    plane.position.set(startX, startY, startZ);

    fogPlanes.push({
      mesh: plane,
      speed: fCfg.planeBaseSpeed + (i % 3) * fCfg.planeSpeedVariance,
      baseY: startY,
      phase: i * 1.2,
    });
  }

  const addToScene = (scene: THREE.Scene) => {
    scene.fog = fogExp;
    fogPlanes.forEach((p) => scene.add(p.mesh));
  };

  const update = (elapsed: number, isReduced: boolean) => {
    if (isReduced) return;
    fogPlanes.forEach((fog) => {
      fog.mesh.position.x += fog.speed;
      if (fog.mesh.position.x > 11) fog.mesh.position.x = -11;
      fog.mesh.position.y = fog.baseY + Math.sin(elapsed * 0.25 + fog.phase) * 0.07;
    });
  };

  const setDensity = (density: number) => {
    fogExp.density = density;
  };

  const dispose = () => {
    disposables.forEach((item) => {
      if ('dispose' in item && typeof item.dispose === 'function') {
        item.dispose();
      }
    });
  };

  return {
    fogExp,
    fogPlanes,
    fogTexture,
    addToScene,
    update,
    setDensity,
    dispose,
  };
}
