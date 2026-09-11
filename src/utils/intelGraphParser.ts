import { NetworkNode, NetworkEdge, EntityCategory } from '../types';

export interface ParsedGraphResult {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  summary: {
    entityCount: number;
    relationCount: number;
    categories: Record<string, number>;
    financialVolume?: string;
    targetName?: string;
    operationName?: string;
  };
}

// Clean helper to generate safe node IDs
function slugifyId(text: string, prefix: string = 'node'): string {
  const safe = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${prefix}-${safe || Math.random().toString(36).substring(2, 7)}`;
}

// Format numbers into Indian currency string
function formatInr(amount: number | string): string {
  if (typeof amount === 'string' && (amount.includes('₹') || amount.includes('Cr') || amount.includes('L'))) {
    return amount;
  }
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
  if (!num || isNaN(num)) return '₹0';
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Parses any intelligence JSON payload (especially Operation_Rapid_Velocity.json)
 * and dynamically extracts nodes and edges from:
 * - financial_intelligence
 * - transit_intelligence
 * - telecom_cdr
 * plus any explicit nodes/links or top-level suspect information.
 */
export function parseIntelligenceJsonToGraph(json: any): ParsedGraphResult {
  if (!json || typeof json !== 'object') {
    return {
      nodes: [],
      edges: [],
      summary: { entityCount: 0, relationCount: 0, categories: {} }
    };
  }

  const nodesMap = new Map<string, NetworkNode>();
  const edgesMap = new Map<string, NetworkEdge>();

  // Extract operation or target metadata if present
  const operationName = json.operation_name || json.operation || json.case_name || json.name;
  const mainTargetName = json.primary_target || json.target || json.target_name || json.subject;

  // Track cluster indices for neat spatial distribution
  const clusterCounts: Record<EntityCategory, number> = {
    PERSON: 0,
    BURNER: 0,
    SHELL_ORG: 0,
    LOCATION: 0,
    ACCOUNT: 0,
    UPI_HANDLE: 0,
  };

  function computeCoordinates(category: EntityCategory, isPrimary: boolean = false): { x: number; y: number } {
    if (isPrimary) {
      return { x: 480, y: 280 };
    }
    const count = clusterCounts[category]++;
    
    // Cluster layout algorithms for each category sector
    switch (category) {
      case 'PERSON': {
        const row = Math.floor(count / 3);
        const col = count % 3;
        return { x: 400 + (col - 1) * 110, y: 150 + row * 90 };
      }
      case 'SHELL_ORG': {
        const row = Math.floor(count / 2);
        const col = count % 2;
        return { x: 190 + col * 120, y: 160 + row * 95 };
      }
      case 'ACCOUNT':
      case 'UPI_HANDLE': {
        const row = Math.floor(count / 3);
        const col = count % 3;
        return { x: 180 + col * 110, y: 360 + row * 85 };
      }
      case 'BURNER': {
        const row = Math.floor(count / 2);
        const col = count % 2;
        return { x: 670 + col * 120, y: 150 + row * 95 };
      }
      case 'LOCATION': {
        const row = Math.floor(count / 2);
        const col = count % 2;
        return { x: 670 + col * 130, y: 390 + row * 95 };
      }
      default:
        return { x: 480 + (Math.random() * 200 - 100), y: 280 + (Math.random() * 200 - 100) };
    }
  }

  // Register or update a node safely
  function registerNode(nodeData: Partial<NetworkNode> & { id: string; label: string; category: EntityCategory }): NetworkNode {
    const existing = nodesMap.get(nodeData.id);
    if (existing) {
      // Merge details
      existing.details = {
        ...existing.details,
        ...nodeData.details,
        connectedCount: (existing.details.connectedCount || 1) + 1,
      };
      if (nodeData.riskScore && nodeData.riskScore > existing.riskScore) {
        existing.riskScore = nodeData.riskScore;
      }
      if (nodeData.isPrimaryTarget) {
        existing.isPrimaryTarget = true;
      }
      return existing;
    }

    const isPrimary = Boolean(
      nodeData.isPrimaryTarget ||
      (mainTargetName && nodeData.label.toLowerCase().includes(String(mainTargetName).toLowerCase()))
    );

    const coords = computeCoordinates(nodeData.category, isPrimary);

    const newNode: NetworkNode = {
      id: nodeData.id,
      label: nodeData.label,
      subLabel: nodeData.subLabel || `${nodeData.category} Entity`,
      category: nodeData.category,
      x: nodeData.x || coords.x,
      y: nodeData.y || coords.y,
      riskScore: nodeData.riskScore || (isPrimary ? 96 : 70),
      isPrimaryTarget: isPrimary,
      avatarUrl: nodeData.avatarUrl,
      status: nodeData.status || (isPrimary ? 'ACTIVE' : 'FLAGGED'),
      details: {
        connectedCount: 1,
        ...nodeData.details,
      },
    };

    nodesMap.set(newNode.id, newNode);
    return newNode;
  }

  // Register or update an edge safely
  function registerEdge(edge: NetworkEdge) {
    if (!edge.source || !edge.target || edge.source === edge.target) return;
    const edgeKey = `${edge.source}-->${edge.target}`;
    const reverseKey = `${edge.target}-->${edge.source}`;
    if (edgesMap.has(edgeKey) || edgesMap.has(reverseKey)) return;

    edgesMap.set(edgeKey, edge);

    // Increment connected counts on both nodes
    const srcNode = nodesMap.get(edge.source);
    if (srcNode) srcNode.details.connectedCount = (srcNode.details.connectedCount || 0) + 1;
    const tgtNode = nodesMap.get(edge.target);
    if (tgtNode) tgtNode.details.connectedCount = (tgtNode.details.connectedCount || 0) + 1;
  }

  // 0. Explicit Primary Target setup if provided at top-level
  let primaryTargetNodeId: string | null = null;
  if (mainTargetName) {
    const pId = slugifyId(mainTargetName, 'node-target');
    primaryTargetNodeId = pId;
    registerNode({
      id: pId,
      label: mainTargetName,
      subLabel: json.target_role || 'Prime Target / Syndicate Leader',
      category: 'PERSON',
      riskScore: 98,
      isPrimaryTarget: true,
      details: {
        alias: json.target_alias || 'Prime Target',
        jurisdiction: json.jurisdiction || 'Delhi NCR / Mumbai / Dubai',
        cctnsFir: json.cctns_fir || json.fir_no || 'FIR #182/2026 U/S 111 BNS & UAPA',
        pan: json.pan,
        aadhaarHash: json.aadhaar_hash,
      },
    });
  }

  // 1. DYNAMIC MAPPING: FINANCIAL INTELLIGENCE
  const finIntel = json.financial_intelligence || json.financial_intel || json.financials || json.transactions;
  if (finIntel) {
    const finRecords: any[] = Array.isArray(finIntel)
      ? finIntel
      : [
          ...(Array.isArray(finIntel.transactions) ? finIntel.transactions : []),
          ...(Array.isArray(finIntel.accounts) ? finIntel.accounts : []),
          ...(Array.isArray(finIntel.hawala_ledgers) ? finIntel.hawala_ledgers : []),
          ...(Array.isArray(finIntel.smurfing_networks) ? finIntel.smurfing_networks : []),
          ...(Array.isArray(finIntel.shell_companies) ? finIntel.shell_companies : []),
        ];

    // If finIntel is an object with direct keys, treat values as records
    if (finRecords.length === 0 && typeof finIntel === 'object') {
      Object.entries(finIntel).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          finRecords.push(...val);
        } else if (typeof val === 'object' && val !== null) {
          finRecords.push({ ...val, _recordType: key });
        }
      });
    }

    finRecords.forEach((item, idx) => {
      if (!item || typeof item !== 'object') return;

      const senderName = item.sender || item.from || item.source || item.remitter || item.source_entity || (primaryTargetNodeId ? mainTargetName : 'Syndicate Remitter');
      const receiverName = item.receiver || item.to || item.destination || item.beneficiary || item.recipient || item.merchant || `Beneficiary Node ${idx + 1}`;
      const amountStr = formatInr(item.amount || item.value || item.volume || item.amount_inr || '₹50,00,000');
      const txnType = item.type || item.mode || item.channel || item.method || 'FINANCIAL';
      const isHawala = String(txnType).toUpperCase().includes('HAWALA') || String(item.remarks || '').toUpperCase().includes('HAWALA');

      // Determine sender category
      let senderCategory: EntityCategory = 'PERSON';
      if (item.sender_type === 'SHELL_ORG' || senderName.toLowerCase().includes('ltd') || senderName.toLowerCase().includes('pvt') || senderName.toLowerCase().includes('logistics') || senderName.toLowerCase().includes('enterprises')) {
        senderCategory = 'SHELL_ORG';
      } else if (item.sender_type === 'ACCOUNT' || senderName.toLowerCase().includes('account') || senderName.toLowerCase().includes('bank')) {
        senderCategory = 'ACCOUNT';
      }

      // Determine receiver category
      let receiverCategory: EntityCategory = 'ACCOUNT';
      if (item.receiver_type === 'UPI' || receiverName.includes('@') || txnType === 'UPI') {
        receiverCategory = 'UPI_HANDLE';
      } else if (item.receiver_type === 'SHELL_ORG' || receiverName.toLowerCase().includes('ltd') || receiverName.toLowerCase().includes('traders') || receiverName.toLowerCase().includes('holdings')) {
        receiverCategory = 'SHELL_ORG';
      } else if (item.receiver_type === 'PERSON' || isHawala) {
        receiverCategory = 'PERSON';
      }

      const senderId = slugifyId(senderName, senderCategory === 'SHELL_ORG' ? 'node-shell' : 'node-pers');
      const receiverId = slugifyId(receiverName, receiverCategory === 'UPI_HANDLE' ? 'node-upi' : (receiverCategory === 'ACCOUNT' ? 'node-acc' : 'node-recv'));

      registerNode({
        id: senderId,
        label: senderName,
        subLabel: item.sender_role || (senderCategory === 'SHELL_ORG' ? 'Shell Front Entity' : 'Financial Remitter'),
        category: senderCategory,
        riskScore: item.sender_risk || (senderId === primaryTargetNodeId ? 96 : 82),
        details: {
          financialTotal: amountStr,
          bankName: item.source_bank || item.bank_name,
          pan: item.sender_pan || item.pan,
          ifsc: item.source_ifsc || item.ifsc,
        },
      });

      registerNode({
        id: receiverId,
        label: receiverName,
        subLabel: item.receiver_role || (receiverCategory === 'UPI_HANDLE' ? 'Smurfing Virtual VPA' : (receiverCategory === 'ACCOUNT' ? 'Beneficiary Escrow' : 'Hawala Mule')),
        category: receiverCategory,
        riskScore: item.receiver_risk || 86,
        status: 'FLAGGED',
        details: {
          financialTotal: amountStr,
          upiId: receiverCategory === 'UPI_HANDLE' ? receiverName : undefined,
          bankName: item.destination_bank || item.bank_name || 'HDFC Bank / Axis Gateway',
          ifsc: item.destination_ifsc || 'HDFC0000060',
        },
      });

      // Register financial edge
      registerEdge({
        id: `edge-fin-${idx}-${senderId}-${receiverId}`,
        source: senderId,
        target: receiverId,
        label: `${amountStr} [${txnType}]`,
        weight: isHawala ? 9 : 6,
        type: isHawala ? 'HAWALA' : 'FINANCIAL',
        highlighted: isHawala || Number(item.amount) > 10000000,
      });
    });
  }

  // 2. DYNAMIC MAPPING: TRANSIT INTELLIGENCE
  const transitIntel = json.transit_intelligence || json.transit_intel || json.transit || json.movements;
  if (transitIntel) {
    const transitRecords: any[] = Array.isArray(transitIntel)
      ? transitIntel
      : [
          ...(Array.isArray(transitIntel.toll_crossings) ? transitIntel.toll_crossings : []),
          ...(Array.isArray(transitIntel.movements) ? transitIntel.movements : []),
          ...(Array.isArray(transitIntel.vehicles) ? transitIntel.vehicles : []),
          ...(Array.isArray(transitIntel.anpr_sightings) ? transitIntel.anpr_sightings : []),
          ...(Array.isArray(transitIntel.flight_records) ? transitIntel.flight_records : []),
        ];

    if (transitRecords.length === 0 && typeof transitIntel === 'object') {
      Object.entries(transitIntel).forEach(([key, val]) => {
        if (Array.isArray(val)) transitRecords.push(...val);
        else if (typeof val === 'object' && val !== null) transitRecords.push({ ...val, _transitType: key });
      });
    }

    transitRecords.forEach((item, idx) => {
      if (!item || typeof item !== 'object') return;

      const locationName = item.toll_plaza || item.plaza_name || item.location || item.checkpoint || item.airport || item.destination || `Toll Plaza Gantry ${idx + 1}`;
      const locationId = slugifyId(locationName, 'node-loc');
      const vehicleDesc = item.vehicle_number || item.reg_no || item.vehicle || item.car || 'Suspect Convoy Vehicle';
      const actorName = item.occupant || item.driver || item.suspect || item.target || mainTargetName || 'Convoy Courier';
      const actorId = slugifyId(actorName, 'node-pers');

      // Register location node
      registerNode({
        id: locationId,
        label: locationName,
        subLabel: item.direction ? `Direction: ${item.direction}` : 'FASTag ANPR Monitored Gantry',
        category: 'LOCATION',
        riskScore: item.risk_score || 72,
        status: 'MONITORED',
        details: {
          tollPlaza: locationName,
          coordinates: item.coordinates || item.lat_lng,
          jurisdiction: item.jurisdiction || 'NHAI Corridor / Delhi NCR Police',
          lastSeen: item.timestamp || item.time || 'Recent FASTag Hit',
        },
      });

      // Register transit edge from Actor/Vehicle to Location
      const sourceActorId = nodesMap.has(actorId) ? actorId : (primaryTargetNodeId || actorId);
      if (!nodesMap.has(sourceActorId)) {
        registerNode({
          id: sourceActorId,
          label: actorName,
          subLabel: `Vehicle: ${vehicleDesc}`,
          category: 'PERSON',
          riskScore: 84,
          details: {
            vahanReg: vehicleDesc,
            fastagId: item.tag_id || item.fastag_id || 'FASTag-IND-9910',
          },
        });
      }

      registerEdge({
        id: `edge-transit-${idx}-${sourceActorId}-${locationId}`,
        source: sourceActorId,
        target: locationId,
        label: item.timestamp ? `Transit @ ${item.timestamp}` : `FASTag: ${vehicleDesc}`,
        weight: 5,
        type: 'GEO_PROXIMITY',
      });
    });
  }

  // 3. DYNAMIC MAPPING: TELECOM CDR
  const telecomIntel = json.telecom_cdr || json.telecom || json.cdr || json.cdr_records;
  if (telecomIntel) {
    const cdrRecords: any[] = Array.isArray(telecomIntel)
      ? telecomIntel
      : [
          ...(Array.isArray(telecomIntel.call_records) ? telecomIntel.call_records : []),
          ...(Array.isArray(telecomIntel.calls) ? telecomIntel.calls : []),
          ...(Array.isArray(telecomIntel.burners) ? telecomIntel.burners : []),
          ...(Array.isArray(telecomIntel.tower_dumps) ? telecomIntel.tower_dumps : []),
        ];

    if (cdrRecords.length === 0 && typeof telecomIntel === 'object') {
      Object.entries(telecomIntel).forEach(([key, val]) => {
        if (Array.isArray(val)) cdrRecords.push(...val);
        else if (typeof val === 'object' && val !== null) cdrRecords.push({ ...val, _cdrType: key });
      });
    }

    cdrRecords.forEach((item, idx) => {
      if (!item || typeof item !== 'object') return;

      const callerNumber = item.caller || item.calling_number || item.a_party || item.msisdn_a || item.phone || `+91 98110 ${10000 + idx}`;
      const receiverNumber = item.receiver || item.called_number || item.b_party || item.msisdn_b || `+91 98201 ${20000 + idx}`;
      const carrierName = item.carrier || item.operator || (callerNumber.includes('9811') ? 'Reliance Jio 5G' : 'Bharti Airtel');
      const durationStr = item.duration ? (typeof item.duration === 'number' ? `${Math.floor(item.duration / 60)}m ${item.duration % 60}s` : String(item.duration)) : '2m 45s';
      const cellIdStr = item.cell_id || item.tower || item.tower_location || 'Cell LKO-1904 (Chandni Chowk)';

      const callerId = slugifyId(callerNumber, 'node-burner');
      const receiverId = slugifyId(receiverNumber, 'node-burner');

      registerNode({
        id: callerId,
        label: callerNumber,
        subLabel: `${carrierName} // Dummy KYC`,
        category: 'BURNER',
        riskScore: item.caller_risk || 82,
        status: 'ACTIVE',
        details: {
          telcoCarrier: carrierName,
          imei: item.imei || item.imei_a || `8649100${1000000 + idx}`,
          cellId: cellIdStr,
          lastSeen: item.timestamp || 'Active CDR Session',
        },
      });

      registerNode({
        id: receiverId,
        label: receiverNumber,
        subLabel: item.b_label || 'Airtel Roaming Burner',
        category: 'BURNER',
        riskScore: item.receiver_risk || 76,
        status: 'ACTIVE',
        details: {
          telcoCarrier: item.b_carrier || 'Bharti Airtel',
          imei: item.imei_b || `3548911${2000000 + idx}`,
          cellId: cellIdStr,
          lastSeen: item.timestamp || 'CDR Session Link',
        },
      });

      registerEdge({
        id: `edge-cdr-${idx}-${callerId}-${receiverId}`,
        source: callerId,
        target: receiverId,
        label: `CDR Call (${durationStr})`,
        weight: 6,
        type: 'COMMS',
      });

      // If primary target exists, link the caller burner to target
      if (primaryTargetNodeId && callerId !== primaryTargetNodeId) {
        registerEdge({
          id: `edge-target-burner-${callerId}`,
          source: primaryTargetNodeId,
          target: callerId,
          label: 'Attributed Burner Device',
          weight: 8,
          type: 'ASSOCIATE',
        });
      }
    });
  }

  // 4. Also check for standard `nodes` and `links` or `edges` inside the JSON
  if (Array.isArray(json.nodes)) {
    json.nodes.forEach((n: any) => {
      if (!n || !n.id) return;
      registerNode({
        id: n.id,
        label: n.label || n.name || n.id,
        subLabel: n.subLabel || n.role || n.description || `${n.category || 'ENTITY'}`,
        category: (n.category as EntityCategory) || 'PERSON',
        riskScore: n.riskScore || n.risk || 75,
        isPrimaryTarget: Boolean(n.isPrimaryTarget),
        details: n.details || {},
      });
    });
  }

  if (Array.isArray(json.links) || Array.isArray(json.edges)) {
    const rawEdges = json.links || json.edges;
    rawEdges.forEach((e: any, idx: number) => {
      if (!e) return;
      registerEdge({
        id: e.id || `custom-edge-${idx}`,
        source: e.source?.id || e.source,
        target: e.target?.id || e.target,
        label: e.label || e.type || 'LINKED',
        weight: e.weight || 5,
        type: e.type || 'ASSOCIATE',
        highlighted: Boolean(e.highlighted),
      });
    });
  }

  const resultNodes = Array.from(nodesMap.values());
  const resultEdges = Array.from(edgesMap.values());

  const categories: Record<string, number> = {};
  resultNodes.forEach(n => {
    categories[n.category] = (categories[n.category] || 0) + 1;
  });

  return {
    nodes: resultNodes,
    edges: resultEdges,
    summary: {
      entityCount: resultNodes.length,
      relationCount: resultEdges.length,
      categories,
      financialVolume: json.total_financial_volume || json.flagged_liquidity,
      targetName: mainTargetName,
      operationName,
    },
  };
}
