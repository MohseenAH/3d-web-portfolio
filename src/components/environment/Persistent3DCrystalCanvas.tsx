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
 * Features frame-rate independent delta-time interpolation, exponential smoothing,
 * organic orientation drift, and decoupled scroll/pointer physics.
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

  // High-frequency live state ref to completely avoid React re-render thrashing
  // and prevent stale closures inside the requestAnimationFrame loop
  const liveRef = useRef({
    reducedMotion: false,
    ctaHovered: false,
    scrollProgress: 0,
    rawMouseX: 0,
    rawMouseY: 0,
    scrollVelocity: 0,
    lastScrollY: 0,
  });

  // Keep liveRef strictly in sync with incoming React props
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

    // Optimized DPR limit: Capped at 1.75 on desktop and 1.25 on mobile
    // Eliminates fragment shading bottlenecks on 4K/Retina displays while preserving razor-sharp crystal glass facets
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
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

    // Passive pointer and scroll event listeners
    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      liveRef.current.rawMouseX = nx;
      liveRef.current.rawMouseY = ny;
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

    // Initial scroll measurement
    handleScroll();

    if (onReady) onReady();

    // =========================================================================
    // RENDER & DELTA-TIME ANIMATION LOOP
    // =========================================================================
    const clock = new THREE.Clock();
    let frameId: number;

    // Smooth state accumulators (frame-rate independent)
    let accumulatedRotY = 0;
    let currentRotSpeed = cCfg.rotationSpeedBase;
    let smoothScrollProgress = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let kineticTiltX = 0;
    let kineticTiltZ = 0;
    let kineticTargetX = 0;
    let kineticTargetZ = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Delta time capped at 0.08s to avoid giant leaps when tab restores from background
      const delta = Math.min(clock.getDelta(), 0.08);
      const elapsed = clock.getElapsedTime();

      // Read mutable liveRef values directly inside the RAF loop (avoids stale closures)
      const {
        reducedMotion: isReduced,
        ctaHovered: isHovered,
        scrollProgress: targetScrollProgress,
        rawMouseX,
        rawMouseY,
        scrollVelocity,
      } = liveRef.current;

      const isDesktop = window.innerWidth >= 1024;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      // 1. Exponential smoothing of mouse pointer input (eliminates hand jitter)
      const mouseDampFactor = isReduced ? 1.0 : 4.0;
      smoothMouseX = THREE.MathUtils.damp(smoothMouseX, isReduced ? 0 : rawMouseX, mouseDampFactor, delta);
      smoothMouseY = THREE.MathUtils.damp(smoothMouseY, isReduced ? 0 : rawMouseY, mouseDampFactor, delta);

      // Update Cursor Dynamic 3D Spotlight with smoothed coordinates
      lighting.updateCursorLight(smoothMouseX, smoothMouseY);

      // 2. Exponential smoothing of scroll progress across keyframes
      smoothScrollProgress = THREE.MathUtils.damp(
        smoothScrollProgress,
        targetScrollProgress,
        isReduced ? 8.0 : 4.5,
        delta
      );

      // 3. Kinetic scroll torque with exponential spring decay to neutral
      if (!isReduced) {
        kineticTargetX += scrollVelocity * cCfg.kineticInertia.factorX;
        kineticTargetZ += scrollVelocity * cCfg.kineticInertia.factorZ;
        liveRef.current.scrollVelocity *= 0.9;
      }
      kineticTargetX = THREE.MathUtils.damp(kineticTargetX, 0, 4.0, delta);
      kineticTargetZ = THREE.MathUtils.damp(kineticTargetZ, 0, 4.0, delta);
      kineticTiltX = THREE.MathUtils.damp(kineticTiltX, kineticTargetX, 6.0, delta);
      kineticTiltZ = THREE.MathUtils.damp(kineticTiltZ, kineticTargetZ, 6.0, delta);

      // 4. Scroll Keyframe Interpolation with Hermite C1 (smoothstep) curves
      // 0.0 = Hero, 0.33 = About, 0.66 = Creations, 1.0 = Contact
      const p = smoothScrollProgress;
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      let targetScale = 1.0;
      let targetRotSpeed = cCfg.rotationSpeedBase;
      let targetFogDensity = fog.fogExp.density;

      if (p <= 0.33) {
        // Hero -> About (normalized t in [0, 1])
        const t = THREE.MathUtils.smoothstep(p / 0.33, 0, 1);
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
        const t = THREE.MathUtils.smoothstep((p - 0.33) / 0.33, 0, 1);
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
        const t = THREE.MathUtils.smoothstep((p - 0.66) / 0.34, 0, 1);
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

      // 5. Continuous, Incremental Rotation Accumulator (ZERO jumps, reversals, or resets)
      currentRotSpeed = THREE.MathUtils.damp(currentRotSpeed, targetRotSpeed, 2.5, delta);
      accumulatedRotY += (isReduced ? 0 : currentRotSpeed) * delta;

      // Organic multi-harmonic gentle orientation drift (prevents mechanical rigid spinning)
      const organicTiltX = isReduced ? 0 : Math.sin(elapsed * 0.42) * 0.045 + Math.cos(elapsed * 0.22) * 0.02;
      const organicTiltZ = isReduced ? 0 : Math.cos(elapsed * 0.35) * 0.035 + Math.sin(elapsed * 0.18) * 0.015;

      // 6. Exponential Damping Position Update
      const floatVal = isReduced ? 0 : Math.sin(elapsed * cCfg.floating.frequency) * cCfg.floating.amplitude;
      const destX = targetX + (isReduced ? 0 : smoothMouseX * cCfg.mouseReaction.posX);
      const destY = targetY + floatVal + (isReduced ? 0 : smoothMouseY * cCfg.mouseReaction.posY);
      const destZ = targetZ;

      crystal.crystalGroup.position.x = THREE.MathUtils.damp(crystal.crystalGroup.position.x, destX, 5.0, delta);
      crystal.crystalGroup.position.y = THREE.MathUtils.damp(crystal.crystalGroup.position.y, destY, 5.0, delta);
      crystal.crystalGroup.position.z = THREE.MathUtils.damp(crystal.crystalGroup.position.z, destZ, 5.0, delta);

      // 7. Rotation Update
      const targetEulerY = accumulatedRotY + (isReduced ? 0.4 : smoothMouseX * cCfg.mouseReaction.rotY);
      const targetEulerX = 0.14 + organicTiltX + kineticTiltX - (isReduced ? 0 : smoothMouseY * cCfg.mouseReaction.rotX);
      const targetEulerZ = organicTiltZ + kineticTiltZ;

      crystal.crystalGroup.rotation.y = THREE.MathUtils.damp(crystal.crystalGroup.rotation.y, targetEulerY, 6.0, delta);
      crystal.crystalGroup.rotation.x = THREE.MathUtils.damp(crystal.crystalGroup.rotation.x, targetEulerX, 5.0, delta);
      crystal.crystalGroup.rotation.z = THREE.MathUtils.damp(crystal.crystalGroup.rotation.z, targetEulerZ, 5.0, delta);

      // 8. Scale & CTA Hover Feedback with Exponential Smoothing
      const activeScale = isHovered ? targetScale * cCfg.ctaHoverScaleMultiplier : targetScale;
      const currentScale = THREE.MathUtils.damp(crystal.crystalGroup.scale.x, activeScale, 5.0, delta);
      crystal.crystalGroup.scale.set(currentScale, currentScale, currentScale);

      // 9. Fog Density Interpolation
      fog.setDensity(THREE.MathUtils.damp(fog.fogExp.density, targetFogDensity, 4.0, delta));

      // 10. Ambient Stardust Particle Subtle Rotation
      if (!isReduced) {
        crystal.stardustParticles.rotation.y += delta * animationConfig.stardust.driftSpeedY;
        crystal.stardustParticles.rotation.x = Math.sin(elapsed * animationConfig.stardust.driftSpeedX) * 0.05;
      }

      // 11. Floating Companion Shards Dynamics
      crystal.companionShards.forEach((item) => {
        const yOff = isReduced ? 0 : Math.sin(elapsed * 0.6 + item.phase) * 0.08;
        const targetShardY = item.baseY + yOff + targetY * 0.3;
        const targetShardX = item.baseX + targetX * 0.2 + (isReduced ? 0 : smoothMouseX * 0.06);

        item.mesh.position.y = THREE.MathUtils.damp(item.mesh.position.y, targetShardY, 4.0, delta);
        item.mesh.position.x = THREE.MathUtils.damp(item.mesh.position.x, targetShardX, 4.0, delta);
        if (!isReduced) item.mesh.rotation.y += delta * 0.08;
      });

      // 12. Atmospheric Fog Planes Update
      fog.update(elapsed, isReduced);

      // 13. Camera Dynamic Parallax
      const camTargetX = isReduced ? 0 : smoothMouseX * camCfg.mouseParallaxX;
      const camTargetY = isReduced ? 0 : smoothMouseY * camCfg.mouseParallaxY;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, camTargetX, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, camTargetY, 3.5, delta);
      camera.lookAt(0.2, 0, 0);

      // 14. Render
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
