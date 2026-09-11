import { DossierTarget } from '../types';
import { ASSETS } from './mockData';

export const DOSSIER_TARGETS: DossierTarget[] = [
  {
    id: 'target-singhania',
    nodeId: 'node-singhania',
    name: 'VIKRAMADITYA "THE VIPER" SINGHANIA',
    syndicateRole: 'Primary Target / Ringleader',
    aliases: 'Vikram Bhai, "Viper-01", V.S. Malhotra, "Sultan"',
    pan: 'ABCPS9182K',
    aadhaarHash: 'SHA256:7f1e9482****a3c9',
    passportNo: 'M4910281 (Turkish/Indian Falsified)',
    locStatus: 'ACTIVE LOC ISSUED',
    locRef: 'LOC-2026-441-INTEL',
    firRef: 'FIR #182/2026 SPECIAL CELL',
    classificationTag: 'HIGH-VALUE TARGET // TIER 1',
    warrantStatus: 'Non-Bailable Warrant (NBW) Active',
    warrantCourt: 'Special Judge (PMLA), Patiala House District Courts, New Delhi',
    warrantNo: 'NBW-PMLA-2026-9014 (Valid Pan-India)',
    threatScore: 96,
    threatSeverity: 'Critical Severity (Flight Risk)',
    threatSeverityColor: '#ef4444',
    networkCentrality: 0.968,
    correlatedNodes: 16,
    flaggedLiquidity: '₹142.8 Cr',
    frozenAmount: '₹34.5 Cr PMLA Court Frozen',
    lastInterceptLocation: 'Delhi IGI Airport T3',
    lastInterceptDetail: 'Gate 14B (Cosine Similarity 0.994)',
    mugshotUrl: ASSETS.targetCCTV,
    referencePhotoUrl: ASSETS.targetMugshot,
    referencePhotoLabel: 'Reference Photo (Driving License 2021)',
    liveCctvLabel: 'CCTV Live Intercept (IGI T3 Gate 14B)',
    biometricMatchPct: 99.4,
    biometricConfidence: '99.4% (Definitive Match)',
    biometricParams: {
      ipd: '64.2 mm',
      nasalCurvature: '0.884',
      mandibularAngle: '118.4°',
      confidenceScore: '99.4% (Definitive)',
      algorithm: 'DRISTI-FaceNet-v4 (CCTNS Engine)',
      legalNote: 'Admissible in Special Court under Sec 65B BSA 2023 as biometric match report.'
    },
    riskVector: {
      burnerRotationPct: 98,
      burnerRotationLabel: '98% (High Evasion Velocity)',
      hawalaComplexityPct: 94,
      hawalaComplexityLabel: '94% (Multilateral Layering)',
      flightRiskPct: 99,
      flightRiskLabel: '99% (Imminent Flight Risk)',
      heuristicSummary: 'Subject observed swapping IMEI transponders 3 times over 72 hours. Last identified moving through Terminal 3 Delhi Airport boarding zone using fraudulent Turkish passport alias.'
    },
    cctnsProsecution: {
      firTitle: 'FIR #182/2026 - PS Special Cell, Lodhi Colony, New Delhi',
      offenses: 'Bharatiya Nyaya Sanhita (BNS) 2023 Sec 111 (Organized Crime Syndicate) & Sec 318 (Hawala Structuring) r/w Sec 13 UAPA',
      io: 'ACP Rajeshwar Rao, Cyber & Hawala Cell',
      warrantTitle: 'Non-Bailable Warrant (NBW) Active',
      warrantCourt: 'Issued by Special Judge (PMLA), Patiala House District Courts, New Delhi',
      warrantNo: 'Warrant No: NBW-PMLA-2026-9014 // Pan-India Non-Bailable Arrest Mandate',
      locTitle: 'Bureau of Immigration Look Out Circular (LOC)',
      locCircular: 'MHA Circular Reference: LOC-2026-441-INTEL',
      locAction: 'Immediate detention at all international airports, sea ports & land immigration check-posts.'
    },
    fiuAccounts: [
      { bank: 'HDFC Bank - Connaught Place', acc: '501004928109', type: 'Current (Apex Import Export)', balance: '₹14,20,00,000', status: 'FROZEN UNDER PMLA SEC 17' },
      { bank: 'ICICI Bank - Chandni Chowk', acc: '002105829104', type: 'Savings (Personal Alias)', balance: '₹4,85,00,000', status: 'FROZEN UNDER PMLA SEC 17' },
      { bank: 'State Bank of India - Mumbai Fort', acc: '38192019481', type: 'Current (Kuber Bullion Pvt Ltd)', balance: '₹15,45,00,000', status: 'FROZEN UNDER PMLA SEC 17' },
      { bank: 'Axis Bank - Gurugram Cyber Hub', acc: '9180200481920', type: 'Current (Shadow Finvest)', balance: '₹21,40,00,000', status: 'ACTIVE STRUCTURING MONITOR' }
    ],
    telcoCdr: {
      burnerTitle: 'Burner SIM 01: Reliance Jio 5G',
      status: 'ACTIVE PING',
      msisdn: '+91 98102 44109',
      imei: '864201048821901',
      towerSector: 'Chandni Chowk Old Delhi (CellID 4412B)',
      roamingStatus: 'Active Voice & VoLTE Session',
      vahanTitle: 'FASTag Vehicle Tracking (VAHAN)',
      vahanStatus: 'SPOOF DETECTED',
      vahanReg: 'DL-10-CA-4091 (Toyota Fortuner 4x4)',
      fastagRfid: '34161FA820301109',
      lastToll: 'Kherki Daula Toll Plaza (NH-48)',
      discrepancy: 'Vehicle on NH-48 while phone in Old Delhi (Impossible Velocity)'
    },
    evidenceItems: [
      { id: 'EVD-IND-906', title: 'IGI Airport T3 CCTV Facial Biometric Stream (Gate 14B)', hash: '7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f4a7b0c', statusBadge: 'BSA 65B SEALED' },
      { id: 'EVD-IND-901', title: 'State Cyber Cell UFED Extraction - Samsung S24 Ultra (HW Dump)', hash: '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f', statusBadge: 'BSA 65B SEALED' },
      { id: 'EVD-IND-902', title: 'FIU-IND Suspicious Transaction Ledger - Hawala Routing (₹142.8 Cr)', hash: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f', statusBadge: 'BSA 65B SEALED' }
    ],
    matchingNodeIds: ['node-singhania', 'target-singhania']
  },
  {
    id: 'target-tariq',
    nodeId: 'node-farooq',
    name: 'TARIQ "HAWALA-1" AHMED',
    syndicateRole: 'Financial Courier',
    aliases: 'Chit-Runner "Falcon-07", Farooq Mir, "Tariq Angadia", Ahmed Chacha',
    pan: 'BKPPA4419M',
    aadhaarHash: 'SHA256:4a9c1827****e812',
    passportNo: 'P8819204 (Impounded u/s 10 Passports Act)',
    locStatus: 'ACTIVE LOC ISSUED',
    locRef: 'LOC-2026-512-HAWALA',
    firRef: 'FIR #204/2026 PS LAHORI GATE',
    classificationTag: 'CHIEF FINANCIAL COURIER // SYNDICATE CASHIER',
    warrantStatus: 'Non-Bailable Warrant (NBW) Active',
    warrantCourt: 'Chief Metropolitan Magistrate, Tis Hazari Courts, Delhi',
    warrantNo: 'NBW-THC-2026-4418 (Sec 174 BNS & Sec 19 PMLA)',
    threatScore: 88,
    threatSeverity: 'High Severity (Financial Courier)',
    threatSeverityColor: '#ff9933',
    networkCentrality: 0.842,
    correlatedNodes: 11,
    flaggedLiquidity: '₹68.4 Cr',
    frozenAmount: '₹18.2 Cr Seized Cash & Bullion Chits',
    lastInterceptLocation: 'Chandni Chowk Angadia Hub',
    lastInterceptDetail: 'Kucha Ghasiram Haveli B-4 Raid Seizure',
    mugshotUrl: ASSETS.associateCCTV,
    referencePhotoUrl: ASSETS.associatePortrait,
    referencePhotoLabel: 'CCTNS Dossier Photo (Lahori Gate PS 2024)',
    liveCctvLabel: 'Raid Footage Frame (Chandni Chowk Vault CAM-14)',
    biometricMatchPct: 98.6,
    biometricConfidence: '98.6% (Optical Verification)',
    biometricParams: {
      ipd: '62.8 mm',
      nasalCurvature: '0.912',
      mandibularAngle: '122.1°',
      confidenceScore: '98.6% (Verified Match)',
      algorithm: 'DRISTI-FaceNet-v4 (CCTNS Engine)',
      legalNote: 'Corroborated by Angadia ledger fingerprint lifting under Sec 311A CrPC.'
    },
    riskVector: {
      burnerRotationPct: 86,
      burnerRotationLabel: '86% (Physical Device Swapping)',
      hawalaComplexityPct: 99,
      hawalaComplexityLabel: '99% (Extreme Multi-Node Hawala)',
      flightRiskPct: 76,
      flightRiskLabel: '76% (Domestic Safehouse Concealment)',
      heuristicSummary: 'Chief financial runner responsible for physical courier routes between Old Delhi, Zaveri Bazaar Mumbai, and Ahmedabad. Operates clandestine token chits and encrypted voice notes.'
    },
    cctnsProsecution: {
      firTitle: 'FIR #204/2026 - PS Lahori Gate & ED ECIR/09/DL/2026',
      offenses: 'Prevention of Money Laundering Act (PMLA) Sec 3 & 4, BNS 2023 Sec 318(4) (Cheating) & Sec 111 (Syndicate Courier)',
      io: 'DySP Kalyan Sengupta, Enforcement Directorate (HQ)',
      warrantTitle: 'Non-Bailable Warrant (NBW) Execution Warrant',
      warrantCourt: 'Issued by Chief Metropolitan Magistrate, Tis Hazari Courts, Delhi',
      warrantNo: 'Warrant No: NBW-THC-2026-4418 // Search & Seizure Mandate',
      locTitle: 'Bureau of Immigration Look Out Circular (LOC)',
      locCircular: 'MHA Circular Reference: LOC-2026-512-HAWALA',
      locAction: 'Detain on sight; seize any currency or bullion exceeding ₹2 Lakhs in possession.'
    },
    fiuAccounts: [
      { bank: 'Yes Bank - Chandni Chowk', acc: '019280194819', type: 'Current (Vajra Settlement Pool)', balance: '₹8,40,00,000', status: 'FROZEN UNDER PMLA SEC 17' },
      { bank: 'Kotak Mahindra - Sadar Bazaar', acc: '849102849102', type: 'Current (Falcon Bullion Traders)', balance: '₹5,15,00,000', status: 'FROZEN UNDER PMLA SEC 17' },
      { bank: 'Bank of Baroda - Karol Bagh', acc: '39102948102', type: 'Current (Mir Angadia Services)', balance: '₹4,65,00,000', status: 'DEBIT RESTRICTED (FIU MONITOR)' }
    ],
    telcoCdr: {
      burnerTitle: 'Vi / Vodafone-Idea Burner SIM',
      status: 'INTERCEPTED SILENT TAP',
      msisdn: '+91 98991 22019',
      imei: '359102849182103',
      towerSector: 'Kucha Ghasiram / Fatehpuri Masjid (CellID 1904)',
      roamingStatus: 'Localized Cell Tower Clustered',
      vahanTitle: 'VAHAN Vehicle Intercept',
      vahanStatus: 'SEIZED IN RAID',
      vahanReg: 'DL-03-CC-8104 (Mahindra Scorpio Black)',
      fastagRfid: '48192BA901239912',
      lastToll: 'Badarpur Border Toll Plaza',
      discrepancy: 'Vehicle confiscated with ₹1.8 Cr cash concealed in chassis secret cavity.'
    },
    evidenceItems: [
      { id: 'EVD-IND-903', title: 'Chandni Chowk Angadia Handwritten Token Ledger (Q3)', hash: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f', statusBadge: 'BSA 65B SEALED' },
      { id: 'EVD-IND-904', title: 'NPCI UPI Switch Transaction Audit - 32 Micro-Burst Smurfing', hash: '3e1a475a87d5ad3ebaf6350c2f7fbbb6ef3d7c5a1c5519668f1ba1b2f8cdaa05', statusBadge: 'BSA 65B SEALED' },
      { id: 'EVD-IND-907', title: 'DoT Legal Intercept Audio Recording - Angadia Dispatch Instructions', hash: '5c18aa950b8347e43ad3eb021f3201bf29d98c99258e9dc5739f12576bf0b901', statusBadge: 'BSA 65B SEALED' }
    ],
    matchingNodeIds: ['node-farooq', 'node-tariq', 'target-tariq']
  },
  {
    id: 'target-sameer',
    nodeId: 'node-sameer',
    name: 'SAMEER MERCHANT',
    syndicateRole: 'SIM/IMEI Operator',
    aliases: 'Sam Tech, "Ghost-SIM", Merchant-X, S.K. Merchant, "Transponder"',
    pan: 'CQMPM7712L',
    aadhaarHash: 'SHA256:9c3f8104****b5a7',
    passportNo: 'N1928301 (Republic of India)',
    locStatus: 'PENDING VERIFICATION',
    locRef: 'LOC-2026-688-CYBER',
    firRef: 'FIR #219/2026 PS DWARKA CYBER',
    classificationTag: 'TECHNICAL EVASION SPECIALIST // SIM CLONER',
    warrantStatus: 'Bailable Warrant with Electronic Tagging Order',
    warrantCourt: 'Additional Chief Judicial Magistrate (Cyber), Gurugram',
    warrantNo: 'BW-CYBER-2026-1182 (Sec 66 IT Act & 318 BNS)',
    threatScore: 82,
    threatSeverity: 'High Severity (Technical Evasion)',
    threatSeverityColor: '#ff9933',
    networkCentrality: 0.795,
    correlatedNodes: 9,
    flaggedLiquidity: '₹22.6 Cr',
    frozenAmount: '₹6.8 Cr Telecom Equipment & Cloud Servers',
    lastInterceptLocation: 'Noida Sector 62 Cyber Park',
    lastInterceptDetail: 'Transponder Baseband RF Signal Intercept',
    mugshotUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    referencePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    referencePhotoLabel: 'Corporate IT ID Registry Photo (Tech Corp 2023)',
    liveCctvLabel: 'Noida Cyber Hub Security Intercept CAM-08',
    biometricMatchPct: 96.8,
    biometricConfidence: '96.8% (FaceNet Vector Match)',
    biometricParams: {
      ipd: '63.4 mm',
      nasalCurvature: '0.845',
      mandibularAngle: '115.8°',
      confidenceScore: '96.8% (Corroborated)',
      algorithm: 'DRISTI-FaceNet-v4 (CCTNS Engine)',
      legalNote: 'MAC address and IMEI hardware pairing submitted as digital evidence under Sec 65B BSA.'
    },
    riskVector: {
      burnerRotationPct: 99,
      burnerRotationLabel: '99% (Automated SIM Farm Rotation)',
      hawalaComplexityPct: 62,
      hawalaComplexityLabel: '62% (UPI & Crypto Bridge)',
      flightRiskPct: 84,
      flightRiskLabel: '84% (Technical Extraction Threat)',
      heuristicSummary: 'Syndicate telecommunications operator utilizing automated 128-channel GSM SIM boxes and SDR transponders to generate synthetic cell tower ping decoys across Delhi NCR and Mumbai.'
    },
    cctnsProsecution: {
      firTitle: 'FIR #219/2026 - PS Dwarka Cyber Crime & DoT Vigilance Cell',
      offenses: 'Information Technology Act Sec 66 & 66C (Identity Theft), BNS 2023 Sec 318 (Cheating), Indian Telegraph Act Sec 20 & 25',
      io: 'Inspector Ananya Roy, Cyber SIGINT Directorate',
      warrantTitle: 'Warrant of Search & Electronic Asset Seizure',
      warrantCourt: 'Issued by ACJM (Cyber), Gurugram District Court',
      warrantNo: 'Warrant No: BW-CYBER-2026-1182 // Telephony Server Seizure',
      locTitle: 'Bureau of Immigration Look Out Circular (LOC)',
      locCircular: 'MHA Circular Reference: LOC-2026-688-CYBER',
      locAction: 'Watchlist alert on international departure manifests at Delhi, Mumbai, and Bangalore.'
    },
    fiuAccounts: [
      { bank: 'HDFC Bank - Noida Sector 62', acc: '501009182049', type: 'Current (CloudByte Systems LLP)', balance: '₹3,20,00,000', status: 'FROZEN UNDER PMLA SEC 17' },
      { bank: 'ICICI Bank - Cyber City Gurugram', acc: '003901928419', type: 'Current (NexGen Telecom Solutions)', balance: '₹2,45,00,000', status: 'DEBIT RESTRICTED' },
      { bank: 'Razorpay Virtual Gateway', acc: 'VA-RZP-99104', type: 'Payment Gateway Escrow Pool', balance: '₹1,15,00,000', status: 'GATEWAY SUSPENDED' }
    ],
    telcoCdr: {
      burnerTitle: 'Reliance Jio Multi-IMSI Transponder',
      status: 'SDR TRANSMITTER ACTIVE',
      msisdn: '+91 98110 49182',
      imei: '864910049182109',
      towerSector: 'Noida Sector 62 / Electronic City (CellID 9918A)',
      roamingStatus: 'Simultaneous Multi-Tower Attachment Detected',
      vahanTitle: 'FASTag Vehicle Surveillance',
      vahanStatus: 'MONITORED',
      vahanReg: 'UP-16-DE-2019 (Hyundai Creta Dark Edition)',
      fastagRfid: '66184AB001928410',
      lastToll: 'DND Flyway Plaza, Noida Tollgate',
      discrepancy: 'Transponders actively spoofing cellular location 48km from vehicle base.'
    },
    evidenceItems: [
      { id: 'EVD-IND-905', title: 'DoT Software Defined Radio (HackRF) Synthetic Baseband Log', hash: 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f', statusBadge: 'BSA 65B SEALED' },
      { id: 'EVD-IND-908', title: 'Dwarka Cyber Cell Seizure Memo - 128-Port SIM Farm Array', hash: 'e2a89104b8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1', statusBadge: 'BSA 65B SEALED' }
    ],
    matchingNodeIds: ['node-sameer', 'node-jio-burner', 'node-airtel-burner', 'target-sameer']
  },
  {
    id: 'target-elena',
    nodeId: 'node-elena',
    name: 'ELENA ROSTOVA',
    syndicateRole: 'International Liaison',
    aliases: 'Elena Petrova, "Caspian-01", Natasha, E. Rostova, "The Diplomat"',
    pan: 'FOR-RUS-8821',
    aadhaarHash: 'FOREIGN NATIONAL (RUSSIAN FEDERATION)',
    passportNo: '75-9018241 (Russian Federation Passport)',
    locStatus: 'ACTIVE RED NOTICE / LOC ISSUED',
    locRef: 'INTERPOL-RN-2026-A4918',
    firRef: 'CBI INTERPOL NCB NEW DELHI #09/2026',
    classificationTag: 'CROSS-BORDER LAUNDERING // INTERPOL RED NOTICE',
    warrantStatus: 'Interpol Red Notice & Extradition Request Active',
    warrantCourt: 'Special Extradition Court, Patiala House Courts, New Delhi',
    warrantNo: 'EXTRADITION-PMLA-2026-0044 (u/s 105A BNS / CrPC)',
    threatScore: 94,
    threatSeverity: 'Critical Severity (International Fugitive)',
    threatSeverityColor: '#ef4444',
    networkCentrality: 0.885,
    correlatedNodes: 13,
    flaggedLiquidity: '₹195.0 Cr',
    frozenAmount: '₹52.0 Cr Offshore Crypto & Escrow Wallets',
    lastInterceptLocation: 'Dubai International Airport DXB',
    lastInterceptDetail: 'Emirates Flight EK-512 Passenger Manifest (Inbound Goa)',
    mugshotUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    referencePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    referencePhotoLabel: 'Interpol General Secretariat Red Notice Dossier Photo',
    liveCctvLabel: 'DXB Terminal 3 First Class Lounge CCTV Feed',
    biometricMatchPct: 99.1,
    biometricConfidence: '99.1% (Interpol BioMatch Vector)',
    biometricParams: {
      ipd: '61.9 mm',
      nasalCurvature: '0.892',
      mandibularAngle: '112.5°',
      confidenceScore: '99.1% (Definitive)',
      algorithm: 'Interpol-BioMatch & CCTNS Trans-National',
      legalNote: 'Certified under Interpol Red Notice bilateral treaty and Section 65B BSA 2023.'
    },
    riskVector: {
      burnerRotationPct: 92,
      burnerRotationLabel: '92% (International eSIM & Threema)',
      hawalaComplexityPct: 98,
      hawalaComplexityLabel: '98% (Offshore Crypto & Hawala Bridge)',
      flightRiskPct: 98,
      flightRiskLabel: '98% (Multi-Jurisdictional Diplomatic Evasion)',
      heuristicSummary: 'Primary international money launderer routing Hawala liquidity into offshore Tether USDT crypto liquidity pools and luxury real estate trusts across Dubai, Cyprus, and London.'
    },
    cctnsProsecution: {
      firTitle: 'CBI INTERPOL NCB New Delhi Case #09/2026 & ED Special Cell',
      offenses: 'UN Convention Against Transnational Organized Crime, PMLA Sec 3, 4 & 5, BNS 2023 Sec 111 (Transnational Crime Syndicate)',
      io: 'Special Director CBI (International Operations) / ED PMLA Cell',
      warrantTitle: 'Interpol Red Notice A-4918/9-2026 & Extradition Warrant',
      warrantCourt: 'Issued by Special Extradition Court, New Delhi',
      warrantNo: 'Warrant No: INTERPOL-RN-2026-A4918 // Pan-Globe Arrest Order',
      locTitle: 'Bureau of Immigration Look Out Circular (LOC)',
      locCircular: 'MHA Circular Reference: LOC-2026-608-INTERPOL',
      locAction: 'Immediate apprehension at all international ports of entry; notify NCB New Delhi immediately.'
    },
    fiuAccounts: [
      { bank: 'Emirates NBD - Dubai Financial Centre', acc: '1019284019284', type: 'Corporate Escrow (Caspian Trust FZE)', balance: '₹78,50,000 equivalent ($940K)', status: 'MONITORED BY UAE FIU' },
      { bank: 'Standard Chartered - Mumbai Fort', acc: '491028491029', type: 'NRE / Foreign Inward Remittance', balance: '₹14,80,00,000', status: 'FROZEN UNDER PMLA SEC 17' },
      { bank: 'Tether TRC-20 Blockchain Cold Vault', acc: 'TX78...99e1 (USDT Multi-Sig)', type: 'TRC-20 Smart Contract Escrow', balance: '₹52,00,00,000 (6.25M USDT)', status: 'CHAINALYSIS TAGGED / OFAC ALERT' }
    ],
    telcoCdr: {
      burnerTitle: 'International eSIM / Threema Protocol',
      status: 'ROAMING ACTIVE',
      msisdn: '+971 50 819 2041',
      imei: '358901849102918',
      towerSector: 'UAE Etisalat / Inbound Roaming Delhi IGI Airport',
      roamingStatus: 'International Roaming Attachment',
      vahanTitle: 'Luxury Transfer Intercept (VAHAN)',
      vahanStatus: 'CHAUFFEUR MONITORED',
      vahanReg: 'DL-1C-AA-0001 (Mercedes-Maybach S-Class)',
      fastagRfid: '8810294810294109',
      lastToll: 'IGI Airport VIP Express Highway',
      discrepancy: 'VIP convoy tracked moving between embassies and Aerocity 5-star hotel.'
    },
    evidenceItems: [
      { id: 'EVD-IND-909', title: 'Interpol Red Notice A-4918/9-2026 Judicial Extract Document', hash: '7c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b', statusBadge: 'BSA 65B SEALED' },
      { id: 'EVD-IND-910', title: 'Chainalysis Blockchain Forensic Audit - 6.25M USDT Cold Wallet Hop', hash: 'f2a5b8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8', statusBadge: 'BSA 65B SEALED' }
    ],
    matchingNodeIds: ['node-elena', 'target-elena']
  }
];

export const getTargetById = (id?: string | null): DossierTarget => {
  if (!id) return DOSSIER_TARGETS[0];
  const found = DOSSIER_TARGETS.find(t => 
    t.id === id || 
    t.nodeId === id || 
    t.matchingNodeIds.includes(id) ||
    t.name.toLowerCase().includes(id.toLowerCase())
  );
  return found || DOSSIER_TARGETS[0];
};

export const findTargetByQuery = (query: string): DossierTarget | undefined => {
  const q = query.toLowerCase();
  return DOSSIER_TARGETS.find(t =>
    t.id.toLowerCase() === q ||
    t.nodeId.toLowerCase() === q ||
    t.name.toLowerCase().includes(q) ||
    t.aliases.toLowerCase().includes(q) ||
    t.matchingNodeIds.some(m => m.toLowerCase() === q)
  );
};
