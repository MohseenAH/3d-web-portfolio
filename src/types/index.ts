/**
 * ============================================================================
 * ARCLUNOR — Core TypeScript Definitions
 * Centralized contracts for site content, 3D scene parameters, themes, and animations.
 * ============================================================================
 */

export interface Palette {
  azure: string;
  skyBlue: string;
  iceBlue: string;
  cloudWhite: string;
  blueGrey: string;
  deepNavy: string;
}

export interface NavigationItem {
  id: string;
  label: string;
}

export interface PillarItem {
  icon: 'Cpu' | 'Sparkles' | 'Eye' | string;
  title: string;
  desc: string;
}

export interface CreationItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  details: string;
  tags: string[];
  accentColor: string;
}

export interface SocialLink {
  platform: string;
  handle: string;
  url: string;
}

export interface BrandContent {
  name: string;
}

export interface HeroContent {
  title: string;
  headline: string;
  subtitle: string;
  categories: string;
  primaryCta: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  lead: string;
  pillars: PillarItem[];
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  email: string;
  socials: SocialLink[];
}

export interface SiteContent {
  brand: BrandContent;
  navigation: NavigationItem[];
  hero: HeroContent;
  about: AboutContent;
  creations: CreationItem[];
  contact: ContactContent;
}

export interface ShardConfig {
  pos: [number, number, number];
  scale: [number, number, number];
  phase: number;
}

export interface SectionKeyframe {
  targetX: { desktop: number; tablet: number; mobile: number };
  targetY: { desktop: number; tablet: number; mobile: number };
  targetZ: number;
  targetScale: { desktop: number; mobile: number };
  targetRotSpeed: number;
  targetFogDensity: number;
}

export interface SectionTransitionsConfig {
  hero: {
    letterStaggerMs: number;
    baseDelayMs: number;
    headlineDelayMs: number;
    ctaDelayMs: number;
  };
  about: {
    headerSlideDistancePx: number;
    pillarStaggerMs: number;
    durationMs: number;
  };
  creations: {
    cardStaggerMs: number;
    initialScale: number;
    durationMs: number;
  };
  contact: {
    cardDelayMs: number;
    socialsDelayMs: number;
    durationMs: number;
  };
}

export interface AnimationConfig {
  crystal: {
    baseRadius: number;
    detail: number;
    aspectRatio: { x: number; y: number; z: number };
    asymmetryWaves: {
      x: { freqY: number; freqZ: number; amp: number };
      y: { freqX: number; amp: number };
      z: { freqX: number; freqY: number; amp: number };
    };
    floating: {
      frequency: number;
      amplitude: number;
    };
    rotationSpeedBase: number;
    lerpDamping: number;
    kineticInertia: {
      factorX: number;
      factorZ: number;
      friction: number;
    };
    mouseReaction: {
      posX: number;
      posY: number;
      rotX: number;
      rotY: number;
    };
    ctaHoverScaleMultiplier: number;
  };
  companionShards: ShardConfig[];
  stardust: {
    countDesktop: number;
    countMobile: number;
    spread: { x: number; y: number; z: number };
    particleSize: number;
    driftSpeedY: number;
    driftSpeedX: number;
  };
  fog: {
    expDensityBase: number;
    planeCountDesktop: number;
    planeCountMobile: number;
    planeWidth: number;
    planeHeight: number;
    planeBaseSpeed: number;
    planeSpeedVariance: number;
    planeBaseOpacity: number;
  };
  camera: {
    fov: number;
    near: number;
    far: number;
    initialZ: number;
    mouseParallaxX: number;
    mouseParallaxY: number;
    lerpDamping: number;
  };
  scrollKeyframes: {
    hero: SectionKeyframe;
    about: SectionKeyframe;
    creations: SectionKeyframe;
    contact: SectionKeyframe;
  };
  sectionTransitions: SectionTransitionsConfig;
}

export interface ThemeConfig {
  palette: Palette;
  gradients: {
    atmosphericBackground: string;
    radialOverlay: string;
    fallbackGlass: string;
  };
  typography: {
    fontFamily: string;
    weights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    letterSpacing: {
      tight: string;
      normal: string;
      wide: string;
      widest: string;
      ultraWide: string;
    };
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  shadows: {
    card: string;
    modal: string;
    ctaDefault: string;
    ctaHover: string;
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
