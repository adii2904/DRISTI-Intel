import React, { useState } from 'react';
import { AuthUser } from '../types';
import { DEMO_OFFICERS, authenticateOfficer, setStoredAuth } from '../data/officers';
import { useTheme } from '../context/ThemeContext';
import { ASSETS } from '../data/mockData';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

type LoginMode = 'username' | 'id';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { isDark, toggleTheme } = useTheme();

  // Login Method Mode: 'username' or 'id'
  const [loginMode, setLoginMode] = useState<LoginMode>('username');

  // Input Fields
  const [username, setUsername] = useState<string>('v.malhotra');
  const [serviceId, setServiceId] = useState<string>('IPS-DL-9942');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Field validation errors
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [handshakeMessage, setHandshakeMessage] = useState<string>('');

  const currentIdentifier = loginMode === 'username' ? username : serviceId;

  // Handle switching tabs
  const handleModeChange = (newMode: LoginMode) => {
    setLoginMode(newMode);
    setErrors({});
    // Sync default demo credentials if present
    if (newMode === 'username') {
      const match = DEMO_OFFICERS.find(o => o.serviceId.toLowerCase() === serviceId.toLowerCase());
      if (match) {
        setUsername(match.username);
      }
    } else {
      const match = DEMO_OFFICERS.find(o => o.username.toLowerCase() === username.toLowerCase());
      if (match) {
        setServiceId(match.serviceId);
      }
    }
  };

  // Quick 1-click autofill for testing
  const handleAutofill = (officer: typeof DEMO_OFFICERS[0]) => {
    if (loginMode === 'username') {
      setUsername(officer.username);
    } else {
      setServiceId(officer.serviceId);
    }
    setPassword(officer.password);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { identifier?: string; password?: string; general?: string } = {};

    const identifierVal = loginMode === 'username' ? username.trim() : serviceId.trim();
    const passwordVal = password.trim();

    if (!identifierVal) {
      newErrors.identifier = loginMode === 'username'
        ? 'Username is required for login'
        : 'Service / Officer ID is required for login';
    }

    if (!passwordVal) {
      newErrors.password = 'Password is required for login';
    } else if (passwordVal.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setHandshakeMessage('AUTHENTICATING CREDENTIALS WITH MHA SECURE DIRECTORY...');

    setTimeout(() => {
      const authResult = authenticateOfficer(loginMode, identifierVal, passwordVal);

      if (authResult.success && authResult.user) {
        setHandshakeMessage('CREDENTIALS VERIFIED // ESTABLISHING SECURE SESSION...');
        setTimeout(() => {
          if (rememberMe) {
            setStoredAuth(authResult.user!);
          }
          setIsSubmitting(false);
          onLoginSuccess(authResult.user!);
        }, 350);
      } else {
        setIsSubmitting(false);
        setHandshakeMessage('');
        setErrors({
          general: authResult.error || 'Authentication failed. Please check your credentials.'
        });
      }
    }, 450);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-[#ff9933]/30 transition-colors duration-200 ${
      isDark ? 'bg-[#070d1e] text-[#e2e8f0]' : 'bg-[#f1f5f9] text-[#0f172a]'
    }`}>
      {/* Top Protocol Status Bar */}
      <div className="bg-[#0b132b] border-b border-[#1e305e] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
        <div className="flex items-center space-x-2 text-[#ff9933]">
          <span className="w-2 h-2 rounded-full bg-[#ff9933] animate-pulse"></span>
          <span className="font-bold tracking-widest uppercase">MHA RESTRICTED // INTELLIGENCE NETWORK</span>
        </div>
        <div className="flex items-center space-x-3 text-[#94a3b8]">
          <span className="hidden sm:inline">GOVERNMENT OF INDIA // MINISTRY OF HOME AFFAIRS</span>
          <span className="text-[#334155]">•</span>
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-1 text-[#ff9933] hover:underline cursor-pointer"
            title="Toggle theme"
          >
            <span className="material-symbols-outlined text-xs">{isDark ? 'light_mode' : 'dark_mode'}</span>
            <span>{isDark ? 'LIGHT MODE' : 'DARK MODE'}</span>
          </button>
        </div>
      </div>

      {/* Main Login Screen Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-2xl bg-[#0b132b] border border-[#1e305e] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Top Emblem Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0e1938] border border-[#ff9933]/50 flex items-center justify-center p-2 mb-3 shadow-inner">
              <img
                src={ASSETS.emblem}
                alt="DRISTI Emblem"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,153,51,0.5)]"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-wider font-['Space_Grotesk',sans-serif] text-[#ffffff] flex items-center space-x-2">
              <span>DRISTI</span>
              <span className="text-[#ff9933]">INTEL</span>
            </h1>
            <p className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mt-1">
              Defense Risk & Intelligence Security Tracking Interface
            </p>
          </div>

          {/* Login Mode Selector Tabs: Username & Password vs ID & Password */}
          <div className="mb-6">
            <div className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider text-center mb-2 font-bold">
              Choose Authentication Method
            </div>
            <div className="grid grid-cols-2 gap-2 bg-[#070d1e] p-1 rounded-xl border border-[#1e305e]">
              <button
                type="button"
                id="tab-login-username"
                onClick={() => handleModeChange('username')}
                className={`py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  loginMode === 'username'
                    ? 'bg-[#ff9933] text-[#070d1e] shadow-md'
                    : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0e1938]'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>Username &amp; Password</span>
              </button>

              <button
                type="button"
                id="tab-login-id"
                onClick={() => handleModeChange('id')}
                className={`py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  loginMode === 'id'
                    ? 'bg-[#ff9933] text-[#070d1e] shadow-md'
                    : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0e1938]'
                }`}
              >
                <span className="material-symbols-outlined text-base">badge</span>
                <span>Officer ID &amp; Password</span>
              </button>
            </div>
          </div>

          {/* General Error Banner */}
          {errors.general && (
            <div className="mb-5 p-3 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/50 text-[#fca5a5] text-xs font-mono flex items-center space-x-2 animate-shake">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Main Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Username OR Officer / Service ID */}
            <div>
              <label className="block text-xs font-mono text-[#cbd5e1] uppercase tracking-wider mb-1.5 font-semibold">
                {loginMode === 'username' ? (
                  <span>
                    Officer Username <span className="text-[#f87171]">*</span>
                  </span>
                ) : (
                  <span>
                    Officer / Service ID <span className="text-[#f87171]">*</span>
                  </span>
                )}
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                  <span className="material-symbols-outlined text-base">
                    {loginMode === 'username' ? 'person' : 'badge'}
                  </span>
                </span>
                <input
                  id="login-identifier-input"
                  type="text"
                  disabled={isSubmitting}
                  value={currentIdentifier}
                  onChange={(e) => {
                    if (loginMode === 'username') {
                      setUsername(e.target.value);
                    } else {
                      setServiceId(e.target.value);
                    }
                    if (errors.identifier) {
                      setErrors(prev => ({ ...prev, identifier: undefined }));
                    }
                  }}
                  placeholder={
                    loginMode === 'username'
                      ? 'e.g. v.malhotra, ananya.roy, or k.sengupta'
                      : 'e.g. IPS-DL-9942, IB-SIGINT-4410, or ED-PMLA-7721'
                  }
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#070d1e] border rounded-lg text-xs font-mono text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:ring-1 transition-all ${
                    errors.identifier
                      ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]'
                      : 'border-[#1e305e] focus:border-[#ff9933] focus:ring-[#ff9933]'
                  }`}
                  autoComplete={loginMode === 'username' ? 'username' : 'off'}
                />
              </div>

              {errors.identifier && (
                <p className="mt-1 text-[11px] font-mono text-[#f87171] flex items-center space-x-1">
                  <span className="material-symbols-outlined text-xs">warning</span>
                  <span>{errors.identifier}</span>
                </p>
              )}
            </div>

            {/* Field 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-[#cbd5e1] uppercase tracking-wider font-semibold">
                  Password <span className="text-[#f87171]">*</span>
                </label>
                <span className="text-[10px] font-mono text-[#94a3b8]">
                  Demo: <code className="text-[#ff9933] bg-[#070d1e] px-1 py-0.5 rounded">password123</code>
                </span>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                  <span className="material-symbols-outlined text-base">lock</span>
                </span>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="Enter your security password"
                  className={`w-full pl-10 pr-11 py-2.5 bg-[#070d1e] border rounded-lg text-xs font-mono text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:ring-1 transition-all ${
                    errors.password
                      ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]'
                      : 'border-[#1e305e] focus:border-[#ff9933] focus:ring-[#ff9933]'
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="btn-toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748b] hover:text-[#f8fafc] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-[11px] font-mono text-[#f87171] flex items-center space-x-1">
                  <span className="material-symbols-outlined text-xs">warning</span>
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Help Links */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8] pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1e305e] text-[#ff9933] focus:ring-0 focus:ring-offset-0 bg-[#070d1e]"
                />
                <span>Remember session</span>
              </label>

              <span className="text-[#64748b] hover:text-[#94a3b8] transition-colors cursor-help" title="Contact the NIC Cyber Grid Security Operations Desk at Lodhi Road for account resets.">
                Need Help? (NIC Desk)
              </span>
            </div>

            {/* Handshake Loading Indicator */}
            {isSubmitting && (
              <div className="p-3 rounded-lg bg-[#070d1e] border border-[#ff9933]/50 font-mono text-xs text-[#ff9933] space-y-1 animate-pulse">
                <div className="flex items-center space-x-2 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#ff9933] animate-ping"></span>
                  <span>AUTHORIZING SECURE CREDENTIALS...</span>
                </div>
                <div className="text-[11px] text-[#cbd5e1] pl-4">{handshakeMessage}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#ff9933] hover:bg-[#e68a00] text-[#070d1e] font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,153,51,0.3)] transition-all cursor-pointer disabled:opacity-50 mt-3"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>
                {isSubmitting
                  ? 'VERIFYING CREDENTIALS...'
                  : loginMode === 'username'
                  ? 'LOGIN WITH USERNAME & PASSWORD'
                  : 'LOGIN WITH OFFICER ID & PASSWORD'}
              </span>
            </button>
          </form>

          {/* Quick Demo Credentials Card Section */}
          <div className="mt-6 pt-5 border-t border-[#1e305e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider font-bold">
                Pre-authorized Demo Accounts (Click to Fill)
              </span>
              <span className="text-[9px] font-mono text-[#ff9933] bg-[#ff9933]/15 px-2 py-0.5 rounded border border-[#ff9933]/30">
                1-CLICK AUTOFILL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_OFFICERS.map((officer) => {
                const isSelected =
                  loginMode === 'username'
                    ? username === officer.username
                    : serviceId === officer.serviceId;

                return (
                  <button
                    key={officer.id}
                    type="button"
                    onClick={() => handleAutofill(officer)}
                    className={`p-2.5 rounded-lg border text-left font-mono transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#ff9933] bg-[#14234b]'
                        : 'border-[#1e305e] bg-[#070d1e] hover:border-[#ff9933]/60 hover:bg-[#0e1938]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#f8fafc] truncate">{officer.name.split(',')[0]}</div>
                      <div className="text-[10px] text-[#ff9933] mt-0.5 truncate">
                        {loginMode === 'username' ? `@${officer.username}` : officer.serviceId}
                      </div>
                    </div>
                    <div className="text-[9px] text-[#94a3b8] mt-2 pt-1 border-t border-[#1e305e]/60 flex items-center justify-between">
                      <span>Pass: {officer.password}</span>
                      <span className="material-symbols-outlined text-[12px] text-[#ff9933]">arrow_forward</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Notice */}
          <div className="mt-5 pt-3 border-t border-[#1e305e] text-center">
            <p className="text-[9px] font-mono text-[#64748b]">
              Authorized for Ministry of Home Affairs &amp; Law Enforcement Personnel Only. Access logged under Sections 43 &amp; 66 IT Act, 2000.
            </p>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Bar */}
      <div className="bg-[#070d1e] border-t border-[#1e305e] px-4 py-2 text-[10px] font-mono text-[#64748b] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-[#94a3b8]">
          <span className="text-[#ff9933] font-bold">DRISTI INTEL v4.2</span>
          <span>•</span>
          <span>SPECIAL CELL CYBER FORENSICS // MHA SECURE ENCLAVE</span>
        </div>
        <div className="text-[#4edea3] flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
          <span>TLS 1.3 256-BIT ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};
