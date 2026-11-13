import React, { useState, useEffect } from 'react';
import { FileCode, X, RefreshCw, Copy, Check } from 'lucide-react';
import { SiteContent } from '../../types';
import { PALETTE } from '../../config/theme';
import { initialSiteContent } from '../../config/siteContent';

interface DeveloperDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteContent: SiteContent;
  setSiteContent: (content: SiteContent) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * ============================================================================
 * DEVELOPER STORE MODAL (Cmd/Ctrl + K)
 * Live in-browser inspection, JSON editing, TypeScript export & motion testing.
 * ============================================================================
 */
export const DeveloperDataModal: React.FC<DeveloperDataModalProps> = ({
  isOpen,
  onClose,
  siteContent,
  setSiteContent,
  reducedMotion,
  setReducedMotion,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonInput(JSON.stringify(siteContent, null, 2));
      setError(null);
    }
  }, [isOpen, siteContent]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonInput) as SiteContent;
      setSiteContent(parsed);
      setError(null);
      onClose();
    } catch {
      setError('Invalid JSON syntax. Please check formatting before applying.');
    }
  };

  const handleCopyTS = () => {
    const code = `// siteContent.ts\nimport { SiteContent } from '../types';\n\nexport const initialSiteContent: SiteContent = ${jsonInput};\n`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl font-sans"
      style={{ backgroundColor: 'rgba(20, 43, 67, 0.35)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-3xl border p-6 sm:p-8 flex flex-col max-h-[85vh]"
        style={{
          backgroundColor: PALETTE.cloudWhite,
          borderColor: PALETTE.iceBlue,
          color: PALETTE.deepNavy,
          boxShadow: '0 32px 90px rgba(20, 43, 67, 0.18)',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: PALETTE.iceBlue }}>
          <div className="flex items-center gap-2.5">
            <FileCode className="w-4 h-4" />
            <div>
              <h2 id="dev-modal-title" className="text-xs font-semibold uppercase tracking-[0.18em]">
                Developer Store · siteContent.ts
              </h2>
              <p className="text-xs opacity-65">Centralized content store & motion preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:opacity-75"
            style={{ backgroundColor: PALETTE.iceBlue }}
            aria-label="Close Developer Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 flex items-center justify-between text-xs border-b" style={{ borderColor: PALETTE.iceBlue }}>
          <span>Motion Accessibility Simulation:</span>
          <button
            onClick={() => setReducedMotion((prev: boolean) => !prev)}
            className="px-3 py-1 rounded-full border transition-colors font-medium"
            style={{
              backgroundColor: reducedMotion ? PALETTE.deepNavy : PALETTE.iceBlue,
              color: reducedMotion ? PALETTE.cloudWhite : PALETTE.deepNavy,
              borderColor: PALETTE.blueGrey,
            }}
          >
            {reducedMotion ? 'Reduced Motion: Active' : 'Standard Motion'}
          </button>
        </div>

        <div className="py-4 flex-1 flex flex-col overflow-hidden">
          {error && (
            <div
              className="mb-3 p-3 rounded-xl text-xs border"
              style={{ backgroundColor: PALETTE.iceBlue, borderColor: PALETTE.deepNavy }}
            >
              {error}
            </div>
          )}
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
            className="w-full flex-1 min-h-[260px] rounded-2xl p-4 font-mono text-xs focus:outline-none border resize-none leading-relaxed"
            style={{ backgroundColor: PALETTE.iceBlue, borderColor: PALETTE.blueGrey, color: PALETTE.deepNavy }}
          />
        </div>

        <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: PALETTE.iceBlue }}>
          <button
            onClick={() => setJsonInput(JSON.stringify(initialSiteContent, null, 2))}
            className="px-4 py-2 rounded-full text-xs flex items-center gap-1.5 border font-medium hover:opacity-80"
            style={{ borderColor: PALETTE.blueGrey, color: PALETTE.deepNavy }}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyTS}
              className="px-4 py-2 rounded-full text-xs flex items-center gap-1.5 border font-medium hover:opacity-80"
              style={{ backgroundColor: PALETTE.iceBlue, borderColor: PALETTE.blueGrey, color: PALETTE.deepNavy }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied TS' : 'Export .ts'}</span>
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
              style={{ backgroundColor: PALETTE.deepNavy, color: PALETTE.cloudWhite }}
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
