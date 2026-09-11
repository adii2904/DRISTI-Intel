import React, { useState, useEffect, useRef } from 'react';
import { EntityCategory, NetworkNode, NetworkEdge, IngestFileItem } from '../types';
import { NETWORK_NODES, NETWORK_EDGES } from '../data/mockData';
import { filterNodesByFile, filterEdgesByFile } from '../utils/fileFocus';
import { DOSSIER_TARGETS } from '../data/dossierTargets';
import { parseIntelligenceJsonToGraph } from '../utils/intelGraphParser';

export interface NetworkExplorerViewProps {
  focusedFile?: IngestFileItem | null;
  onClearFileFocus?: () => void;
  onNavigateToDossier?: (targetId?: string) => void;
  customNodes?: NetworkNode[];
  customEdges?: NetworkEdge[];
  activeSourceName?: string | null;
  onUploadJsonFile?: (data: any, fileName: string) => void;
  onResetGraph?: () => void;
}

export const NetworkExplorerView: React.FC<NetworkExplorerViewProps> = ({
  focusedFile = null,
  onClearFileFocus,
  onNavigateToDossier,
  customNodes,
  customEdges,
  activeSourceName,
  onUploadJsonFile,
  onResetGraph
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sourceEntityId, setSourceEntityId] = useState<string>('');
  const [targetEntityId, setTargetEntityId] = useState<string>('');
  const [pathResult, setPathResult] = useState<{ pathNodes: string[]; edges: string[]; degrees: number } | null>(null);

  // File upload & Drag-and-drop state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Base dataset resolution: prioritize dynamic props over mockData
  const baseNodes = customNodes && customNodes.length > 0 ? customNodes : NETWORK_NODES;
  const baseEdges = customEdges && customEdges.length > 0 ? customEdges : NETWORK_EDGES;

  // Derive file-scoped nodes and edges (supports dynamic custom nodes & focused files)
  const scopedNodes = filterNodesByFile(baseNodes, focusedFile);
  const scopedNodeIdSet = new Set(scopedNodes.map(n => n.id));
  const scopedEdges = filterEdgesByFile(baseEdges, scopedNodeIdSet, focusedFile);

  // Intelligence category counts
  const financialCount = scopedNodes.filter(n =>
    ['ACCOUNT', 'UPI_HANDLE', 'SHELL_ORG'].includes(n.category) ||
    Boolean(n.details?.financialTotal || n.details?.bankName || n.details?.upiId)
  ).length;

  const transitCount = scopedNodes.filter(n =>
    n.category === 'LOCATION' ||
    Boolean(n.details?.tollPlaza || n.details?.vahanReg || n.details?.fastagId)
  ).length;

  const telecomCount = scopedNodes.filter(n =>
    n.category === 'BURNER' ||
    Boolean(n.details?.telcoCarrier || n.details?.imei || n.details?.cellId)
  ).length;

  const isDynamicActive = Boolean(
    activeSourceName ||
    (focusedFile && (focusedFile.customNodes || focusedFile.rawJson)) ||
    scopedNodes.some(n => n.id.startsWith('node-target') || n.id.startsWith('node-shell') || n.id.startsWith('node-loc'))
  );

  const getTargetForNode = (node: NetworkNode | null) => {
    if (!node) return null;
    return DOSSIER_TARGETS.find(t => 
      t.nodeId === node.id || 
      t.matchingNodeIds.includes(node.id) ||
      node.label.toLowerCase().includes(t.name.toLowerCase().split(' ')[0]) ||
      t.name.toLowerCase().includes(node.label.toLowerCase().split(' ')[0])
    ) || null;
  };

  // Keep selection synchronized if selected node is not in scoped set
  useEffect(() => {
    if (scopedNodes.length > 0) {
      if (!selectedNodeId || !scopedNodeIdSet.has(selectedNodeId)) {
        const primary = scopedNodes.find(n => n.isPrimaryTarget) || scopedNodes[0];
        setSelectedNodeId(primary.id);
      }
      if (!scopedNodeIdSet.has(sourceEntityId)) {
        setSourceEntityId(scopedNodes[0].id);
      }
      if (!scopedNodeIdSet.has(targetEntityId)) {
        setTargetEntityId(scopedNodes[Math.min(1, scopedNodes.length - 1)].id);
      }
    }
  }, [scopedNodes.length, focusedFile?.id, activeSourceName]);

  const selectedNode = scopedNodes.find(n => n.id === selectedNodeId) || scopedNodes[0];

  const filteredNodes = scopedNodes.filter(n => {
    const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;
    const matchesQuery = n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (n.subLabel || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleJsonFileInput = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const graph = parseIntelligenceJsonToGraph(parsed);
      if (graph.nodes.length === 0) {
        showToast('JSON file did not contain identifiable intelligence records.');
        return;
      }
      if (onUploadJsonFile) {
        onUploadJsonFile(parsed, file.name);
      }
      showToast(`Ingested ${file.name}: Dynamically mapped ${graph.nodes.length} nodes and ${graph.edges.length} links!`);
    } catch (err) {
      showToast('Failed to parse JSON file. Please ensure valid JSON structure.');
    }
  };

  const handleDropJson = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.json') || file.type.includes('json')) {
        handleJsonFileInput(file);
      } else {
        showToast('Please drop a valid .json intelligence file.');
      }
    }
  };

  const computeShortestPath = () => {
    if (sourceEntityId === targetEntityId) {
      setPathResult({ pathNodes: [sourceEntityId], edges: [], degrees: 0 });
      return;
    }

    const queue: { current: string; path: string[]; edgePath: string[] }[] = [
      { current: sourceEntityId, path: [sourceEntityId], edgePath: [] }
    ];
    const visited = new Set<string>([sourceEntityId]);

    while (queue.length > 0) {
      const { current, path, edgePath } = queue.shift()!;
      if (current === targetEntityId) {
        setPathResult({
          pathNodes: path,
          edges: edgePath,
          degrees: path.length - 1
        });
        return;
      }

      const connectedEdges = scopedEdges.filter(e => e.source === current || e.target === current);
      for (const edge of connectedEdges) {
        const neighbor = edge.source === current ? edge.target : edge.source;
        const edgeId = edge.id;

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({
            current: neighbor,
            path: [...path, neighbor],
            edgePath: [...edgePath, edgeId]
          });
        }
      }
    }

    setPathResult(null);
  };

  const getCategoryColor = (cat: EntityCategory) => {
    switch (cat) {
      case 'PERSON': return '#f87171';
      case 'BURNER': return '#ff9933';
      case 'SHELL_ORG': return '#fbbf24';
      case 'LOCATION': return '#34d399';
      case 'ACCOUNT': return '#38bdf8';
      case 'UPI_HANDLE': return '#a78bfa';
      default: return '#ff9933';
    }
  };

  const isHighlightedNode = (id: string) => {
    if (pathResult && pathResult.pathNodes.includes(id)) return true;
    return id === selectedNodeId;
  };

  const isHighlightedEdge = (edgeId: string) => {
    if (pathResult && pathResult.edges.includes(edgeId)) return true;
    return false;
  };

  return (
    <div className="space-y-5">
      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0e1938] border border-[#ff9933] text-[#f8fafc] px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,153,51,0.3)] font-mono text-xs flex items-center space-x-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[#ff9933] text-sm">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Active File Focus Notification Banner */}
      {focusedFile && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#14234b] border border-[#ff9933]/60 rounded-xl text-xs font-mono shadow-[0_0_15px_rgba(255,153,51,0.15)] animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <span className="material-symbols-outlined text-lg text-[#ff9933]">filter_alt</span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[#ff9933] font-bold">ACTIVE FILE FOCUS:</span>
                <span className="text-[#f8fafc] font-semibold">{focusedFile.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ff9933]/20 text-[#ffb366] border border-[#ff9933]/40">
                  {focusedFile.sourceCategory}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Displaying only {filteredNodes.length} entities and {scopedEdges.length} correlations correlated with this ingested package.
              </p>
            </div>
          </div>
          {onClearFileFocus && (
            <button
              onClick={onClearFileFocus}
              className="px-3 py-1.5 rounded-lg bg-[#0e1938] hover:bg-[#1a2e63] text-[#f8fafc] hover:text-[#ff9933] border border-[#1e305e] transition-all text-xs font-bold shrink-0 cursor-pointer"
            >
              SHOW ALL INGESTED FILES
            </button>
          )}
        </div>
      )}

      {/* Dynamic Intelligence HUD Bar */}
      <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isDynamicActive 
          ? 'bg-[#0f2347] border-[#38bdf8]/60 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
          : 'bg-[#0e1938] border-[#1e305e]'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full shrink-0 animate-pulse ${
            isDynamicActive ? 'bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]' : 'bg-[#22c55e]'
          }`} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#f8fafc]">
                {activeSourceName ? `DYNAMIC INTEL: ${activeSourceName}` : isDynamicActive ? 'DYNAMIC INTELLIGENCE GRAPH ACTIVE' : 'TOPOLOGY STATUS: SIMULATED BASELINE'}
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${
                isDynamicActive
                  ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40'
                  : 'bg-[#14234b] text-[#94a3b8] border-[#1e305e]'
              }`}>
                {isDynamicActive ? 'LIVE MAPPED' : 'SIMULATED'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1 text-[11px] text-[#cbd5e1]">
              <span className="flex items-center space-x-1 text-[#38bdf8]">
                <span>💳</span>
                <span>Financial: <strong className="text-white">{financialCount}</strong></span>
              </span>
              <span className="text-[#475569]">•</span>
              <span className="flex items-center space-x-1 text-[#34d399]">
                <span>🚗</span>
                <span>Transit: <strong className="text-white">{transitCount}</strong></span>
              </span>
              <span className="text-[#475569]">•</span>
              <span className="flex items-center space-x-1 text-[#ff9933]">
                <span>📡</span>
                <span>Telecom CDR: <strong className="text-white">{telecomCount}</strong></span>
              </span>
              <span className="text-[#475569]">•</span>
              <span className="text-[#94a3b8]">
                Correlations: <strong className="text-[#f8fafc]">{scopedEdges.length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleJsonFileInput(e.target.files[0]);
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-[#38bdf8]/15 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-[#070d1e] border border-[#38bdf8]/40 transition-all font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
            title="Upload any intelligence JSON containing financial, transit, or telecom records"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <span>UPLOAD INTEL JSON</span>
          </button>
          {isDynamicActive && (
            <button
              onClick={() => {
                onResetGraph?.();
                showToast('Reset to default graph topology.');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#070d1e] hover:bg-[#14234b] text-[#94a3b8] hover:text-[#f87171] border border-[#1e305e] transition-all text-xs font-bold cursor-pointer"
              title="Reset graph to default simulated dataset"
            >
              RESET GRAPH
            </button>
          )}
        </div>
      </div>

      {/* 1. Unified Clean Header Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ff9933] uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">hub</span>
            <span>NETWORK GRAPH // LINK ANALYSIS &amp; RELATIONSHIP MAPPING</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] font-['Space_Grotesk',sans-serif] tracking-wide">
            Network Graph &amp; Entity Correlation
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5 max-w-2xl">
            Interactive link analysis mapping Hawala cash couriers, UPI transaction nodes, burner SIM cards, and shell enterprises.
          </p>
        </div>

        {/* Shortest Path Routing Tool in Header */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-lg bg-[#070d1e] border border-[#ff9933]/40 font-mono text-xs shadow-sm shrink-0">
          <span className="text-[#ff9933] font-bold flex items-center space-x-1 pl-1 text-[11px]">
            <span className="material-symbols-outlined text-sm">alt_route</span>
            <span>SHORTEST PATH:</span>
          </span>
          <select
            value={sourceEntityId}
            onChange={(e) => setSourceEntityId(e.target.value)}
            className="bg-[#0e1938] text-[#f8fafc] border border-[#1e305e] px-2 py-1 rounded text-xs focus:outline-none focus:border-[#ff9933]"
          >
            {scopedNodes.map(n => (
              <option key={n.id} value={n.id}>Origin: {n.label}</option>
            ))}
          </select>
          <span className="text-[#64748b]">➔</span>
          <select
            value={targetEntityId}
            onChange={(e) => setTargetEntityId(e.target.value)}
            className="bg-[#0e1938] text-[#f8fafc] border border-[#1e305e] px-2 py-1 rounded text-xs focus:outline-none focus:border-[#ff9933]"
          >
            {scopedNodes.map(n => (
              <option key={n.id} value={n.id}>Dest: {n.label}</option>
            ))}
          </select>
          <button
            onClick={computeShortestPath}
            className="px-2.5 py-1 rounded bg-[#ff9933] text-[#070d1e] font-bold hover:bg-[#ffb366] transition-colors cursor-pointer text-xs"
          >
            TRACE HOPS
          </button>
          {pathResult && (
            <span className="text-[#22c55e] font-bold px-2 py-0.5 rounded bg-[#138808]/20 border border-[#138808]/40 text-[11px]">
              {pathResult.degrees} {pathResult.degrees === 1 ? 'Hop' : 'Hops'} Link
            </span>
          )}
        </div>
      </div>

      {/* 2. Standardized Single-Row Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Entity Nodes</span>
            <span className="material-symbols-outlined text-base text-[#ff9933]">scatter_plot</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#f8fafc]">{scopedNodes.length}</div>
          </div>
          <div className="text-[10px] text-[#94a3b8]">
            {filteredNodes.length} Visible in View
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Correlations</span>
            <span className="material-symbols-outlined text-base text-[#4edea3]">timeline</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#4edea3]">{scopedEdges.length}</div>
          </div>
          <div className="text-[10px] text-[#22c55e]">
            Transactions &amp; Co-locations
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Graph Density</span>
            <span className="material-symbols-outlined text-base text-[#ffb366]">hub</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#ffb366]">96.4%</div>
          </div>
          <div className="text-[10px] text-[#94a3b8]">
            CCTNS + FIU Mesh
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Selected Node</span>
            <span className="material-symbols-outlined text-base text-[#38bdf8]">adjust</span>
          </div>
          <div className="my-2">
            <div className="text-base font-bold text-[#38bdf8] truncate">{selectedNode?.label || 'None'}</div>
          </div>
          <div className="text-[10px] text-[#38bdf8]">
            {selectedNode?.id} ({selectedNode?.category})
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-2.5 bg-[#0e1938] border border-[#1e305e] rounded-xl p-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['ALL', 'PERSON', 'BURNER', 'SHELL_ORG', 'LOCATION', 'ACCOUNT'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933] font-semibold'
                    : 'bg-[#14234b] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e305e]'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search entity node / UPI / IMEI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#070d1e] text-xs font-mono text-[#f8fafc] pl-8 pr-3 py-1 rounded-lg border border-[#1e305e] focus:outline-none focus:border-[#ff9933] w-full md:w-64"
            />
            <span className="material-symbols-outlined text-sm text-[#94a3b8] absolute left-2.5 top-1.5">
              search
            </span>
          </div>
        </div>

        {/* Syndicate Targets Quick-Jump Bar */}
        <div className="flex items-center space-x-2 pt-2 border-t border-[#1e305e]/70 overflow-x-auto scrollbar-none font-mono text-xs">
          <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider shrink-0 flex items-center space-x-1">
            <span className="material-symbols-outlined text-xs text-[#ff9933]">manage_accounts</span>
            <span>Syndicate Targets:</span>
          </span>
          <div className="flex items-center space-x-1.5">
            {DOSSIER_TARGETS.map(t => {
              const isTargetActive = selectedNode?.id === t.nodeId || selectedNode?.id === t.matchingNodeIds[0];
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedNodeId(t.nodeId);
                    onNavigateToDossier?.(t.id);
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap border ${
                    isTargetActive
                      ? 'bg-[#ff9933] text-[#070d1e] font-bold border-[#ff9933]'
                      : 'bg-[#070d1e] text-[#cbd5e1] hover:text-[#ff9933] border-[#1e305e] hover:border-[#ff9933]/50'
                  }`}
                  title={`Inspect ${t.name} in Suspect Dossier`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isTargetActive ? 'bg-[#070d1e]' : 'bg-[#ff9933]'}`}></span>
                  <span>{t.name.split(' ')[0]} {t.name.includes('"') ? t.name.split('"')[1] : ''}</span>
                  <span className={`text-[9px] px-1 rounded ${isTargetActive ? 'bg-black/20 text-[#070d1e]' : 'bg-[#ff9933]/20 text-[#ff9933]'}`}>
                    {t.threatScore}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Interactive SVG Graph Canvas with Drag & Drop */}
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDropJson}
          className={`xl:col-span-3 bg-[#070d1e] border rounded-xl relative overflow-hidden h-[560px] shadow-sm flex flex-col justify-between p-4 transition-all ${
            isDraggingOver ? 'border-[#ff9933] ring-2 ring-[#ff9933]/50' : 'border-[#1e305e]'
          }`}
        >
          {/* Drag & Drop Overlay */}
          {isDraggingOver && (
            <div className="absolute inset-0 z-40 bg-[#070d1e]/95 border-2 border-dashed border-[#ff9933] rounded-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn pointer-events-none">
              <span className="material-symbols-outlined text-5xl text-[#ff9933] mb-3 animate-bounce">
                upload_file
              </span>
              <h3 className="text-base font-bold text-[#f8fafc] font-sans">
                DROP INTELLIGENCE JSON HERE
              </h3>
              <p className="text-xs text-[#94a3b8] font-mono mt-1 max-w-md">
                Automatically extracts financial_intelligence, transit_intelligence, and telecom_cdr into active graph nodes and relationships.
              </p>
            </div>
          )}

          {/* Canvas HUD overlays */}
          <div className="flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#22c55e] bg-[#0e1938]/90 px-2.5 py-1 rounded border border-[#1e305e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse"></span>
              <span>{isDynamicActive ? 'DYNAMIC INTELLIGENCE MESH' : 'CCTNS-FIU CORRELATED TOPOLOGY'}</span>
            </div>
            <div className="text-[10px] font-mono text-[#94a3b8] bg-[#0e1938]/90 px-2.5 py-1 rounded border border-[#1e305e]">
              ENTITIES: {filteredNodes.length} // CORRELATIONS: {scopedEdges.length}
            </div>
          </div>

          {/* SVG Visual Graph Container */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 900 620">
              <defs>
                <filter id="glow-saffron" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff9933" />
                </marker>
              </defs>

              {/* Grid lines */}
              <g stroke="#1e305e" strokeWidth="0.5" opacity="0.3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`v-${i}`} x1={i * 80} y1="0" x2={i * 80} y2="620" />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 80} x2="900" y2={i * 80} />
                ))}
              </g>

              {/* Edges */}
              {scopedEdges.map(edge => {
                const sourceNode = scopedNodes.find(n => n.id === edge.source);
                const targetNode = scopedNodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isHl = isHighlightedEdge(edge.id);

                return (
                  <g key={edge.id} className="cursor-pointer">
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isHl ? '#ff9933' : '#1e305e'}
                      strokeWidth={isHl ? 3 : 1.5}
                      strokeDasharray={edge.type === 'COMMS' ? '4 2' : undefined}
                      opacity={isHl ? 1 : 0.6}
                    />
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 4}
                      fill={isHl ? '#ff9933' : '#64748b'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map(node => {
                const isSelected = isHighlightedNode(node.id);
                const color = getCategoryColor(node.category);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle
                        r="26"
                        fill="none"
                        stroke="#ff9933"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-spin-slow"
                        opacity="0.8"
                      />
                    )}

                    <circle
                      r="18"
                      fill="#070d1e"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                      filter={isSelected ? 'url(#glow-saffron)' : undefined}
                      className="transition-all"
                    />

                    <circle
                      r="7"
                      fill={color}
                      opacity={isSelected ? 1 : 0.7}
                    />

                    {/* Node Text Label */}
                    <text
                      y="32"
                      fill="#f8fafc"
                      fontSize="10"
                      fontFamily="'Space Grotesk', sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {node.label}
                    </text>
                    <text
                      y="44"
                      fill="#94a3b8"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {node.subLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Canvas Controls */}
          <div className="flex items-center justify-between z-10 pointer-events-auto">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#94a3b8]">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#f87171]"></span>
                <span>Person</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#ff9933]"></span>
                <span>Burner SIM</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24]"></span>
                <span>Shell Org</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
                <span>UPI / Bank</span>
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setPathResult(null);
              }}
              className="px-2.5 py-1 text-[10px] font-mono rounded bg-[#14234b] text-[#cbd5e1] hover:text-[#f8fafc] border border-[#1e305e] cursor-pointer"
            >
              RESET CANVAS
            </button>
          </div>
        </div>

        {/* Right: Entity Inspector Drawer */}
        <div className="xl:col-span-1 bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 shadow-sm font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e305e] pb-2.5">
            <div className="flex items-center space-x-2 text-xs text-[#ff9933] font-bold">
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>NODE DOSSIER</span>
            </div>
            <span className="text-[10px] text-[#22c55e] bg-[#138808]/20 px-2 py-0.5 rounded border border-[#138808]/40 font-bold">
              VERIFIED
            </span>
          </div>

          {selectedNode ? (
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[9px] text-[#94a3b8] uppercase block">Entity ID</span>
                <span className="text-[#38bdf8] font-bold text-sm block">{selectedNode.id}</span>
                <h4 className="text-base font-bold text-[#f8fafc] mt-0.5 font-sans">{selectedNode.label}</h4>
                <span className="text-[11px] text-[#ffb366]">{selectedNode.subLabel}</span>
              </div>

              <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e] space-y-1">
                <div className="text-[10px] text-[#94a3b8] uppercase">Intelligence Category</div>
                <div className="text-[#f8fafc] font-bold flex items-center space-x-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(selectedNode.category) }}
                  ></span>
                  <span>{selectedNode.category}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e] space-y-1">
                <div className="text-[10px] text-[#94a3b8] uppercase">Risk Metric &amp; Degree</div>
                <div className="flex justify-between items-center text-[#f8fafc]">
                  <span>Threat Score:</span>
                  <span className="text-[#ef4444] font-bold text-sm">{selectedNode.riskScore}/100</span>
                </div>
                <div className="flex justify-between items-center text-[#cbd5e1] text-[11px]">
                  <span>Direct Hops:</span>
                  <span className="text-[#ff9933] font-bold">
                    {scopedEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length} links
                  </span>
                </div>
              </div>

              {/* Dynamic Financial Intelligence Card */}
              {(selectedNode.details?.financialTotal || selectedNode.details?.bankName || selectedNode.details?.upiId || selectedNode.details?.pan) && (
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#38bdf8]/40 space-y-1.5 shadow-[0_0_10px_rgba(56,189,248,0.1)]">
                  <div className="text-[10px] text-[#38bdf8] font-bold uppercase flex items-center space-x-1">
                    <span className="material-symbols-outlined text-xs">payments</span>
                    <span>FINANCIAL INTELLIGENCE</span>
                  </div>
                  {selectedNode.details?.financialTotal && (
                    <div className="flex justify-between items-center text-[#f8fafc]">
                      <span className="text-[#94a3b8]">Volume Transacted:</span>
                      <span className="text-[#38bdf8] font-bold">{selectedNode.details.financialTotal}</span>
                    </div>
                  )}
                  {selectedNode.details?.bankName && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">Bank / Institution:</span>
                      <span className="font-medium text-right truncate max-w-[150px]">{selectedNode.details.bankName}</span>
                    </div>
                  )}
                  {selectedNode.details?.upiId && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">UPI VPA:</span>
                      <span className="text-[#a78bfa] font-mono">{selectedNode.details.upiId}</span>
                    </div>
                  )}
                  {selectedNode.details?.ifsc && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">IFSC:</span>
                      <span className="font-mono">{selectedNode.details.ifsc}</span>
                    </div>
                  )}
                  {selectedNode.details?.pan && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">Tax PAN:</span>
                      <span className="font-mono text-[#ff9933]">{selectedNode.details.pan}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Transit Intelligence Card */}
              {(selectedNode.details?.tollPlaza || selectedNode.details?.coordinates || selectedNode.details?.vahanReg || selectedNode.details?.fastagId) && (
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#34d399]/40 space-y-1.5 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                  <div className="text-[10px] text-[#34d399] font-bold uppercase flex items-center space-x-1">
                    <span className="material-symbols-outlined text-xs">local_shipping</span>
                    <span>TRANSIT INTELLIGENCE</span>
                  </div>
                  {selectedNode.details?.tollPlaza && (
                    <div className="text-[11px] text-[#f8fafc]">
                      <span className="text-[#94a3b8] block text-[9px] uppercase">Gantry / Plaza:</span>
                      <span className="font-medium">{selectedNode.details.tollPlaza}</span>
                    </div>
                  )}
                  {selectedNode.details?.vahanReg && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">VAHAN Reg:</span>
                      <span className="font-mono font-bold text-[#ffb366]">{selectedNode.details.vahanReg}</span>
                    </div>
                  )}
                  {selectedNode.details?.fastagId && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">FASTag ID:</span>
                      <span className="font-mono">{selectedNode.details.fastagId}</span>
                    </div>
                  )}
                  {selectedNode.details?.coordinates && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">GPS:</span>
                      <span className="font-mono text-[#34d399]">{selectedNode.details.coordinates}</span>
                    </div>
                  )}
                  {selectedNode.details?.lastSeen && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">Timestamp:</span>
                      <span className="font-mono">{selectedNode.details.lastSeen}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Telecom CDR Card */}
              {(selectedNode.details?.telcoCarrier || selectedNode.details?.imei || selectedNode.details?.cellId) && (
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#ff9933]/40 space-y-1.5 shadow-[0_0_10px_rgba(255,153,51,0.1)]">
                  <div className="text-[10px] text-[#ff9933] font-bold uppercase flex items-center space-x-1">
                    <span className="material-symbols-outlined text-xs">cell_tower</span>
                    <span>TELECOM CDR INTELLIGENCE</span>
                  </div>
                  {selectedNode.details?.telcoCarrier && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">Telco Operator:</span>
                      <span className="font-medium text-[#f8fafc]">{selectedNode.details.telcoCarrier}</span>
                    </div>
                  )}
                  {selectedNode.details?.imei && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">Handset IMEI:</span>
                      <span className="font-mono text-[#ffb366]">{selectedNode.details.imei}</span>
                    </div>
                  )}
                  {selectedNode.details?.cellId && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">Tower Cell ID:</span>
                      <span className="font-mono">{selectedNode.details.cellId}</span>
                    </div>
                  )}
                  {selectedNode.details?.lastSeen && (
                    <div className="flex justify-between items-center text-[11px] text-[#cbd5e1]">
                      <span className="text-[#94a3b8]">Last Session:</span>
                      <span className="font-mono text-[#f8fafc]">{selectedNode.details.lastSeen}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Raw JSON Payload Viewer (if available) */}
              {(selectedNode.rawPayload || selectedNode.details?.rawPayload) && (
                <details className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e] group">
                  <summary className="text-[10px] text-[#94a3b8] group-hover:text-[#ff9933] cursor-pointer flex items-center justify-between font-bold">
                    <span>RAW INTEL RECORD (JSON)</span>
                    <span className="material-symbols-outlined text-xs">expand_more</span>
                  </summary>
                  <pre className="mt-2 text-[9px] font-mono text-[#cbd5e1] overflow-x-auto max-h-36 bg-[#0e1938] p-2 rounded border border-[#1e305e]">
                    {JSON.stringify(selectedNode.rawPayload || selectedNode.details?.rawPayload, null, 2)}
                  </pre>
                </details>
              )}

              {/* Google Maps Live Geospatial Link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selectedNode.label + ' ' + (selectedNode.details?.jurisdiction || selectedNode.subLabel || '')
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-[#38bdf8]/15 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-[#070d1e] border border-[#38bdf8]/40 transition-all font-bold text-[11px] font-mono cursor-pointer"
                title="Search entity location on Google Maps"
              >
                <span className="material-symbols-outlined text-xs">pin_drop</span>
                <span>VERIFY ON GOOGLE MAPS</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>

              {/* Cross-Tab Auto-Navigation to Suspect Dossier */}
              {(() => {
                const targetMatch = getTargetForNode(selectedNode);
                if (!targetMatch) return null;
                return (
                  <div className="p-3 rounded-lg bg-[#14234b] border border-[#ff9933] space-y-2 shadow-[0_0_15px_rgba(255,153,51,0.25)] ring-1 ring-[#ff9933]/50 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#ff9933] font-bold uppercase tracking-wider flex items-center space-x-1">
                        <span className="material-symbols-outlined text-xs">manage_accounts</span>
                        <span>SYNDICATE TARGET MATCH</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 font-bold">
                        THREAT {targetMatch.threatScore}
                      </span>
                    </div>
                    <div className="text-xs text-[#f8fafc] font-bold font-sans">
                      {targetMatch.name}
                    </div>
                    <div className="text-[10px] text-[#94a3b8]">
                      Role: <span className="text-[#ffb366] font-semibold">{targetMatch.syndicateRole}</span>
                    </div>
                    <button
                      onClick={() => onNavigateToDossier?.(targetMatch.id)}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-[#ff9933] hover:bg-[#e68a00] text-[#070d1e] font-bold text-xs transition-all cursor-pointer shadow-md font-mono"
                    >
                      <span className="material-symbols-outlined text-sm">assignment_ind</span>
                      <span>AUTO-NAVIGATE TO DOSSIER ➔</span>
                    </button>
                  </div>
                );
              })()}

              <div>
                <span className="text-[10px] text-[#94a3b8] uppercase block mb-1.5">Correlated Edges</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {scopedEdges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(edge => {
                      const peerId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const peerNode = scopedNodes.find(n => n.id === peerId);
                      return (
                        <div
                          key={edge.id}
                          onClick={() => setSelectedNodeId(peerId)}
                          className="p-2 rounded bg-[#070d1e] hover:bg-[#14234b] border border-[#1e305e] cursor-pointer transition-colors text-[11px]"
                        >
                          <div className="flex justify-between text-[#ff9933]">
                            <span className="font-bold">{edge.label}</span>
                            <span className="text-[9px] text-[#94a3b8]">{edge.type}</span>
                          </div>
                          <div className="text-[#f8fafc] mt-0.5">{peerNode?.label}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-[#94a3b8] text-xs">
              Click any node in the SVG canvas to view entity dossier and direct connections.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
