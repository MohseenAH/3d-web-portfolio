import { ThemeConfig } from '../types';

/**
 * ============================================================================
 * PALETTE DEFINITION — ATMOSPHERIC AZURE SYSTEM
 * ============================================================================
 * - Atmospheric Azure: #65B9EB  (Signature skyward vibrancy)
 * - Sky Blue:          #91D4F2  (Ambient atmospheric layer)
 * - Ice Blue:          #B9E5F5  (Translucent refractive borders & glares)
 * - Cloud White:       #EAF8FF  (High-key specular peaks & highlights)
 * - Blue Grey:         #6D9EBF  (Structural typography & faceted outlines)
 * - Deep Navy:         #142B43  (Cinematic depth anchor & foundation)
 */
export const PALETTE = {
  azure: '#65B9EB',
  skyBlue: '#91D4F2',
  iceBlue: '#B9E5F5',
  cloudWhite: '#EAF8FF',
  blueGrey: '#6D9EBF',
  deepNavy: '#142B43',
} as const;

/**
 * ============================================================================
 * CENTRAL THEME CONFIGURATION
 * Single source of truth for visual tokens, typography, radii, and shadows.
 * AI assistants can modify visual styles here directly without altering components.
 * ============================================================================
 */
export const themeConfig: ThemeConfig = {
  palette: PALETTE,
  gradients: {
    // Primary page backdrop
    atmosphericBackground: `linear-gradient(155deg, ${PALETTE.deepNavy} 0%, #20486D 14%, ${PALETTE.azure} 44%, ${PALETTE.skyBlue} 76%, ${PALETTE.iceBlue} 100%)`,
    // Soft radial illumination behind hero crystal
    radialOverlay: `radial-gradient(circle at 76% 38%, rgba(234, 248, 255, 0.6) 0%, rgba(145, 212, 242, 0.25) 45%, rgba(20, 43, 67, 0.45) 90%)`,
    // Fallback static glass representation for unsupported WebGL browsers
    fallbackGlass: `linear-gradient(135deg, ${PALETTE.cloudWhite} 0%, ${PALETTE.iceBlue} 50%, ${PALETTE.azure} 100%)`,
  },
  typography: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0em',
      wide: '0.1em',
      widest: '0.24em',
      ultraWide: '0.32em',
    },
  },
  radii: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  shadows: {
    card: '0 20px 50px rgba(20, 43, 67, 0.08)',
    modal: '0 32px 90px rgba(20, 43, 67, 0.18)',
    ctaDefault: '0 12px 30px rgba(20, 43, 67, 0.16)',
    ctaHover: '0 20px 45px rgba(20, 43, 67, 0.28)',
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1440,
  },
};
