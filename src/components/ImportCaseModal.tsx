import React, { useState } from 'react';
import { CaseRecord, AgencySource, CaseDocument, AccusedPerson, LegalOffenseItem, SeizedAssetItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ImportCaseModalProps {
  onClose: () => void;
  onCaseImported: (newCase: CaseRecord) => void;
}

export const ImportCaseModal: React.FC<ImportCaseModalProps> = ({ onClose, onCaseImported }) => {
  const { isDark } = useTheme();
  const [selectedAgency, setSelectedAgency] = useState<AgencySource>('CCTNS');
  const [firNumber, setFirNumber] = useState('FIR #204/2026');
  const [caseTitle, setCaseTitle] = useState('Operation HAWKEYE: Interstate Telecom & Crypto Mule Extraction');
  const [jurisdiction, setJurisdiction] = useState('Maharashtra (CID Crime)');
  const [policeStation, setPoliceStation] = useState('PS Cyber Crime, BKC, Mumbai');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleStartIngest = () => {
    setIsProcessing(true);
    setProgress(10);
    setCurrentStep('Computing SHA-256 Bitstream Hash under Section 65B BSA 2023...');

    setTimeout(() => {
      setProgress(35);
      setCurrentStep('Executing OCR & Multi-Language Entity Parsing (Hindi / English CCTNS Form I-IX)...');
    }, 800);

    setTimeout(() => {
      setProgress(68);
      setCurrentStep('Extracting BNS/IPC offenses, PAN tokens, UPI VPAs & fastag RFID tags...');
    }, 1600);

    setTimeout(() => {
      setProgress(92);
      setCurrentStep('Cross-referencing National Intelligence Grid (NATGRID) & Bureau of Immigration LOC...');
    }, 2400);

    setTimeout(() => {
      setProgress(100);
      setCurrentStep('Case Dossier Cryptographically Sealed & Indexed!');

      // Construct realistic imported case
      const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const newAccused: AccusedPerson[] = [
        {
          id: `ACC-IMP-${Date.now()}-1`,
          name: 'Sameer Qureshi',
          alias: 'Sam / Tech Lead',
          role: 'Primary Mule Account Facilitator & Crypto Arbitrageur',
          aadhaarHash: 'XXXX-XXXX-4109 [UIDAI Verified]',
          pan: 'APQPS7712M',
          passportNo: 'N8190241',
          locStatus: 'Active LOC Issued (Bureau of Immigration)',
          arrestStatus: 'Non-Bailable Warrant (NBW) Active',
          warrantDetails: 'NBW Issued by Spl Court (CCTNS/Cyber), BKC Mumbai',
          riskScore: 89
        },
        {
          id: `ACC-IMP-${Date.now()}-2`,
          name: 'Dinesh Patel',
          alias: 'Kaka',
          role: 'Hawala Bullion Clearing Agent, Zaveri Bazaar',
          aadhaarHash: 'XXXX-XXXX-9904 [UIDAI Tokenized]',
          pan: 'BPKPP1924L',
          passportNo: 'None',
          locStatus: 'Pending Verification',
          arrestStatus: 'Arrested & Remanded',
          warrantDetails: 'Police Custody 5 days u/s 187 BNSS 2023',
          riskScore: 76
        }
      ];

      const newOffenses: LegalOffenseItem[] = [
        {
          id: `OFF-IMP-1`,
          act: 'Bharatiya Nyaya Sanhita (BNS) 2023',
          section: 'Section 111',
          title: 'Organized Crime Syndicate',
          description: 'Laundering and extortion through syndicated digital infrastructure.',
          cognizable: true,
          bailable: false,
          maxPenalty: 'Life Imprisonment + Fine'
        },
        {
          id: `OFF-IMP-2`,
          act: 'Information Technology Act 2000',
          section: 'Section 66D',
          title: 'Cheating by Personation Using Computer Resource',
          description: 'Mule bank account provisioning through forged biometric signatures.',
          cognizable: true,
          bailable: false,
          maxPenalty: 'Imprisonment up to 3 years'
        }
      ];

      const newAssets: SeizedAssetItem[] = [
        {
          id: `AST-IMP-1`,
          type: 'BANK_ACCOUNT',
          identifier: 'ICICI Bank Bandra A/C #001201994821 (IFSC: ICIC0000012)',
          description: 'Aggregated mule current account holding structured deposits.',
          estimatedValue: '₹8,92,00,000 (₹8.92 Cr)',
          holdingEntity: 'Zaveri Bullion Trading LLP',
          freezeStatus: 'FROZEN (Sec 17 PMLA)',
          custodyMemo: 'MUM/CYB/SZ-2026-89',
          seizureDate: '2026-09-08'
        },
        {
          id: `AST-IMP-2`,
          type: 'UPI_VPA',
          identifier: 'mule.settle99@icici & zaveri.gold@okhdfcbank',
          description: 'Automated settlement handles routed through SIM box modems.',
          estimatedValue: '₹74,50,000',
          holdingEntity: 'Sameer Qureshi (Mule)',
          freezeStatus: 'FROZEN (Sec 17 PMLA)',
          custodyMemo: 'NPCI/MUM/FRZ-102',
          seizureDate: '2026-09-08'
        }
      ];

      const newDoc: CaseDocument = {
        id: `DOC-IMP-${Date.now()}`,
        title: `${selectedAgency} Case File: ${firNumber} Dossier`,
        docType: 'FIR (Form I-IX)',
        date: '2026-09-09',
        classification: 'TOP SECRET // INTERNAL SECURITY RESTRICTED',
        sha256: randomHash,
        pages: files.length > 0 ? 18 : 12,
        authorOfficer: 'DySP Ramesh Kulkarni, Crime Branch Cyber Ops',
        entities: {
          accused: ['Sameer Qureshi', 'Dinesh Patel'],
          financial: ['ICICI Bank #001201994821', 'mule.settle99@icici'],
          assets: ['Zaveri Bazaar Gold Bullion', 'SIM Box Modems'],
          sections: ['BNS Sec 111', 'IT Act Sec 66D', 'PMLA Sec 3']
        },
        fullContent: `STATE CYBER POLICE HEADQUARTERS // MUMBAI
INTEGRATED CASE DOSSIER UNDER BNSS 2023 & BNS 2023
CASE RECORD NO: ${firNumber} // JURISDICTION: ${jurisdiction}

1. Reporting Authority: ${policeStation}
2. Offenses Charged: BNS Section 111 (Organized Crime), Section 318 (Cheating), IT Act Section 66D.
3. Accused Entities:
   - Primary: Sameer Qureshi @ Sam (LOC Active)
   - Associate: Dinesh Patel @ Kaka (Arrested)

4. Forensic Seizure Summary:
   Digital telemetry analysis identified an automated network of 48 mule bank accounts receiving structured UPI micropayments under ₹50,000. Funds were swiftly pooled into ICICI Bank account #001201994821 and converted into physical gold bars at Zaveri Bazaar before transshipment abroad.

5. Digital Hash Seal: SHA-256 ${randomHash} verified under Section 65B Bharatiya Sakshya Adhiniyam 2023.`
      };

      const newCase: CaseRecord = {
        id: `CASE-IMP-${Date.now()}`,
        caseNo: firNumber,
        title: caseTitle,
        agency: selectedAgency,
        agencyFullName: `${selectedAgency} Investigating Division (${jurisdiction})`,
        firOrRcNo: firNumber,
        policeStationOrBranch: policeStation,
        stateOrJurisdiction: jurisdiction,
        dateRegistered: '2026-09-09 22:30 IST',
        caseStage: 'Under Investigation',
        legalFramework: ['BNS / IPC', 'IT Act', 'PMLA'],
        bnsIpcSections: ['BNS Sec 111 (Organized Crime)', 'IT Act Sec 66D', 'BNS Sec 318'],
        summary: `Imported multi-agency case file containing authenticated CCTNS FIR Form I-IX, financial ledger extractions, and biometric records for ${caseTitle}.`,
        priority: 'CRITICAL',
        documentCount: 1,
        documents: [newDoc],
        accusedRoster: newAccused,
        legalOffenseMatrix: newOffenses,
        seizedAssetTrail: newAssets,
        sha256Seal: randomHash,
        bsaCertificate: {
          section: 'Section 65B(4) Bharatiya Sakshya Adhiniyam 2023',
          certifiedBy: 'DySP Ramesh Kulkarni (Cyber Crime & Forensics)',
          hash: randomHash,
          verificationDate: '2026-09-09 22:45 IST',
          status: 'VALID'
        }
      };

      setTimeout(() => {
        setIsProcessing(false);
        onCaseImported(newCase);
        onClose();
      }, 700);
    }, 3000);
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
              <span className="material-symbols-outlined text-xl">file_upload</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-wide">
                UNIVERSAL CASE IMPORT &amp; OCR EXTRACTION
              </h3>
              <p className={`text-xs font-mono ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                Ingest Multi-Agency FIRs, CCTNS XML Feeds, PDFs &amp; Bank Ledgers
              </p>
            </div>
          </div>

          {!isProcessing && (
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
          )}
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Agency Selector */}
          <div>
            <label className={`block text-xs font-mono font-bold uppercase mb-1.5 ${
              isDark ? 'text-[#ff9933]' : 'text-[#ea580c]'
            }`}>
              Originating Agency / Network
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                { id: 'CCTNS', label: 'CCTNS (Police)' },
                { id: 'CBI', label: 'CBI (Central)' },
                { id: 'NIA', label: 'NIA (Counter-Terror)' },
                { id: 'ED', label: 'ED (PMLA)' },
                { id: 'NCB', label: 'NCB (Narcotics)' },
                { id: 'FIU_IND', label: 'FIU-IND (Finance)' },
                { id: 'CYBER_CRIME', label: 'Cyber Crime Cell' },
              ].map((ag) => (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => setSelectedAgency(ag.id as AgencySource)}
                  className={`px-2.5 py-2 rounded-lg border text-left font-semibold transition-all cursor-pointer truncate ${
                    selectedAgency === ag.id
                      ? 'bg-[#ff9933]/20 border-[#ff9933] text-[#ff9933]'
                      : isDark
                        ? 'bg-[#0e1938] border-[#1e305e] text-[#94a3b8] hover:bg-[#14234b]'
                        : 'bg-slate-100 border-[#cbd5e1] text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Case Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className={`block font-mono font-semibold mb-1 ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
                FIR / Case / RC Number
              </label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border font-mono text-xs focus:outline-none focus:border-[#ff9933] ${
                  isDark ? 'bg-[#0e1938] border-[#1e305e] text-[#f8fafc]' : 'bg-slate-50 border-[#cbd5e1] text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className={`block font-mono font-semibold mb-1 ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
                Jurisdiction / State / Branch
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border font-mono text-xs focus:outline-none focus:border-[#ff9933] ${
                  isDark ? 'bg-[#0e1938] border-[#1e305e] text-[#f8fafc]' : 'bg-slate-50 border-[#cbd5e1] text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block font-mono font-semibold text-xs mb-1 ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
              Case Subject / Operation Codename
            </label>
            <input
              type="text"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border font-mono text-xs focus:outline-none focus:border-[#ff9933] ${
                isDark ? 'bg-[#0e1938] border-[#1e305e] text-[#f8fafc]' : 'bg-slate-50 border-[#cbd5e1] text-slate-900'
              }`}
            />
          </div>

          {/* Drag & Drop Zone */}
          <div>
            <label className={`block font-mono font-semibold text-xs mb-1.5 ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
              Attach Evidence Files (PDF, CCTNS XML, Scanned FIR, CSV Bank Ledgers)
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                files.length > 0
                  ? 'border-[#22c55e] bg-[#22c55e]/10'
                  : isDark
                    ? 'border-[#1e305e] hover:border-[#ff9933]/60 bg-[#0e1938]/50'
                    : 'border-[#cbd5e1] hover:border-[#ea580c] bg-slate-50'
              }`}
              onClick={() => document.getElementById('case-file-input')?.click()}
            >
              <input
                id="case-file-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
              <span className="material-symbols-outlined text-3xl text-[#ff9933] mb-2">
                cloud_upload
              </span>
              <p className="text-xs font-mono font-semibold">
                {files.length > 0
                  ? `${files.length} file(s) selected: ${files.map(f => f.name).join(', ')}`
                  : 'Drag and drop FIR or click to browse files'}
              </p>
              <p className={`text-[11px] font-mono mt-1 ${isDark ? 'text-[#64748b]' : 'text-slate-400'}`}>
                Supports .PDF, .XML, .JSON, .CSV, .JPG (Auto-OCR enabled with SHA-256 seal)
              </p>
            </div>
          </div>

          {/* Processing Progress State */}
          {isProcessing && (
            <div className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'bg-[#070d1e] border-[#1e305e]' : 'bg-slate-50 border-[#cbd5e1]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#ff9933] font-bold flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#ff9933] animate-ping"></span>
                  <span>AI PARSING IN PROGRESS</span>
                </span>
                <span className="font-bold">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-700/40 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff9933] to-[#22c55e] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-[11px] font-mono text-[#94a3b8] flex items-center space-x-1.5 truncate">
                <span className="material-symbols-outlined text-sm text-[#22c55e]">memory</span>
                <span className="truncate">{currentStep}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${
          isDark ? 'bg-[#070d1e] border-[#1e305e]' : 'bg-[#f8fafc] border-[#e2e8f0]'
        }`}>
          <div className="text-[10px] font-mono text-[#94a3b8] hidden sm:block">
            MHA-BSA Section 65B Compliant Ingestion Engine
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {!isProcessing && (
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border text-xs font-medium font-mono transition-all cursor-pointer ${
                  isDark 
                    ? 'border-[#1e305e] hover:bg-[#14234b] text-[#cbd5e1]' 
                    : 'border-[#cbd5e1] hover:bg-slate-100 text-slate-700'
                }`}
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleStartIngest}
              disabled={isProcessing}
              className="px-5 py-2 rounded-lg bg-[#ff9933] hover:bg-[#ffaa4d] disabled:opacity-50 text-[#070d1e] text-xs font-bold font-mono flex items-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {isProcessing ? 'sync' : 'bolt'}
              </span>
              <span>{isProcessing ? 'Ingesting & Hashing...' : 'Start Universal Ingest'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
