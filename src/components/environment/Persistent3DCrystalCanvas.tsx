import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PALETTE } from '../../config/theme';
import { animationConfig } from '../../config/animationConfig';
import { createSceneLighting } from './Lighting';
import { createCrystalSystem } from './Crystal';
import { createFogSystem } from './Fog';

interface Persistent3DCrystalCanvasProps {
  reducedMotion: boolean;
  ctaHovered: boolean;
  scrollProgress: number;
  onReady?: () => void;
}

/**
 * ============================================================================
 * Persistent 3D Crystal & Atmospheric Azure Scene Canvas
 * High-performance WebGL canvas mounted behind all sections.
 * ============================================================================
 */
export const Persistent3DCrystalCanvas: React.FC<Persistent3DCrystalCanvasProps> = ({
  reducedMotion,
  ctaHovered,
  scrollProgress,
  onReady,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const liveRef = useRef({
    reducedMotion: false,
    ctaHovered: false,
    mouseX: 0,
    mouseY: 0,
    scrollProgress: 0,
    lastScrollY: 0,
    scrollVelocity: 0,
  });

  useEffect(() => {
    liveRef.current.reducedMotion = reducedMotion;
    liveRef.current.ctaHovered = ctaHovered;
    liveRef.current.scrollProgress = scrollProgress;
  }, [reducedMotion, ctaHovered, scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        if (onReady) onReady();
        return;
      }

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      if (onReady) onReady();
      return;
    }

    const isMobile = window.innerWidth < 768;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Camera setup
    const { camera: camCfg, crystal: cCfg, scrollKeyframes: kf } = animationConfig;
    const camera = new THREE.PerspectiveCamera(
      camCfg.fov,
      container.clientWidth / container.clientHeight,
      camCfg.near,
      camCfg.far
    );
    camera.position.set(0, 0, camCfg.initialZ);

    // Modular Systems
    const lighting = createSceneLighting();
    lighting.addToScene(scene);

    const crystal = createCrystalSystem(isMobile);
    crystal.addToScene(scene);

    const fog = createFogSystem(isMobile);
    fog.addToScene(scene);

    // Event listeners
    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      liveRef.current.mouseX = nx;
      liveRef.current.mouseY = ny;
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - liveRef.current.lastScrollY;
      liveRef.current.scrollVelocity = delta;
      liveRef.current.lastScrollY = currentY;
    };

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    if (onReady) onReady();

    // Render & Animation Loop
    const clock = new THREE.Clock();
    let frameId: number;
    let kineticRotX = 0;
    let kineticRotZ = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const {
        reducedMotion: isReduced,
        ctaHovered: isHovered,
        mouseX,
        mouseY,
        scrollProgress: p,
        scrollVelocity,
      } = liveRef.current;

      const isDesktop = window.innerWidth >= 1024;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      // Update Cursor Dynamic 3D Spotlight
      lighting.updateCursorLight(mouseX, mouseY);

      // Kinetic scroll velocity inertia
      if (!isReduced) {
        kineticRotX += scrollVelocity * cCfg.kineticInertia.factorX;
        kineticRotZ += scrollVelocity * cCfg.kineticInertia.factorZ;
        kineticRotX *= cCfg.kineticInertia.friction;
        kineticRotZ *= cCfg.kineticInertia.friction;
        liveRef.current.scrollVelocity *= 0.9;
      }

      // Scroll Keyframe Interpolation
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      let targetScale = 1.0;
      let targetRotSpeed = cCfg.rotationSpeedBase;
      let targetFogDensity = fog.fogExp.density;

      if (p <= 0.33) {
        // Hero -> About
        const t = p / 0.33;
        const hX = isDesktop ? kf.hero.targetX.desktop : isTablet ? kf.hero.targetX.tablet : kf.hero.targetX.mobile;
        const hY = isDesktop ? kf.hero.targetY.desktop : isTablet ? kf.hero.targetY.tablet : kf.hero.targetY.mobile;
        const aX = isDesktop ? kf.about.targetX.desktop : isTablet ? kf.about.targetX.tablet : kf.about.targetX.mobile;
        const aY = isDesktop ? kf.about.targetY.desktop : isTablet ? kf.about.targetY.tablet : kf.about.targetY.mobile;

        targetX = THREE.MathUtils.lerp(hX, aX, t);
        targetY = THREE.MathUtils.lerp(hY, aY, t);
        targetZ = THREE.MathUtils.lerp(kf.hero.targetZ, kf.about.targetZ, t);
        targetScale = THREE.MathUtils.lerp(
          isDesktop ? kf.hero.targetScale.desktop : kf.hero.targetScale.mobile,
          isDesktop ? kf.about.targetScale.desktop : kf.about.targetScale.mobile,
          t
        );
        targetRotSpeed = THREE.MathUtils.lerp(kf.hero.targetRotSpeed, kf.about.targetRotSpeed, t);
        targetFogDensity = THREE.MathUtils.lerp(kf.hero.targetFogDensity, kf.about.targetFogDensity, t);
      } else if (p <= 0.66) {
        // About -> Creations
        const t = (p - 0.33) / 0.33;
        const aX = isDesktop ? kf.about.targetX.desktop : isTablet ? kf.about.targetX.tablet : kf.about.targetX.mobile;
        const aY = isDesktop ? kf.about.targetY.desktop : isTablet ? kf.about.targetY.tablet : kf.about.targetY.mobile;
        const cX = isDesktop ? kf.creations.targetX.desktop : isTablet ? kf.creations.targetX.tablet : kf.creations.targetX.mobile;
        const cY = isDesktop ? kf.creations.targetY.desktop : isTablet ? kf.creations.targetY.tablet : kf.creations.targetY.mobile;

        targetX = THREE.MathUtils.lerp(aX, cX, t);
        targetY = THREE.MathUtils.lerp(aY, cY, t);
        targetZ = THREE.MathUtils.lerp(kf.about.targetZ, kf.creations.targetZ, t);
        targetScale = THREE.MathUtils.lerp(
          isDesktop ? kf.about.targetScale.desktop : kf.about.targetScale.mobile,
          isDesktop ? kf.creations.targetScale.desktop : kf.creations.targetScale.mobile,
          t
        );
        targetRotSpeed = THREE.MathUtils.lerp(kf.about.targetRotSpeed, kf.creations.targetRotSpeed, t);
        targetFogDensity = THREE.MathUtils.lerp(kf.about.targetFogDensity, kf.creations.targetFogDensity, t);
      } else {
        // Creations -> Contact
        const t = (p - 0.66) / 0.34;
        const cX = isDesktop ? kf.creations.targetX.desktop : isTablet ? kf.creations.targetX.tablet : kf.creations.targetX.mobile;
        const cY = isDesktop ? kf.creations.targetY.desktop : isTablet ? kf.creations.targetY.tablet : kf.creations.targetY.mobile;
        const ctX = isDesktop ? kf.contact.targetX.desktop : isTablet ? kf.contact.targetX.tablet : kf.contact.targetX.mobile;
        const ctY = isDesktop ? kf.contact.targetY.desktop : isTablet ? kf.contact.targetY.tablet : kf.contact.targetY.mobile;

        targetX = THREE.MathUtils.lerp(cX, ctX, t);
        targetY = THREE.MathUtils.lerp(cY, ctY, t);
        targetZ = THREE.MathUtils.lerp(kf.creations.targetZ, kf.contact.targetZ, t);
        targetScale = THREE.MathUtils.lerp(
          isDesktop ? kf.creations.targetScale.desktop : kf.creations.targetScale.mobile,
          isDesktop ? kf.contact.targetScale.desktop : kf.contact.targetScale.mobile,
          t
        );
        targetRotSpeed = THREE.MathUtils.lerp(kf.creations.targetRotSpeed, kf.contact.targetRotSpeed, t);
        targetFogDensity = THREE.MathUtils.lerp(kf.creations.targetFogDensity, kf.contact.targetFogDensity, t);
      }

      // Smooth Position Lerp
      const floatVal = isReduced ? 0 : Math.sin(elapsed * cCfg.floating.frequency) * cCfg.floating.amplitude;
      crystal.crystalGroup.position.x = THREE.MathUtils.lerp(
        crystal.crystalGroup.position.x,
        targetX + (isReduced ? 0 : mouseX * cCfg.mouseReaction.posX),
        cCfg.lerpDamping
      );
      crystal.crystalGroup.position.y = THREE.MathUtils.lerp(
        crystal.crystalGroup.position.y,
        targetY + floatVal + (isReduced ? 0 : mouseY * cCfg.mouseReaction.posY),
        cCfg.lerpDamping
      );
      crystal.crystalGroup.position.z = THREE.MathUtils.lerp(
        crystal.crystalGroup.position.z,
        targetZ,
        cCfg.lerpDamping
      );

      // Smooth Rotation with Kinetic Inertia
      crystal.crystalGroup.rotation.y = THREE.MathUtils.lerp(
        crystal.crystalGroup.rotation.y,
        elapsed * targetRotSpeed + (isReduced ? 0.4 : mouseX * cCfg.mouseReaction.rotY),
        cCfg.lerpDamping
      );
      crystal.crystalGroup.rotation.x = THREE.MathUtils.lerp(
        crystal.crystalGroup.rotation.x,
        0.14 + kineticRotX + (isReduced ? 0 : Math.cos(elapsed * 0.4) * 0.04 - mouseY * cCfg.mouseReaction.rotX),
        cCfg.lerpDamping
      );
      crystal.crystalGroup.rotation.z += kineticRotZ;

      // Scale & CTA Hover Feedback
      const activeScale = isHovered ? targetScale * cCfg.ctaHoverScaleMultiplier : targetScale;
      const currentScale = THREE.MathUtils.lerp(crystal.crystalGroup.scale.x, activeScale, cCfg.lerpDamping);
      crystal.crystalGroup.scale.set(currentScale, currentScale, currentScale);

      // Fog Density Interpolation
      fog.setDensity(THREE.MathUtils.lerp(fog.fogExp.density, targetFogDensity, cCfg.lerpDamping));

      // Stardust Particle Slow Drift
      if (!isReduced) {
        crystal.stardustParticles.rotation.y = elapsed * animationConfig.stardust.driftSpeedY;
        crystal.stardustParticles.rotation.x = Math.sin(elapsed * animationConfig.stardust.driftSpeedX) * 0.05;
      }

      // Companion Shards
      crystal.companionShards.forEach((item) => {
        const yOff = isReduced ? 0 : Math.sin(elapsed * 0.6 + item.phase) * 0.08;
        item.mesh.position.y = item.baseY + yOff + targetY * 0.3;
        item.mesh.position.x = item.baseX + targetX * 0.2 + (isReduced ? 0 : mouseX * 0.06);
        if (!isReduced) item.mesh.rotation.y = item.phase + elapsed * 0.08;
      });

      // Fog Planes Drift
      fog.update(elapsed, isReduced);

      // Camera Dynamics
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, isReduced ? 0 : mouseX * camCfg.mouseParallaxX, camCfg.lerpDamping);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, isReduced ? 0 : mouseY * camCfg.mouseParallaxY, camCfg.lerpDamping);
      camera.lookAt(0.2, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      lighting.dispose();
      crystal.dispose();
      fog.dispose();
      renderer.dispose();
    };
  }, [onReady]);

  if (!webglSupported) {
    return (
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-64 h-80 rotate-12 rounded-3xl border backdrop-blur-xl"
          style={{
            background: `linear-gradient(135deg, ${PALETTE.cloudWhite} 0%, ${PALETTE.iceBlue} 50%, ${PALETTE.azure} 100%)`,
            borderColor: PALETTE.cloudWhite,
            boxShadow: '0 30px 90px rgba(20, 43, 67, 0.12)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
};
