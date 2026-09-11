import { CaseRecord } from '../types';
import { ASSETS } from './mockData';

export const MOCK_CASES: CaseRecord[] = [
  {
    id: 'CASE-CCTNS-2026-182',
    caseNo: 'FIR #182/2026',
    title: 'Operation TRIDENT: Transnational Hawala & Shell Corporate Laundering',
    agency: 'CCTNS',
    agencyFullName: 'Delhi Police Special Cell (CCTNS Inter-State Network)',
    firOrRcNo: 'FIR-182/2026-SPL-CELL',
    policeStationOrBranch: 'PS Special Cell, Lodhi Colony, New Delhi',
    stateOrJurisdiction: 'Delhi NCR',
    dateRegistered: '2026-08-14 11:30 IST',
    caseStage: 'Charge Sheeted (u/s 173 BNS)',
    legalFramework: ['BNS / IPC', 'PMLA', 'IT Act'],
    bnsIpcSections: ['BNS Sec 111 (Organized Crime)', 'BNS Sec 316 (Criminal Breach of Trust)', 'BNS Sec 318 (Cheating)', 'IT Act Sec 66D'],
    summary: 'Multi-jurisdictional syndicate spearheaded by Vikramaditya Singhania deploying 14 shell LLPs, 42 structured UPI VPAs, and Chandni Chowk bullion couriers to illicitly remit ₹142.8 Crore to Dubai escrow vaults.',
    priority: 'CRITICAL',
    documentCount: 5,
    sha256Seal: '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f',
    bsaCertificate: {
      section: 'Section 65B(4) Bharatiya Sakshya Adhiniyam 2023',
      certifiedBy: 'ACP Rajeshwar Rao, IPS (Cyber & Financial Forensics, New Delhi)',
      hash: '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f',
      verificationDate: '2026-09-09 21:44 IST',
      status: 'VALID'
    },
    accusedRoster: [
      {
        id: 'ACC-01',
        name: 'Vikramaditya Singhania',
        alias: 'Kabir / VS / Director',
        role: 'Kingpin & Beneficial Owner (Kavach Tech Pvt Ltd)',
        aadhaarHash: 'XXXX-XXXX-8821 [UIDAI Tokenized SHA-256]',
        pan: 'ABCPS9182K',
        passportNo: 'Z4901824 (Expired) / Fake Mauritian #M-90214',
        locStatus: 'Active LOC Issued (Bureau of Immigration)',
        arrestStatus: 'Non-Bailable Warrant (NBW) Active',
        warrantDetails: 'NBW Issued by Spl Judge (PMLA), Patiala House District Courts (CNR: DLDH01-00214-2026)',
        riskScore: 96,
        photoUrl: ASSETS.targetMugshot
      },
      {
        id: 'ACC-02',
        name: 'Rajesh Sharma',
        alias: 'Panditji / Munshi',
        role: 'Chandni Chowk Hawala Cash Operator & Token Courier',
        aadhaarHash: 'XXXX-XXXX-3419 [UIDAI Verified]',
        pan: 'BNYPS4410J',
        passportNo: 'R1820491',
        locStatus: 'Pending Verification',
        arrestStatus: 'Arrested & Remanded',
        warrantDetails: 'Remanded to Police Custody u/s 187 BNSS 2023 for 7 days',
        riskScore: 84,
        photoUrl: ASSETS.associatePortrait
      },
      {
        id: 'ACC-03',
        name: 'Farooq Mir',
        alias: 'Mir Sahab',
        role: 'Dubai Logistics & Escrow Controller (Trident Logistics FZE)',
        aadhaarHash: 'XXXX-XXXX-9912 [UIDAI Flagged]',
        pan: 'CPZPM1029L',
        passportNo: 'P9028142',
        locStatus: 'Active LOC Issued (Bureau of Immigration)',
        arrestStatus: 'Absconding',
        warrantDetails: 'Red Corner Notice (RCN) Proposal under MHA Inter-Agency Review',
        riskScore: 91
      }
    ],
    legalOffenseMatrix: [
      {
        id: 'OFF-01',
        act: 'Bharatiya Nyaya Sanhita (BNS) 2023',
        section: 'Section 111',
        title: 'Organized Crime Syndicate & Hawala Racketeering',
        description: 'Continuing unlawful activity committed by a crime syndicate by violence, intimidation, fraud or illicit economic transactions exceeding ₹1 Crore.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Rigorous Imprisonment for Life or Death + Min Fine ₹5 Lakh'
      },
      {
        id: 'OFF-02',
        act: 'Bharatiya Nyaya Sanhita (BNS) 2023',
        section: 'Section 316 (2)',
        title: 'Criminal Breach of Trust by Public Servant or Banker/Merchant',
        description: 'Dishonest misappropriation or conversion of commercial funds entrusted to corporate directors and financial escrow custodians.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Imprisonment up to 10 years and Fine'
      },
      {
        id: 'OFF-03',
        act: 'Prevention of Money Laundering Act (PMLA) 2002',
        section: 'Sections 3 & 4',
        title: 'Offense of Money-Laundering & Placement of Proceeds of Crime',
        description: 'Direct involvement in concealment, possession, acquisition or use of proceeds of crime and projecting it as untainted property.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Rigorous Imprisonment up to 7 to 10 years + Attachment of Assets'
      },
      {
        id: 'OFF-04',
        act: 'Information Technology Act 2000',
        section: 'Section 66D',
        title: 'Cheating by Personation by Using Computer Resource',
        description: 'Deployment of structured botnet scripts and forged digital tokens to spoof PAN reporting on banking APIs.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Imprisonment up to 3 years and Fine up to ₹1 Lakh'
      }
    ],
    seizedAssetTrail: [
      {
        id: 'AST-01',
        type: 'BANK_ACCOUNT',
        identifier: 'HDFC Escrow A/C #50200088192011 (IFSC: HDFC0000003)',
        description: 'Primary corporate settlement current account held at Connaught Place branch.',
        estimatedValue: '₹34,50,00,000 (₹34.5 Cr)',
        holdingEntity: 'Kavach Technologies India Pvt Ltd',
        freezeStatus: 'FROZEN (Sec 17 PMLA)',
        custodyMemo: 'MHA/SPL/SZ-2026-441',
        seizureDate: '2026-08-16'
      },
      {
        id: 'AST-02',
        type: 'UPI_VPA',
        identifier: 'singhania.hawala@ybl & trident.escrow@paytm',
        description: 'Structured payment routing VPAs with 42 micro-transfers between ₹48,000 - ₹49,500.',
        estimatedValue: '₹2,05,80,000 (₹2.05 Cr)',
        holdingEntity: 'Vikramaditya Singhania (Personal VPA)',
        freezeStatus: 'FROZEN (Sec 17 PMLA)',
        custodyMemo: 'NPCI/PMLA/FRZ-8812',
        seizureDate: '2026-08-18'
      },
      {
        id: 'AST-03',
        type: 'VEHICLE',
        identifier: 'Toyota Fortuner 4x4 (DL-10-CA-4091) • FASTag #34161FA820301109',
        description: 'Surveillance intercept vehicle deployed as decoy with cloned FASTag RFID tag.',
        estimatedValue: '₹46,00,000',
        holdingEntity: 'Vajra Logistics Delhi Hub',
        freezeStatus: 'SEIZED (Sec 102 BNS)',
        custodyMemo: 'DEL-POL-SZ-904',
        seizureDate: '2026-09-08'
      },
      {
        id: 'AST-04',
        type: 'IMEI_SIM',
        identifier: 'Samsung S24 Ultra (IMEI: 354891109481204) + Jio 5G eSIM',
        description: 'Cryptographic cold-storage hardware, encrypted Signal vault, and hawala token notes.',
        estimatedValue: 'Evidentiary Artifact',
        holdingEntity: 'Physical Custody at CFSL New Delhi',
        freezeStatus: 'SEIZED (Sec 102 BNS)',
        custodyMemo: 'CFSL/DL/EVD-901',
        seizureDate: '2026-09-09'
      },
      {
        id: 'AST-05',
        type: 'IMMOVABLE_PROPERTY',
        identifier: 'Farmhouse No. 14-B, Radhey Mohan Drive, Chhatarpur, New Delhi',
        description: 'Luxury sprawling estate registered under bogus LLP shell (Trident Agro-Tech).',
        estimatedValue: '₹48,00,00,000 (₹48 Cr)',
        holdingEntity: 'Trident Agro-Tech India LLP',
        freezeStatus: 'ATTACHED (ED PMLA)',
        custodyMemo: 'ED/DLZO/PAO-04/2026',
        seizureDate: '2026-08-25'
      }
    ],
    documents: [
      {
        id: 'DOC-182-01',
        title: 'CCTNS Integrated FIR Form I: State vs. Vikramaditya Singhania & Ors',
        docType: 'FIR (Form I-IX)',
        date: '2026-08-14',
        classification: 'RESTRICTED // LAW ENFORCEMENT SENSITIVE',
        sha256: '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f',
        pages: 14,
        authorOfficer: 'Inspector Harish Chandra, Special Cell, Lodhi Colony',
        entities: {
          accused: ['Vikramaditya Singhania', 'Rajesh Sharma', 'Farooq Mir'],
          financial: ['HDFC Escrow A/C #50200088192011', 'singhania.hawala@ybl'],
          assets: ['Toyota Fortuner DL-10-CA-4091', 'FASTag #34161FA820301109', 'Samsung S24 Ultra'],
          sections: ['BNS Sec 111', 'BNS Sec 316', 'PMLA Sec 3', 'PMLA Sec 4', 'IT Act Sec 66D']
        },
        fullContent: `GOVERNMENT OF NCT OF DELHI // DELHI POLICE
CRIME AND CRIMINAL TRACKING NETWORK & SYSTEMS (CCTNS)
FIRST INFORMATION REPORT (Under Section 173 BNSS 2023 / Form I)

1. District: New Delhi | Police Station: Special Cell (Lodhi Colony) | Year: 2026
2. FIR No.: 0182/2026 | Date & Hour of Occurrence: 2026-06-01 to 2026-08-13
3. Acts & Sections:
   (i) Bharatiya Nyaya Sanhita (BNS) 2023: Section 111 (Organized Crime), Section 316(2) (Criminal Breach of Trust), Section 318(4) (Cheating)
   (ii) Information Technology Act 2000: Section 66D
   (iii) Prevention of Money Laundering Act (PMLA) 2002: Sections 3 & 4 (Predicate Offenses Scheduled)

4. Type of Information: Written Complaint forwarded by Joint Director, Financial Intelligence Unit - India (FIU-IND) Ref: FIU/DL/STR/2026/891.
5. Place of Occurrence: Corporate Offices of Kavach Technologies India Pvt Ltd (Barakhamba Road, Connaught Place) and bullion clearing houses at Kucha Mahajani, Chandni Chowk, Delhi.

6. Details of Known / Suspected / Accused Persons:
   (a) Vikramaditya Singhania @ Kabir (Managing Director, Kavach Technologies India Pvt Ltd)
   (b) Rajesh Sharma @ Panditji (Chief Cash Handler, Chandni Chowk Hawala Node)
   (c) Farooq Mir @ Mir Sahab (Managing Partner, Trident Logistics FZE, Dubai)

7. Brief Facts of the Case:
   Intelligence received via FIU-IND Suspicious Transaction Report indicated systematic structuring ("smurfing") of transactions under ₹50,000 to circumvent mandatory PAN disclosure mandated under Rule 114B of Income Tax Rules. Funds were remitted through UPI VPAs including singhania.hawala@ybl and pooled into HDFC Escrow A/C #50200088192011. Subsequent physical cash collections occurred at Chandni Chowk via courier Rajesh Sharma. Over ₹142.8 Crore was siphoned offshore using fictitious IT consultancy service export invoices. Primary target Vikramaditya Singhania orchestrated movement using encrypted burner phones and vehicle decoys.

8. Action Taken: Case registered. Endorsed to ACP Rajeshwar Rao for detailed investigation. SHA-256 digital cryptographic hash generated under Section 65B Bharatiya Sakshya Adhiniyam 2023.`
      },
      {
        id: 'DOC-182-02',
        title: 'CCTNS Police Final Report / Charge Sheet u/s 173 BNS 2023',
        docType: 'Charge Sheet (u/s 173 BNS)',
        date: '2026-09-02',
        classification: 'TOP SECRET // FOR SPECIAL COURT ONLY',
        sha256: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
        pages: 82,
        authorOfficer: 'ACP Rajeshwar Rao, Special Investigation Team (SIT)',
        entities: {
          accused: ['Vikramaditya Singhania', 'Rajesh Sharma'],
          financial: ['HDFC Escrow A/C #50200088192011', '₹142.8 Crore'],
          assets: ['Chhatarpur Farmhouse #14-B', 'DL-10-CA-4091', 'Trezor HW-409'],
          sections: ['BNS Sec 111', 'BNS Sec 316', 'BNS Sec 318', 'PMLA Sec 3']
        },
        fullContent: `IN THE COURT OF SPECIAL JUDGE (PMLA / SPECIAL CELL), PATIALA HOUSE COURTS, NEW DELHI
CHARGE SHEET UNDER SECTION 173 BNS 2023 (POLICE REPORT)
CNR NO: DLDH01-00214-2026 // STATE VS. VIKRAMADITYA SINGHANIA & ORS.

SUMMARY OF CHARGES & PROVABLE EVIDENCE:
1. The accused Vikramaditya Singhania incorporated 14 front LLPs in Registrar of Companies, Delhi, between 2021 and 2025. None of these entities possessed physical premises or bona fide employees.
2. Invoices claiming technical documentation exports to Trident Logistics FZE, UAE, were generated using automated templates found on the seized Samsung S24 Ultra (IMEI: 354891109481204).
3. Digital ledger analysis conducted by CFSL New Delhi revealed cash ledgers correlating precisely with hawala tokens seized from co-accused Rajesh Sharma on 2026-08-16.
4. Fastag tracking records confirm accused DL-10-CA-4091 passed Kherki Daula toll gate carrying an imposter while the accused held meetings in old Delhi.
5. The prosecution prays for issuance of Non-Bailable Warrants and attachment of proceeds of crime totaling ₹142.8 Crore.`
      },
      {
        id: 'DOC-182-03',
        title: 'Seizure Memo & Panchnama: Cash, Hardware & Gold Bullion',
        docType: 'Seizure Memo',
        date: '2026-08-16',
        classification: 'RESTRICTED // EVIDENCE SEAL',
        sha256: 'd2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c99f8e4c7b2a1d0f5e8a3b6c9d2e1f',
        pages: 6,
        authorOfficer: 'Sub-Inspector Mohan Lal, Crime Branch',
        entities: {
          accused: ['Rajesh Sharma'],
          financial: ['Cash ₹2.40 Crore', 'Hawala Token Chits'],
          assets: ['Gold Bars 4.5 kg', 'Samsung S24 Ultra', 'Trezor HW-409'],
          sections: ['BNS Sec 102', 'BSA Sec 65B']
        },
        fullContent: `MEMORANDUM OF SEIZURE (PANCHNAMA) UNDER SECTION 105 BNSS 2023
Place of Seizure: Shop #42, Ground Floor, Kucha Mahajani, Chandni Chowk, Delhi - 110006
Date & Time: 16th August 2026 at 16:45 IST

IN PRESENCE OF INDEPENDENT PANCH WITNESSES:
1. Shri Ramesh Gupta, R/o 112 Nai Sarak, Delhi
2. Shri Alok Jain, R/o 45 Dariba Kalan, Delhi

ITEMS SEIZED AND LABELED:
- Parcel A: Indian Currency notes in denominations of ₹500 totaling ₹2,40,00,000/- (Two Crore Forty Lakhs).
- Parcel B: Four (4) Swiss Gold Bullion Bars 999.9 purity, 1 kg each, bearing serial marks PAMP SUISSE.
- Parcel C: One Samsung S24 Ultra Black mobile handset with dual Jio eSIM active, powered off using Faraday Bag.
- Parcel D: Trezor Hardware Ledger HW-409 containing Ethereum/Tron multi-sig cold wallet seeds.
- Parcel E: 18 Handwritten chits denoting alphanumeric hawala tokens (e.g., 'DEL-DXB-901', 'CP-50K-42').

All parcels were sealed with Delhi Police brass seal 'SP-CELL-DL' and signed by Panch witnesses. Section 65B BSA hash certificate affixed.`
      }
    ]
  },
  {
    id: 'CASE-ED-2026-09',
    caseNo: 'ECIR/09/DLZO/2026',
    title: 'Enforcement Directorate PMLA Attachment: Kavach & Trident Offshore Escrows',
    agency: 'ED',
    agencyFullName: 'Directorate of Enforcement (ED), Delhi Zonal Office',
    firOrRcNo: 'ECIR-09/DLZO/2026/PMLA',
    policeStationOrBranch: 'Delhi Zonal Office - II, APJ Abdul Kalam Road',
    stateOrJurisdiction: 'ED Zonal Office (DLZO)',
    dateRegistered: '2026-08-18 14:00 IST',
    caseStage: 'Under Investigation',
    legalFramework: ['PMLA', 'BNS / IPC'],
    bnsIpcSections: ['PMLA Sec 3 (Money Laundering)', 'PMLA Sec 4 (Punishment)', 'PMLA Sec 17 (Search & Seizure)', 'PMLA Sec 5 (Provisional Attachment)'],
    summary: 'Provisional Attachment of ₹84.5 Crore in bank balances, commercial real estate in BKC Mumbai, and Chhatarpur farmhouses derived from predicate offenses registered under FIR #182/2026.',
    priority: 'CRITICAL',
    documentCount: 3,
    sha256Seal: '8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    bsaCertificate: {
      section: 'Section 65B BSA 2023 & Section 50 PMLA 2002',
      certifiedBy: 'Deputy Director S. K. Nambiar, ED Delhi Zonal Office',
      hash: '8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
      verificationDate: '2026-09-08 19:15 IST',
      status: 'VALID'
    },
    accusedRoster: [
      {
        id: 'ACC-ED-01',
        name: 'Vikramaditya Singhania',
        alias: 'VS / Beneficiary',
        role: 'Promoter & Mastermind',
        aadhaarHash: 'XXXX-XXXX-8821',
        pan: 'ABCPS9182K',
        passportNo: 'Z4901824',
        locStatus: 'Active LOC Issued (Bureau of Immigration)',
        arrestStatus: 'Non-Bailable Warrant (NBW) Active',
        warrantDetails: 'Summons u/s 50 PMLA issued (non-compliant 3 times)',
        riskScore: 98,
        photoUrl: ASSETS.targetBiometric
      },
      {
        id: 'ACC-ED-02',
        name: 'Pooja Singhania',
        alias: 'Director Pooja',
        role: 'Dummy Director (Trident Agro-Tech India LLP)',
        aadhaarHash: 'XXXX-XXXX-1940',
        pan: 'AQEPS2109M',
        passportNo: 'T1092841',
        locStatus: 'Pending Verification',
        arrestStatus: 'Interrogated u/s 67 NDPS/BNS',
        warrantDetails: 'Statement recorded under Section 50 PMLA on 2026-08-28',
        riskScore: 68
      }
    ],
    legalOffenseMatrix: [
      {
        id: 'OFF-ED-01',
        act: 'Prevention of Money Laundering Act (PMLA) 2002',
        section: 'Section 3',
        title: 'Whosoever Directly or Indirectly Attempts to Indulge in Money Laundering',
        description: 'Knowingly being a party to activities connected with the proceeds of crime including concealment, possession, acquisition, and untainted projection.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Rigorous Imprisonment 3 to 7 years + Uncapped Fines'
      },
      {
        id: 'OFF-ED-02',
        act: 'Prevention of Money Laundering Act (PMLA) 2002',
        section: 'Section 5',
        title: 'Attachment of Property Involved in Money-Laundering',
        description: 'Provisional attachment of properties likely to be concealed, transferred or dealt with to frustrate proceedings.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Permanent Confiscation by Central Government upon Adjudication'
      }
    ],
    seizedAssetTrail: [
      {
        id: 'AST-ED-01',
        type: 'IMMOVABLE_PROPERTY',
        identifier: 'Unit 1204, Cyber City Tower B, BKC Bandra-Kurla Complex, Mumbai',
        description: 'Commercial office measuring 4,800 sq ft registered to Kavach Technologies.',
        estimatedValue: '₹22,00,00,000 (₹22 Cr)',
        holdingEntity: 'Kavach Technologies India Pvt Ltd',
        freezeStatus: 'ATTACHED (ED PMLA)',
        custodyMemo: 'ED/MZU/PAO-12/2026',
        seizureDate: '2026-08-20'
      },
      {
        id: 'AST-ED-02',
        type: 'BANK_ACCOUNT',
        identifier: 'Kotak Mahindra Escrow A/C #9011824011 (IFSC: KKBK0000192)',
        description: 'Escrow account used for routing foreign inward remittance certificates (FIRC).',
        estimatedValue: '₹14,20,00,000 (₹14.2 Cr)',
        holdingEntity: 'Trident Logistics India LLP',
        freezeStatus: 'FROZEN (Sec 17 PMLA)',
        custodyMemo: 'ED/DLZO/FRZ-91',
        seizureDate: '2026-08-22'
      }
    ],
    documents: [
      {
        id: 'DOC-ED-01',
        title: 'Provisional Attachment Order (PAO No. 04/2026/DLZO)',
        docType: 'Progress Report (PR)',
        date: '2026-08-25',
        classification: 'CONFIDENTIAL // PMLA ADJUDICATING AUTHORITY',
        sha256: '8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
        pages: 34,
        authorOfficer: 'Joint Director P. K. Sharma, ED New Delhi',
        entities: {
          accused: ['Vikramaditya Singhania', 'Pooja Singhania'],
          financial: ['Kotak Mahindra Escrow #9011824011', '₹84.5 Crore'],
          assets: ['BKC Unit 1204', 'Chhatarpur Farmhouse'],
          sections: ['PMLA Sec 3', 'PMLA Sec 5', 'PMLA Sec 17']
        },
        fullContent: `DIRECTORATE OF ENFORCEMENT // GOVERNMENT OF INDIA
PROVISIONAL ATTACHMENT ORDER NO. 04/2026
UNDER SECTION 5(1) OF THE PREVENTION OF MONEY LAUNDERING ACT, 2002

IN THE MATTER OF: ECIR/09/DLZO/2026
ARISING OUT OF PREDICATE OFFENCE: FIR NO. 182/2026 PS SPECIAL CELL DELHI

WHEREAS, investigation reveals that the accused Vikramaditya Singhania and his family members have layered and integrated proceeds of crime generated through tax evasion, fake input tax credits (ITC), and unauthorized inward Hawala remittances.
NOW THEREFORE, in exercise of powers conferred under Section 5(1) of PMLA, the properties specified in Schedule-A amounting to ₹84,50,00,000/- are hereby provisionally attached. The respondents are restrained from alienating, transferring or charging said assets.`
      }
    ]
  },
  {
    id: 'CASE-NIA-2026-04',
    caseNo: 'RC-04/2026/NIA/DLI',
    title: 'NIA Trans-Border Hawala Financing & Electronic Communications Syndicate',
    agency: 'NIA',
    agencyFullName: 'National Investigation Agency (NIA), New Delhi Hqrs',
    firOrRcNo: 'RC-04/2026/NIA/DLI',
    policeStationOrBranch: 'NIA Police Station, CGO Complex, Lodhi Road, New Delhi',
    stateOrJurisdiction: 'Pan-India / Inter-State',
    dateRegistered: '2026-08-20 18:00 IST',
    caseStage: 'Under Investigation',
    legalFramework: ['UAPA', 'BNS / IPC'],
    bnsIpcSections: ['UAPA Sec 17 (Raising Funds for Terrorist Act)', 'UAPA Sec 18 (Conspiracy)', 'UAPA Sec 40 (Offense of Terror Funding)', 'BNS Sec 120B (Criminal Conspiracy)'],
    summary: 'Probe into covert funding networks channeling foreign currency chits through Dubai and Zurich front entities into domestic communication relay cells operating cloned SIMs and encrypted transmitters.',
    priority: 'CRITICAL',
    documentCount: 2,
    sha256Seal: 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    bsaCertificate: {
      section: 'Section 65B BSA 2023 / Section 43D UAPA 1967',
      certifiedBy: 'Superintendent of Police K. V. Raghavan, IPS (NIA Ops-IV)',
      hash: 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f',
      verificationDate: '2026-09-07 10:20 IST',
      status: 'VALID'
    },
    accusedRoster: [
      {
        id: 'ACC-NIA-01',
        name: 'Farooq Mir',
        alias: 'Mir Sahab / Engineer',
        role: 'Trans-border Logistics Coordinator',
        aadhaarHash: 'XXXX-XXXX-9912',
        pan: 'CPZPM1029L',
        passportNo: 'P9028142',
        locStatus: 'Active LOC Issued (Bureau of Immigration)',
        arrestStatus: 'Absconding',
        warrantDetails: 'Look Out Circular #LOC-2026-881 / Inter-Agency Warrant',
        riskScore: 94
      },
      {
        id: 'ACC-NIA-02',
        name: 'Vikramaditya Singhania',
        alias: 'Kabir',
        role: 'Domestic Node & Hardware Supplier',
        aadhaarHash: 'XXXX-XXXX-8821',
        pan: 'ABCPS9182K',
        passportNo: 'Z4901824',
        locStatus: 'Active LOC Issued (Bureau of Immigration)',
        arrestStatus: 'Non-Bailable Warrant (NBW) Active',
        warrantDetails: 'Non-Bailable Warrant Patiala House Court',
        riskScore: 96,
        photoUrl: ASSETS.targetCCTV
      }
    ],
    legalOffenseMatrix: [
      {
        id: 'OFF-NIA-01',
        act: 'Unlawful Activities (Prevention) Act (UAPA) 1967',
        section: 'Section 17',
        title: 'Punishment for Raising Funds for Terrorist Act',
        description: 'Collecting or providing funds from legitimate or illegitimate sources knowing that such funds are likely to be used to commit subversive acts.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Imprisonment for not less than 5 years, extending up to Life + Fine'
      },
      {
        id: 'OFF-NIA-02',
        act: 'Unlawful Activities (Prevention) Act (UAPA) 1967',
        section: 'Section 18',
        title: 'Punishment for Conspiracy to Commit Terrorist Act',
        description: 'Conspiring or attempting to facilitate any act preparatory to the commission of unlawful disruptive events.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Imprisonment for not less than 5 years, extending up to Life'
      }
    ],
    seizedAssetTrail: [
      {
        id: 'AST-NIA-01',
        type: 'CRYPTO_LEDGER',
        identifier: 'TRC-20 Tether Escrow (Wallet: 0x9f8...2e1f) • Ledger HW-409',
        description: 'Multi-signature cryptographic cold storage seized from old Delhi vault.',
        estimatedValue: 'USDT $1,850,000 (~₹15.4 Cr)',
        holdingEntity: 'CFSL Cyber Security Lab Vault',
        freezeStatus: 'FROZEN (Sec 17 PMLA)',
        custodyMemo: 'NIA/HQ/EVD-409',
        seizureDate: '2026-08-29'
      }
    ],
    documents: [
      {
        id: 'DOC-NIA-01',
        title: 'NIA First Information Report (Re-Registered RC-04/2026)',
        docType: 'FIR (Form I-IX)',
        date: '2026-08-20',
        classification: 'TOP SECRET // NATIONAL SECURITY RESTRICTED',
        sha256: 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f',
        pages: 18,
        authorOfficer: 'DySP Amitav Sen, NIA New Delhi',
        entities: {
          accused: ['Farooq Mir', 'Vikramaditya Singhania'],
          financial: ['USDT $1.85M', 'Hawala Token DEL-DXB-901'],
          assets: ['Ledger HW-409', 'Encrypted Transmitters'],
          sections: ['UAPA Sec 17', 'UAPA Sec 18', 'UAPA Sec 40']
        },
        fullContent: `NATIONAL INVESTIGATION AGENCY // NEW DELHI
RE-REGISTRATION OF CASE UNDER SECTION 6(5) OF NIA ACT 2008
CASE NO: RC-04/2026/NIA/DLI

WHEREAS, the Central Government, Ministry of Home Affairs, via Order No. 11011/42/2026-IS-IV directed the National Investigation Agency to take over investigation of interstate hawala conduit having cross-border ramifications.
Prima facie verification reveals that proceeds generated through corporate fraud in New Delhi were diverted through covert crypto pools to finance unauthorized SDR communication equipment in border regions.`
      }
    ]
  },
  {
    id: 'CASE-CBI-2026-218',
    caseNo: 'RC-218/2026/CBI/EOU-IV',
    title: 'CBI Economic Offenses Probe: Public Sector Consortium Credit Diversion',
    agency: 'CBI',
    agencyFullName: 'Central Bureau of Investigation (CBI), Economic Offenses Wing',
    firOrRcNo: 'RC-218/2026/CBI/EOU-IV',
    policeStationOrBranch: 'CBI / EOU-IV, CGO Complex, Lodhi Road, New Delhi',
    stateOrJurisdiction: 'CBI Branches (EOU)',
    dateRegistered: '2026-07-28 10:00 IST',
    caseStage: 'Under Investigation',
    legalFramework: ['PC Act', 'BNS / IPC'],
    bnsIpcSections: ['PC Act Sec 7 (Bribery & Public Corruption)', 'PC Act Sec 13(1)(d)', 'BNS Sec 318 (Cheating)', 'BNS Sec 336 (Forgery of Valuable Security)'],
    summary: 'Consortium bank fraud involving ₹68.4 Crore in working capital credit facilities diverted to non-existent vendors using fabricated e-Way bills and fake GSTINs.',
    priority: 'HIGH',
    documentCount: 2,
    sha256Seal: '7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f4a7b0c',
    bsaCertificate: {
      section: 'Section 65B BSA 2023 / Section 17A PC Act',
      certifiedBy: 'Superintendent of Police R. C. Mathur, CBI EOU-IV',
      hash: '7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f4a7b0c',
      verificationDate: '2026-09-05 16:30 IST',
      status: 'VALID'
    },
    accusedRoster: [
      {
        id: 'ACC-CBI-01',
        name: 'Vikramaditya Singhania',
        alias: 'VS',
        role: 'Borrower & Managing Director',
        aadhaarHash: 'XXXX-XXXX-8821',
        pan: 'ABCPS9182K',
        passportNo: 'Z4901824',
        locStatus: 'Active LOC Issued (Bureau of Immigration)',
        arrestStatus: 'Non-Bailable Warrant (NBW) Active',
        warrantDetails: 'CBI Special Court Warrant Rouse Avenue',
        riskScore: 92,
        photoUrl: ASSETS.targetMugshot
      },
      {
        id: 'ACC-CBI-02',
        name: 'Sunil Bajpai',
        alias: 'DGM Credit',
        role: 'Ex-DGM, Consortium Lead Bank (Retired)',
        aadhaarHash: 'XXXX-XXXX-7110',
        pan: 'AGHPB4910K',
        passportNo: 'K8192041',
        locStatus: 'None',
        arrestStatus: 'Interrogated u/s 67 NDPS/BNS',
        warrantDetails: 'Co-conspirator charge memo filed under PC Act Section 7',
        riskScore: 74
      }
    ],
    legalOffenseMatrix: [
      {
        id: 'OFF-CBI-01',
        act: 'Prevention of Corruption Act (PC Act) 1988',
        section: 'Section 7',
        title: 'Offense Relating to Public Servant Being Bribed',
        description: 'Obtaining undue advantage with intention to induce improper performance of a public function by a public sector bank manager.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Imprisonment 3 to 7 years + Fine'
      },
      {
        id: 'OFF-CBI-02',
        act: 'Bharatiya Nyaya Sanhita (BNS) 2023',
        section: 'Section 336',
        title: 'Forgery of Valuable Security or Will',
        description: 'Fabrication of consortium letters of credit (LCs) and false bills of lading.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Imprisonment up to 10 years or Life + Fine'
      }
    ],
    seizedAssetTrail: [
      {
        id: 'AST-CBI-01',
        type: 'BANK_ACCOUNT',
        identifier: 'Punjab National Bank Escrow A/C #001920018819 (IFSC: PUNB0001900)',
        description: 'Consortium fund pooling account holding credit balance.',
        estimatedValue: '₹9,80,00,000 (₹9.8 Cr)',
        holdingEntity: 'Punjab National Bank Parliament Street',
        freezeStatus: 'FROZEN (Sec 17 PMLA)',
        custodyMemo: 'CBI/EOU/SZ-12',
        seizureDate: '2026-08-05'
      }
    ],
    documents: [
      {
        id: 'DOC-CBI-01',
        title: 'CBI Regular Case First Information Report: RC-218/2026',
        docType: 'FIR (Form I-IX)',
        date: '2026-07-28',
        classification: 'CONFIDENTIAL // CBI COURT RECORD',
        sha256: '7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f4a7b0c',
        pages: 22,
        authorOfficer: 'DSP N. K. Murthy, CBI EOU-IV',
        entities: {
          accused: ['Vikramaditya Singhania', 'Sunil Bajpai'],
          financial: ['PNB Escrow A/C #001920018819', '₹68.4 Crore'],
          assets: ['Consortium Letters of Credit'],
          sections: ['PC Act Sec 7', 'BNS Sec 318', 'BNS Sec 336']
        },
        fullContent: `CENTRAL BUREAU OF INVESTIGATION // NEW DELHI
FIRST INFORMATION REPORT UNDER SECTION 154 CrPC / 173 BNSS 2023
CASE NO: RC-218/2026/CBI/EOU-IV

COMPLAINANT: Chief Vigilance Officer, Consortium Lead Bank, Sansad Marg, New Delhi.
ACCUSED:
1. M/s Kavach Technologies India Pvt Ltd through MD Vikramaditya Singhania
2. Shri Sunil Bajpai, then Deputy General Manager (Credit Approvals)
3. Unknown private individuals and chartered accountants.

SUMMARY: The accused firm was sanctioned credit facilities of ₹75 Crore on the basis of fabricated balance sheets certified by fictitious auditor firms. Forensic audit discovered that funds were systematically routed to 12 bogus vendor accounts having common directors.`
      }
    ]
  },
  {
    id: 'CASE-NCB-2026-14',
    caseNo: 'NCB-DZU-CR-14/2026',
    title: 'Narcotics Control Bureau (NCB): Darknet Hawala Payment Conduit',
    agency: 'NCB',
    agencyFullName: 'Narcotics Control Bureau (NCB), Delhi Zonal Unit',
    firOrRcNo: 'NCB-DZU-CR-14/2026',
    policeStationOrBranch: 'NCB Delhi Zonal Unit, R. K. Puram, Sector 1, New Delhi',
    stateOrJurisdiction: 'Delhi NCR',
    dateRegistered: '2026-08-04 15:30 IST',
    caseStage: 'Under Trial',
    legalFramework: ['NDPS Act', 'PMLA'],
    bnsIpcSections: ['NDPS Act Sec 22 (Psychotropic Substances)', 'NDPS Act Sec 27A (Financing Illicit Traffic)', 'NDPS Act Sec 29 (Abetment & Criminal Conspiracy)'],
    summary: 'Interception of postal courier parcels containing commercial grade methamphetamine financed via escrow hawala tokens and anonymized Monero wallets linked to Chandni Chowk operators.',
    priority: 'HIGH',
    documentCount: 2,
    sha256Seal: '5b8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a4a7b0c3d6e9f2a5b8c1d4e7f0a3b',
    bsaCertificate: {
      section: 'Section 65B BSA 2023 & Section 67 NDPS Act 1985',
      certifiedBy: 'Superintendent V. K. Hooda, NCB Delhi Zonal Unit',
      hash: '5b8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a4a7b0c3d6e9f2a5b8c1d4e7f0a3b',
      verificationDate: '2026-09-02 12:45 IST',
      status: 'VALID'
    },
    accusedRoster: [
      {
        id: 'ACC-NCB-01',
        name: 'Rajesh Sharma',
        alias: 'Panditji',
        role: 'Crypto-to-Cash Hawala Facilitator',
        aadhaarHash: 'XXXX-XXXX-3419',
        pan: 'BNYPS4410J',
        passportNo: 'R1820491',
        locStatus: 'None',
        arrestStatus: 'Arrested & Remanded',
        warrantDetails: 'Special NDPS Court Rohini Judicial Remand',
        riskScore: 88,
        photoUrl: ASSETS.associatePortrait
      }
    ],
    legalOffenseMatrix: [
      {
        id: 'OFF-NCB-01',
        act: 'Narcotic Drugs & Psychotropic Substances (NDPS) Act 1985',
        section: 'Section 27A',
        title: 'Punishment for Financing Illicit Traffic and Harbouring Offenders',
        description: 'Providing or organizing funds directly or indirectly to finance narcotic operations.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Rigorous Imprisonment not less than 10 years, up to 20 years + ₹1-2 Lakh Fine'
      }
    ],
    seizedAssetTrail: [
      {
        id: 'AST-NCB-01',
        type: 'CRYPTO_LEDGER',
        identifier: 'Monero (XMR) Cold Subaddress: 888tXz...491',
        description: 'Darknet escrow ledger with 420 XMR tokens.',
        estimatedValue: '₹62,00,000',
        holdingEntity: 'NCB Central Seizure Vault',
        freezeStatus: 'SEIZED (Sec 102 BNS)',
        custodyMemo: 'NCB/DZU/SZ-44',
        seizureDate: '2026-08-07'
      }
    ],
    documents: [
      {
        id: 'DOC-NCB-01',
        title: 'NCB Crime Complaint & Statement u/s 67 NDPS Act',
        docType: 'Interrogation Report',
        date: '2026-08-08',
        classification: 'RESTRICTED // NDPS SPECIAL COURT',
        sha256: '5b8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a4a7b0c3d6e9f2a5b8c1d4e7f0a3b',
        pages: 12,
        authorOfficer: 'Inspector Shashi Kant, NCB DZU',
        entities: {
          accused: ['Rajesh Sharma'],
          financial: ['Monero XMR 420 tokens', 'Cash ₹45 Lakhs'],
          assets: ['Postal Parcels #IN90214'],
          sections: ['NDPS Act Sec 22', 'NDPS Act Sec 27A']
        },
        fullContent: `NARCOTICS CONTROL BUREAU // DELHI ZONAL UNIT
VOLUNTARY STATEMENT UNDER SECTION 67 NDPS ACT 1985

Accused Rajesh Sharma admitted to converting cash collected in Chandni Chowk into anonymous cryptocurrency on behalf of overseas clients. Payments were delivered in sealed envelopes marked with unique ₹10 note serial numbers matching codes transmitted over Telegram.`
      }
    ]
  },
  {
    id: 'CASE-CYBER-2026-402',
    caseNo: 'FIR-402/2026/CYBER',
    title: 'State Cyber Crime Cell: Automated UPI Smurfing & SIM Swap Botnet',
    agency: 'CYBER_CRIME',
    agencyFullName: 'State Cyber Crime Police Station, Dwarka, New Delhi',
    firOrRcNo: 'FIR-402/2026/CYBER-DEL',
    policeStationOrBranch: 'PS Cyber Crime Unit, Sector 19, Dwarka, New Delhi',
    stateOrJurisdiction: 'Delhi NCR',
    dateRegistered: '2026-08-11 12:15 IST',
    caseStage: 'Under Investigation',
    legalFramework: ['IT Act', 'BNS / IPC'],
    bnsIpcSections: ['IT Act Sec 66C (Identity Theft)', 'IT Act Sec 66D (Cheating by Personation)', 'BNS Sec 318 (Cheating)', 'BNS Sec 336 (Forgery)'],
    summary: 'Discovery of a 128-modem GSM SIM farm executing automated micro-debits and cloned FASTag simulations to create artificial travel alibis and bypass banking fraud triggers.',
    priority: 'HIGH',
    documentCount: 2,
    sha256Seal: 'df9eeaae3b775883193bc49c0bcf06f987241d95c4f98513e6aedc9fb6470cb3',
    bsaCertificate: {
      section: 'Section 65B(4) BSA 2023 Digital Audit Certificate',
      certifiedBy: 'Inspector Sunita Bishnoi, Cyber Forensics Division',
      hash: 'df9eeaae3b775883193bc49c0bcf06f987241d95c4f98513e6aedc9fb6470cb3',
      verificationDate: '2026-09-06 14:10 IST',
      status: 'VALID'
    },
    accusedRoster: [
      {
        id: 'ACC-CYB-01',
        name: 'Gaurav Mehta',
        alias: 'Botmaster / GM',
        role: 'Hardware Engineer & Script Developer',
        aadhaarHash: 'XXXX-XXXX-6512',
        pan: 'AFRPM9912C',
        passportNo: 'L9102941',
        locStatus: 'None',
        arrestStatus: 'Arrested & Remanded',
        warrantDetails: 'Judicial Custody Tihar Central Jail #4',
        riskScore: 82
      }
    ],
    legalOffenseMatrix: [
      {
        id: 'OFF-CYB-01',
        act: 'Information Technology Act 2000',
        section: 'Section 66C',
        title: 'Punishment for Identity Theft',
        description: 'Fraudulently or dishonestly making use of the electronic signature, password or any other unique identification feature of any other person.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Imprisonment up to 3 years and Fine up to ₹1 Lakh'
      }
    ],
    seizedAssetTrail: [
      {
        id: 'AST-CYB-01',
        type: 'IMEI_SIM',
        identifier: '128-Port GSM SIM Box Pool (IMEI Range: 869401020001 - 869401020128)',
        description: 'Hardware pool carrying pre-activated telco SIM cards used for automated OTP verification.',
        estimatedValue: '₹8,50,000',
        holdingEntity: 'Cyber Police Station Dwarka',
        freezeStatus: 'SEIZED (Sec 102 BNS)',
        custodyMemo: 'CYB/DWK/SZ-109',
        seizureDate: '2026-08-12'
      }
    ],
    documents: [
      {
        id: 'DOC-CYB-01',
        title: 'Cyber Forensic Extraction & Botnet Architecture Report',
        docType: 'Digital Forensic Extraction',
        date: '2026-08-14',
        classification: 'RESTRICTED // LAW ENFORCEMENT TECHNICAL',
        sha256: 'df9eeaae3b775883193bc49c0bcf06f987241d95c4f98513e6aedc9fb6470cb3',
        pages: 26,
        authorOfficer: 'Dr. Vivek Saxena, Cyber Forensic Examiner',
        entities: {
          accused: ['Gaurav Mehta', 'Vikramaditya Singhania'],
          financial: ['42 UPI accounts', 'NPCI micro-routing'],
          assets: ['128-Port GSM SIM Box', 'FASTag Cloner'],
          sections: ['IT Act Sec 66C', 'IT Act Sec 66D']
        },
        fullContent: `STATE CYBER CRIME CELL // NEW DELHI
DIGITAL FORENSIC EXAMINATION REPORT (EXHIBIT NO. CYB-2026-918)

TECHNICAL OBSERVATIONS:
1. Physical recovery of an industrial 128-port GSM SIM server operating in a residential basement in Mahavir Enclave, Dwarka.
2. The server was programmed via Python scripts to emulate 42 different UPI handles, each making micro-payments of ₹49,000 every 12 minutes to evade Rule 114B PAN verification.
3. Telemetry logs link the server's static IP to VPN endpoints configured by Kavach Technologies.`
      }
    ]
  },
  {
    id: 'CASE-FIU-2026-9812',
    caseNo: 'FIU-STR-2026-9812/DEL',
    title: 'Financial Intelligence Unit (FIU-IND): Suspicious Transaction Alert Dossier',
    agency: 'FIU_IND',
    agencyFullName: 'Financial Intelligence Unit - India (FIU-IND), Department of Revenue',
    firOrRcNo: 'STR-2026-9812',
    policeStationOrBranch: 'FIU-IND Directorate, 6th Floor, Hotel Samrat, Chanakyapuri, New Delhi',
    stateOrJurisdiction: 'Pan-India / Financial Banking Mesh',
    dateRegistered: '2026-08-10 09:00 IST',
    caseStage: 'Under Investigation',
    legalFramework: ['PMLA'],
    bnsIpcSections: ['PMLA Sec 12 (Reporting Entity Obligations)', 'PMLA Sec 13 (Powers of Director)', 'Rule 114B Income Tax Rules'],
    summary: 'Algorithmic detection of structured banking velocity across 14 public and private sector banks with rapid aggregate movement of ₹142.8 Crore into Dubai and Hong Kong correspondent accounts.',
    priority: 'CRITICAL',
    documentCount: 1,
    sha256Seal: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    bsaCertificate: {
      section: 'Section 65B BSA 2023 / Section 66 PMLA Information Sharing',
      certifiedBy: 'Joint Director P. K. Sharma (Analysis & Intelligence, FIU-IND)',
      hash: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
      verificationDate: '2026-09-01 11:15 IST',
      status: 'VALID'
    },
    accusedRoster: [
      {
        id: 'ACC-FIU-01',
        name: 'Vikramaditya Singhania',
        alias: 'VS',
        role: 'Beneficial Owner',
        aadhaarHash: 'XXXX-XXXX-8821',
        pan: 'ABCPS9182K',
        passportNo: 'Z4901824',
        locStatus: 'Active LOC Issued (Bureau of Immigration)',
        arrestStatus: 'Non-Bailable Warrant (NBW) Active',
        warrantDetails: 'Flagged on Central FIU Red Flag Register',
        riskScore: 97,
        photoUrl: ASSETS.targetBiometric
      }
    ],
    legalOffenseMatrix: [
      {
        id: 'OFF-FIU-01',
        act: 'Prevention of Money Laundering Act (PMLA) 2002',
        section: 'Section 12',
        title: 'Reporting Entity to Maintain Records & Furnish Information',
        description: 'Obligation on banks and financial institutions to report suspicious transactions and avoid tipping off.',
        cognizable: true,
        bailable: false,
        maxPenalty: 'Monetary Penalty on Non-Compliant Entities + Criminal Prosecution'
      }
    ],
    seizedAssetTrail: [
      {
        id: 'AST-FIU-01',
        type: 'BANK_ACCOUNT',
        identifier: 'Axis Bank Current A/C #918020048120 (IFSC: UTIB0000007)',
        description: 'Secondary clearing account used for immediate RTGS sweeps.',
        estimatedValue: '₹18,40,00,000 (₹18.4 Cr)',
        holdingEntity: 'Kavach Technologies India Pvt Ltd',
        freezeStatus: 'FROZEN (Sec 17 PMLA)',
        custodyMemo: 'FIU/PMLA/DIS-901',
        seizureDate: '2026-08-11'
      }
    ],
    documents: [
      {
        id: 'DOC-FIU-01',
        title: 'FIU-IND High Risk Suspicious Transaction Report (STR)',
        docType: 'FIU Suspicious Transaction Audit',
        date: '2026-08-10',
        classification: 'TOP SECRET // STRICTLY CONFIDENTIAL // FIU DIRECTIVE',
        sha256: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
        pages: 16,
        authorOfficer: 'Director FIU-IND, Ministry of Finance',
        entities: {
          accused: ['Vikramaditya Singhania'],
          financial: ['Axis Bank A/C #918020048120', '₹142.8 Crore', 'singhania.hawala@ybl'],
          assets: ['RTGS Outward Remittances'],
          sections: ['PMLA Sec 12', 'PMLA Sec 66']
        },
        fullContent: `FINANCIAL INTELLIGENCE UNIT - INDIA // DEPARTMENT OF REVENUE
SUSPICIOUS TRANSACTION REPORT (STR DISSEMINATION)
REFERENCE NO: FIU-IND/STR/2026/DEL/9812

TO:
1. Director, Enforcement Directorate (ED), New Delhi
2. Special Commissioner of Police (Crime & Special Cell), Delhi Police

SUBJECT: DISSEMINATION OF SUSPICIOUS TRANSACTION INFORMATION REGARDING RECURRING SMURFING & TRANSSHIPMENT OF ILLICIT FUNDS

1. Trigger: Multiple automated transaction monitoring rule violations (Rule 114B evasion, Sudden surge in turnover without commercial justification, Rapid pass-through accounts).
2. Primary Entity: Kavach Technologies India Pvt Ltd (PAN: ABCPS9182K).
3. Findings: Analysis of bank statements across 42 VPAs indicates that ₹142.8 Crore was moved within a span of 72 days. The ultimate beneficiaries are overseas entities linked to Trident Logistics FZE, UAE.
4. Recommendation: Immediate freezing under Section 17 PMLA and issuance of Look Out Circular (LOC) against Vikramaditya Singhania.`
      }
    ]
  }
];
