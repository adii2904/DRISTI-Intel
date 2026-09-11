import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IngestFileItem, AuthUser } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  ingestionFiles?: IngestFileItem[];
  selectedFileFocus: string;
  onSelectFileFocus: (fileId: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
  ingestionFiles = [],
  selectedFileFocus,
  onSelectFileFocus,
  currentUser,
  onLogout
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Indian Standard Time (UTC + 5:30)
      const istString = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setIstTime(istString.replace(',', '') + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isFiltered = selectedFileFocus !== 'ALL';
  const currentFile = isFiltered ? ingestionFiles.find(f => f.id === selectedFileFocus) : null;

  return (
    <header className="border-b border-[#1e305e] bg-[#0b132b]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="h-16 px-4 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Sidebar Toggle + App Branding */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="btn-sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-2 rounded-lg border border-[#1e305e] bg-[#0e1938] hover:bg-[#14234b] text-[#94a3b8] hover:text-[#ff9933] transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-xl block">
              menu
            </span>
          </button>

          <div className="flex items-center space-x-2.5">
            <h1 className="text-base sm:text-lg font-bold tracking-wider font-['Space_Grotesk',sans-serif] text-[#ffffff] flex items-center space-x-1.5">
              <span>DRISTI</span>
              <span className="text-[#ff9933]">INTEL</span>
            </h1>

            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#ff9933]/15 text-[#ff9933] border border-[#ff9933]/40 font-bold tracking-wide">
              MHA SEC-OPS
            </span>

            <span className="hidden xl:inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#138808]/20 text-[#4edea3] border border-[#138808]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span>GRID LIVE</span>
            </span>
          </div>
        </div>

        {/* Center: Global Active Case / File Focus Dropdown */}
        <div className="flex items-center flex-1 max-w-md lg:max-w-lg mx-1 sm:mx-2 min-w-0">
          <div className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border transition-all ${
            isFiltered
              ? 'bg-[#14234b] border-[#ff9933] shadow-[0_0_12px_rgba(255,153,51,0.2)]'
              : 'bg-[#0e1938] border-[#1e305e] hover:border-[#2d4580]'
          }`}>
            <span className={`material-symbols-outlined text-base shrink-0 ${
              isFiltered ? 'text-[#ff9933]' : 'text-[#64748b]'
            }`}>
              {isFiltered ? 'filter_alt' : 'layers'}
            </span>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between text-[9px] font-mono leading-none mb-0.5">
                <span className={`${isFiltered ? 'text-[#ff9933] font-bold' : 'text-[#94a3b8]'}`}>
                  ACTIVE FILE FOCUS
                </span>
                {isFiltered && currentFile && (
                  <span className="text-[#4edea3] bg-[#138808]/20 px-1 py-0.2 rounded font-mono text-[8px] truncate max-w-[100px]">
                    {currentFile.sourceCategory}
                  </span>
                )}
              </div>

              <select
                id="header-file-focus-select"
                value={selectedFileFocus}
                onChange={(e) => onSelectFileFocus(e.target.value)}
                aria-label="Active Case or Ingested File Focus"
                className="bg-transparent text-xs font-mono text-[#f8fafc] font-medium outline-none cursor-pointer truncate pr-1"
                title={isFiltered && currentFile ? currentFile.name : 'All Ingested Files (Combined view)'}
              >
                <option value="ALL" className="bg-[#0b132b] text-[#f8fafc]">
                  All Ingested Files (Combined view)
                </option>
                {ingestionFiles.map((file) => (
                  <option key={file.id} value={file.id} className="bg-[#0b132b] text-[#f8fafc]">
                    [{file.sourceCategory}] {file.name} ({file.size})
                  </option>
                ))}
              </select>
            </div>

            {isFiltered && (
              <button
                id="btn-clear-file-focus-header"
                onClick={() => onSelectFileFocus('ALL')}
                title="Reset to All Ingested Files"
                className="p-1 text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e305e] rounded transition-all shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm block">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Officer Badge + Telemetry + Dark/Light Mode Toggle + Logout */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Indian Standard Time Telemetry */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-[#1e305e] bg-[#070d1e] text-[11px] font-mono text-[#ff9933]">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="font-semibold tracking-wide">{istTime || '2026-09-10 01:30:00 IST'}</span>
          </div>

          {/* Officer Profile Badge */}
          {currentUser && (
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-lg border border-[#1e305e] bg-[#0e1938]">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#ff9933]/60"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#1e305e] text-[#ff9933] font-mono text-[10px] font-bold flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="text-left font-mono leading-tight">
                <div className="text-[11px] font-bold text-[#f8fafc] truncate max-w-[120px]">
                  {currentUser.name.split(',')[0]}
                </div>
                <div className="text-[9px] text-[#ff9933] font-semibold">
                  {currentUser.badgeId}
                </div>
              </div>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-header-btn"
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-[#1e305e] bg-[#0e1938] hover:bg-[#14234b] text-[#f8fafc] hover:text-[#ff9933] transition-all font-mono text-xs cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base text-[#ff9933]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="font-semibold text-[11px] hidden xs:inline">{isDark ? 'LIGHT' : 'DARK'}</span>
          </button>

          {/* Lock / Logout Terminal Button */}
          {onLogout && (
            <button
              id="btn-officer-logout"
              onClick={onLogout}
              title="Lock Terminal & Log Out"
              aria-label="Log out"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-[#ef4444]/40 bg-[#ef4444]/10 hover:bg-[#ef4444]/25 text-[#fca5a5] hover:text-[#ffffff] transition-all font-mono text-xs cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="font-bold text-[10px] hidden sm:inline">LOCK TERMINAL</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
