import React from 'react';
import { NavigationItem } from '../../types';
import { PALETTE } from '../../config/theme';

interface FooterProps {
  brandName: string;
  navigation: NavigationItem[];
  onNavigate: (sectionId: string) => void;
  onOpenDevModal: () => void;
}

/**
 * ============================================================================
 * MINIMAL FOOTER
 * Brand identity, copyright, navigation anchors, and developer studio config trigger.
 * ============================================================================
 */
export const Footer: React.FC<FooterProps> = ({
  brandName,
  navigation,
  onNavigate,
  onOpenDevModal,
}) => {
  return (
    <footer
      className="relative z-20 w-full border-t py-12 font-sans"
      style={{
        borderColor: 'rgba(185, 229, 245, 0.6)',
        backgroundColor: 'rgba(234, 248, 255, 0.4)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-sm font-bold tracking-[0.26em] uppercase" style={{ color: PALETTE.deepNavy }}>
            {brandName}
          </div>
          <div className="text-xs opacity-60">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              data-magnetic="true"
              className="hover:opacity-60 transition-opacity"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenDevModal}
          data-magnetic="true"
          className="text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-full font-medium transition-opacity opacity-40 hover:opacity-90"
          style={{
            color: PALETTE.deepNavy,
            border: `1px solid ${PALETTE.blueGrey}`,
          }}
          title="Studio Config (Cmd/Ctrl + K)"
        >
          Studio Config
        </button>
      </div>
    </footer>
  );
};
