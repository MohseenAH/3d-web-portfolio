import * as THREE from 'three';
import { animationConfig } from '../../config/animationConfig';

export interface CompanionShardInstance {
  mesh: THREE.Mesh;
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
}

export interface CrystalSystem {
  crystalGroup: THREE.Group;
  primaryCrystalMesh: THREE.Mesh;
  innerPrismMesh: THREE.Mesh;
  crystalEdges: THREE.LineSegments;
  companionShards: CompanionShardInstance[];
  stardustParticles: THREE.Points;
  addToScene: (scene: THREE.Scene) => void;
  dispose: () => void;
}

/**
 * ============================================================================
 * Primary Asymmetrical Optical Glass Crystal & Stardust System
 * Constructs sculpted crystal, inner reflective core, edges, shards & stardust.
 * ============================================================================
 */
export function createCrystalSystem(isMobile: boolean): CrystalSystem {
  const crystalGroup = new THREE.Group();
  const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

  const { crystal: cCfg, companionShards: shardCfgs, stardust: sCfg } = animationConfig;

  // 1. Primary sculpted octahedron geometry
  const rawCrystalGeo = new THREE.OctahedronGeometry(cCfg.baseRadius, cCfg.detail);
  const posAttr = rawCrystalGeo.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    // Apply aspect ratio compression / elongation
    vertex.y *= cCfg.aspectRatio.y;
    vertex.z *= cCfg.aspectRatio.z;
    vertex.x *= cCfg.aspectRatio.x;

    // Harmonic asymmetry waves
    const asymX = Math.sin(vertex.y * cCfg.asymmetryWaves.x.freqY + vertex.z * cCfg.asymmetryWaves.x.freqZ) * cCfg.asymmetryWaves.x.amp;
    const asymY = Math.cos(vertex.x * cCfg.asymmetryWaves.y.freqX) * cCfg.asymmetryWaves.y.amp;
    const asymZ = Math.sin(vertex.x * cCfg.asymmetryWaves.z.freqX - vertex.y * cCfg.asymmetryWaves.z.freqY) * cCfg.asymmetryWaves.z.amp;

    vertex.x += asymX;
    vertex.y += asymY;
    vertex.z += asymZ;

    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  const sculptedCrystalGeo = rawCrystalGeo.toNonIndexed();
  sculptedCrystalGeo.computeVertexNormals();
  rawCrystalGeo.dispose();
  disposables.push(sculptedCrystalGeo);

  // 2. Optical Glass MeshPhysicalMaterial
  const crystalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xeaf8ff,
    emissive: 0xb9e5f5,
    emissiveIntensity: 0.2,
    metalness: 0.06,
    roughness: 0.04,
    transmission: isMobile ? 0.84 : 0.93,
    ior: 1.48,
    thickness: 1.85,
    attenuationColor: new THREE.Color(0x65b9eb),
    attenuationDistance: 2.4,
    reflectivity: 0.96,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    specularIntensity: 1.0,
    specularColor: new THREE.Color(0x6d9ebf),
    transparent: true,
    opacity: 0.95,
    flatShading: true,
  });
  disposables.push(crystalMaterial);

  const primaryCrystalMesh = new THREE.Mesh(sculptedCrystalGeo, crystalMaterial);
  crystalGroup.add(primaryCrystalMesh);

  // 3. Internal Reflective Core Prism
  const innerPrismGeo = sculptedCrystalGeo.clone();
  innerPrismGeo.scale(0.52, 0.58, 0.52);
  disposables.push(innerPrismGeo);

  const innerPrismMat = new THREE.MeshPhysicalMaterial({
    color: 0xb9e5f5,
    emissive: 0x65b9eb,
    emissiveIntensity: 0.28,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.45,
    flatShading: true,
  });
  disposables.push(innerPrismMat);

  const innerPrismMesh = new THREE.Mesh(innerPrismGeo, innerPrismMat);
  innerPrismMesh.rotation.y = Math.PI / 3;
  crystalGroup.add(innerPrismMesh);

  // 4. Sharp Facet Outline Edges
  const crystalEdgesGeo = new THREE.EdgesGeometry(sculptedCrystalGeo, 16);
  disposables.push(crystalEdgesGeo);

  const crystalEdgesMat = new THREE.LineBasicMaterial({
    color: 0x6d9ebf,
    transparent: true,
    opacity: 0.6,
  });
  disposables.push(crystalEdgesMat);

  const crystalEdges = new THREE.LineSegments(crystalEdgesGeo, crystalEdgesMat);
  crystalGroup.add(crystalEdges);

  // 5. Ambient 3D Stardust Particle Field
  const particleCount = isMobile ? sCfg.countMobile : sCfg.countDesktop;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * sCfg.spread.x;
    particlePos[i * 3 + 1] = (Math.random() - 0.5) * sCfg.spread.y;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * sCfg.spread.z - 2;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  disposables.push(particleGeo);

  const particleMat = new THREE.PointsMaterial({
    color: 0xeaf8ff,
    size: sCfg.particleSize,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
  });
  disposables.push(particleMat);

  const stardustParticles = new THREE.Points(particleGeo, particleMat);

  // 6. Secondary Floating Companion Shards
  const companionShards: CompanionShardInstance[] = [];
  const baseShardGeo = new THREE.OctahedronGeometry(1, 0);
  disposables.push(baseShardGeo);

  shardCfgs.forEach((cfg) => {
    const mesh = new THREE.Mesh(baseShardGeo, crystalMaterial);
    mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    mesh.scale.set(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
    mesh.rotation.set(cfg.phase, cfg.phase * 0.5, 0.2);
    companionShards.push({
      mesh,
      baseX: cfg.pos[0],
      baseY: cfg.pos[1],
      baseZ: cfg.pos[2],
      phase: cfg.phase,
    });
  });

  const addToScene = (scene: THREE.Scene) => {
    scene.add(crystalGroup);
    scene.add(stardustParticles);
    companionShards.forEach((s) => scene.add(s.mesh));
  };

  const dispose = () => {
    disposables.forEach((item) => {
      if ('dispose' in item && typeof item.dispose === 'function') {
        item.dispose();
      }
    });
  };

  return {
    crystalGroup,
    primaryCrystalMesh,
    innerPrismMesh,
    crystalEdges,
    companionShards,
    stardustParticles,
    addToScene,
    dispose,
  };
}
