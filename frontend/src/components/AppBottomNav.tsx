import React from 'react';

export type TabKey = 'dashboard' | 'new-setup' | 'history' | 'settings';

interface AppBottomNavProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { key: 'dashboard' as TabKey, label: 'Dashboard', icon: 'dashboard' },
    { key: 'new-setup' as TabKey, label: 'New Setup', icon: 'video_call' },
    { key: 'history' as TabKey, label: 'History', icon: 'history' },
    { key: 'settings' as TabKey, label: 'Settings', icon: 'settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-[#e5eeff] pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
                isActive
                  ? 'text-[#004ac6] font-semibold scale-105'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
