import React from 'react';
import { NavModule } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ASSETS } from '../data/mockData';

interface SidebarProps {
  activeModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { isDark } = useTheme();

  const navItems: { id: NavModule; label: string; icon: string; badge?: string; desc: string }[] = [
    { id: 'ingestion', label: 'Data Ingestion', icon: 'cloud_upload', desc: 'Telco CDR, FIU ledgers, UFED' },
    { id: 'network', label: 'Network Graph', icon: 'hub', desc: 'Entity link analysis & path' },
    { id: 'dossier', label: 'Suspect Dossier', icon: 'badge', desc: 'Target profile & biometrics' },
    { id: 'anomalies', label: 'Threat Surface & AI', icon: 'crisis_alert', desc: 'Risk scoring & radar' },
    { id: 'timeline', label: 'Activity Timeline', icon: 'timeline', desc: 'Geo playback & events' },
    { id: 'copilot', label: 'DRISTI Neural AI', icon: 'smart_toy', desc: 'Investigative multi-hop AI' },
    { id: 'vault', label: 'Saved Evidence', icon: 'verified_user', desc: 'BSA 2023 65B repository' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        id="dristi-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 flex flex-col border-r ${
          isDark 
            ? 'bg-[#080f24] border-[#1e305e]' 
            : 'bg-white border-slate-200 shadow-sm'
        } ${collapsed ? 'w-18' : 'w-64'} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className={`h-16 flex items-center border-b px-3.5 transition-colors ${
          isDark ? 'border-[#1e305e]' : 'border-slate-200'
        } ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#ff9933]/60 bg-[#0e1938] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,153,51,0.25)]">
              {/* Ashoka Chakra Crest Emblem */}
              <svg className="w-6 h-6 text-[#ff9933]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center space-x-1.5">
                  <span className="font-['Space_Grotesk',sans-serif] font-bold tracking-wider text-sm text-[#f8fafc]">
                    DRISTI <span className="text-[#ff9933]">INTEL</span>
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#94a3b8] truncate">
                  MHA SEC-OPS PORTAL
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Button */}
          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              className="hidden lg:flex p-1.5 rounded-md hover:bg-[#14234b] text-[#94a3b8] hover:text-[#f8fafc] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">first_page</span>
            </button>
          )}
        </div>

        {/* Tactical Status Pill in Sidebar */}
        {!collapsed && (
          <div className="px-3 py-2 border-b border-[#1e305e]/60 bg-[#0b132b]/50">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#94a3b8]">OPS STATUS</span>
              <span className="flex items-center space-x-1 text-[#22c55e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
                <span>GRID ONLINE</span>
              </span>
            </div>
          </div>
        )}

        {/* Navigation Modules Section */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          <div className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#64748b] ${
            collapsed ? 'text-center' : ''
          }`}>
            {collapsed ? 'NAV' : 'Tactical Modules'}
          </div>

          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectModule(item.id);
                  onCloseMobile();
                }}
                title={collapsed ? `${item.label} (${item.desc})` : undefined}
                className={`w-full flex items-center rounded-lg transition-colors text-left cursor-pointer group relative ${
                  collapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5 space-x-3'
                } ${
                  isActive
                    ? isDark
                      ? 'bg-[#ff9933]/15 text-[#ffffff] font-semibold'
                      : 'bg-amber-100/70 text-slate-900 font-semibold'
                    : isDark
                    ? 'text-[#94a3b8] hover:bg-[#111d3f] hover:text-[#f8fafc]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#ff9933]'
                      : 'text-[#64748b] group-hover:text-[#ff9933]'
                  }`}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate tracking-wide">{item.label}</div>
                    <div className="text-[10px] font-mono text-[#64748b] truncate group-hover:text-[#94a3b8]">
                      {item.desc}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Collapsed view Expand Trigger Button at bottom */}
        {collapsed && (
          <div className="p-2 border-t border-[#1e305e] flex justify-center hidden lg:flex">
            <button
              onClick={onToggleCollapse}
              title="Expand sidebar"
              className="p-2 rounded-lg hover:bg-[#14234b] text-[#ff9933] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">last_page</span>
            </button>
          </div>
        )}

        {/* Officer Profile Footer in Sidebar */}
        <div className={`p-3 border-t transition-colors ${
          isDark ? 'border-[#1e305e] bg-[#0b132b]/80' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2.5'}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#ff9933]/60 shadow-sm bg-[#0e1938] shrink-0">
              <img
                src={ASSETS.officerVikram}
                alt="SP Vikram Malhotra, IPS"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#f8fafc] truncate flex items-center space-x-1">
                  <span>SP V. Malhotra</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#138808]/30 text-[#4edea3] border border-[#138808]/50 shrink-0">
                    IPS
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#94a3b8] truncate">
                  Cyber Operations Desk
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
