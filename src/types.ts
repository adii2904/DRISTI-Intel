export type NavModule = 
  | 'ingestion' 
  | 'network' 
  | 'dossier' 
  | 'anomalies' 
  | 'timeline' 
  | 'copilot' 
  | 'vault';

export type AgencySource = 
  | 'ALL'
  | 'CCTNS'
  | 'CBI'
  | 'NIA'
  | 'ED'
  | 'NCB'
  | 'FIU_IND'
  | 'CYBER_CRIME';

export type CaseStage = 
  | 'ALL'
  | 'Under Investigation'
  | 'Charge Sheeted (u/s 173 BNS)'
  | 'Under Trial'
  | 'Untraced / Closure Report'
  | 'Convicted';

export type LegalFrameworkTag = 
  | 'ALL'
  | 'BNS / IPC'
  | 'PMLA'
  | 'PC Act'
  | 'UAPA'
  | 'NDPS Act'
  | 'IT Act';

export interface AccusedPerson {
  id: string;
  name: string;
  alias?: string;
  role: string;
  aadhaarHash: string;
  pan: string;
  passportNo: string;
  locStatus: 'Active LOC Issued (Bureau of Immigration)' | 'Pending Verification' | 'None';
  arrestStatus: 'Non-Bailable Warrant (NBW) Active' | 'Arrested & Remanded' | 'Absconding' | 'Interrogated u/s 67 NDPS/BNS';
  warrantDetails: string;
  riskScore: number;
  photoUrl?: string;
}

export interface LegalOffenseItem {
  id: string;
  act: string;
  section: string;
  title: string;
  description: string;
  cognizable: boolean;
  bailable: boolean;
  maxPenalty: string;
}

export interface SeizedAssetItem {
  id: string;
  type: 'BANK_ACCOUNT' | 'UPI_VPA' | 'FASTAG' | 'IMEI_SIM' | 'IMMOVABLE_PROPERTY' | 'VEHICLE' | 'CRYPTO_LEDGER';
  identifier: string;
  description: string;
  estimatedValue: string;
  holdingEntity: string;
  freezeStatus: 'FROZEN (Sec 17 PMLA)' | 'SEIZED (Sec 102 BNS)' | 'ATTACHED (ED PMLA)' | 'MONITORED';
  custodyMemo: string;
  seizureDate: string;
}

export interface CaseDocument {
  id: string;
  title: string;
  docType: 'FIR (Form I-IX)' | 'Charge Sheet (u/s 173 BNS)' | 'Seizure Memo' | 'Interrogation Report' | 'Progress Report (PR)' | 'FIU Suspicious Transaction Audit' | 'Digital Forensic Extraction';
  date: string;
  classification: string;
  sha256: string;
  pages: number;
  authorOfficer: string;
  fullContent: string;
  entities: {
    accused: string[];
    financial: string[];
    assets: string[];
    sections: string[];
  };
}

export interface CaseRecord {
  id: string;
  caseNo: string;
  title: string;
  agency: AgencySource;
  agencyFullName: string;
  firOrRcNo: string;
  policeStationOrBranch: string;
  stateOrJurisdiction: string;
  dateRegistered: string;
  caseStage: CaseStage;
  legalFramework: LegalFrameworkTag[];
  bnsIpcSections: string[];
  summary: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  documentCount: number;
  documents: CaseDocument[];
  accusedRoster: AccusedPerson[];
  legalOffenseMatrix: LegalOffenseItem[];
  seizedAssetTrail: SeizedAssetItem[];
  sha256Seal: string;
  bsaCertificate: {
    section: string;
    certifiedBy: string;
    hash: string;
    verificationDate: string;
    status: 'VALID' | 'TAMPER_PROOF';
  };
}

export interface IngestFileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'QUEUED' | 'PARSING' | 'EXTRACTED' | 'FAILED';
  progress: number;
  extractedEntities: number;
  extractedRelations: number;
  timestamp: string;
  sha256: string;
  sourceCategory: 'TELECOM' | 'FORENSIC' | 'FINANCIAL' | 'SURVEILLANCE' | 'GOV_INTEL' | 'TRANSIT';
  agency?: string;
  sourceAgency?: string;
  bsaCompliance?: string;
  rawJson?: any;
  customNodes?: NetworkNode[];
  customEdges?: NetworkEdge[];
}

export type EntityCategory = 'PERSON' | 'BURNER' | 'SHELL_ORG' | 'LOCATION' | 'ACCOUNT' | 'UPI_HANDLE';

export interface NetworkNode {
  id: string;
  label: string;
  subLabel: string;
  category: EntityCategory;
  x: number;
  y: number;
  riskScore: number;
  isPrimaryTarget?: boolean;
  avatarUrl?: string;
  status: 'ACTIVE' | 'FLAGGED' | 'FROZEN' | 'MONITORED';
  rawPayload?: any;
  details: {
    alias?: string;
    jurisdiction?: string;
    lastSeen?: string;
    connectedCount?: number;
    financialTotal?: string;
    telcoCarrier?: string;
    upiId?: string;
    ifsc?: string;
    bankName?: string;
    cctnsFir?: string;
    aadhaarHash?: string;
    pan?: string;
    fastagId?: string;
    vahanReg?: string;
    imei?: string;
    cellId?: string;
    tollPlaza?: string;
    coordinates?: string;
    flightNo?: string;
    rawPayload?: any;
  };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight: number;
  type: 'FINANCIAL' | 'COMMS' | 'DIRECTOR' | 'GEO_PROXIMITY' | 'ASSOCIATE' | 'HAWALA';
  highlighted?: boolean;
}

export interface AnomalyItem {
  id: string;
  title: string;
  riskScore: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: 'IMPOSSIBLE_TRAVEL' | 'SMURFING_VELOCITY' | 'COVERT_COLOCATION' | 'HARDWARE_SPOOF' | 'FASTAG_CDR_DISCREPANCY';
  entityName: string;
  entityId: string;
  timestamp: string;
  summary: string;
  explanation: {
    reasoning: string;
    modelConfidence: number;
    telemetryFactors: string[];
    citations: {
      evidenceId: string;
      source: string;
      hash: string;
    }[];
  };
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeDisplay: string;
  channel: 'ATM' | 'CELL_TOWER' | 'VOIP' | 'CCTV' | 'FLIGHT' | 'FASTAG' | 'IRCTC_RAIL';
  title: string;
  location: string;
  coordinates: string;
  details: string;
  target: string;
  confidence: number;
  imageUrl?: string;
  alertLevel: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  sourceAgency?: string;
  targetId?: string;
}

export interface VaultEvidence {
  id: string;
  title: string;
  type: string;
  fileFormat: string;
  classification: string;
  sha256: string;
  custodian: string;
  collectedDate: string;
  status: 'VERIFIED' | 'LOCKED' | 'SEALED';
  linkedEntities: string[];
  chainOfCustodyCount: number;
  previewUrl?: string;
  bsaSection?: string;
  courtAdmissible?: boolean;
  firRef?: string;
  hashAlgorithm?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    };
  };
}

export type GeminiModelChoice =
  | 'gemini-3.8-flash'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite'
  | 'gemini-3.1-pro-preview';

export type TacticalRole =
  | 'TACTICAL_OPERATIONS'
  | 'FIU_FINANCIAL_INVESTIGATOR'
  | 'GEOSPATIAL_RECON'
  | 'LEGAL_PROSECUTOR_65B';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  timestamp: string;
  text: string;
  modelUsed?: string;
  isMapsGrounded?: boolean;
  groundingChunks?: GroundingChunk[];
  groundingMetadata?: any;
  provenanceCitations?: {
    evidenceId: string;
    title: string;
    hash: string;
    bsaSection?: string;
  }[];
  suggestedActions?: string[];
  isError?: boolean;
}

export type SecurityClearance = 'LEVEL_4_TOP_SECRET' | 'LEVEL_3_SECRET' | 'LEVEL_2_RESTRICTED';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  badgeId: string;
  serviceId?: string;
  designation: string;
  agency: string;
  clearanceLevel: SecurityClearance;
  station: string;
  avatarUrl?: string;
  tokenExpiry: string;
  lastLoginTime: string;
}

export interface DossierTarget {
  id: string;
  nodeId: string;
  name: string;
  syndicateRole: string;
  aliases: string;
  pan: string;
  aadhaarHash: string;
  passportNo: string;
  locStatus: string;
  locRef: string;
  firRef: string;
  classificationTag: string;
  warrantStatus: string;
  warrantCourt: string;
  warrantNo: string;
  threatScore: number;
  threatSeverity: string;
  threatSeverityColor?: string;
  networkCentrality: number;
  correlatedNodes: number;
  flaggedLiquidity: string;
  frozenAmount: string;
  lastInterceptLocation: string;
  lastInterceptDetail: string;
  mugshotUrl: string;
  referencePhotoUrl: string;
  referencePhotoLabel: string;
  liveCctvLabel: string;
  biometricMatchPct: number;
  biometricConfidence: string;
  biometricParams: {
    ipd: string;
    nasalCurvature: string;
    mandibularAngle: string;
    confidenceScore: string;
    algorithm: string;
    legalNote: string;
  };
  riskVector: {
    burnerRotationPct: number;
    burnerRotationLabel: string;
    hawalaComplexityPct: number;
    hawalaComplexityLabel: string;
    flightRiskPct: number;
    flightRiskLabel: string;
    heuristicSummary: string;
  };
  cctnsProsecution: {
    firTitle: string;
    offenses: string;
    io: string;
    warrantTitle: string;
    warrantCourt: string;
    warrantNo: string;
    locTitle: string;
    locCircular: string;
    locAction: string;
  };
  fiuAccounts: Array<{
    bank: string;
    acc: string;
    type: string;
    balance: string;
    status: string;
  }>;
  telcoCdr: {
    burnerTitle: string;
    status: string;
    msisdn: string;
    imei: string;
    towerSector: string;
    roamingStatus: string;
    vahanTitle: string;
    vahanStatus: string;
    vahanReg: string;
    fastagRfid: string;
    lastToll: string;
    discrepancy: string;
  };
  evidenceItems: Array<{
    id: string;
    title: string;
    hash: string;
    statusBadge?: string;
  }>;
  matchingNodeIds: string[];
}

