# ARCLUNOR — 3D Atmospheric Creative Portfolio

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.170-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**ARCLUNOR** is an independent creative universe operating at the intersection of artificial intelligence, atmospheric worldbuilding, optical digital sculpture, and serene cinematic storytelling.

This project is built from the ground up as a **modular, maintainable, and AI-friendly codebase**. Every visual token, 3D parameter, content string, and component is cleanly separated so that you or any AI coding assistant can modify individual aspects at a micro-level without touching unrelated code.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Architecture](#2-project-architecture)
3. [Getting Started & Installation](#3-getting-started--installation)
4. [Development Server](#4-development-server)
5. [Production Build](#5-production-build)
6. [Micro-Level Customization Guide](#6-micro-level-customization-guide)
   - [Where to Modify Website Content](#a-modify-website-content)
   - [Where to Modify Colors, Gradients & Typography](#b-modify-colors-gradients--typography)
   - [Where to Modify Crystal Geometry & Materials](#c-modify-crystal-geometry--materials)
   - [Where to Modify Fog & Atmosphere](#d-modify-fog--atmosphere)
   - [Where to Modify Animation Speed & Scroll Choreography](#e-modify-animation-speed--scroll-choreography)
   - [Where to Modify Individual Sections](#f-modify-individual-sections)
   - [Where to Modify Procedural Audio & Chimes](#g-modify-procedural-audio--chimes)
7. [Developer Store Modal (Cmd/Ctrl + K)](#7-developer-store-modal-cmdctrl--k)
8. [GitHub Repository Setup (Manual Steps)](#8-github-repository-setup-manual-steps)

---

## 1. Technology Stack

- **Framework**: [React 18](https://react.dev/) (Functional components, custom hooks)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing, no loose `any`)
- **Build Tool**: [Vite 5](https://vitejs.dev/) (Instant HMR, manual vendor chunk splitting)
- **3D Graphics**: [Three.js](https://threejs.org/) (Custom sculpted non-indexed geometry, `MeshPhysicalMaterial` transmission, ACESFilmic tone mapping)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + custom CSS keyframes
- **Audio**: Web Audio API (procedural harmonic ambient pad + glass resonance chimes, zero external mp3/wav files required)

---

## 2. Project Architecture

```
arclunor/
│
├── public/
│   ├── assets/                # Static public assets
│   └── favicon.svg            # Custom optical crystal SVG favicon
│
├── src/
│   ├── app/
│   │   ├── App.tsx            # Root composition & state coordinator
│   │   └── main.tsx           # React DOM root entrypoint
│   │
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── Navbar.tsx     # Frosted glass fixed header & sound toggle
│   │   │   ├── MobileMenu.tsx # Fullscreen mobile navigation overlay
│   │   │   └── Footer.tsx     # Minimal footer with Studio Config shortcut
│   │   │
│   │   ├── hero/
│   │   │   ├── Hero.tsx       # Hero section with headline, subtitle & CTA
│   │   │   └── BrandTitle.tsx # Single-line guaranteed Montserrat 700 bold title
│   │   │
│   │   ├── environment/
│   │   │   ├── Persistent3DCrystalCanvas.tsx # WebGL render loop & event coordinator
│   │   │   ├── Crystal.ts     # Octahedron deformation, glass materials, shards & stardust
│   │   │   ├── Fog.ts         # Volumetric FogExp2 and drifting fog planes
│   │   │   ├── Lighting.ts    # Ambient, hemi, key, rim & interactive cursor spotlight
│   │   │   └── EnvironmentTextures.ts # Procedural radial/linear gradient canvas textures
│   │   │
│   │   ├── sections/
│   │   │   ├── About.tsx      # Algorithmic synthesis & 3 pillars grid
│   │   │   ├── Creations.tsx  # Featured portfolio works section
│   │   │   └── Contact.tsx    # Direct studio email & social channels
│   │   │
│   │   ├── creations/
│   │   │   ├── CreationCard.tsx    # 3D physical tilt card with specular glare
│   │   │   └── CreationDetails.tsx # Detailed exhibit modal dialog
│   │   │
│   │   ├── cursor/
│   │   │   └── CustomCursor.tsx    # Dual-ring magnetic cursor with spring lerp
│   │   │
│   │   └── developer/
│   │       └── DeveloperDataModal.tsx # Live JSON editor & motion tester (Cmd/Ctrl + K)
│   │
│   ├── config/
│   │   ├── theme.ts           # Centralized visual tokens, palette, and gradients
│   │   ├── siteContent.ts     # Single source of truth for copy, navigation & cards
│   │   └── animationConfig.ts # 3D positions, rotations, keyframes & speeds
│   │
│   ├── hooks/
│   │   ├── useScrollProgress.ts # Normalized scroll progress & section detection
│   │   └── useReducedMotion.ts  # System & simulated reduced motion hook
│   │
│   ├── services/
│   │   └── SpatialSoundEngine.ts # Procedural Web Audio synthesizer (pad + chimes)
│   │
│   ├── styles/
│   │   ├── globals.css        # Tailwind directives & typography rules
│   │   └── animations.css     # Keyframe animations (float, pulse, ripple)
│   │
│   └── types/
│       └── index.ts           # Shared TypeScript interfaces & types
│
├── .gitignore
├── AGENTS.md                  # Development rules for AI coding assistants
├── README.md                  # Comprehensive project documentation
├── index.html                 # HTML shell with Google Fonts
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 3. Getting Started & Installation

Prerequisites:
- [Node.js](https://nodejs.org/) v18+ (tested on Node v20/v22/v24)
- npm v9+

Install dependencies:
```bash
npm install
```

---

## 4. Development Server

Start the local Vite development server:
```bash
npm run dev
```

Open your browser at `http://localhost:3000` (or the port displayed in your terminal).

---

## 5. Production Build

Verify types and build the optimized production distribution:
```bash
npm run build
```

The production output is placed in the `dist/` directory with code splitting:
- `dist/assets/index-*.js` (Application logic)
- `dist/assets/vendor-*.js` (React & UI dependencies)
- `dist/assets/three-*.js` (Three.js 3D engine)
- `dist/assets/index-*.css` (Tailwind & custom styling)

Preview the production build locally:
```bash
npm run preview
```

---

## 6. Micro-Level Customization Guide

### A. Modify Website Content
Edit: `src/config/siteContent.ts`
- **Brand name**: Change `initialSiteContent.brand.name`.
- **Hero headline, subtitle, categories, or CTA**: Edit `initialSiteContent.hero`.
- **About eyebrow, title, lead, and pillars**: Edit `initialSiteContent.about`.
- **Portfolio creations, descriptions, tags, and accents**: Edit `initialSiteContent.creations`.
- **Contact email and social media handles**: Edit `initialSiteContent.contact`.

### B. Modify Colors, Gradients & Typography
Edit: `src/config/theme.ts`
- **Palette**: Modify hex values in `PALETTE` (`azure`, `skyBlue`, `iceBlue`, `cloudWhite`, `blueGrey`, `deepNavy`).
- **Backdrop Gradient**: Modify `themeConfig.gradients.atmosphericBackground`.
- **Typography & Weights**: Modify `themeConfig.typography`.

### C. Modify Crystal Geometry & Materials
Edit:
- Parameters: `src/config/animationConfig.ts` (`animationConfig.crystal`)
  - `baseRadius`: default `1.18` (change to increase/decrease scale).
  - `aspectRatio`: `{ x: 0.88, y: 1.62, z: 0.82 }` (controls height vs width proportions).
  - `asymmetryWaves`: controls harmonic wave facet deformation.
- Materials & Shading: `src/components/environment/Crystal.ts`
  - Modify `crystalMaterial` properties: `transmission`, `roughness`, `ior`, `thickness`, `attenuationColor`.

### D. Modify Fog & Atmosphere
Edit:
- Configuration: `src/config/animationConfig.ts` (`animationConfig.fog`)
  - `expDensityBase`: default `0.038`
  - `planeCountDesktop`: default `7`
  - `planeBaseSpeed`: default `0.0016`
- Fog Plane Generation: `src/components/environment/Fog.ts`
- Texture Canvas Gradients: `src/components/environment/EnvironmentTextures.ts`

### E. Modify Animation Speed & Scroll Choreography
Edit: `src/config/animationConfig.ts`
- **Rotation speed**: `crystal.rotationSpeedBase` (default `0.12`).
- **Vertical levitation**: `crystal.floating.frequency` (`0.7`) and `amplitude` (`0.1`).
- **Kinetic scroll momentum**: `crystal.kineticInertia` (`factorX`, `factorZ`, `friction`).
- **Section-by-section 3D choreography**: `scrollKeyframes.hero`, `.about`, `.creations`, `.contact`.
  - Adjust `targetX`, `targetY`, `targetZ`, `targetScale`, `targetRotSpeed`, `targetFogDensity` per section.

### F. Modify Individual Sections
Each section is isolated in `src/components/sections/`:
- Hero: `src/components/hero/Hero.tsx` & `BrandTitle.tsx`
- About: `src/components/sections/About.tsx`
- Creations: `src/components/sections/Creations.tsx` & `src/components/creations/CreationCard.tsx`
- Contact: `src/components/sections/Contact.tsx`
- Navigation: `src/components/navigation/Navbar.tsx` & `MobileMenu.tsx`
- Footer: `src/components/navigation/Footer.tsx`

### G. Modify Procedural Audio & Chimes
Edit: `src/services/SpatialSoundEngine.ts`
- **Harmonic pad chord**: Frequencies in `startAmbientPad()` (default Amaj9/Emaj7 suspended chord).
- **Glass chime pitch**: `playGlassChime(freq)` (called on card tilt, section entry, and button interactions).

---

## 7. Developer Store Modal (Cmd/Ctrl + K)

Press **`Cmd + K`** (Mac) or **`Ctrl + K`** (Windows/Linux) — or click **"Studio Config"** in the footer — to open the live Developer Store Modal:
- View and edit the entire `siteContent` JSON in real-time.
- Click **"Apply Changes"** to test live updates immediately.
- Click **"Export .ts"** to copy the formatted TypeScript code directly to your clipboard.
- Toggle **"Motion Accessibility Simulation"** to preview how the website behaves with reduced motion enabled.

---

## 8. GitHub Repository Setup (Manual Steps)

When you are ready to publish ARCLUNOR to your GitHub account:

1. **Create a new empty repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g. `arclunor-3d-portfolio`).
   - Do **not** check "Add a README", "Add .gitignore", or "Choose a license" (the local project already includes them).

2. **Open your local terminal in the project directory**:
   ```bash
   cd c:\Users\Arc\Downloads\3d
   ```

3. **Link your remote repository and push**:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```
