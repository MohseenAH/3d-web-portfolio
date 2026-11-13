import React from 'react';
import { X } from 'lucide-react';
import { CreationItem } from '../../types';
import { PALETTE } from '../../config/theme';

interface CreationDetailsProps {
  creation: CreationItem | null;
  onClose: () => void;
}

/**
 * ============================================================================
 * CREATION DETAILS MODAL
 * Detailed exhibit modal displaying description, tags, and category info.
 * ============================================================================
 */
export const CreationDetails: React.FC<CreationDetailsProps> = ({ creation, onClose }) => {
  if (!creation) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl font-sans"
      style={{ backgroundColor: 'rgba(20, 43, 67, 0.4)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="creation-title"
    >
      <div
        className="relative w-full max-w-xl rounded-3xl p-6 sm:p-10 border backdrop-blur-2xl transition-all"
        style={{
          backgroundColor: 'rgba(234, 248, 255, 0.95)',
          borderColor: PALETTE.iceBlue,
          color: PALETTE.deepNavy,
          boxShadow: '0 30px 90px rgba(20, 43, 67, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:opacity-75 transition-opacity"
          style={{ backgroundColor: PALETTE.iceBlue }}
          aria-label="Close Creation Details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-xs uppercase tracking-[0.24em] font-semibold mb-2" style={{ color: PALETTE.blueGrey }}>
          {creation.category} · {creation.id}
        </div>

        <h3 id="creation-title" className="text-2xl sm:text-3xl font-light mb-4">
          {creation.title}
        </h3>

        <div
          className="p-4 rounded-2xl mb-6 border"
          style={{ backgroundColor: PALETTE.cloudWhite, borderColor: PALETTE.iceBlue }}
        >
          <p className="text-sm leading-relaxed font-light">{creation.details}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {creation.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: PALETTE.iceBlue,
                borderColor: PALETTE.blueGrey,
                color: PALETTE.deepNavy,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
            style={{ backgroundColor: PALETTE.deepNavy, color: PALETTE.cloudWhite }}
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
