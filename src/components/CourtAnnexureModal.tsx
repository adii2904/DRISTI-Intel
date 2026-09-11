import React, { useState } from 'react';
import { CaseRecord, CaseDocument } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CourtAnnexureModalProps {
  caseRecord: CaseRecord;
  document: CaseDocument;
  onClose: () => void;
}

export const CourtAnnexureModal: React.FC<CourtAnnexureModalProps> = ({
  caseRecord,
  document,
  onClose,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden ${
          isDark 
            ? 'bg-[#0b132b] border-[#1e305e] text-[#f8fafc]' 
            : 'bg-white border-[#cbd5e1] text-[#0f172a]'
        }`}
      >
        {/* Modal Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'bg-[#070d1e] border-[#1e305e]' : 'bg-[#f8fafc] border-[#e2e8f0]'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#ff9933]/15 border border-[#ff9933]/50 flex items-center justify-center text-[#ff9933]">
              <span className="material-symbols-outlined text-xl">gavel</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold tracking-wide">
                  COURT ADMISSIBILITY ANNEXURE // SECTION 65B BSA 2023
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#138808]/20 text-[#22c55e] border border-[#138808]/40">
                  TAMPER-PROOF CERTIFIED
                </span>
              </div>
              <p className={`text-xs font-mono ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                Special Court Patiala House / PMLA / NIA Court Submission Ready
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

        {/* Certificate Printable Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Formal Judicial Heading */}
          <div className={`p-6 rounded-xl border text-center relative overflow-hidden ${
            isDark ? 'bg-[#070d1e]/80 border-[#1e305e]' : 'bg-[#fafafa] border-[#e2e8f0]'
          }`}>
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-6xl sm:text-8xl font-black font-mono rotate-[-25deg] select-none">
                BSA SEC 65B
              </span>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#ff9933] font-bold">
                IN THE COURT OF SESSIONS / SPECIAL JUDGE, PATIALA HOUSE COURTS, NEW DELHI
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold tracking-wide">
                CERTIFICATE UNDER SECTION 65B(4) OF THE BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
              </h2>
              <div className={`text-xs font-mono ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                (Relating to Admissibility of Electronic Records in Case: <span className="font-bold text-[#ff9933]">{caseRecord.caseNo}</span> // {caseRecord.agencyFullName})
              </div>
            </div>
          </div>

          {/* Officer & System Declaration Details */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono ${
            isDark ? 'text-[#e2e8f0]' : 'text-[#334155]'
          }`}>
            <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#0e1938]/60 border-[#1e305e]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
              <div className="text-[11px] font-bold uppercase text-[#ff9933] mb-2 flex items-center space-x-1">
                <span className="material-symbols-outlined text-sm">badge</span>
                <span>CERTIFYING OFFICER DETAILS</span>
              </div>
              <div className="space-y-1">
                <div><span className="text-[#94a3b8]">Name:</span> <span className="font-semibold">{caseRecord.bsaCertificate.certifiedBy}</span></div>
                <div><span className="text-[#94a3b8]">Agency / Unit:</span> {caseRecord.policeStationOrBranch}</div>
                <div><span className="text-[#94a3b8]">Verification Date:</span> {caseRecord.bsaCertificate.verificationDate}</div>
                <div><span className="text-[#94a3b8]">Statutory Capacity:</span> Authorized Forensic Custodian & Investigating Officer</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#0e1938]/60 border-[#1e305e]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
              <div className="text-[11px] font-bold uppercase text-[#22c55e] mb-2 flex items-center space-x-1">
                <span className="material-symbols-outlined text-sm">security</span>
                <span>CRYPTOGRAPHIC INTEGRITY HASH</span>
              </div>
              <div className="space-y-1">
                <div><span className="text-[#94a3b8]">Algorithm:</span> FIPS 180-4 SHA-256 Digest</div>
                <div><span className="text-[#94a3b8]">Seal Status:</span> <span className="text-[#22c55e] font-bold">BIT-EXACT / ZERO TAMPERING DETECTED</span></div>
                <div className="truncate">
                  <span className="text-[#94a3b8]">Doc Hash:</span> <span className="font-mono text-[10px] text-[#ff9933]">{document.sha256}</span>
                </div>
                <div><span className="text-[#94a3b8]">Hardware Gateway:</span> NIC National Security Cloud HSM #8812</div>
              </div>
            </div>
          </div>

          {/* Statutory Affirmation Clauses */}
          <div className={`p-5 rounded-lg border space-y-3 text-xs leading-relaxed ${
            isDark ? 'bg-[#070d1e]/50 border-[#1e305e] text-[#cbd5e1]' : 'bg-slate-50 border-[#e2e8f0] text-slate-700'
          }`}>
            <h4 className="font-bold text-[#ff9933] uppercase font-mono text-xs tracking-wider">
              STATUTORY AFFIRMATION & CHAIN OF CUSTODY (BSA 2023)
            </h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                I hereby certify that the electronic record titled <strong>"{document.title}"</strong> ({document.pages} pages, Type: {document.docType}) was produced by the computerized servers and investigative terminals of the <strong>{caseRecord.agencyFullName}</strong> during the regular course of official activities.
              </li>
              <li>
                Throughout the period of generation and archival, lawful custody and operational control over the computer resource was exercised strictly by certified officers under the supervision of the Ministry of Home Affairs (MHA).
              </li>
              <li>
                The computer system operated properly during the extraction of records, and the digital duplicate is bit-exact with the original bitstream captured in police seizure memo.
              </li>
              <li>
                Under <strong>Section 65B of the Bharatiya Sakshya Adhiniyam, 2023</strong>, this certificate is issued to be received as primary evidence of the contents of the said electronic document in any court of law without further proof of production of original hardware.
              </li>
            </ol>
          </div>

          {/* Digital Signature Box */}
          <div className={`p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'bg-[#0e1938] border-[#1e305e]' : 'bg-[#f1f5f9] border-[#cbd5e1]'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full border border-[#22c55e] bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <div>
                <div className="font-mono text-xs font-bold text-[#22c55e]">DIGITALLY SIGNED & NOTARIZED</div>
                <div className="text-[11px] font-mono text-[#94a3b8]">
                  Govt. of India e-Sign PKI Token ID: MHA-DL-90821 // NIC Secured
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyHash}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                copied
                  ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
                  : isDark
                    ? 'bg-[#070d1e] border-[#1e305e] hover:border-[#ff9933] text-[#f8fafc]'
                    : 'bg-white border-[#cbd5e1] hover:border-[#ff9933] text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check_circle' : 'content_copy'}
              </span>
              <span>{copied ? 'Hash Copied!' : 'Copy SHA-256 Digest'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${
          isDark ? 'bg-[#070d1e] border-[#1e305e]' : 'bg-[#f8fafc] border-[#e2e8f0]'
        }`}>
          <div className="text-[11px] font-mono text-[#94a3b8]">
            Court Exhibit Form No: MHA-BSA-65B/2026/PATIALA-HOUSE
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSimulatePrint}
              className="px-4 py-2 rounded-lg bg-[#ff9933] hover:bg-[#ffaa4d] text-[#070d1e] text-xs font-semibold font-mono flex items-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {printSuccess ? 'check' : 'print'}
              </span>
              <span>{printSuccess ? 'Sent to NIC Secure Print!' : 'Print Certified Annexure'}</span>
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border text-xs font-medium font-mono transition-all cursor-pointer ${
                isDark 
                  ? 'border-[#1e305e] hover:bg-[#14234b] text-[#cbd5e1]' 
                  : 'border-[#cbd5e1] hover:bg-slate-100 text-slate-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
