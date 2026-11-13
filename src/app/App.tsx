import { useState, useEffect, useCallback } from 'react';
import { CreationItem } from '../types';
import { themeConfig } from '../config/theme';
import { initialSiteContent } from '../config/siteContent';
import { soundEngine } from '../services/SpatialSoundEngine';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Components
import { CustomCursor } from '../components/cursor/CustomCursor';
import { Persistent3DCrystalCanvas } from '../components/environment/Persistent3DCrystalCanvas';
import { Navbar } from '../components/navigation/Navbar';
import { MobileMenu } from '../components/navigation/MobileMenu';
import { Footer } from '../components/navigation/Footer';
import { Hero } from '../components/hero/Hero';
import { About } from '../components/sections/About';
import { Creations } from '../components/sections/Creations';
import { Contact } from '../components/sections/Contact';
import { CreationDetails } from '../components/creations/CreationDetails';
import { DeveloperDataModal } from '../components/developer/DeveloperDataModal';

/**
 * ============================================================================
 * MAIN APPLICATION — ARCLUNOR AWWWARDS-GRADE 3D PORTFOLIO
 * Modular, component-driven architecture with centralized AI-editable configs.
 * ============================================================================
 */
export default function App() {
  const [siteContent, setSiteContent] = useState(initialSiteContent);
  const [sceneReady, setSceneReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useReducedMotion();
  const [ctaHovered, setCtaHovered] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState<CreationItem | null>(null);

  // Sound Engine state
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Navigation & Scroll state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollProgress, activeSection } = useScrollProgress(['hero', 'about', 'creations', 'contact']);

  // Developer Store Modal (Cmd/Ctrl + K)
  const [devModalOpen, setDevModalOpen] = useState(false);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setDevModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Smooth entrance transition on WebGL scene readiness
  useEffect(() => {
    if (sceneReady) {
      const timer = setTimeout(() => setEntered(true), 120);
      return () => clearTimeout(timer);
    }
  }, [sceneReady]);

  // Audio Toggle Handler
  const handleSoundToggle = useCallback(() => {
    const active = soundEngine.toggleSound(!soundEnabled);
    setSoundEnabled(active);
  }, [soundEnabled]);

  // Smooth Section Navigation
  const scrollToSection = useCallback((id: string) => {
    soundEngine.playGlassChime(1320);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      className="relative w-full min-h-screen select-none font-sans overflow-x-hidden"
      style={{
        color: themeConfig.palette.deepNavy,
        background: themeConfig.gradients.atmosphericBackground,
      }}
    >
      {/* CUSTOM DUAL-RING MAGNETIC CURSOR */}
      <CustomCursor />

      {/* Atmospheric Radial Gradient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: themeConfig.gradients.radialOverlay,
        }}
      />

      {/* ONE PERSISTENT 3D CRYSTAL CANVAS MOUNTED BEHIND ALL SECTIONS */}
      <Persistent3DCrystalCanvas
        reducedMotion={reducedMotion}
        ctaHovered={ctaHovered}
        scrollProgress={scrollProgress}
        onReady={() => setSceneReady(true)}
      />

      {/* FIXED TOP NAVIGATION BAR */}
      <Navbar
        brandName={siteContent.brand.name}
        navigation={siteContent.navigation}
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        soundEnabled={soundEnabled}
        mobileMenuOpen={mobileMenuOpen}
        onToggleSound={handleSoundToggle}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onNavigate={scrollToSection}
      />

      {/* MOBILE NAV OVERLAY */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        navigation={siteContent.navigation}
        subtitle={siteContent.hero.subtitle}
        soundEnabled={soundEnabled}
        onToggleSound={handleSoundToggle}
        onNavigate={scrollToSection}
      />

      {/* MAIN SECTIONS */}
      <main>
        {/* SECTION 1 — HERO (#hero) */}
        <Hero
          hero={siteContent.hero}
          entered={entered}
          reducedMotion={reducedMotion}
          ctaHovered={ctaHovered}
          setCtaHovered={setCtaHovered}
          onExploreClick={() => scrollToSection('creations')}
        />

        {/* SECTION 2 — ABOUT (#about) */}
        <About about={siteContent.about} />

        {/* SECTION 3 — CREATIONS (#creations) */}
        <Creations
          creations={siteContent.creations}
          onSelectCreation={(creation) => setSelectedCreation(creation)}
        />

        {/* SECTION 4 — CONTACT (#contact) */}
        <Contact contact={siteContent.contact} />
      </main>

      {/* SECTION 5 — FOOTER */}
      <Footer
        brandName={siteContent.brand.name}
        navigation={siteContent.navigation}
        onNavigate={scrollToSection}
        onOpenDevModal={() => setDevModalOpen(true)}
      />

      {/* CREATION OVERVIEW MODAL */}
      <CreationDetails
        creation={selectedCreation}
        onClose={() => setSelectedCreation(null)}
      />

      {/* DEVELOPER MODAL (Cmd/Ctrl + K) */}
      <DeveloperDataModal
        isOpen={devModalOpen}
        onClose={() => setDevModalOpen(false)}
        siteContent={siteContent}
        setSiteContent={setSiteContent}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
      />
    </div>
  );
}
