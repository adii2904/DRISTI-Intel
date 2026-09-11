import { IngestFileItem, NetworkNode, NetworkEdge, AnomalyItem, TimelineEvent, VaultEvidence } from '../types';

export const ASSETS = {
  emblem: 'https://lh3.googleusercontent.com/aida/AEtjO1Xlhzv-uIkPZ1lDsMSqvpzQGALGG6-UuM5FEGw102glezrEPo4e2pf3z3lIE04S8b6Jpi_3HxkygmmqiRNPW_lvfRERW1bV2tVmFtHyaZmyfTX7ocVUjOEekNSSz2BleiEd5ZxOg3LO8yZwEChRIvQ94t0kbYB9kcPFKK2c1kQV-QrxxH00tlqtNdOqkExFJXcfN02UlsHY6MCy7wfDT2EpIkS-zRE2mPbjscfI7MrggzO6PUh0-wW1',
  officerVikram: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg6ZkgkpK4aG4K4BeVC3p4baqbrf-2KwWfR7s-bpTlcScdIxX0aRRfsO_ljGNEuauSIbZBn3ls2t1Ih5hb4em-JiZqWeF0SnoBpQ1XsulIVssKr0bA2xXMVoMczJ4wQhuF0y0-AktglC5uSxxnRpU7vqIY6L1bT3cEFmuaJb_b2d3CPMFxz0fXdlyWJrHtOv5l6FQtxGUP-Bndq-bLXY2qvtI69SRt27Yfni5Bh09tS7CsCUEOxd0',
  targetBiometric: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfON0CCl9r-lZ4NiEfXe_odIBdqv2VfcAfSQRbBPe0kprmu5SQ5CTTbpT1jslhhO5os89ka9hUhLJYaPjWUOkCMyfYhEAQ7_oMU5WC0XZ9ZXI_WhMiKvEZEL5E0EDQwaCUZAMJryyPBqa391OHJ3_3m4_yMZMXYui07mTu46Vt7Ek_FsfNEQAvnZakvxJzKvCSj5bx_bAcbwQ86rrrVfkfXjn7ZQ75nbyAjBeELifYeVR9q1JDRpI',
  targetMugshot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfYmG8CP2MIi2o6MkVtv8iqrLsXnkHXqy3HtrpkJZRSI0NpfSysN-xFgFVxFzq1ri5UfyormeWEHw9zeUSkCq0m1f2DE7qArtVT40io2E3Z0tYk9JtbqLLsWOEGCeUCni_RpNiGe0NxT6SUb4kKQ65lQd1KGMxLXxYQ4zx2RA4i-T_nwK_aDJk6GrpC96O_Zqbq861AW57mB1yQiOVYijRmTgHbpikbMjVuGyxgxjPRe4waZnKuPs',
  targetCCTV: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoR8Ohc_0pXsEanW2TVxhtD3uqP6NwSGjB7p-AuYSzraWhE-bNmo0HsL9g5pET6bP4cXGJCgtxHeruWNzo9kCHOnJhWw67ynr18FAKObyJJseE4GENYrtdPDeBgvzcg_pgtchFgo9gtvpfq_VuI7TuhITHFOOPjUq_uU43KaZEq_4msmhVpKF-UYA_gDh1F6HF1UToWlVaagNwKggS5S58cZzOt30zi8X-PjvH6s5UsmJlkzWeJpw',
  targetGraph: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNNW9TCcGdfpFLrrjoMFdHYA4fJUpLKf8tBuf3B7aWnZ7ch0etF10FQifmx5uPxbrKDEUfalgGzoEUkfks64KM4TTEb5JLY99IbXP8sYGLQ8fqDVCZZveILFvme5acA9BO2t5AovClOnVuoomoAAEM9MeagBn045YTVMlb6W8aUWlmmMz_KRD1ZCs1gtWKo-G4aSfPfJfPpYGZAYhTPu7lTnSqKOoj5uk9Y3XLYijLR22zT4FygVY',
  targetCopilot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByL61K1yam8bTNHD2pM08JLzGD53xGb1kiCE943dwmTEh85WvFXjF4zb1DiBqf8WrEx5l5gSA_9fRib1I6B7lD8ewhMI1-ywrr1EiIW6He91JdljHWMTlhty8mGQ68-VXsTEwGK-mMU-qDLBZBIUomXGPFFw5uPRbQ78TotFptC9B2Z48hWqo-jkqVvExEkmtNlHrmXn0TnDHmy7LkCmrAfBA4Fbc2H8v0X_ZAnrjfmRiQx5ecQQI',
  associatePortrait: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHiTN8TLOxbVmM_20kytyRHgXUT7lkvp5J4Hnuu8AgQ6C_odUWmB0bMx7tqd6VkIzIT65UpLY1wnp8JEdz8keQx63Ta84JILNg3-5QbaxcU9gKeLHackZj0vlYYZ47d2D5qzQogHcw1bqZ21vcWokGi1BxhyPbCXgg7-v12e1wKvNgm5fQx_FBcO4DbghflJPNfFeNTg3UlB_YSLxEPBO8OApTX8Fq4VZ1Hq4HpCHCGqaiLDNuAeI',
  associateCCTV: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEfC63e-gFZsxwf0BhS2RbPBUgaEoVxKS_oK4kZS0kBrzNLz038rLPrk2-bEXiPbm8vTg8ZqRlyY3VYnWYgsVISP0urtG046TPy3SeaRZM0PNwMp9CJj4Vm3rE0XVVN_805QYwwiHfgBdV9Al3pkUVw6hY1DcYM2s_WIzipqAwBVsNeyQNSCwFNyBtrmwJfGyukGJhUp0jdj2xtA-Qvle1XXN_rUtIt4ipOo9MROXsL7Q142s-r5Y',
  seizedHardware: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEY6j5_b7ImZAes_7J4FkjvRl3c9vH1fswAp93gMRQlxpkXvB6IfVn95iyAAE56EVe__cV8r5zuYmEfL8c0zErziUhHpbv2OTrly8hh9S6onCXtqw6YqB1DN4G-QLpVW9qpsjGGLNbUy02sMmhAiLZT2_uvcseLhTcu5pbJJ5yr2kPZou0IXPluRXNsrG29pjVsYK2KQjNSoKTXdQLl4h7qJtfs3mrKMbykVe3kP2ebLdt8Tl5qNg',
  delhiMap: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZd0H7NkdZ5nS14JlE0FXAizLwekOy1QYm5gNy0B9Hj3Rb31BVkNQkL9wdjWldj1Y2Fae1ZL-EaiCW6ohD-ZMgX5j51I7yrBrSzh9EawxmhCsf08GzeDSzBs7EsX_itlI6f7wculsxYVxm_L-JbQvZKBZSwwNdc-BoJDX1WQwFttlz2dlj0KTQRx-7p1ZlLMuoVU6VCX2RKq6hASFKtOWErM6yWBoIkxzCXKp-Sf7v_MEndRgKjms',
  mumbaiMap: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKC5RFq36K0wDA9EgTK2zZtXTHSReJLbA0sVkHbSffPbNSLOXcX_lIRUhxFPI5DsOd6vfqV1Hs5Jfdjt4zHQAexp3qpvlg9NXwAS5MsXXF35SyP89_yEZkewPTYvsfA7mJgid_PznsXVa3zCXIQ_Kjm7aptsaeJ0cCo-D0toSmrKwgyLWfMRXLWxnOdjg1ITopX_6la9AbobPPiIqkA2ho67HZAyPVDnToYoaWNiqdPb0g-jAIBVc',
  flirNight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIA3SajDSYL8Q1Ot4mnGsm0aEP85rPdiBEqJdtOm59Q4sc9lMSJqQruXqwRDt9YdTTx2RuL-d0_pDXg1reLKHpFTmkWbQDQ7l1fFr7XPZVEvn02Vl1KaJXXtVtC17NmAjpae-bpU65uMvW3PEJz3wUUiic6UDyjSD1rD5FuSm9mIpfA6E8Z4IrEtI00LMqAIzVXGlReBQAcsNLaig0k3J-T9P6SQkEiIO4RFlotaCFOQ3iiVu-pCg',
  bhuvanSat: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXoy19yCkrD_djJ4q-AQ45S-sHslqfBc6B0rrI2ZmWVZ0Pqa3Viwf2YOZU84U9F5r86KDEnQls99JP6dieAd1LAwWb1NbY7fyie4HxFxgz2ZeDO9jiZWMBXQGSWVixquUxu5kgckDU0nvbdEWDjjm9VFiP_fJYYZrsfA83z8y_eWRpyFMVNdT6WXmEv7_Woro_st77J2AZDUkmTSwETIfoyZ9VsMT8snte5_nTPPsLUBbs3HaCMx4',
};

export const INITIAL_INGEST_FILES: IngestFileItem[] = [
  {
    id: 'ING-IND-90821',
    name: 'StateCyberCell_Delhi_UFED_OnePlus11_Physical.bin',
    type: 'Hardware Forensics (UFED)',
    size: '14.8 GB',
    status: 'EXTRACTED',
    progress: 100,
    extractedEntities: 384,
    extractedRelations: 1420,
    timestamp: '2026-09-09 19:42:10 IST',
    sha256: '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f',
    sourceCategory: 'FORENSIC',
    agency: 'Delhi Police Special Cell / Maharashtra Cyber'
  },
  {
    id: 'ING-IND-90822',
    name: 'FIU_IND_STR_Hawala_Ledger_ChandniChowk_Q3.csv',
    type: 'FIU-IND Suspicious Transaction Report',
    size: '84.2 MB',
    status: 'EXTRACTED',
    progress: 100,
    extractedEntities: 112,
    extractedRelations: 540,
    timestamp: '2026-09-09 20:15:33 IST',
    sha256: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    sourceCategory: 'FINANCIAL',
    agency: 'Financial Intelligence Unit - India (FIU-IND)'
  },
  {
    id: 'ING-IND-90823',
    name: 'CCTNS_State_FIR_Index_UAPA_Sec120B_Singhania.pdf',
    type: 'CCTNS Inter-State FIR Dossier',
    size: '12.4 MB',
    status: 'EXTRACTED',
    progress: 100,
    extractedEntities: 36,
    extractedRelations: 142,
    timestamp: '2026-09-09 20:44:02 IST',
    sha256: 'd2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c99f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    sourceCategory: 'GOV_INTEL',
    agency: 'National Investigation Agency (NIA) / CCTNS'
  },
  {
    id: 'ING-IND-90824',
    name: 'NHAI_FASTag_Transit_Logs_NH48_Hub_KherkiDaula.json',
    type: 'FASTag Transit Telemetry',
    size: '340 MB',
    status: 'PARSING',
    progress: 78,
    extractedEntities: 28,
    extractedRelations: 82,
    timestamp: '2026-09-09 21:12:49 IST',
    sha256: '8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    sourceCategory: 'TRANSIT',
    agency: 'National Highways Authority of India (NHAI)'
  },
  {
    id: 'ING-IND-90825',
    name: 'Jio_5G_TowerDump_CellID_LKO1904_ChandniChowk.log',
    type: 'Telco CDR Tower Dump (Jio 5G)',
    size: '520 MB',
    status: 'QUEUED',
    progress: 25,
    extractedEntities: 0,
    extractedRelations: 0,
    timestamp: '2026-09-09 21:30:11 IST',
    sha256: 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    sourceCategory: 'TELECOM',
    agency: 'Reliance Jio Infocomm / DoT Compliance'
  }
];

export const NETWORK_NODES: NetworkNode[] = [
  {
    id: 'node-singhania',
    label: 'Vikramaditya "Kabir" Singhania',
    subLabel: 'Alias: "Sultan" / Prime Target',
    category: 'PERSON',
    x: 480,
    y: 280,
    riskScore: 96,
    isPrimaryTarget: true,
    avatarUrl: ASSETS.targetGraph,
    status: 'ACTIVE',
    details: {
      alias: 'Vikramaditya Singhania (Sultan)',
      jurisdiction: 'Delhi NCR / Mumbai / Dubai',
      lastSeen: '2026-09-09 18:24 IGI Airport T3',
      connectedCount: 16,
      financialTotal: '₹142.8 Cr',
      cctnsFir: 'FIR #182/2026 U/S 120B, 420 IPC & UAPA Special Cell',
      pan: 'ABCPS9182F',
      aadhaarHash: 'SHA256:7f1e9482****a3c9'
    }
  },
  {
    id: 'node-farooq',
    label: 'Farooq "Angadia" Mir',
    subLabel: 'Chief Hawala Cash Courier',
    category: 'PERSON',
    x: 260,
    y: 190,
    riskScore: 84,
    avatarUrl: ASSETS.associatePortrait,
    status: 'FLAGGED',
    details: {
      alias: 'Chit-Runner "Falcon-07"',
      jurisdiction: 'Chandni Chowk / Zaveri Bazaar',
      lastSeen: '2026-09-09 14:10 Kucha Ghasiram',
      connectedCount: 9,
      financialTotal: '₹38.4 Cr',
      upiId: 'farooq.angadia@okaxis',
      telcoCarrier: 'Reliance Jio 5G'
    }
  },
  {
    id: 'node-vajra',
    label: 'Vajra Logistics Pvt Ltd',
    subLabel: 'Front Entity (CIN: U74999DL2021)',
    category: 'SHELL_ORG',
    x: 320,
    y: 420,
    riskScore: 90,
    status: 'MONITORED',
    details: {
      alias: 'GSTN: 07AAACV9812K1Z5',
      jurisdiction: 'Barakhamba Road, Connaught Place, New Delhi',
      lastSeen: 'Active Current Account & UPI Conduit',
      connectedCount: 12,
      financialTotal: '₹84.6 Cr',
      bankName: 'HDFC Bank - Fort Branch Mumbai',
      ifsc: 'HDFC0000060'
    }
  },
  {
    id: 'node-jio-burner',
    label: '+91 98110 49182',
    subLabel: 'Jio 5G Burner // Dummy KYC',
    category: 'BURNER',
    x: 680,
    y: 180,
    riskScore: 78,
    status: 'ACTIVE',
    details: {
      alias: 'IMEI: 864910049182109',
      jurisdiction: 'Delhi Telecom Circle (North)',
      telcoCarrier: 'Reliance Jio Infocomm',
      lastSeen: '12m ago (Cell LKO-1904 Chandni Chowk)',
      connectedCount: 6
    }
  },
  {
    id: 'node-airtel-burner',
    label: '+91 98201 84109',
    subLabel: 'Airtel Roaming SIM (Decoy)',
    category: 'BURNER',
    x: 720,
    y: 350,
    riskScore: 74,
    status: 'ACTIVE',
    details: {
      alias: 'IMEI: 354891109481204',
      jurisdiction: 'Mumbai Metro Circle',
      telcoCarrier: 'Bharti Airtel',
      lastSeen: '1h ago (Marine Lines eNodeB)',
      connectedCount: 5
    }
  },
  {
    id: 'node-igi-airport',
    label: 'IGI Airport Terminal 3',
    subLabel: 'VIP Departure Gate 4B // Bhuvan ISRO',
    category: 'LOCATION',
    x: 760,
    y: 500,
    riskScore: 68,
    status: 'MONITORED',
    details: {
      jurisdiction: 'New Delhi (Bhuvan GIS: 28.5562° N, 77.1000° E)',
      lastSeen: 'Optical CCTV Match 99.4% Cosine',
      connectedCount: 8
    }
  },
  {
    id: 'node-safehouse',
    label: 'Chandni Chowk Angadia Hub',
    subLabel: 'Kucha Ghasiram Haveli B-4',
    category: 'LOCATION',
    x: 150,
    y: 360,
    riskScore: 92,
    status: 'FLAGGED',
    details: {
      jurisdiction: 'Old Delhi (28.6562° N, 77.2301° E)',
      lastSeen: 'Tactical Raid & Seizure Completed',
      connectedCount: 7
    }
  },
  {
    id: 'node-hdfc-account',
    label: 'HDFC A/C 50200091824109',
    subLabel: 'IFSC: HDFC0000060 (Fort Mumbai)',
    category: 'ACCOUNT',
    x: 490,
    y: 520,
    riskScore: 86,
    status: 'FROZEN',
    details: {
      jurisdiction: 'RBI / FIU-IND Freeze Order Sec 102 CrPC',
      bankName: 'HDFC Bank Ltd',
      ifsc: 'HDFC0000060',
      lastSeen: 'Debit Frozen by Enforcement Directorate',
      connectedCount: 7,
      financialTotal: '₹34.5 Cr'
    }
  },
  {
    id: 'node-upi-smurf',
    label: 'vajra.settle@ybl',
    subLabel: 'Yes Bank UPI Smurfing Pool',
    category: 'UPI_HANDLE',
    x: 180,
    y: 540,
    riskScore: 91,
    status: 'FLAGGED',
    details: {
      alias: 'NPCI UPI Identifier: YBL-99120',
      jurisdiction: 'NPCI Gateway / FIU-IND Flagged',
      lastSeen: '32 micro-burst transactions detected',
      connectedCount: 5,
      financialTotal: '₹15.8 Lakhs (Micro-burst)'
    }
  },
  {
    id: 'node-tariq',
    label: 'Tariq "Hawala-1" Ahmed',
    subLabel: 'Chief Hawala Cash Courier',
    category: 'PERSON',
    x: 260,
    y: 190,
    riskScore: 88,
    avatarUrl: ASSETS.associatePortrait,
    status: 'FLAGGED',
    details: {
      alias: 'Chit-Runner "Falcon-07" / Farooq Mir',
      jurisdiction: 'Chandni Chowk / Zaveri Bazaar',
      lastSeen: '2026-09-09 14:10 Kucha Ghasiram',
      connectedCount: 11,
      financialTotal: '₹68.4 Cr',
      upiId: 'tariq.angadia@okaxis',
      telcoCarrier: 'Vodafone-Idea 4G / Vi Burner'
    }
  },
  {
    id: 'node-sameer',
    label: 'Sameer Merchant',
    subLabel: 'SIM/IMEI Operator & Evasion Tech',
    category: 'PERSON',
    x: 600,
    y: 90,
    riskScore: 82,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    status: 'FLAGGED',
    details: {
      alias: 'Sam Tech, "Ghost-SIM", Merchant-X',
      jurisdiction: 'Noida Sector 62 / Dwarka PS',
      lastSeen: '2026-09-09 17:10 Electronic City Tower',
      connectedCount: 9,
      financialTotal: '₹22.6 Cr',
      telcoCarrier: 'Reliance Jio Multi-IMSI'
    }
  },
  {
    id: 'node-elena',
    label: 'Elena Rostova',
    subLabel: 'International Liaison (Interpol Red Notice)',
    category: 'PERSON',
    x: 820,
    y: 220,
    riskScore: 94,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    status: 'FLAGGED',
    details: {
      alias: 'Elena Petrova, "Caspian-01", Natasha',
      jurisdiction: 'Dubai UAE / London / Goa Liaison',
      lastSeen: '2026-09-09 19:15 DXB Lounge Passenger PNR',
      connectedCount: 13,
      financialTotal: '₹195.0 Cr',
      cctnsFir: 'INTERPOL Red Notice A-4918/9-2026'
    }
  }
];

export const NETWORK_EDGES: NetworkEdge[] = [
  { id: 'e1', source: 'node-singhania', target: 'node-farooq', label: 'Hawala Chits & Cash Instructions', weight: 9, type: 'HAWALA', highlighted: true },
  { id: 'e2', source: 'node-singhania', target: 'node-vajra', label: '100% Ultimate Beneficiary Owner', weight: 10, type: 'DIRECTOR', highlighted: true },
  { id: 'e3', source: 'node-singhania', target: 'node-jio-burner', label: 'Primary Encrypted Voice Device', weight: 8, type: 'COMMS' },
  { id: 'e4', source: 'node-singhania', target: 'node-airtel-burner', label: 'Hardware Cloned Decoy SIM', weight: 7, type: 'COMMS' },
  { id: 'e5', source: 'node-singhania', target: 'node-igi-airport', label: 'Facial Biometric Match (CCTV 99.4%)', weight: 9, type: 'GEO_PROXIMITY', highlighted: true },
  { id: 'e6', source: 'node-farooq', target: 'node-vajra', label: 'Angadia Cash Balancing Ledger', weight: 9, type: 'FINANCIAL', highlighted: true },
  { id: 'e7', source: 'node-farooq', target: 'node-safehouse', label: 'Chandni Chowk Vault Custodian', weight: 8, type: 'GEO_PROXIMITY' },
  { id: 'e8', source: 'node-vajra', target: 'node-hdfc-account', label: 'Corporate Banking Wires (₹34.5 Cr)', weight: 9, type: 'FINANCIAL', highlighted: true },
  { id: 'e9', source: 'node-vajra', target: 'node-upi-smurf', label: 'UPI P2P Smurfing Funnel', weight: 8, type: 'FINANCIAL' },
  { id: 'e10', source: 'node-singhania', target: 'node-tariq', label: 'Container Manifest Hawala Routing', weight: 6, type: 'ASSOCIATE' },
  { id: 'e11', source: 'node-jio-burner', target: 'node-tariq', label: '18 Encrypted Signal Calls', weight: 6, type: 'COMMS' },
  { id: 'e12', source: 'node-hdfc-account', target: 'node-igi-airport', label: 'Forex Card Withdrawal ₹9.5 Lakhs', weight: 7, type: 'GEO_PROXIMITY' },
  { id: 'e13', source: 'node-sameer', target: 'node-jio-burner', label: '128-Port SIM Farm Management', weight: 9, type: 'COMMS', highlighted: true },
  { id: 'e14', source: 'node-sameer', target: 'node-airtel-burner', label: 'Synthetic SDR Baseband Cloner', weight: 8, type: 'COMMS' },
  { id: 'e15', source: 'node-singhania', target: 'node-sameer', label: 'Technical Retainer & Equipment Wires', weight: 7, type: 'ASSOCIATE' },
  { id: 'e16', source: 'node-singhania', target: 'node-elena', label: 'Offshore Crypto & Real Estate Trust', weight: 10, type: 'FINANCIAL', highlighted: true },
  { id: 'e17', source: 'node-elena', target: 'node-hdfc-account', label: 'Cross-Border Inward Forex Remittance', weight: 8, type: 'FINANCIAL' },
  { id: 'e18', source: 'node-elena', target: 'node-igi-airport', label: 'Emirates EK-512 Inbound PNR Track', weight: 9, type: 'GEO_PROXIMITY' }
];

export const ANOMALIES_DATA: AnomalyItem[] = [
  {
    id: 'ANOM-2026-IND-01',
    title: 'FASTag Toll vs CDR Cell Tower Velocity Conflict',
    riskScore: 99,
    severity: 'CRITICAL',
    category: 'IMPOSSIBLE_TRAVEL',
    entityName: 'Vikramaditya "Kabir" Singhania',
    entityId: 'node-singhania',
    timestamp: '2026-09-09 17:45 IST (Δ 48m)',
    summary: 'FASTag RFID tag (TAG-IND-88194, Fortuner DL 01 AB 9942) logged at Kherki Daula Toll Plaza NH-48 (Gurugram). 48 minutes later, target Airtel IMEI attached to Marine Lines eNodeB tower in Mumbai (1,420 km away). Velocity required: >1,775 km/h.',
    explanation: {
      reasoning: 'The AI Spatiotemporal Engine cross-correlated NHAI FASTag electronic toll records with DoT compliance CDR feeds from Bharti Airtel. Commercial flights between IGI New Delhi and CSIA Mumbai take 2h 10m minimum, excluding airport security overhead. This mathematical impossibility confirms a coordinated decoy maneuver: an associate drove the vehicle through Gurugram while a software-defined radio (SDR) or cloned baseband transceiver pinged in Mumbai.',
      modelConfidence: 99.7,
      telemetryFactors: [
        'FASTag Toll Lane 04 Reader ID #KD-NH48-04 recorded RFID hit at 16:57:10 IST',
        'Bharti Airtel eNodeB #7719A Sector 2 attached target IMEI at 17:45:18 IST',
        'Air Traffic Control (DGCA / AAI) confirms zero private charter flights in this window matching target credentials',
        'Indicates active SDR baseband transmitter decoy deployed across NCR & Mumbai'
      ],
      citations: [
        { evidenceId: 'EVD-IND-902', source: 'NHAI_FASTag_Transit_Logs_NH48_Hub.json', hash: '8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b9f8e4c7b2a1d0f5e8a3b6c9d2e1f' },
        { evidenceId: 'EVD-IND-905', source: 'Airtel_CDR_Circle_Mumbai_Sector_7719A.log', hash: 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f' }
      ]
    }
  },
  {
    id: 'ANOM-2026-IND-02',
    title: 'UPI Micro-Smurfing Burst & FIU-IND STR Avoidance',
    riskScore: 93,
    severity: 'CRITICAL',
    category: 'SMURFING_VELOCITY',
    entityName: 'Vajra Logistics Pvt Ltd (vajra.settle@ybl)',
    entityId: 'node-vajra',
    timestamp: '2026-09-09 12:15 - 15:10 IST',
    summary: '32 consecutive UPI outward transactions executed between ₹48,500 and ₹49,950 across @paytm, @okaxis, and @ybl to circumvent the mandatory ₹50,000 PMLA/FIU-IND automated Suspicious Transaction Reporting threshold within 175 minutes.',
    explanation: {
      reasoning: 'Heuristic graph analysis detected high-velocity micro-structuring. The transaction amounts have a standard deviation of <₹240, specifically engineered to avoid the ₹50,000 PMLA surveillance threshold. Aggregate outflow totals ₹15.82 Lakhs, funneled into 4 newly generated merchant QR aggregators before instant conversion into Angadia cash chits.',
      modelConfidence: 98.4,
      telemetryFactors: [
        '32 micro-transfers originated from Yes Bank UPI VPA vajra.settle@ybl',
        'Mean transaction amount ₹49,437.50 (Zero transactions exceeding ₹50,000)',
        'Destination VPAs resolved to mule accounts created with falsified Aadhaar e-KYC',
        'Cross-verified with seized Chandni Chowk ledger matching token notes'
      ],
      citations: [
        { evidenceId: 'EVD-IND-903', source: 'FIU_IND_STR_Hawala_Ledger_ChandniChowk.csv', hash: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f' },
        { evidenceId: 'EVD-IND-904', source: 'NPCI_UPI_Switch_Audit_Logs_Sept2026.xml', hash: '3e1a475a87d5ad3ebaf6350c2f7fbbb6ef3d7c5a1c5519668f1ba1b2f8cdaa05' }
      ]
    }
  },
  {
    id: 'ANOM-2026-IND-03',
    title: 'Covert RF Jammer Co-Location at Chandni Chowk Angadia Hub',
    riskScore: 88,
    severity: 'HIGH',
    category: 'COVERT_COLOCATION',
    entityName: 'Farooq Mir & Captain Tariq Sheikh',
    entityId: 'node-farooq',
    timestamp: '2026-09-09 14:05 - 14:48 IST',
    summary: 'Target devices registered simultaneous silent RF dropouts in Old Delhi dead-zone with localized 433MHz / 2.4GHz tactical RF jammer signatures detected by Delhi Police SIGINT sensor.',
    explanation: {
      reasoning: 'SIGINT sensor arrays detected both Jio and Vi burner hardware severing cell network connections within 8 seconds of each other at coordinates 28.6562° N, 77.2301° E (Kucha Ghasiram). A localized tactical RF jamming bubble operated for 43 minutes, consistent with counter-surveillance protocols during high-value physical Hawala chit exchanges.',
      modelConfidence: 95.2,
      telemetryFactors: [
        'Simultaneous base station disconnect on Jio Cell LKO-1904 within 8 seconds',
        'RF jammer carrier frequency harmonic spikes recorded by Special Cell SIGINT-09',
        'CCTV CAM-14 captured courier carrying metallic briefcase into haveli at 14:08 IST',
        'Resumed encrypted VoIP ping on BSNL fiber gateway at 14:52 IST'
      ],
      citations: [
        { evidenceId: 'EVD-IND-901', source: 'StateCyberCell_Delhi_UFED_OnePlus11_Physical.bin', hash: '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f' },
        { evidenceId: 'EVD-IND-906', source: 'DelhiPolice_SpecialCell_SIGINT_Chowk_Sensor.bin', hash: '5c18aa950b8347e43ad3eb021f3201bf29d98c99258e9dc5739f12576bf0b901' }
      ]
    }
  },
  {
    id: 'ANOM-2026-IND-04',
    title: 'Cloned IMEI Baseband Spoofing (Dual IMSI Attach)',
    riskScore: 81,
    severity: 'MEDIUM',
    category: 'HARDWARE_SPOOF',
    entityName: '+91 98110 49182 (Reliance Jio)',
    entityId: 'node-jio-burner',
    timestamp: '2026-09-09 17:10 IST',
    summary: 'DoT compliance logs reveal simultaneous IMSI attach requests for IMEI 864910049182109 on non-contiguous base stations in Connaught Place and Noida Sector 62 with impossible Timing Advance.',
    explanation: {
      reasoning: 'The target hardware IMEI registered simultaneously on two base stations 26 km apart with 120ms delta. The timing advance (TA=3 vs TA=19) proves a software-defined radio (HackRF/BladeRF) was transmitting synthetic cellular broadcast bursts as an evasion tactic.',
      modelConfidence: 93.6,
      telemetryFactors: [
        'Timing Advance TA=3 on CP Tower #104 and TA=19 on Noida Sector 62',
        'Physical carrier wave phase jitter incompatible with authentic Qualcomm baseband',
        'Synthetic LTE RRCConnectionRequest headers detected'
      ],
      citations: [
        { evidenceId: 'EVD-IND-905', source: 'Jio_5G_TowerDump_CellID_LKO1904.log', hash: 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f' }
      ]
    }
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'EVT-IND-01',
    timestamp: '2026-09-09T08:14:00Z',
    timeDisplay: '08:14:22 IST',
    channel: 'ATM',
    title: 'High-Value Structured Cash Withdrawal (₹9.5 Lakhs)',
    location: 'SBI ATM #412, Connaught Place, New Delhi',
    coordinates: '28.6315° N, 77.2167° E',
    details: 'Unmasked operative matching Tariq Ahmed / Farooq Mir profile withdrew ₹9.5 Lakhs in ₹500 denominations using 3 cloned corporate debit cards.',
    target: 'Tariq "Hawala-1" Ahmed',
    targetId: 'target-tariq',
    confidence: 91,
    imageUrl: ASSETS.delhiMap,
    alertLevel: 'ELEVATED',
    sourceAgency: 'State Bank of India / Delhi Police'
  },
  {
    id: 'EVT-IND-02',
    timestamp: '2026-09-09T11:22:15Z',
    timeDisplay: '11:22:15 IST',
    channel: 'VOIP',
    title: 'Encrypted VoIP Session via Reliance Jio 5G Wiretap',
    location: 'Barakhamba Road Fiber Tap #09',
    coordinates: '28.6289° N, 77.2285° E',
    details: '310-second encrypted session routed through custom wireguard relay. Audio voiceprint matched Singhania with 97.4% acoustic cosine confidence.',
    target: 'Vikramaditya "The Viper" Singhania',
    targetId: 'target-singhania',
    confidence: 97.4,
    alertLevel: 'HIGH',
    sourceAgency: 'DoT Section 69 Intercept Order'
  },
  {
    id: 'EVT-IND-03',
    timestamp: '2026-09-09T14:10:00Z',
    timeDisplay: '14:10:48 IST',
    channel: 'CCTV',
    title: 'Physical Surveillance Intercept at Chandni Chowk Haveli',
    location: 'Kucha Ghasiram, Old Delhi 110006',
    coordinates: '28.6562° N, 77.2301° E',
    details: 'Delhi Police Special Cell CCTV CAM-14 captured Tariq Ahmed receiving metallic cash dispatch briefcase with verified Hawala Angadia chit tokens.',
    target: 'Tariq "Hawala-1" Ahmed',
    targetId: 'target-tariq',
    confidence: 98.6,
    imageUrl: ASSETS.associateCCTV,
    alertLevel: 'HIGH',
    sourceAgency: 'Delhi Police Special Cell'
  },
  {
    id: 'EVT-IND-04',
    timestamp: '2026-09-09T16:57:10Z',
    timeDisplay: '16:57:10 IST',
    channel: 'FASTAG',
    title: 'FASTag Electronic Toll Plaza Crossing',
    location: 'Kherki Daula Toll Plaza NH-48 (Lane 04, Gurugram)',
    coordinates: '28.3975° N, 76.9854° E',
    details: 'White Toyota Fortuner DL 01 AB 9942 registered to Vajra Logistics passed toll lane 04 at 68 km/h heading toward Jaipur corridor.',
    target: 'Vikramaditya "The Viper" Singhania',
    targetId: 'target-singhania',
    confidence: 99.2,
    imageUrl: ASSETS.flirNight,
    alertLevel: 'HIGH',
    sourceAgency: 'NHAI / MoRTH FASTag Gateway'
  },
  {
    id: 'EVT-IND-05',
    timestamp: '2026-09-09T17:25:30Z',
    timeDisplay: '17:25:30 IST',
    channel: 'CELL_TOWER',
    title: '128-Port SIM Farm Synthetic Baseband Broadcast Burst',
    location: 'Noida Sector 62 Electronic City Tower #14',
    coordinates: '28.6280° N, 77.3649° E',
    details: 'Cyber Cell SIGINT detected 128 multi-IMSI transponders cycling simultaneously under operator Sameer Merchant, creating false RF propagation bubbles.',
    target: 'Sameer Merchant',
    targetId: 'target-sameer',
    confidence: 96.8,
    imageUrl: ASSETS.seizedHardware,
    alertLevel: 'HIGH',
    sourceAgency: 'DoT Vigilance & Cyber Crime PS'
  },
  {
    id: 'EVT-IND-06',
    timestamp: '2026-09-09T17:45:18Z',
    timeDisplay: '17:45:18 IST',
    channel: 'CELL_TOWER',
    title: 'Decoy Baseband Telemetry (Airtel Mumbai eNodeB)',
    location: 'Marine Lines Sector 2 Tower #7719A, Mumbai',
    coordinates: '18.9438° N, 72.8234° E',
    details: 'Cloned target IMEI 354891109481204 pinged base station while physical target was sighted in Delhi NCR, confirming deliberate SDR decoy transmission.',
    target: 'Sameer Merchant',
    targetId: 'target-sameer',
    confidence: 94.8,
    alertLevel: 'CRITICAL',
    sourceAgency: 'Bharti Airtel Telecom Compliance'
  },
  {
    id: 'EVT-IND-07',
    timestamp: '2026-09-09T18:24:12Z',
    timeDisplay: '18:24:12 IST',
    channel: 'CCTV',
    title: 'Biometric Optical Facial Intercept (IGI Airport T3)',
    location: 'Terminal 3 VIP Departure Concourse Gate 4B',
    coordinates: '28.5562° N, 77.1000° E',
    details: 'AI biometric facial recognition matched CCTNS / LOC Look Out Circular profile with 99.4% cosine similarity. Target attempted exit using fake Turkish passport.',
    target: 'Vikramaditya "The Viper" Singhania',
    targetId: 'target-singhania',
    confidence: 99.4,
    imageUrl: ASSETS.targetCCTV,
    alertLevel: 'CRITICAL',
    sourceAgency: 'Bureau of Immigration / CISF Security'
  },
  {
    id: 'EVT-IND-08',
    timestamp: '2026-09-09T19:15:45Z',
    timeDisplay: '19:15:45 IST',
    channel: 'FLIGHT',
    title: 'International Inbound Manifest Intercept (Emirates EK-512)',
    location: 'Dubai International DXB -> Goa Dabolim GOI',
    coordinates: '25.2532° N, 55.3657° E',
    details: 'Interpol Red Notice alert triggered on Advance Passenger Information (API) system for Elena Rostova on Emirates flight connecting via Dubai.',
    target: 'Elena Rostova',
    targetId: 'target-elena',
    confidence: 99.1,
    imageUrl: ASSETS.mumbaiMap,
    alertLevel: 'CRITICAL',
    sourceAgency: 'Interpol NCB New Delhi & Bureau of Immigration'
  }
];

export const EVIDENCE_VAULT: VaultEvidence[] = [
  {
    id: 'EVD-IND-901',
    title: 'OnePlus 11 Physical UFED Device Dump & Decrypted Database',
    type: 'State Cyber Cell Physical Extraction',
    fileFormat: 'BIN / TAR.GZ Physical RAM & NAND Flash',
    classification: 'TOP SECRET // INTERNAL SECURITY // MHA RESTRICTED',
    sha256: '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f',
    custodian: 'SP Vikram Malhotra, IPS (Cyber Ops Lead, MHA)',
    collectedDate: '2026-09-09 19:42:10 IST',
    status: 'SEALED',
    linkedEntities: ['Vikramaditya Singhania', 'Farooq Mir', 'Vajra Logistics'],
    chainOfCustodyCount: 6,
    previewUrl: ASSETS.seizedHardware,
    bsaSection: 'Section 63 & 65B Bharatiya Sakshya Adhiniyam 2023',
    courtAdmissible: true,
    firRef: 'FIR #182/2026 Special Cell Delhi',
    hashAlgorithm: 'SHA-256 (FIPS 180-4)'
  },
  {
    id: 'EVD-IND-902',
    title: 'NHAI FASTag Transit Logs & High-Speed Optical Still',
    type: 'Transit & Toll Plaza RFID Telemetry',
    fileFormat: 'JSON / RAW Optical Camera Plate Capture',
    classification: 'SECRET // FOR OFFICIAL USE ONLY (FOUO)',
    sha256: '8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    custodian: 'DySP Ananya Roy (CID Crime / FASTag Liaison)',
    collectedDate: '2026-09-09 16:57:10 IST',
    status: 'VERIFIED',
    linkedEntities: ['Vajra Logistics', 'Kherki Daula Toll'],
    chainOfCustodyCount: 4,
    previewUrl: ASSETS.flirNight,
    bsaSection: 'Section 65B BSA 2023 Certified Electronic Record',
    courtAdmissible: true,
    firRef: 'FIR #182/2026 Special Cell Delhi',
    hashAlgorithm: 'SHA-256'
  },
  {
    id: 'EVD-IND-903',
    title: 'FIU-IND Suspicious Transaction Report (STR-2026-9812)',
    type: 'Financial Intelligence Unit Audit Ledger',
    fileFormat: 'CSV / ISO 20022 Financial XML Ledger',
    classification: 'TOP SECRET // PMLA COMPLIANCE',
    sha256: '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    custodian: 'Joint Director P. K. Sharma (FIU-IND)',
    collectedDate: '2026-09-09 20:15:33 IST',
    status: 'VERIFIED',
    linkedEntities: ['Vajra Logistics', 'HDFC Bank Fort', 'vajra.settle@ybl'],
    chainOfCustodyCount: 8,
    bsaSection: 'Section 65B BSA 2023 / PMLA Section 50 Admissible',
    courtAdmissible: true,
    firRef: 'ECIR/09/DLZO/2026 ED New Delhi',
    hashAlgorithm: 'SHA-256'
  },
  {
    id: 'EVD-IND-904',
    title: 'Seized Trezor Hardware Ledger HW-409 with TRC-20 Assets',
    type: 'Cryptographic Hardware Wallet Seizure',
    fileFormat: 'Physical Vault Item & Binary Memory Dump',
    classification: 'TOP SECRET // HAWALA CRYPTO ASSET',
    sha256: 'df9eeaae3b775883193bc49c0bcf06f987241d95c4f98513e6aedc9fb6470cb3',
    custodian: 'Dr. S. K. Raman (Head CFSL New Delhi)',
    collectedDate: '2026-09-08 22:30:00 IST',
    status: 'LOCKED',
    linkedEntities: ['Trezor HW-409', 'Vikramaditya Singhania'],
    chainOfCustodyCount: 12,
    previewUrl: ASSETS.seizedHardware,
    bsaSection: 'Section 63 & 65B BSA 2023 Physical-Digital Forensic Seal',
    courtAdmissible: true,
    firRef: 'FIR #182/2026 Special Cell Delhi',
    hashAlgorithm: 'SHA-256'
  },
  {
    id: 'EVD-IND-905',
    title: 'Reliance Jio & Bharti Airtel CDR Cell Dump Logs',
    type: 'Telecommunications Call Detail Records & Timing Advance',
    fileFormat: 'PCAP / ASN.1 Cell Telemetry & Geo-Tower Dump',
    classification: 'RESTRICTED // MHA INTERCEPT WARRANT',
    sha256: 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f',
    custodian: 'Telecom Enforcement Inspector R. Verma',
    collectedDate: '2026-09-09 21:30:11 IST',
    status: 'VERIFIED',
    linkedEntities: ['+91 98110 49182', '+91 98201 84109', 'Singhania'],
    chainOfCustodyCount: 5,
    bsaSection: 'Section 65B BSA 2023 Telco Nodal Officer Certificate',
    courtAdmissible: true,
    firRef: 'FIR #182/2026 Special Cell Delhi',
    hashAlgorithm: 'SHA-256'
  },
  {
    id: 'EVD-IND-906',
    title: 'IGI Airport T3 Optical CCTV Facial Biometric Match Stream',
    type: 'High-Definition Surveillance Video & Cosine Embeddings',
    fileFormat: 'MP4 (H.265 / 4K) & FaceNet 512D Vector Embeddings',
    classification: 'TOP SECRET // MHA RESTRICTED',
    sha256: '7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f4a7b0c',
    custodian: 'Bureau of Immigration / CISF Aviation Security Command',
    collectedDate: '2026-09-09 18:24:12 IST',
    status: 'SEALED',
    linkedEntities: ['Vikramaditya Singhania', 'IGI Airport T3'],
    chainOfCustodyCount: 7,
    previewUrl: ASSETS.targetCCTV,
    bsaSection: 'Section 65B BSA 2023 Digital Video Forensic Certificate',
    courtAdmissible: true,
    firRef: 'FIR #182/2026 Special Cell Delhi / LOC-2026-441',
    hashAlgorithm: 'SHA-256'
  }
];
