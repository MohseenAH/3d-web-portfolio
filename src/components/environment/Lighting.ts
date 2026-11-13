import * as THREE from 'three';

export interface SceneLighting {
  ambientLight: THREE.AmbientLight;
  skyHemiLight: THREE.HemisphereLight;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  cursorSpotlight: THREE.PointLight;
  addToScene: (scene: THREE.Scene) => void;
  updateCursorLight: (mouseX: number, mouseY: number) => void;
  dispose: () => void;
}

/**
 * ============================================================================
 * Cinematic Atmospheric Lighting Setup
 * Sets up 4-point atmospheric key/fill/rim/hemi lighting + interactive mouse spotlight.
 * ============================================================================
 */
export function createSceneLighting(): SceneLighting {
  const ambientLight = new THREE.AmbientLight(0xeaf8ff, 2.4);

  const skyHemiLight = new THREE.HemisphereLight(0xeaf8ff, 0x65b9eb, 1.8);
  skyHemiLight.position.set(0, 15, 0);

  const keyLight = new THREE.DirectionalLight(0xeaf8ff, 3.5);
  keyLight.position.set(-6, 8, 6);

  const rimLight = new THREE.DirectionalLight(0xb9e5f5, 2.5);
  rimLight.position.set(7, -3, -4);

  // Dynamic interactive spotlight following cursor in 3D world space
  const cursorSpotlight = new THREE.PointLight(0xeaf8ff, 3.2, 14);
  cursorSpotlight.position.set(0, 0, 4);

  const addToScene = (scene: THREE.Scene) => {
    scene.add(ambientLight);
    scene.add(skyHemiLight);
    scene.add(keyLight);
    scene.add(rimLight);
    scene.add(cursorSpotlight);
  };

  const updateCursorLight = (mouseX: number, mouseY: number) => {
    cursorSpotlight.position.x = mouseX * 5.5;
    cursorSpotlight.position.y = mouseY * 4.0;
  };

  const dispose = () => {
    ambientLight.dispose();
    skyHemiLight.dispose();
    keyLight.dispose();
    rimLight.dispose();
    cursorSpotlight.dispose();
  };

  return {
    ambientLight,
    skyHemiLight,
    keyLight,
    rimLight,
    cursorSpotlight,
    addToScene,
    updateCursorLight,
    dispose,
  };
}
