import { IngestFileItem, NetworkNode, NetworkEdge, TimelineEvent, ChatMessage } from '../types';
import { parseIntelligenceJsonToGraph } from './intelGraphParser';

// Map of known initial file IDs to explicit node and event IDs
const FILE_EXPLICIT_MAP: Record<string, { nodeIds: string[]; eventIds: string[] }> = {
  // UFED Device Dump (Physical Forensics)
  'ING-IND-90821': {
    nodeIds: ['node-singhania', 'node-jio-burner', 'node-tariq', 'node-safehouse', 'node-farooq'],
    eventIds: ['EVT-IND-02', 'EVT-IND-03']
  },
  // FIU-IND Hawala Ledger (Financial)
  'ING-IND-90822': {
    nodeIds: ['node-singhania', 'node-farooq', 'node-vajra', 'node-hdfc-account', 'node-upi-smurf'],
    eventIds: ['EVT-IND-01', 'EVT-IND-03']
  },
  // CCTNS FIR Index (Gov Intel / Case Record)
  'ING-IND-90823': {
    nodeIds: ['node-singhania', 'node-farooq', 'node-vajra', 'node-igi-airport'],
    eventIds: ['EVT-IND-03', 'EVT-IND-06']
  },
  // NHAI FASTag Transit (Transit)
  'ING-IND-90824': {
    nodeIds: ['node-singhania', 'node-vajra', 'node-igi-airport', 'node-airtel-burner'],
    eventIds: ['EVT-IND-04', 'EVT-IND-05']
  },
  // Jio 5G Tower Dump (Telco CDR)
  'ING-IND-90825': {
    nodeIds: ['node-singhania', 'node-jio-burner', 'node-airtel-burner', 'node-safehouse', 'node-tariq'],
    eventIds: ['EVT-IND-02', 'EVT-IND-05']
  }
};

/**
 * Checks if a network node belongs to a specific file package
 */
export function isNodeInFile(file: IngestFileItem, node: NetworkNode): boolean {
  // 1. Explicit ID check
  const explicit = FILE_EXPLICIT_MAP[file.id];
  if (explicit && explicit.nodeIds.includes(node.id)) {
    return true;
  }

  // 2. Category & semantic heuristics for uploaded / dynamic files
  const cat = file.sourceCategory;
  const fileName = file.name.toLowerCase();

  if (cat === 'TELECOM' || fileName.includes('cdr') || fileName.includes('tower') || fileName.includes('jio') || fileName.includes('airtel')) {
    return ['BURNER', 'PERSON'].includes(node.category) || node.details.telcoCarrier !== undefined;
  }

  if (cat === 'FINANCIAL' || fileName.includes('fiu') || fileName.includes('upi') || fileName.includes('ledger') || fileName.includes('bank')) {
    return ['ACCOUNT', 'UPI_HANDLE', 'SHELL_ORG', 'PERSON'].includes(node.category) ||
      Boolean(node.details.financialTotal || node.details.bankName || node.details.upiId);
  }

  if (cat === 'TRANSIT' || fileName.includes('fastag') || fileName.includes('transit') || fileName.includes('toll')) {
    return ['LOCATION', 'SHELL_ORG', 'PERSON'].includes(node.category) ||
      Boolean(node.details.vahanReg || node.details.fastagId || node.label.toLowerCase().includes('airport'));
  }

  if (cat === 'FORENSIC' || fileName.includes('ufed') || fileName.includes('bin') || fileName.includes('ram')) {
    return ['PERSON', 'BURNER', 'LOCATION'].includes(node.category) ||
      Boolean(node.isPrimaryTarget || node.details.alias?.includes('IMEI'));
  }

  if (cat === 'SURVEILLANCE' || fileName.includes('cctv') || fileName.includes('cam')) {
    return ['LOCATION', 'PERSON'].includes(node.category) ||
      Boolean(node.avatarUrl || node.label.toLowerCase().includes('airport') || node.label.toLowerCase().includes('haveli'));
  }

  // Fallback: Primary targets are linked to case files
  return node.isPrimaryTarget || false;
}

/**
 * Filter nodes based on active file focus
 */
export function filterNodesByFile(nodes: NetworkNode[], file: IngestFileItem | null): NetworkNode[] {
  if (!file) return nodes;

  // 1. If file has explicit parsed customNodes, use them directly
  if (file.customNodes && file.customNodes.length > 0) {
    return file.customNodes;
  }

  // 2. If file has rawJson containing financial, transit, or telecom intelligence, dynamically parse it
  if (file.rawJson) {
    const parsed = parseIntelligenceJsonToGraph(file.rawJson);
    if (parsed.nodes.length > 0) {
      return parsed.nodes;
    }
  }

  // 3. Otherwise use heuristic filter on provided nodes
  const matched = nodes.filter(n => isNodeInFile(file, n));
  // Guarantee at least the primary target if empty
  if (matched.length === 0) {
    const primary = nodes.find(n => n.isPrimaryTarget);
    return primary ? [primary] : nodes.slice(0, 3);
  }
  return matched;
}

/**
 * Filter edges based on active file focus
 */
export function filterEdgesByFile(
  edges: NetworkEdge[],
  activeNodeIds: Set<string>,
  file?: IngestFileItem | null
): NetworkEdge[] {
  // 1. If file has explicit parsed customEdges, use them directly
  if (file?.customEdges && file.customEdges.length > 0) {
    return file.customEdges;
  }

  // 2. If file has rawJson containing intelligence data, dynamically parse it
  if (file?.rawJson) {
    const parsed = parseIntelligenceJsonToGraph(file.rawJson);
    if (parsed.edges.length > 0) {
      return parsed.edges;
    }
  }

  return edges.filter(e => activeNodeIds.has(e.source) && activeNodeIds.has(e.target));
}

/**
 * Checks if a timeline event belongs to a specific file package
 */
export function isEventInFile(file: IngestFileItem, event: TimelineEvent): boolean {
  // 1. Explicit ID check
  const explicit = FILE_EXPLICIT_MAP[file.id];
  if (explicit && explicit.eventIds.includes(event.id)) {
    return true;
  }

  // 2. Category & channel matching for uploaded / dynamic files
  const cat = file.sourceCategory;
  const fileName = file.name.toLowerCase();

  if (cat === 'TELECOM' || fileName.includes('cdr') || fileName.includes('tower')) {
    return event.channel === 'CELL_TOWER' || event.channel === 'VOIP';
  }

  if (cat === 'FINANCIAL' || fileName.includes('fiu') || fileName.includes('upi') || fileName.includes('ledger')) {
    return event.channel === 'ATM' || event.title.toLowerCase().includes('cash') || event.title.toLowerCase().includes('withdrawal');
  }

  if (cat === 'TRANSIT' || fileName.includes('fastag') || fileName.includes('nhai')) {
    return event.channel === 'FASTAG' || event.channel === 'FLIGHT' || event.channel === 'IRCTC_RAIL';
  }

  if (cat === 'SURVEILLANCE' || fileName.includes('cctv')) {
    return event.channel === 'CCTV';
  }

  if (cat === 'FORENSIC' || fileName.includes('ufed')) {
    return event.channel === 'VOIP' || event.channel === 'CCTV';
  }

  // Fallback match high confidence events
  return event.confidence > 90;
}

/**
 * Filter timeline events based on active file focus
 */
export function filterTimelineEventsByFile(events: TimelineEvent[], file: IngestFileItem | null): TimelineEvent[] {
  if (!file) return events;
  const matched = events.filter(e => isEventInFile(file, e));
  return matched.length > 0 ? matched : events.slice(0, 2);
}

/**
 * Returns customized suggested prompts for Neural Copilot based on file package
 */
export function getFileSpecificCopilotPrompts(file: IngestFileItem): string[] {
  const cat = file.sourceCategory;
  const lowerName = file.name.toLowerCase();

  if (cat === 'TELECOM' || lowerName.includes('cdr') || lowerName.includes('tower')) {
    return [
      `Analyze cell tower pings & timing advance in ${file.name}`,
      `Identify cloned IMEI & SDR decoy transmitters in this dump`,
      `Correlate burner SIM attaches with physical sightings`
    ];
  }

  if (cat === 'FINANCIAL' || lowerName.includes('fiu') || lowerName.includes('ledger') || lowerName.includes('upi')) {
    return [
      `Detect ₹50,000 PMLA threshold smurfing patterns in ${file.name}`,
      `Trace Hawala Angadia cash chits & corporate escrow wires`,
      `Generate Section 17 PMLA account freeze order draft`
    ];
  }

  if (cat === 'TRANSIT' || lowerName.includes('fastag')) {
    return [
      `Calculate velocity conflicts between FASTag tolls and tower pings`,
      `Map convoy vehicle routes from ${file.name}`,
      `Flag impossible travel anomalies across Delhi-Mumbai corridor`
    ];
  }

  if (cat === 'FORENSIC' || lowerName.includes('ufed')) {
    return [
      `Extract decrypted Signal chats and contact rosters from ${file.name}`,
      `Analyze deleted SQLite messages and crypto wallet artifacts`,
      `Map hardware forensic timeline to Hawala cash pickups`
    ];
  }

  return [
    `Summarize key intelligence entities extracted from ${file.name}`,
    `Correlate findings in this package with prime suspect Singhania`,
    `Identify investigative leads and Section 65B BSA compliance status`
  ];
}

/**
 * Returns contextual initial AI intelligence briefing for the selected file
 */
export function getFileSpecificAnalysis(file: IngestFileItem): ChatMessage {
  const cat = file.sourceCategory;
  const fileName = file.name;
  let analysisText = '';
  let citations: ChatMessage['provenanceCitations'] = [];

  if (cat === 'TELECOM' || fileName.toLowerCase().includes('cdr') || fileName.toLowerCase().includes('tower')) {
    analysisText = `**ACTIVE FILE FOCUS BRIEFING // TELCO CDR TELEMETRY**
File Package: \`${fileName}\` (${file.size}, Agency: ${file.sourceAgency || file.agency || 'DoT Compliance'})

1. **Cell Footprint Analysis**: Tower logs indicate concentrated RF activity around Cell ID \`LKO1904\` (Chandni Chowk Old Delhi) and Sector 2 Marine Lines (Mumbai).
2. **IMEI Discrepancy**: Device attached simultaneously with Timing Advance TA=3 and TA=19 across non-adjacent towers—confirming a software-defined radio (SDR) decoy transmitter deployed to spoof physical presence.
3. **Key Linked Entities**: Target Burner (+91 98110 49182), Decoy SIM (+91 98201 84109), and 18 encrypted voice calls with Captain Tariq Sheikh.`;
    citations = [
      {
        evidenceId: file.id,
        title: fileName,
        hash: file.sha256 || 'a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1d0f5e8a3b6c9d2e1f'
      }
    ];
  } else if (cat === 'FINANCIAL' || fileName.toLowerCase().includes('fiu') || fileName.toLowerCase().includes('ledger')) {
    analysisText = `**ACTIVE FILE FOCUS BRIEFING // FINANCIAL STR & HAWALA LEDGER**
File Package: \`${fileName}\` (${file.size}, Agency: ${file.sourceAgency || file.agency || 'FIU-IND'})

1. **Micro-Smurfing Pattern**: Detected 32 consecutive UPI outbound transfers clustered between ₹48,500 and ₹49,950 through Yes Bank VPA \`vajra.settle@ybl\` to evade the ₹50,000 PMLA automated reporting ceiling.
2. **Escrow Aggregation**: ₹34.5 Crore wired from shell entity Vajra Logistics into HDFC Bank Fort Branch before instant conversion into Angadia physical cash chits.
3. **Key Linked Entities**: Farooq Mir (Courier), Vajra Logistics Pvt Ltd, HDFC Escrow A/C, and Yes Bank UPI Smurf Pool.`;
    citations = [
      {
        evidenceId: file.id,
        title: fileName,
        hash: file.sha256 || '4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f9f8e4c7b2a1d0f5e8a3b6c9d2e1f'
      }
    ];
  } else if (cat === 'TRANSIT' || fileName.toLowerCase().includes('fastag')) {
    analysisText = `**ACTIVE FILE FOCUS BRIEFING // FASTAG TRANSIT TELEMETRY**
File Package: \`${fileName}\` (${file.size}, Agency: ${file.sourceAgency || file.agency || 'NHAI'})

1. **Toll Plaza Crossing**: RFID Tag #TAG-IND-88194 (Toyota Fortuner DL 01 AB 9942) logged at Kherki Daula Toll Plaza NH-48 Lane 04 heading toward Jaipur corridor.
2. **Velocity Conflict**: 48 minutes post-toll, target mobile IMEI pinged in Mumbai (1,420 km away), demonstrating an impossible velocity of >1,775 km/h and confirming an active vehicle decoy.
3. **Key Linked Entities**: Vajra Logistics Vehicle Fleet, IGI Airport transit corridor, Vikramaditya Singhania.`;
    citations = [
      {
        evidenceId: file.id,
        title: fileName,
        hash: file.sha256 || '8c1d4e7f0a3b6c9d2e1f4a7b0c3d6e9f2a5b9f8e4c7b2a1d0f5e8a3b6c9d2e1f'
      }
    ];
  } else if (cat === 'FORENSIC' || fileName.toLowerCase().includes('ufed')) {
    analysisText = `**ACTIVE FILE FOCUS BRIEFING // HARDWARE PHYSICAL EXTRACTION**
File Package: \`${fileName}\` (${file.size}, Agency: ${file.sourceAgency || file.agency || 'Special Cell Cyber Ops'})

1. **Physical RAM & NAND Dump**: Extracted 384 entities and 1,420 relational links from seized hardware. Decrypted Signal SQLite database revealed coordinates for Chandni Chowk cash vault.
2. **Cryptographic Wallets**: Uncovered encrypted private key recovery phrases associated with hardware Trezor ledger and Dubai offshore Hawala conduit.
3. **Key Linked Entities**: Vikramaditya Singhania (Owner), Farooq Mir, Captain Tariq Sheikh, Burner SIMs.`;
    citations = [
      {
        evidenceId: file.id,
        title: fileName,
        hash: file.sha256 || '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e1f'
      }
    ];
  } else {
    analysisText = `**ACTIVE FILE FOCUS BRIEFING // OPERATIONAL DATA PACKAGE**
File Package: \`${fileName}\` (${file.size}, Category: ${cat})

1. **Intake Processing**: Package verified with ${file.extractedEntities} extracted entities and ${file.extractedRelations} correlation links.
2. **Cross-Correlation**: Entity records mapped across prime target Vikramaditya Singhania, associated shell organizations, and physical meet locations.
3. **Actionable Status**: Ready for cross-indexing against active CCTNS warrants and FIU transaction surveillance networks.`;
    citations = [
      {
        evidenceId: file.id,
        title: fileName,
        hash: file.sha256 || 'd2e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c99f8e4c7b2a1d0f5e8a3b6c9d2e1f'
      }
    ];
  }

  return {
    id: `focus-ai-${file.id}`,
    sender: 'ASSISTANT',
    timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    text: analysisText,
    provenanceCitations: citations,
    suggestedActions: getFileSpecificCopilotPrompts(file)
  };
}
