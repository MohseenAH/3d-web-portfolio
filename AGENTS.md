# AI AGENT INSTRUCTIONS & DEVELOPMENT RULES — ARCLUNOR

> **Role & Directive:**
> You are acting on the ARCLUNOR 3D Portfolio repository. ARCLUNOR is a high-end creative portfolio featuring an atmospheric 3D WebGL scene, procedural audio synthesis, and modular React + TypeScript architecture.
> When interacting with or modifying this repository, you **MUST** follow the rules below without exception.

---

## 1. Core Development Rules

1. **Inspect Before Modifying**: Always read and understand the relevant component and its configuration file before proposing or applying changes.
2. **Make the Smallest Reasonable Change**: Never refactor or rewrite an entire component when only a single property or sub-element needs adjustment.
3. **Do Not Rewrite Unrelated Components**: Keep edits strictly isolated to the requested feature, bug fix, or style adjustment.
4. **Preserve Existing Visual Identity**:
   - Palette: Atmospheric Azure (`#65B9EB`), Sky Blue (`#91D4F2`), Ice Blue (`#B9E5F5`), Cloud White (`#EAF8FF`), Blue Grey (`#6D9EBF`), Deep Navy (`#142B43`).
   - Font: Montserrat (weights 300 to 700).
   - Identity: ARCLUNOR title must remain bold, single-line guaranteed, and visually cohesive.
5. **Reuse Centralized Configuration**:
   - Content changes belong in `src/config/siteContent.ts`.
   - Visual tokens (colors, gradients, typography, radii, shadows) belong in `src/config/theme.ts`.
   - 3D crystal, camera, fog, particle, and scroll dynamics belong in `src/config/animationConfig.ts`.
6. **Avoid Duplicated Functionality**: Reuse existing services (`soundEngine`), hooks (`useScrollProgress`, `useReducedMotion`), and components rather than re-implementing them.
7. **Do Not Introduce Unnecessary Dependencies**: Use existing standard Three.js and React primitives. Do not install heavy libraries (like GSAP or Framer Motion) unless explicitly instructed by the user.
8. **Run TypeScript Checks and Production Builds**:
   - Always run `npm run lint` (`tsc --noEmit`) and `npm run build` after changes.
   - Do not disable strict mode or insert `any` types to silence errors.
9. **Explain Which Files Were Changed and Why**: Always provide a succinct breakdown of modified files and the rationale behind each modification.
10. **Verify Truthfully**: **Never** claim that a test, build, or type-check passed without actually executing the command and verifying its exit code.

---

## 2. Fast Modification Map for AI Assistants

When the user asks for a specific micro-level change, refer to this exact routing table:

| User Request | File to Edit | Key Properties |
| :--- | :--- | :--- |
| **"Make crystal 10% smaller"** | `src/config/animationConfig.ts` | `crystal.baseRadius`, `crystal.aspectRatio`, or `scrollKeyframes.*.targetScale` |
| **"Slow down / speed up crystal rotation"** | `src/config/animationConfig.ts` | `crystal.rotationSpeedBase` or `scrollKeyframes.*.targetRotSpeed` |
| **"Change floating height / speed"** | `src/config/animationConfig.ts` | `crystal.floating.amplitude`, `crystal.floating.frequency` |
| **"Modify fog density / planes"** | `src/config/animationConfig.ts` & `src/components/environment/Fog.ts` | `fog.expDensityBase`, `fog.planeCountDesktop`, `fog.planeBaseSpeed` |
| **"Adjust background gradient or colors"** | `src/config/theme.ts` | `PALETTE`, `themeConfig.gradients.atmosphericBackground` |
| **"Edit copy, titles, pillars, or contacts"** | `src/config/siteContent.ts` | `hero`, `about.pillars`, `creations`, `contact` |
| **"Adjust crystal glass refraction or transmission"**| `src/components/environment/Crystal.ts` | `MeshPhysicalMaterial` (`transmission`, `ior`, `roughness`, `thickness`) |
| **"Change 3D tilt card sensitivity"** | `src/components/creations/CreationCard.tsx` | `rotateX`, `rotateY` multiplier (default `12deg`) |
| **"Adjust audio chord or chime pitch"** | `src/services/SpatialSoundEngine.ts` | `freqs` in `startAmbientPad()`, `freq` in `playGlassChime()` |
| **"Modify mobile menu behavior"** | `src/components/navigation/MobileMenu.tsx` | Menu overlay layout, backdrop blur, items list |
| **"Adjust hero single-line title styling"** | `src/styles/globals.css` & `src/components/hero/BrandTitle.tsx` | `.arclunor-title-bold` CSS rule |

---

## 3. Three.js Architecture Rules

- **No Canvas Duplication**: Keep all 3D rendering inside `src/components/environment/Persistent3DCrystalCanvas.tsx`.
- **High-Frequency Animation Outside React State**: Do not put mouse coordinates or scroll positions in React `useState` for the 60fps/120fps render loop; use `liveRef` or direct animation parameters.
- **Resource Cleanup**: When modifying Three.js objects, always dispose of previous geometries (`geometry.dispose()`), materials (`material.dispose()`), textures (`texture.dispose()`), and event listeners.
