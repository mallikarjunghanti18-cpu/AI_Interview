import React from 'react';
import { BackendConfig } from '../types/interview';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  backendConfig: BackendConfig;
  onOpenSettings?: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'AI Interviewer',
  subtitle = 'Dashboard',
  showBack = false,
  onBack,
  backendConfig,
  onOpenSettings,
  isMobileFrame,
  onToggleFrame
}) => {
  return (
    <header className="sticky top-0 w-full z-40 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#e5eeff] px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left branding / navigation */}
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-9 h-9 flex items-center justify-center text-[#0b1c30] rounded-lg hover:bg-[#e5eeff] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          )}

          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#004ac6] to-[#4b41e1] flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[16px] text-[#0b1c30] tracking-tight leading-tight">
                {title}
              </span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#dce9ff]">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    backendConfig.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-blue-600 animate-pulse'
                  }`}
                />
                <span className="text-[10px] font-mono text-[#434655] font-medium leading-none">
                  {backendConfig.isOnline ? 'Live API' : 'Ready'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#737686] truncate max-w-[140px] leading-tight">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Right actions: Viewport Mode Toggle, Notifications & Profile */}
        <div className="flex items-center gap-1.5">
          {/* Frame Viewport Toggle */}
          <button
            onClick={onToggleFrame}
            title={isMobileFrame ? 'Expand to Fullscreen' : 'Switch to Android Phone View'}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#e5eeff] text-[#004ac6] hover:bg-[#dce9ff] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isMobileFrame ? 'fullscreen' : 'smartphone'}
            </span>
            <span>{isMobileFrame ? 'Expanded' : 'Phone'}</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => onOpenSettings?.()}
            aria-label="Backend Status and Notifications"
            title="Backend Settings"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#434655] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {!backendConfig.isOnline && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* User Profile */}
          <button
            onClick={onOpenSettings}
            title="Profile & Settings"
            className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
