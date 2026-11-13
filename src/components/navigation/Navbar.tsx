import React from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { NavigationItem } from '../../types';
import { PALETTE } from '../../config/theme';
import { soundEngine } from '../../services/SpatialSoundEngine';

interface NavbarProps {
  brandName: string;
  navigation: NavigationItem[];
  activeSection: string;
  scrollProgress: number;
  soundEnabled: boolean;
  mobileMenuOpen: boolean;
  onToggleSound: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (sectionId: string) => void;
}

/**
 * ============================================================================
 * FIXED TOP NAVIGATION BAR
 * Translucent frosted glass header with brand identity, nav items, and audio toggle.
 * ============================================================================
 */
export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  navigation,
  activeSection,
  scrollProgress,
  soundEnabled,
  mobileMenuOpen,
  onToggleSound,
  onToggleMobileMenu,
  onNavigate,
}) => {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 backdrop-blur-md py-3.5 sm:py-4 border-b ${
        scrollProgress > 0.02 ? 'shadow-sm' : ''
      }`}
      style={{
        backgroundColor: 'rgba(247, 252, 255, 0.88)',
        borderColor: '#B9E5F5',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('hero')}
          data-magnetic="true"
          className="text-xs sm:text-sm font-bold tracking-[0.32em] uppercase transition-opacity hover:opacity-75"
          style={{ color: PALETTE.deepNavy }}
        >
          {brandName}
        </button>

        {/* Desktop Nav Links & Web Audio Sound Toggle */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8" aria-label="Primary Navigation">
            {navigation.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  data-magnetic="true"
                  onMouseEnter={() => soundEngine.playGlassChime(1760)}
                  className="text-xs sm:text-sm font-semibold tracking-[0.1em] transition-all relative py-1"
                  style={{
                    color: PALETTE.deepNavy,
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-[2px] rounded-full transition-all"
                      style={{ backgroundColor: PALETTE.deepNavy }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Soundscape ON / OFF Toggle */}
          <button
            onClick={onToggleSound}
            data-magnetic="true"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
            style={{
              backgroundColor: soundEnabled ? PALETTE.deepNavy : 'transparent',
              color: soundEnabled ? PALETTE.cloudWhite : PALETTE.deepNavy,
              borderColor: PALETTE.blueGrey,
            }}
            title="Toggle Spatial Audio Soundscape"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'SOUND ON' : 'SOUND OFF'}</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-full transition-transform active:scale-95"
          style={{ backgroundColor: PALETTE.iceBlue, color: PALETTE.deepNavy }}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
