import React, { useState } from 'react';
import { CaseRecord } from '../types';
import { useTheme } from '../context/ThemeContext';

interface GraphTransferModalProps {
  caseRecord: CaseRecord;
  onClose: () => void;
  onNavigateToGraph: () => void;
}

export const GraphTransferModal: React.FC<GraphTransferModalProps> = ({
  caseRecord,
  onClose,
  onNavigateToGraph,
}) => {
  const { isDark } = useTheme();
  const [transferred, setTransferred] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleExecuteSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setTransferred(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-2xl flex flex-col rounded-xl border shadow-2xl overflow-hidden ${
          isDark 
            ? 'bg-[#0b132b] border-[#1e305e] text-[#f8fafc]' 
            : 'bg-white border-[#cbd5e1] text-[#0f172a]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'bg-[#070d1e] border-[#1e305e]' : 'bg-[#f8fafc] border-[#e2e8f0]'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#ff9933]/15 border border-[#ff9933]/50 flex items-center justify-center text-[#ff9933]">
              <span className="material-symbols-outlined text-xl">hub</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-wide">
                SYNC CASE ENTITIES TO DRISTI KNOWLEDGE GRAPH
              </h3>
              <p className={`text-xs font-mono ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                {caseRecord.caseNo} // {caseRecord.agencyFullName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isDark 
                ? 'hover:bg-[#1e305e] text-[#94a3b8] hover:text-white' 
                : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
            transferred
              ? 'bg-[#22c55e]/15 border-[#22c55e]/40 text-[#22c55e]'
              : isDark
                ? 'bg-[#0e1938] border-[#1e305e] text-[#e2e8f0]'
                : 'bg-slate-50 border-[#cbd5e1] text-slate-800'
          }`}>
            <span className="material-symbols-outlined text-2xl shrink-0 text-[#ff9933]">
              {transferred ? 'task_alt' : 'device_hub'}
            </span>
            <div className="text-xs font-mono">
              {transferred ? (
                <div>
                  <span className="font-bold text-[#22c55e]">GRAPH TOPOLOGY UPDATED!</span>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    Extracted target nodes and financial links are now projected onto the live intelligence mesh with risk scores and hawala paths.
                  </p>
                </div>
              ) : (
                <div>
                  <span className="font-bold text-[#ff9933]">CROSS-AGENCY TOPOLOGY MERGE:</span>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    Transferring these entities will immediately correlate this case against existing Operation TRIDENT entities (e.g. Vikramaditya Singhania, Vajra Logistics, and Bank Escrows).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Entity Summary Cards */}
          <div className="space-y-3">
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-[#ff9933]' : 'text-[#ea580c]'
            }`}>
              Entities Ready for Network Injection ({caseRecord.accusedRoster.length + caseRecord.seizedAssetTrail.length} Nodes)
            </h4>

            {/* Accused Target Nodes */}
            <div className={`p-3 rounded-lg border space-y-2 ${
              isDark ? 'bg-[#070d1e]/80 border-[#1e305e]' : 'bg-slate-50 border-[#e2e8f0]'
            }`}>
              <div className="text-[11px] font-mono font-bold text-[#ff9933] flex items-center justify-between">
                <span>TARGET &amp; PERSON NODES ({caseRecord.accusedRoster.length})</span>
                <span className="text-[10px] text-[#94a3b8]">Node Type: PERSON / BENEFICIARY</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {caseRecord.accusedRoster.map((acc) => (
                  <div 
                    key={acc.id}
                    className={`p-2 rounded border flex items-center justify-between ${
                      isDark ? 'bg-[#0e1938] border-[#1e305e]' : 'bg-white border-[#cbd5e1]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{acc.name}</div>
                      <div className="text-[10px] text-[#94a3b8]">{acc.alias || acc.role}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40">
                      Risk {acc.riskScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial & Hardware Nodes */}
            <div className={`p-3 rounded-lg border space-y-2 ${
              isDark ? 'bg-[#070d1e]/80 border-[#1e305e]' : 'bg-slate-50 border-[#e2e8f0]'
            }`}>
              <div className="text-[11px] font-mono font-bold text-[#38bdf8] flex items-center justify-between">
                <span>FINANCIAL &amp; ASSET NODES ({caseRecord.seizedAssetTrail.length})</span>
                <span className="text-[10px] text-[#94a3b8]">Node Type: ACCOUNT / VPA / HARDWARE</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {caseRecord.seizedAssetTrail.slice(0, 3).map((ast) => (
                  <div 
                    key={ast.id}
                    className={`p-2 rounded border flex items-center justify-between ${
                      isDark ? 'bg-[#0e1938] border-[#1e305e]' : 'bg-white border-[#cbd5e1]'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="font-bold truncate">{ast.identifier}</div>
                      <div className="text-[10px] text-[#94a3b8] truncate">{ast.description}</div>
                    </div>
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40">
                      {ast.estimatedValue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${
          isDark ? 'bg-[#070d1e] border-[#1e305e]' : 'bg-[#f8fafc] border-[#e2e8f0]'
        }`}>
          <div className="text-[11px] font-mono text-[#94a3b8]">
            DRISTI Graph Sync Engine v4.2
          </div>

          <div className="flex items-center space-x-3">
            {transferred ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToGraph();
                }}
                className="px-5 py-2 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold font-mono flex items-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">hub</span>
                <span>Open in DRISTI Knowledge Graph</span>
              </button>
            ) : (
              <button
                onClick={handleExecuteSync}
                disabled={syncing}
                className="px-5 py-2 rounded-lg bg-[#ff9933] hover:bg-[#ffaa4d] disabled:opacity-50 text-[#070d1e] text-xs font-bold font-mono flex items-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  {syncing ? 'sync' : 'share'}
                </span>
                <span>{syncing ? 'Injecting Nodes...' : 'Confirm Knowledge Graph Transfer'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border text-xs font-medium font-mono transition-all cursor-pointer ${
                isDark 
                  ? 'border-[#1e305e] hover:bg-[#14234b] text-[#cbd5e1]' 
                  : 'border-[#cbd5e1] hover:bg-slate-100 text-slate-700'
              }`}
            >
              {transferred ? 'Done' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
