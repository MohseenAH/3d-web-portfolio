import { AnimationConfig } from '../types';

/**
 * ============================================================================
 * ARCLUNOR — Centralized Animation & 3D Environment Configuration
 * Modify 3D crystal motion, camera dynamics, particles, fog, and section
 * entrance transitions here.
 * Micro-level AI modifications should be applied directly in this file.
 * ============================================================================
 */
export const animationConfig: AnimationConfig = {
  crystal: {
    // Base geometry size before non-uniform sculpting
    baseRadius: 1.18,
    detail: 1,

    // Non-uniform geometric proportions (Y elongated, X/Z compressed)
    aspectRatio: {
      x: 0.88,
      y: 1.62,
      z: 0.82,
    },

    // Harmonic asymmetry wave functions applied to vertex positions
    asymmetryWaves: {
      x: { freqY: 2.2, freqZ: 1.5, amp: 0.11 },
      y: { freqX: 2.4, amp: 0.12 },
      z: { freqX: 1.7, freqY: 1.1, amp: 0.08 },
    },

    // Vertical floating motion (sinusoidal levitation)
    floating: {
      frequency: 0.7, // Speed of vertical bobbing cycle
      amplitude: 0.1,  // Vertical bobbing travel distance (world units)
    },

    // Base continuous Y-axis rotation speed (radians/sec multiplier)
    rotationSpeedBase: 0.12,

    // Lerp damping factor for position & rotation transitions (0.01 = sluggish, 0.1 = snappy)
    lerpDamping: 0.04,

    // Inertial velocity reaction when user scrolls vigorously
    kineticInertia: {
      factorX: 0.0004,
      factorZ: 0.00025,
      friction: 0.92, // Multiplier per frame to decay momentum
    },

    // Interactive cursor reaction intensity
    mouseReaction: {
      posX: 0.14,
      posY: 0.1,
      rotX: 0.12,
      rotY: 0.2,
    },

    // Scale pulse multiplier when user hovers over the primary Hero CTA
    ctaHoverScaleMultiplier: 1.06,
  },

  // Secondary floating companion shards surrounding the primary crystal
  companionShards: [
    { pos: [-2.6, 1.25, -1.2], scale: [0.18, 0.32, 0.18], phase: 0.5 },
    { pos: [2.85, -1.1, -0.9], scale: [0.16, 0.26, 0.16], phase: 2.3 },
    { pos: [-1.95, -1.4, -1.6], scale: [0.13, 0.22, 0.13], phase: 4.1 },
  ],

  // Ambient floating stardust motes
  stardust: {
    countDesktop: 130,
    countMobile: 60,
    spread: { x: 14, y: 14, z: 10 },
    particleSize: 0.05,
    driftSpeedY: 0.02,
    driftSpeedX: 0.015,
  },

  // Volumetric exponential fog and drifting atmospheric planes
  fog: {
    expDensityBase: 0.038,
    planeCountDesktop: 7,
    planeCountMobile: 4,
    planeWidth: 9,
    planeHeight: 5,
    planeBaseSpeed: 0.0016,
    planeSpeedVariance: 0.0007,
    planeBaseOpacity: 0.2,
  },

  // 3D Perspective camera configuration
  camera: {
    fov: 35,
    near: 0.1,
    far: 100,
    initialZ: 8.5,
    mouseParallaxX: 0.18,
    mouseParallaxY: 0.1,
    lerpDamping: 0.03,
  },

  // Keyframe targets by scroll progress (0.0 = Hero, 0.33 = About, 0.66 = Creations, 1.0 = Contact)
  scrollKeyframes: {
    hero: {
      targetX: { desktop: 2.35, tablet: 1.4, mobile: 0 },
      targetY: { desktop: 0.05, tablet: 0.4, mobile: 1.25 },
      targetZ: 0,
      targetScale: { desktop: 0.92, mobile: 0.65 },
      targetRotSpeed: 0.12,
      targetFogDensity: 0.038,
    },
    about: {
      targetX: { desktop: -2.2, tablet: -1.2, mobile: -0.7 },
      targetY: { desktop: 0.6, tablet: 0.9, mobile: 1.35 },
      targetZ: -1.6,
      targetScale: { desktop: 0.72, mobile: 0.48 },
      targetRotSpeed: 0.08,
      targetFogDensity: 0.03,
    },
    creations: {
      targetX: { desktop: 2.1, tablet: 1.3, mobile: 0.8 },
      targetY: { desktop: -0.4, tablet: -0.3, mobile: -0.2 },
      targetZ: -2.8,
      targetScale: { desktop: 0.54, mobile: 0.38 },
      targetRotSpeed: 0.16,
      targetFogDensity: 0.024,
    },
    contact: {
      targetX: { desktop: 0, tablet: 0, mobile: 0 },
      targetY: { desktop: 0.7, tablet: 0.9, mobile: 1.2 },
      targetZ: -3.6,
      targetScale: { desktop: 0.42, mobile: 0.32 },
      targetRotSpeed: 0.05,
      targetFogDensity: 0.018,
    },
  },

  // Individual section entrance choreography timings & parameters
  sectionTransitions: {
    hero: {
      letterStaggerMs: 60,
      baseDelayMs: 120,
      headlineDelayMs: 500,
      ctaDelayMs: 700,
    },
    about: {
      headerSlideDistancePx: 28,
      pillarStaggerMs: 160,
      durationMs: 900,
    },
    creations: {
      cardStaggerMs: 180,
      initialScale: 0.93,
      durationMs: 800,
    },
    contact: {
      cardDelayMs: 200,
      socialsDelayMs: 400,
      durationMs: 1000,
    },
  },
};
