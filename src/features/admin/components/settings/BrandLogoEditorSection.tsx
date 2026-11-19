import React, { useRef, useState } from 'react';
import { Image, Upload, RotateCcw, Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { ResolvaLogo } from '@/components/brand/ResolvaLogo';

const LOGO_PRESETS = [
  {
    name: 'Geometric Cube',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  },
  {
    name: 'Cyber Shield',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  },
  {
    name: 'AI Neural',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%238b5cf6" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>',
  },
];

export const BrandLogoEditorSection: React.FC = () => {
  const { customLogoUrl, setCustomLogoUrl } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomLogoUrl(result);
        setFeedback('Custom logo uploaded successfully!');
        setTimeout(() => setFeedback(null), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setCustomLogoUrl(null);
    setFeedback('Logo reset to Resolyx default');
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-brand-indigo" />
          <div>
            <h2 className="text-sm font-bold text-foreground">Platform & Organization Logo</h2>
            <p className="text-xs text-foreground-muted">
              Customize the logo displayed in the admin sidebar, customer portal, and emails.
            </p>
          </div>
        </div>

        {customLogoUrl && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Live Logo Preview Box */}
        <div className="p-4 rounded-xl bg-surface-subtle/50 border border-border flex flex-col justify-between space-y-3">
          <span className="text-[11px] font-semibold text-foreground-muted">Live Preview</span>
          <div className="flex items-center justify-center py-4 px-2 bg-surface rounded-xl border border-border shadow-sm min-h-[84px]">
            <ResolvaLogo
              size="lg"
              showSubtitle
              imageSrc={customLogoUrl || undefined}
              imageClassName="h-13 sm:h-14 max-h-14 w-auto"
            />
          </div>
          <p className="text-[10px] text-foreground-muted text-center">
            {customLogoUrl
              ? 'Custom branding active across portal'
              : 'Using official Resolyx brand lockup'}
          </p>
        </div>

        {/* Upload & Preset Options */}
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-border hover:border-brand-indigo bg-surface hover:bg-brand-indigo/5 text-foreground transition-all flex flex-col items-center justify-center gap-1"
          >
            <Upload className="h-5 w-5 text-brand-indigo" />
            <span className="text-xs font-bold">Upload Custom Logo File</span>
            <span className="text-[10px] text-foreground-muted">
              PNG, SVG, JPG, or WebP (max 2MB)
            </span>
          </button>

          <div>
            <span className="text-[11px] font-semibold text-foreground-muted block mb-1.5">
              Or Choose a Brand Preset:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {LOGO_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setCustomLogoUrl(preset.url);
                    setFeedback(`Applied ${preset.name}`);
                    setTimeout(() => setFeedback(null), 2500);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    customLogoUrl === preset.url
                      ? 'border-brand-indigo bg-brand-indigo/10 text-brand-indigo font-bold'
                      : 'border-border bg-surface text-foreground hover:bg-surface-subtle'
                  }`}
                >
                  <span className="text-[11px] font-medium block truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
          <Check className="h-3.5 w-3.5" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
