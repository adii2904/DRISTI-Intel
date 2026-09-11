import React, { useState } from 'react';
import { VaultEvidence } from '../types';
import { EVIDENCE_VAULT } from '../data/mockData';

export const VaultView: React.FC = () => {
  const [evidenceItems] = useState<VaultEvidence[]>(EVIDENCE_VAULT);
  const [verifyingAll, setVerifyingAll] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<VaultEvidence | null>(null);

  const verifyAllSeals = () => {
    setVerifyingAll(true);
    setTimeout(() => {
      setVerifyingAll(false);
      alert('Section 65B BSA Certificate validated. All SHA-256 Merkle root hashes verified against DRISTI immutable ledger. Zero tampering detected.');
    }, 1500);
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5">
      {/* 1. Unified Clean Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ff9933] uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>SAVED EVIDENCE // BSA 2023 REPOSITORY</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] font-['Space_Grotesk',sans-serif] tracking-wide">
            Saved Evidence &amp; Forensic Vault
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5 max-w-2xl">
            Court-admissible electronic evidence repository with SHA-256 Merkle chains and Bharatiya Sakshya Adhiniyam (BSA) 2023 Sec 65B certificates.
          </p>
        </div>

        {/* Action Buttons & Compliance Badge */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={verifyAllSeals}
            disabled={verifyingAll}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#14234b] text-[#22c55e] hover:bg-[#1a2e63] transition-all font-mono text-xs border border-[#138808]/50 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-sm ${verifyingAll ? 'animate-spin' : ''}`}>
              {verifyingAll ? 'sync' : 'security_update_good'}
            </span>
            <span>{verifyingAll ? 'AUDITING SEALS...' : 'VERIFY 65B SEALS'}</span>
          </button>

          <button
            id="btn-generate-report"
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#ff9933] text-[#070d1e] hover:bg-[#ffb366] transition-all font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,153,51,0.25)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">description</span>
            <span>GENERATE COURT BRIEF</span>
          </button>
        </div>
      </div>

      {/* 2. Standardized Single-Row Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Sealed Artifacts</span>
            <span className="material-symbols-outlined text-base text-[#ff9933]">folder_zip</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#f8fafc]">{evidenceItems.length}</div>
          </div>
          <div className="text-[10px] text-[#22c55e] flex items-center space-x-1">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            <span>100% Chain Intact</span>
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Custody Logs</span>
            <span className="material-symbols-outlined text-base text-[#fbbf24]">history_edu</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#fbbf24]">42 Logged</div>
          </div>
          <div className="text-[10px] text-[#94a3b8]">
            Multi-Officer Key Signed
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Legal Standard</span>
            <span className="material-symbols-outlined text-base text-[#ff9933]">gavel</span>
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-[#f8fafc]">BSA Sec 65B</div>
          </div>
          <div className="text-[10px] text-[#ffb366]">
            Bharatiya Sakshya 2023
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Admissibility</span>
            <span className="material-symbols-outlined text-base text-[#22c55e]">account_balance</span>
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-[#22c55e]">PATIALA HOUSE</div>
          </div>
          <div className="text-[10px] text-[#22c55e]">
            Special PMLA/NIA Court
          </div>
        </div>
      </div>

      {/* 3. Evidence Registry Table with Expandable Detail Rows */}
      <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#1e305e]">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#ff9933]">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="font-bold uppercase tracking-wider">Secure Registry &amp; Integrity Repository ({evidenceItems.length})</span>
          </div>
          <span className="text-[10px] font-mono text-[#94a3b8] hidden sm:inline">HARDWARE HSM &amp; AES-256-GCM ENCRYPTED</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-[#94a3b8] border-b border-[#1e305e] bg-[#070d1e]/50 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-4 w-28">Status</th>
                <th className="py-2.5 px-4">Evidence Item</th>
                <th className="py-2.5 px-4">Custodian / Date</th>
                <th className="py-2.5 px-4">Linked Entities</th>
                <th className="py-2.5 px-4">SHA-256 Hash</th>
                <th className="py-2.5 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e305e]/50">
              {evidenceItems.map(item => {
                const isExpanded = expandedRowId === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      onClick={() => toggleRowExpand(item.id)}
                      className={`hover:bg-[#14234b]/50 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[#14234b]/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-[#138808]/20 text-[#22c55e] border border-[#138808]/40 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#f8fafc] max-w-sm truncate">{item.title}</div>
                        <div className="text-[10px] text-[#94a3b8] flex items-center space-x-2 mt-0.5">
                          <span className="text-[#ff9933]">{item.id}</span>
                          <span>•</span>
                          <span>{item.type} ({item.fileFormat})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[#cbd5e1]">{item.custodian}</div>
                        <div className="text-[9px] text-[#94a3b8]">{item.collectedDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.linkedEntities.map((ent, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#070d1e] text-[#fbbf24] border border-[#1e305e]">
                              {ent}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] text-[#38bdf8] font-mono select-all">
                          {item.sha256.substring(0, 16)}...
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvidenceForDetail(item);
                            }}
                            className="px-2 py-1 text-[10px] rounded bg-[#14234b] hover:bg-[#1a2e63] text-[#f8fafc] border border-[#1e305e] transition-colors cursor-pointer"
                          >
                            Audit
                          </button>
                          <span className="material-symbols-outlined text-sm text-[#64748b]">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Detail Row */}
                    {isExpanded && (
                      <tr className="bg-[#070d1e]/80 border-b border-[#1e305e]">
                        <td colSpan={6} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono bg-[#0e1938] border border-[#1e305e] rounded-lg p-3">
                            <div className="md:col-span-2">
                              <span className="text-[#94a3b8] uppercase text-[10px] block">Full Cryptographic Hash (SHA-256)</span>
                              <span className="text-[#38bdf8] break-all select-all font-bold block mt-0.5">
                                {item.sha256}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#94a3b8] uppercase text-[10px] block">Evidentiary Chain</span>
                              <div className="text-[#22c55e] flex items-center space-x-1 mt-0.5">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                <span>Section 65B BSA 2023 Admissible</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structured Report Generator Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#0e1938] border border-[#ff9933] rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative font-mono max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center space-x-2 text-xs text-[#ff9933] font-bold mb-1">
              <span className="material-symbols-outlined text-sm">gavel</span>
              <span>SPECIAL COURT EVIDENCE DOSSIER // BSA 2023 SEC 65B</span>
            </div>
            <h2 className="text-xl font-bold text-[#f8fafc] font-['Space_Grotesk',sans-serif]">
              Digital Evidence Audit Certificate (Section 65B BSA 2023)
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              Special Court for Prevention of Money Laundering Act (PMLA) &amp; National Investigation Agency (NIA), Patiala House Courts, New Delhi.
            </p>

            <div className="mt-4 p-4 rounded-lg bg-[#070d1e] border border-[#1e305e] space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#1e305e] pb-2 text-[11px]">
                <span className="text-[#94a3b8]">CASE REFERENCE:</span>
                <span className="text-[#f8fafc] font-bold">RC-04/2026/NIA/DLI (Hawala Smurfing &amp; Fake FASTags)</span>
              </div>
              <div className="flex justify-between border-b border-[#1e305e] pb-2 text-[11px]">
                <span className="text-[#94a3b8]">SEIZING AGENCY:</span>
                <span className="text-[#ff9933] font-bold">Delhi Police Special Cell / FIU-IND</span>
              </div>
              <div className="flex justify-between border-b border-[#1e305e] pb-2 text-[11px]">
                <span className="text-[#94a3b8]">CERTIFYING OFFICER:</span>
                <span className="text-[#f8fafc]">SP Vikram Malhotra, IPS (Cyber Operations)</span>
              </div>

              <div className="text-[11px] text-[#cbd5e1] leading-relaxed pt-2">
                "I hereby certify under Section 65B of the Bharatiya Sakshya Adhiniyam (BSA), 2023 that the electronic records, Telco CDR streams, NHAI FASTag transit records, and FIU-IND UPI ledger exports cataloged herein were produced by automated computer systems operating under regular law-enforcement lawful interception procedures without tampering."
              </div>

              <div className="p-3 bg-[#0e1938] rounded border border-[#1e305e] font-mono text-[10px] space-y-1">
                <div className="text-[#22c55e] font-bold">AGGREGATE MERKLE ROOT:</div>
                <div className="text-[#38bdf8] break-all">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[10px] text-[#22c55e] flex items-center space-x-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>CRYPTOGRAPHICALLY SEALED</span>
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    alert('Official BSA 2023 Sec 65B Certificate generated and digitally signed by SP Vikram Malhotra, IPS.');
                    setShowReportModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#ff9933] text-[#070d1e] font-bold text-xs hover:bg-[#ffb366] transition-all cursor-pointer"
                >
                  Download Signed PDF Brief
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#14234b] text-xs text-[#f8fafc] border border-[#1e305e] hover:bg-[#1a2e63] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Evidence Audit Modal */}
      {selectedEvidenceForDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0e1938] border border-[#ff9933]/50 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative font-mono">
            <button
              onClick={() => setSelectedEvidenceForDetail(null)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center space-x-1.5 text-xs text-[#ff9933] font-bold mb-1">
              <span className="material-symbols-outlined text-sm">security</span>
              <span>CHAIN OF CUSTODY AUDIT LOG</span>
            </div>
            <h3 className="text-base font-bold text-[#f8fafc]">{selectedEvidenceForDetail.title}</h3>

            <div className="mt-3 space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e]">
                <div className="text-[10px] text-[#94a3b8]">SHA-256 Cryptographic Hash</div>
                <div className="text-[#38bdf8] break-all select-all font-bold mt-0.5 text-[11px]">
                  {selectedEvidenceForDetail.sha256}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e] space-y-1.5">
                <div className="text-[10px] text-[#ff9933] font-bold">Custodial Handshake Log</div>
                <div className="text-[11px] text-[#cbd5e1]">1. Seized by: {selectedEvidenceForDetail.custodian}</div>
                <div className="text-[11px] text-[#cbd5e1]">2. Date &amp; Time: {selectedEvidenceForDetail.collectedDate}</div>
                <div className="text-[11px] text-[#cbd5e1]">3. Storage: Air-gapped DRISTI Hardware Vault, North Block MHA</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedEvidenceForDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-[#14234b] hover:bg-[#1a2e63] text-xs text-[#f8fafc] border border-[#1e305e] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
