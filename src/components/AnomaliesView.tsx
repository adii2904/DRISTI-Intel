import React, { useState } from 'react';
import { AnomalyItem } from '../types';
import { ANOMALIES_DATA } from '../data/mockData';

export const AnomaliesView: React.FC = () => {
  const [anomalies] = useState<AnomalyItem[]>(ANOMALIES_DATA);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(ANOMALIES_DATA[0]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [isDeepScanning, setIsDeepScanning] = useState<boolean>(false);

  const triggerDeepScan = () => {
    setIsDeepScanning(true);
    setTimeout(() => {
      setIsDeepScanning(false);
    }, 1800);
  };

  const filteredAnomalies = selectedSeverity === 'ALL'
    ? anomalies
    : anomalies.filter(a => a.severity === selectedSeverity);

  const criticalCount = anomalies.filter(a => a.severity === 'CRITICAL').length;
  const highCount = anomalies.filter(a => a.severity === 'HIGH').length;
  const avgRiskScore = Math.round(anomalies.reduce((acc, a) => acc + a.riskScore, 0) / anomalies.length);

  return (
    <div className="space-y-5">
      {/* 1. Unified Clean Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ff9933] uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">crisis_alert</span>
            <span>THREAT SURFACE &amp; AI // HEURISTIC RADAR</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] font-['Space_Grotesk',sans-serif] tracking-wide">
            Threat Surface &amp; AI Correlation
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5 max-w-2xl">
            Automated multi-source anomaly detection, spatiotemporal CDR tower mismatch, and FASTag toll RFID velocity heuristics.
          </p>
        </div>

        {/* Action & Status */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="px-2.5 py-1.5 rounded-lg bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#fca5a5] font-mono text-[11px] flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-sm">priority_high</span>
            <span>{criticalCount} Critical Alerts</span>
          </div>

          <button
            id="btn-trigger-scan"
            onClick={triggerDeepScan}
            disabled={isDeepScanning}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#ff9933] text-[#070d1e] hover:bg-[#ffb366] transition-all font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,153,51,0.25)] disabled:opacity-50 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-sm ${isDeepScanning ? 'animate-spin' : ''}`}>
              {isDeepScanning ? 'radar' : 'auto_fix_high'}
            </span>
            <span>{isDeepScanning ? 'ANALYZING MESH...' : 'RUN HEURISTIC SCAN'}</span>
          </button>
        </div>
      </div>

      {/* 2. Standardized Single-Row Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Total Anomalies</span>
            <span className="material-symbols-outlined text-base text-[#ff9933]">warning</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#f8fafc]">{anomalies.length}</div>
          </div>
          <div className="text-[10px] text-[#94a3b8]">
            Across All Sensors
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Critical Flags</span>
            <span className="material-symbols-outlined text-base text-[#ef4444]">error</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#ef4444]">{criticalCount}</div>
          </div>
          <div className="text-[10px] text-[#ef4444]">
            Immediate Action Required
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>High Severity</span>
            <span className="material-symbols-outlined text-base text-[#ffb366]">report_problem</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#ffb366]">{highCount}</div>
          </div>
          <div className="text-[10px] text-[#ffb366]">
            Under Active Surveillance
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Avg Risk Score</span>
            <span className="material-symbols-outlined text-base text-[#38bdf8]">speed</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#38bdf8]">{avgRiskScore} <span className="text-xs font-normal text-[#94a3b8]">/ 100</span></div>
          </div>
          <div className="text-[10px] text-[#22c55e] flex items-center space-x-1">
            <span className="material-symbols-outlined text-xs">verified</span>
            <span>AI Confidence: 98%</span>
          </div>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#1e305e] pb-2 text-xs font-mono">
        <div className="flex items-center space-x-1.5">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                selectedSeverity === sev
                  ? 'bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933]/60 font-semibold'
                  : 'bg-[#0e1938] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e305e]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[#94a3b8]">
          Showing {filteredAnomalies.length} Flagged Inconsistencies
        </span>
      </div>

      {/* Threat List & Explainability Engine Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Anomalies List */}
        <div className="xl:col-span-7 space-y-3">
          {filteredAnomalies.map(anom => {
            const isSelected = selectedAnomaly?.id === anom.id;
            return (
              <div
                key={anom.id}
                onClick={() => setSelectedAnomaly(anom)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff9933]/10 border-[#ff9933] shadow-[0_0_15px_rgba(255,153,51,0.2)]'
                    : 'bg-[#0e1938] border-[#1e305e] hover:border-[#ff9933]/50 hover:bg-[#14234b]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        anom.severity === 'CRITICAL'
                          ? 'bg-[#ef4444] text-[#ffffff]'
                          : anom.severity === 'HIGH'
                          ? 'bg-[#ff9933]/30 text-[#ffb366] border border-[#ff9933]/40'
                          : 'bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40'
                      }`}>
                        {anom.severity}
                      </span>
                      <span className="text-[10px] font-mono text-[#ff9933]">{anom.id}</span>
                      <span className="text-[10px] font-mono text-[#94a3b8]">{anom.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#f8fafc] mt-1.5 font-['Space_Grotesk',sans-serif]">{anom.title}</h4>
                    <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2">{anom.summary}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-mono font-bold text-[#ef4444]">{anom.riskScore}</div>
                    <span className="text-[9px] font-mono text-[#94a3b8]">THREAT SCORE</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1e305e] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#38bdf8] flex items-center space-x-1">
                    <span className="material-symbols-outlined text-xs">person</span>
                    <span>{anom.entityName}</span>
                  </span>
                  <span className="text-[#ff9933] flex items-center space-x-1 font-semibold">
                    <span>Inspect AI Rationale</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: AI Explainability Engine */}
        <div className="xl:col-span-5 bg-[#0e1938] border border-[#1e305e] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e305e] pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#ff9933]">
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span className="font-bold">AI EXPLAINABILITY ENGINE</span>
            </div>
            <span className="text-[10px] font-mono text-[#22c55e] bg-[#138808]/20 px-2 py-0.5 rounded border border-[#138808]/40 font-bold">
              CONFIDENCE: {selectedAnomaly ? selectedAnomaly.explanation.modelConfidence : 98}%
            </span>
          </div>

          {selectedAnomaly ? (
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-mono text-[#ff9933] uppercase tracking-wider block font-bold">IDENTIFIED PATTERN</span>
                <h4 className="text-base font-bold text-[#f8fafc] mt-0.5 font-['Space_Grotesk',sans-serif]">{selectedAnomaly.title}</h4>
                <div className="text-xs font-mono text-[#94a3b8] mt-0.5">Primary Target: {selectedAnomaly.entityName}</div>
              </div>

              {/* Natural Language AI Reasoning */}
              <div className="p-3.5 bg-[#070d1e] rounded-lg border border-[#ff9933]/30">
                <span className="text-[10px] font-mono text-[#ff9933] uppercase block mb-1 flex items-center space-x-1 font-bold">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  <span>Neural Reasoning &amp; Context Rationale</span>
                </span>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  {selectedAnomaly.explanation.reasoning}
                </p>
              </div>

              {/* Telemetry Factors */}
              <div>
                <span className="text-[10px] font-mono text-[#94a3b8] uppercase block mb-1.5 font-bold">
                  Corroborating Telemetry Vectors:
                </span>
                <div className="space-y-1 font-mono text-xs">
                  {selectedAnomaly.explanation.telemetryFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start space-x-2 p-2 bg-[#070d1e] rounded-md border border-[#1e305e]">
                      <span className="text-[#ff9933] text-xs">●</span>
                      <span className="text-[#cbd5e1] text-[11px]">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Citations */}
              <div>
                <span className="text-[10px] font-mono text-[#94a3b8] uppercase block mb-1.5 font-bold">
                  BSA 2023 Evidentiary Citations:
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {selectedAnomaly.explanation.citations.map(cit => (
                    <div key={cit.evidenceId} className="p-2.5 bg-[#070d1e] rounded-md border border-[#1e305e]">
                      <div className="flex justify-between text-[#ff9933] font-bold text-[11px]">
                        <span>{cit.evidenceId}</span>
                        <span className="text-[#22c55e] text-[9px] bg-[#138808]/20 px-1 py-0.2 rounded border border-[#138808]/40">SEC 65B</span>
                      </div>
                      <div className="text-[#f8fafc] text-[11px] mt-0.5">{cit.source}</div>
                      <div className="text-[#94a3b8] text-[9px] mt-1 break-all select-all font-mono">
                        SHA-256: {cit.hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#94a3b8] font-mono text-xs">
              Select an anomaly item to inspect AI reasoning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
