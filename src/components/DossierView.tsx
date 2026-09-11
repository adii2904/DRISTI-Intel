import React, { useState, useEffect } from 'react';
import { IngestFileItem } from '../types';
import { DOSSIER_TARGETS, getTargetById } from '../data/dossierTargets';

export interface DossierViewProps {
  focusedFile?: IngestFileItem | null;
  onClearFileFocus?: () => void;
  selectedTargetId?: string;
  onSelectTarget?: (targetId: string) => void;
}

export const DossierView: React.FC<DossierViewProps> = ({
  focusedFile = null,
  onClearFileFocus,
  selectedTargetId,
  onSelectTarget
}) => {
  const [internalTargetId, setInternalTargetId] = useState<string>(selectedTargetId || 'target-singhania');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BIOMETRICS' | 'FINANCIAL_FIU' | 'HARDWARE_TELCO' | 'EVIDENCE'>('OVERVIEW');
  const [dispatchAlertSent, setDispatchAlertSent] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Synchronize internal target state if prop changes
  useEffect(() => {
    if (selectedTargetId) {
      setInternalTargetId(selectedTargetId);
    }
  }, [selectedTargetId]);

  const currentTargetId = selectedTargetId || internalTargetId;
  const target = getTargetById(currentTargetId);

  const handleTargetChange = (newId: string) => {
    setInternalTargetId(newId);
    onSelectTarget?.(newId);
  };

  // Automatically switch tabs based on the focused file's category
  useEffect(() => {
    if (!focusedFile) return;
    const cat = focusedFile.sourceCategory.toUpperCase();
    const name = focusedFile.name.toUpperCase();

    if (cat.includes('TELCO') || name.includes('CDR') || name.includes('BURNER')) {
      setActiveTab('HARDWARE_TELCO');
    } else if (cat.includes('BANK') || cat.includes('FIN') || name.includes('HDFC') || name.includes('UPI') || name.includes('HAWALA') || name.includes('AXIS')) {
      setActiveTab('FINANCIAL_FIU');
    } else if (cat.includes('CCTV') || name.includes('FACIAL') || name.includes('CCTV')) {
      setActiveTab('BIOMETRICS');
    } else if (cat.includes('VOIP') || name.includes('SIGNAL') || name.includes('INTERCEPT')) {
      setActiveTab('EVIDENCE');
    }
  }, [focusedFile?.id]);

  const handleDispatchAlert = () => {
    setDispatchAlertSent(true);
    setTimeout(() => setDispatchAlertSent(false), 4500);
  };

  const handleExportDossier = () => {
    setExportNotice(`Generated Cryptographic Section 65B BSA 2023 Electronic Dossier for ${target.name} [SHA-256 SEAL: ${target.evidenceItems[0]?.hash.substring(0, 24)}...]`);
    setTimeout(() => setExportNotice(null), 5000);
  };

  return (
    <div className="space-y-5">
      {/* 0. Target Selector Toolbar & Multi-Suspect Switcher */}
      <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-3.5 sm:p-4 shadow-md font-mono">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#1e305e]/80">
          <div className="flex items-center space-x-2.5">
            <span className="material-symbols-outlined text-[#ff9933] text-xl">manage_accounts</span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#f8fafc] tracking-wider uppercase">
                  SELECT TARGET / SUSPECT DOSSIER
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933]/40 font-bold">
                  {DOSSIER_TARGETS.length} SYNDICATE TARGETS
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Switch target profile to dynamically update legal warrants, biometrics, telco CDRs, and FIU financial flows.
              </p>
            </div>
          </div>

          {/* Quick Dropdown Control */}
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <label htmlFor="target-select-dropdown" className="text-xs text-[#94a3b8] whitespace-nowrap hidden sm:inline">
              Active Dossier:
            </label>
            <div className="relative flex-1 sm:w-80">
              <select
                id="target-select-dropdown"
                value={target.id}
                onChange={(e) => handleTargetChange(e.target.value)}
                className="w-full bg-[#070d1e] border border-[#ff9933]/60 focus:border-[#ff9933] text-[#f8fafc] rounded-lg px-3 py-2 text-xs font-bold font-mono outline-none cursor-pointer appearance-none shadow-[0_0_10px_rgba(255,153,51,0.15)] pr-8"
              >
                {DOSSIER_TARGETS.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} [{t.syndicateRole}] — Threat {t.threatScore}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#ff9933] text-sm">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Target Quick-Pills Carousel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3">
          {DOSSIER_TARGETS.map(t => {
            const isSelected = t.id === target.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTargetChange(t.id)}
                className={`flex items-center space-x-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#14234b] border-[#ff9933] shadow-[0_0_12px_rgba(255,153,51,0.25)] ring-1 ring-[#ff9933]'
                    : 'bg-[#070d1e] border-[#1e305e] hover:border-[#ff9933]/50 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="relative w-9 h-11 rounded overflow-hidden border border-[#ff9933]/60 shrink-0 bg-[#070d1e]">
                  <img
                    src={t.mugshotUrl}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#ff9933]/20 border border-[#ff9933]"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
                      THREAT {t.threatScore}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#ff9933] animate-pulse"></span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#f8fafc] truncate mt-0.5 font-sans">
                    {t.name.split(' ')[0]} {t.name.includes('"') ? t.name.split('"')[1] : ''}
                  </div>
                  <div className="text-[10px] text-[#ffb366] truncate font-mono">
                    {t.syndicateRole}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active File Focus Notification Banner */}
      {focusedFile && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#14234b] border border-[#ff9933]/60 rounded-xl text-xs font-mono shadow-[0_0_15px_rgba(255,153,51,0.15)] animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <span className="material-symbols-outlined text-lg text-[#ff9933]">filter_alt</span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[#ff9933] font-bold">ACTIVE DOSSIER FILE FOCUS:</span>
                <span className="text-[#f8fafc] font-semibold">{focusedFile.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ff9933]/20 text-[#ffb366] border border-[#ff9933]/40">
                  {focusedFile.sourceCategory}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Target attributes and cross-references dynamically isolated to data extracted from this intake package.
              </p>
            </div>
          </div>
          {onClearFileFocus && (
            <button
              onClick={onClearFileFocus}
              className="px-3 py-1.5 rounded-lg bg-[#0e1938] hover:bg-[#1a2e63] text-[#f8fafc] hover:text-[#ff9933] border border-[#1e305e] transition-all text-xs font-bold shrink-0 cursor-pointer"
            >
              SHOW ALL INGESTED FILES
            </button>
          )}
        </div>
      )}

      {/* 65B Export Notification */}
      {exportNotice && (
        <div className="p-3 bg-[#0e2a1b] border border-[#22c55e]/60 rounded-xl text-xs font-mono text-[#4edea3] flex items-center justify-between shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-fadeIn">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-base text-[#22c55e]">verified</span>
            <span>{exportNotice}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#22c55e] border border-[#22c55e]/40 px-2 py-0.5 rounded">
            BSA 2023 SEC 65B SEALED
          </span>
        </div>
      )}

      {/* 1. Unified Clean Header Toolbar with Target Summary */}
      <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            {/* Target Mugshot */}
            <div className="relative w-20 h-24 rounded-lg overflow-hidden border-2 border-[#ff9933] shadow-[0_0_15px_rgba(255,153,51,0.25)] shrink-0 bg-[#070d1e]">
              <img
                src={target.mugshotUrl}
                alt={`${target.name} Mugshot`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1 left-1 bg-[#ef4444] text-[#ffffff] text-[8px] font-mono px-1 py-0.2 rounded font-bold">
                {target.locStatus.includes('RED NOTICE') ? 'RED NOTICE' : 'LOC ISSUED'}
              </div>
              <div className="absolute bottom-0.5 inset-x-0.5 text-center font-mono text-[8px] text-[#ff9933] bg-[#070d1e]/90 py-0.2 rounded">
                MATCH {target.biometricMatchPct}%
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#fca5a5] border border-[#ef4444]/40 font-bold uppercase">
                  {target.firRef}
                </span>
                <span className="text-[#ff9933] font-bold uppercase">
                  {target.classificationTag}
                </span>
                <span className="text-[#22c55e] bg-[#138808]/20 px-1.5 py-0.5 rounded border border-[#138808]/40">
                  {target.locRef}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] font-['Space_Grotesk',sans-serif] tracking-wide">
                  {target.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933]/40 font-mono font-bold">
                  [{target.syndicateRole}]
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono text-[#94a3b8]">
                <span>Aliases: <span className="text-[#cbd5e1]">{target.aliases}</span></span>
                <span>•</span>
                <span className="text-[#cbd5e1]">PAN: {target.pan}</span>
                <span>•</span>
                <span className="text-[#cbd5e1]">Passport: {target.passportNo}</span>
                <span>•</span>
                <span className="text-[#ef4444] font-semibold">{target.warrantStatus}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDispatchAlert}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#ef4444] text-[#ffffff] hover:bg-[#dc2626] transition-all font-mono text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">notifications_active</span>
              <span>
                {dispatchAlertSent
                  ? 'INTERCEPT DISPATCHED!'
                  : target.locStatus.includes('RED NOTICE')
                  ? 'TRANSMIT INTERPOL ALERT'
                  : 'DISPATCH IMMIGRATION INTERCEPT'}
              </span>
            </button>
            <button
              onClick={handleExportDossier}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#14234b] text-[#f8fafc] hover:bg-[#1a2e63] transition-all font-mono text-xs border border-[#1e305e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#ff9933]">download</span>
              <span>EXPORT 65B DOSSIER</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Standardized Dynamic Single-Row Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Overall Threat</span>
            <span className="material-symbols-outlined text-base text-[#ef4444]">security</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#ef4444]">{target.threatScore} <span className="text-xs font-normal text-[#94a3b8]">/ 100</span></div>
          </div>
          <div className="text-[10px] text-[#ef4444] font-bold uppercase truncate">
            {target.threatSeverity}
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Network Centrality</span>
            <span className="material-symbols-outlined text-base text-[#ff9933]">hub</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#ff9933]">{target.networkCentrality}</div>
          </div>
          <div className="text-[10px] text-[#94a3b8]">
            {target.correlatedNodes} Syndicate Correlated Nodes
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Flagged Liquidity</span>
            <span className="material-symbols-outlined text-base text-[#38bdf8]">payments</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#38bdf8]">{target.flaggedLiquidity}</div>
          </div>
          <div className="text-[10px] text-[#22c55e] truncate">
            {target.frozenAmount}
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Last Intercept</span>
            <span className="material-symbols-outlined text-base text-[#22c55e]">my_location</span>
          </div>
          <div className="my-2">
            <div className="text-base font-bold text-[#22c55e] truncate">{target.lastInterceptLocation}</div>
          </div>
          <div className="text-[10px] text-[#ff9933] truncate">
            {target.lastInterceptDetail}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1.5 border-b border-[#1e305e] pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'OVERVIEW', label: 'CCTNS & Legal Profile', icon: 'gavel' },
          { id: 'BIOMETRICS', label: 'Biometric FaceNet Grid', icon: 'face' },
          { id: 'FINANCIAL_FIU', label: 'FIU-IND UPI & Hawala', icon: 'account_balance' },
          { id: 'HARDWARE_TELCO', label: 'Telco CDR & FASTag', icon: 'devices' },
          { id: 'EVIDENCE', label: `BSA 65B Evidence (${target.evidenceItems.length})`, icon: 'verified' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933] font-semibold'
                : 'bg-[#0e1938] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e305e]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content 1: CCTNS Legal Profile */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Legal Prosecution Profile */}
          <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-5 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold font-mono text-[#f8fafc] uppercase tracking-wider flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#ff9933] text-sm">gavel</span>
              <span>CCTNS Criminal History &amp; Judicial Warrants</span>
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 bg-[#070d1e] rounded-lg border border-[#1e305e] space-y-1">
                <div className="text-[#ff9933] font-bold">{target.cctnsProsecution.firTitle}</div>
                <div className="text-[#cbd5e1] text-[11px] leading-relaxed">Offences: {target.cctnsProsecution.offenses}</div>
                <div className="text-[10px] text-[#94a3b8]">Investigating Officer: {target.cctnsProsecution.io}</div>
              </div>

              <div className="p-3 bg-[#070d1e] rounded-lg border border-[#1e305e] space-y-1">
                <div className="text-[#ef4444] font-bold">{target.cctnsProsecution.warrantTitle}</div>
                <div className="text-[#cbd5e1] text-[11px]">{target.cctnsProsecution.warrantCourt}</div>
                <div className="text-[10px] text-[#94a3b8]">{target.cctnsProsecution.warrantNo}</div>
              </div>

              <div className="p-3 bg-[#070d1e] rounded-lg border border-[#1e305e] space-y-1">
                <div className="text-[#22c55e] font-bold">{target.cctnsProsecution.locTitle}</div>
                <div className="text-[#cbd5e1] text-[11px]">{target.cctnsProsecution.locCircular}</div>
                <div className="text-[10px] text-[#94a3b8]">{target.cctnsProsecution.locAction}</div>
              </div>
            </div>
          </div>

          {/* Behavioral Risk Matrix */}
          <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-5 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold font-mono text-[#f8fafc] uppercase tracking-wider flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#38bdf8] text-sm">analytics</span>
              <span>Threat &amp; Counter-Surveillance Vector Assessment</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1 text-[11px]">
                  <span className="text-[#94a3b8]">Burner SIM Rotation Velocity:</span>
                  <span className="text-[#ef4444] font-bold">{target.riskVector.burnerRotationLabel}</span>
                </div>
                <div className="w-full h-1.5 bg-[#070d1e] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ef4444] rounded-full" style={{ width: `${target.riskVector.burnerRotationPct}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-[11px]">
                  <span className="text-[#94a3b8]">Hawala Layering Complexity:</span>
                  <span className="text-[#ff9933] font-bold">{target.riskVector.hawalaComplexityLabel}</span>
                </div>
                <div className="w-full h-1.5 bg-[#070d1e] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff9933] rounded-full" style={{ width: `${target.riskVector.hawalaComplexityPct}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-[11px]">
                  <span className="text-[#94a3b8]">Cross-Border Flight Risk:</span>
                  <span className="text-[#ef4444] font-bold">{target.riskVector.flightRiskLabel}</span>
                </div>
                <div className="w-full h-1.5 bg-[#070d1e] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ef4444] rounded-full" style={{ width: `${target.riskVector.flightRiskPct}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-[#070d1e] rounded-lg border border-[#1e305e] text-[11px] text-[#cbd5e1] leading-relaxed">
                <span className="text-[#ff9933] font-bold block mb-1">AUTOMATED INTERCEPTION HEURISTIC:</span>
                {target.riskVector.heuristicSummary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Biometrics */}
      {activeTab === 'BIOMETRICS' && (
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold font-mono text-[#ff9933] uppercase flex items-center space-x-2">
              <span className="material-symbols-outlined text-sm">face</span>
              <span>Biometric FaceNet Recognition &amp; Interpol / CCTNS Optical Matching</span>
            </h3>
            <span className="text-xs font-mono text-[#22c55e] font-bold bg-[#138808]/20 px-2 py-0.5 rounded border border-[#138808]/40">
              MATCH: {target.biometricMatchPct}% CONFIDENCE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-[#070d1e] rounded-lg border border-[#1e305e]">
              <div className="text-xs font-mono text-[#94a3b8] mb-2 truncate">{target.referencePhotoLabel}</div>
              <img src={target.referencePhotoUrl} alt="Reference Photo" className="w-full h-48 object-cover rounded" referrerPolicy="no-referrer" />
              <div className="mt-2 text-[10px] font-mono text-[#22c55e]">Baseline Facial Vector Extracted</div>
            </div>

            <div className="p-3 bg-[#070d1e] rounded-lg border border-[#1e305e]">
              <div className="text-xs font-mono text-[#94a3b8] mb-2 truncate">{target.liveCctvLabel}</div>
              <img src={target.mugshotUrl} alt="Live CCTV" className="w-full h-48 object-cover rounded border border-[#ff9933]" referrerPolicy="no-referrer" />
              <div className="mt-2 text-[10px] font-mono text-[#ff9933] font-bold">Matched: {target.biometricMatchPct}% Cosine Similarity</div>
            </div>

            <div className="p-3 bg-[#070d1e] rounded-lg border border-[#1e305e] flex flex-col justify-between font-mono text-xs space-y-2">
              <span className="text-[#f8fafc] font-bold text-xs uppercase">Biometric Match Parameters</span>
              <div className="space-y-1.5 text-[11px] text-[#cbd5e1]">
                <div>Inter-pupillary Distance: <span className="text-[#38bdf8] font-bold">{target.biometricParams.ipd}</span></div>
                <div>Nasal Bridge Curvature: <span className="text-[#38bdf8] font-bold">{target.biometricParams.nasalCurvature}</span></div>
                <div>Mandibular Angle: <span className="text-[#38bdf8] font-bold">{target.biometricParams.mandibularAngle}</span></div>
                <div>Confidence Score: <span className="text-[#22c55e] font-bold">{target.biometricParams.confidenceScore}</span></div>
                <div>Algorithm: <span className="text-[#ff9933]">{target.biometricParams.algorithm}</span></div>
              </div>
              <div className="p-2 bg-[#138808]/20 border border-[#138808]/40 rounded text-[#4edea3] text-[10px] leading-relaxed">
                {target.biometricParams.legalNote}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Financial & FIU */}
      {activeTab === 'FINANCIAL_FIU' && (
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-[#38bdf8] uppercase flex items-center space-x-2">
              <span className="material-symbols-outlined text-sm">account_balance</span>
              <span>FIU-IND Hawala Structured Accounts &amp; PMLA Attachment Orders ({target.name})</span>
            </h4>
            <span className="text-[#38bdf8] text-xs font-bold bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/30">
              TOTAL LIQUIDITY: {target.flaggedLiquidity}
            </span>
          </div>

          <div className="space-y-2">
            {target.fiuAccounts.map((acc, i) => (
              <div key={i} className="p-3 bg-[#070d1e] rounded-lg border border-[#1e305e] flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-[#f8fafc] font-bold">{acc.bank}</span>
                  <span className="text-[#94a3b8] text-[10px] ml-2">A/C: {acc.acc}</span>
                  <div className="text-[10px] text-[#ffb366] mt-0.5">{acc.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#f8fafc]">{acc.balance}</div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    acc.status.includes('FROZEN') ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40' : 'bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933]/40'
                  }`}>
                    {acc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: Hardware & Telco CDR */}
      {activeTab === 'HARDWARE_TELCO' && (
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
          <h4 className="text-xs font-bold text-[#ff9933] uppercase flex items-center space-x-2">
            <span className="material-symbols-outlined text-sm">memory</span>
            <span>Telco CDR Telemetry &amp; VAHAN / FASTag Intercepts ({target.name})</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#070d1e] rounded-lg border border-[#1e305e] space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[#ff9933] font-bold">{target.telcoCdr.burnerTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 font-bold">
                  {target.telcoCdr.status}
                </span>
              </div>
              <div>MSISDN: <span className="text-[#f8fafc] font-bold">{target.telcoCdr.msisdn}</span></div>
              <div>IMEI: <span className="text-[#f8fafc]">{target.telcoCdr.imei}</span></div>
              <div>Tower Sector: <span className="text-[#ff9933]">{target.telcoCdr.towerSector}</span></div>
              <div>Roaming Status: <span className="text-[#f8fafc]">{target.telcoCdr.roamingStatus}</span></div>
            </div>

            <div className="p-3.5 bg-[#070d1e] rounded-lg border border-[#1e305e] space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[#22c55e] font-bold">{target.telcoCdr.vahanTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#fca5a5] border border-[#ef4444]/40 font-bold">
                  {target.telcoCdr.vahanStatus}
                </span>
              </div>
              <div>Vehicle Reg: <span className="text-[#f8fafc] font-bold">{target.telcoCdr.vahanReg}</span></div>
              <div>FASTag RFID: <span className="text-[#f8fafc]">{target.telcoCdr.fastagRfid}</span></div>
              <div>Last Toll: <span className="text-[#f8fafc]">{target.telcoCdr.lastToll}</span></div>
              <div>Discrepancy: <span className="text-[#ef4444] font-bold">{target.telcoCdr.discrepancy}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: BSA 65B Evidence */}
      {activeTab === 'EVIDENCE' && (
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-5 shadow-sm space-y-3.5 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-[#ff9933] uppercase flex items-center space-x-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Evidentiary Items Linked to {target.name} under Section 65B BSA 2023</span>
            </h4>
            <span className="text-[10px] text-[#22c55e] bg-[#138808]/20 px-2 py-0.5 rounded border border-[#138808]/40 font-bold">
              {target.evidenceItems.length} SEALED EXHIBITS
            </span>
          </div>

          <div className="space-y-2">
            {target.evidenceItems.map(ev => (
              <div key={ev.id} className="p-2.5 bg-[#070d1e] rounded-lg border border-[#1e305e] flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-[#ff9933] font-bold mr-2">{ev.id}</span>
                  <span className="text-[#f8fafc] font-semibold">{ev.title}</span>
                  <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate max-w-lg font-mono">
                    SHA-256 SEAL: {ev.hash}
                  </div>
                </div>
                <span className="text-[#22c55e] text-[10px] px-2 py-0.5 rounded bg-[#138808]/20 border border-[#138808]/40 whitespace-nowrap self-start md:self-auto font-bold">
                  {ev.statusBadge || 'BSA 65B SEALED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
