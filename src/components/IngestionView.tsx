import React, { useState, useRef } from 'react';
import { IngestFileItem } from '../types';
import { INITIAL_INGEST_FILES } from '../data/mockData';
import { parseIntelligenceJsonToGraph } from '../utils/intelGraphParser';

export interface IngestionViewProps {
  files?: IngestFileItem[];
  setFiles?: React.Dispatch<React.SetStateAction<IngestFileItem[]>>;
  onAddFiles?: (newFiles: IngestFileItem[]) => void;
  onResetFiles?: () => void;
  onIngestJsonGraph?: (jsonData: any, fileName: string) => void;
}

export const IngestionView: React.FC<IngestionViewProps> = ({
  files: externalFiles,
  setFiles: externalSetFiles,
  onAddFiles,
  onResetFiles,
  onIngestJsonGraph
}) => {
  const [internalFiles, setInternalFiles] = useState<IngestFileItem[]>(INITIAL_INGEST_FILES);
  const files = externalFiles ?? internalFiles;
  const setFiles = externalSetFiles ?? setInternalFiles;

  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [selectedFileForModal, setSelectedFileForModal] = useState<IngestFileItem | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const detectSourceCategory = (
    fileName: string
  ): { category: IngestFileItem['sourceCategory']; agency: string; type: string } => {
    const lower = fileName.toLowerCase();

    if (
      lower.includes('cdr') ||
      lower.includes('tower') ||
      lower.includes('telco') ||
      lower.includes('sim') ||
      lower.includes('jio') ||
      lower.includes('airtel') ||
      lower.includes('telecom')
    ) {
      return {
        category: 'TELECOM',
        agency: 'Telecom Service Provider',
        type: 'Telco CDR & Baseband Dump'
      };
    }

    if (
      lower.includes('upi') ||
      lower.includes('fiu') ||
      lower.includes('bank') ||
      lower.includes('ledger') ||
      lower.includes('trans') ||
      lower.includes('hdfc') ||
      lower.includes('sbi') ||
      lower.includes('statement')
    ) {
      return {
        category: 'FINANCIAL',
        agency: 'FIU-IND / Banking Node',
        type: 'Financial & Structured Ledger'
      };
    }

    if (
      lower.includes('cctv') ||
      lower.includes('cam') ||
      lower.includes('gate') ||
      lower.includes('airport') ||
      lower.includes('video') ||
      lower.includes('face')
    ) {
      return {
        category: 'SURVEILLANCE',
        agency: 'Surveillance Grid / ANPR',
        type: 'Optical & Transit Stream'
      };
    }

    if (
      lower.includes('ufed') ||
      lower.includes('dump') ||
      lower.includes('cellebrite') ||
      lower.includes('phone') ||
      lower.includes('forensic') ||
      lower.includes('hw')
    ) {
      return {
        category: 'FORENSIC',
        agency: 'Digital Forensics Unit',
        type: 'Mobile UFED & Hardware Dump'
      };
    }

    if (lower.endsWith('.csv')) {
      return {
        category: 'FINANCIAL',
        agency: 'Tabular Data Stream',
        type: 'Structured CSV Data'
      };
    }

    if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
      return {
        category: 'FINANCIAL',
        agency: 'Accounts Repository',
        type: 'Spreadsheet Ledger'
      };
    }

    if (lower.endsWith('.json')) {
      return {
        category: 'GOV_INTEL',
        agency: 'Intelligence Data API',
        type: 'Structured JSON Records'
      };
    }

    if (lower.endsWith('.bin')) {
      return {
        category: 'FORENSIC',
        agency: 'Binary Acquisition',
        type: 'Raw Memory / Binary Dump'
      };
    }

    return {
      category: 'GOV_INTEL',
      agency: 'Operational Ingest Gateway',
      type: 'Text & Document Record'
    };
  };

  const processUploadedFiles = async (uploadedFiles: File[]) => {
    if (uploadedFiles.length === 0) return;

    const newItems: IngestFileItem[] = [];

    for (const file of uploadedFiles) {
      const { category, agency, type } = detectSourceCategory(file.name);
      const newId = `ING-IND-${Math.floor(10000 + Math.random() * 90000)}`;
      const isJson = file.name.toLowerCase().endsWith('.json') || file.type.includes('json');

      let rawJson: any = null;
      let customNodes = undefined;
      let customEdges = undefined;
      let extractedEntities = Math.max(4, Math.floor(Math.random() * 25) + 5);
      let extractedRelations = Math.max(10, Math.floor(Math.random() * 60) + 15);
      let isInstant = false;

      if (isJson) {
        try {
          const text = await file.text();
          rawJson = JSON.parse(text);
          const parsedGraph = parseIntelligenceJsonToGraph(rawJson);

          if (parsedGraph.nodes.length > 0) {
            customNodes = parsedGraph.nodes;
            customEdges = parsedGraph.edges;
            extractedEntities = parsedGraph.nodes.length;
            extractedRelations = parsedGraph.edges.length;
            isInstant = true;
            // Notify parent to dynamically activate this graph
            onIngestJsonGraph?.(rawJson, file.name);
          }
        } catch (err) {
          console.warn('Could not parse JSON as graph intelligence:', err);
        }
      }

      newItems.push({
        id: newId,
        name: file.name,
        type: isJson ? 'Structured Intelligence Package (JSON)' : type,
        size: formatFileSize(file.size),
        status: isInstant ? 'EXTRACTED' : 'PARSING',
        progress: isInstant ? 100 : 20,
        extractedEntities,
        extractedRelations,
        timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        sha256: '',
        sourceCategory: isJson ? 'GOV_INTEL' : category,
        sourceAgency: agency,
        rawJson,
        customNodes,
        customEdges,
      });
    }

    if (onAddFiles) {
      onAddFiles(newItems);
    } else {
      setFiles(prev => [...newItems, ...prev]);
    }

    const jsonItemWithGraph = newItems.find(i => i.customNodes && i.customNodes.length > 0);
    if (jsonItemWithGraph && jsonItemWithGraph.rawJson && onIngestJsonGraph) {
      onIngestJsonGraph(jsonItemWithGraph.rawJson, jsonItemWithGraph.name);
    }

    const hasJsonGraph = Boolean(jsonItemWithGraph);
    setUploadFeedback(
      hasJsonGraph
        ? `Successfully ingested JSON & dynamically mapped financial, transit, and telecom intelligence into the active Graph!`
        : `Added ${newItems.length} file(s) to operational ingestion pipeline.`
    );
    setTimeout(() => setUploadFeedback(null), 5000);

    // Animate progress for newly uploaded files that weren't instant
    newItems.forEach(item => {
      if (item.status === 'EXTRACTED') return;
      let currentProgress = 20;
      const interval = setInterval(() => {
        currentProgress += 25;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
        }
        setFiles(curr =>
          curr.map(f =>
            f.id === item.id
              ? {
                  ...f,
                  progress: currentProgress,
                  status: currentProgress === 100 ? 'EXTRACTED' : 'PARSING',
                  extractedEntities:
                    currentProgress === 100
                      ? item.extractedEntities
                      : Math.floor(item.extractedEntities * (currentProgress / 100)),
                  extractedRelations:
                    currentProgress === 100
                      ? item.extractedRelations
                      : Math.floor(item.extractedRelations * (currentProgress / 100))
                }
              : f
          )
        );
      }, 400);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset input to allow uploading the same file again
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const simulateNewIngest = () => {
    setIsSimulating(true);
    const newId = `ING-IND-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDump: IngestFileItem = {
      id: newId,
      name: 'Reliance_Jio_CDR_TowerDump_Gurugram_CyberHub_Cell501.csv',
      type: 'Telco CDR & Baseband Dump',
      size: '184.2 MB',
      status: 'PARSING',
      progress: 20,
      extractedEntities: 18,
      extractedRelations: 64,
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      sha256: '',
      sourceCategory: 'TELECOM',
      sourceAgency: 'Telecom Provider / Data Gateway'
    };

    if (onAddFiles) {
      onAddFiles([newDump]);
    } else {
      setFiles(prev => [newDump, ...prev]);
    }

    // Progressive update simulation
    let progress = 20;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsSimulating(false);
      }
      setFiles(currentFiles =>
        currentFiles.map(f =>
          f.id === newId
            ? {
                ...f,
                progress,
                status: progress === 100 ? 'EXTRACTED' : 'PARSING',
                extractedEntities: Math.floor(progress * 0.45),
                extractedRelations: Math.floor(progress * 1.8)
              }
            : f
        )
      );
    }, 500);
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  const filteredFiles =
    selectedFilter === 'ALL'
      ? files
      : files.filter(f => f.sourceCategory === selectedFilter);

  const totalEntities = files.reduce((acc, f) => acc + f.extractedEntities, 0);
  const totalRelations = files.reduce((acc, f) => acc + f.extractedRelations, 0);

  return (
    <div className="space-y-5">
      {/* Hidden File Input for Native File Browsing */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv,.xlsx,.xls,.json,.bin,.pdf,.txt,.tsv"
        onChange={handleFileInputChange}
        className="hidden"
        id="native-file-upload-input"
      />

      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ff9933] uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">cloud_sync</span>
            <span>DATA INGESTION // OPERATIONAL PIPELINE</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] font-['Space_Grotesk',sans-serif] tracking-wide">
            Data Ingestion &amp; Multi-Source Processing
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5 max-w-2xl">
            Multi-source file upload and automated intake across Telco CDRs, financial transaction ledgers, and device extractions.
          </p>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="btn-browse-files-header"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#ff9933] text-[#070d1e] hover:bg-[#ffb366] transition-all font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,153,51,0.25)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">folder_open</span>
            <span>BROWSE FILES</span>
          </button>
          <button
            id="btn-trigger-intake"
            disabled={isSimulating}
            onClick={simulateNewIngest}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#14234b] text-[#f8fafc] hover:bg-[#1a2e63] transition-all font-mono text-xs border border-[#1e305e] disabled:opacity-50 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-sm ${isSimulating ? 'animate-spin text-[#ff9933]' : 'text-[#ff9933]'}`}>
              {isSimulating ? 'refresh' : 'add_circle'}
            </span>
            <span>{isSimulating ? 'PARSING...' : 'SIMULATE INGEST'}</span>
          </button>
          {onResetFiles && (
            <button
              id="btn-reset-queue"
              onClick={onResetFiles}
              title="Reset queue to default sample files"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#14234b] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1a2e63] transition-all font-mono text-xs border border-[#1e305e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span className="hidden sm:inline">RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Feedback Toast */}
      {uploadFeedback && (
        <div className="p-3 bg-[#138808]/20 border border-[#138808]/40 rounded-xl text-xs font-mono text-[#4edea3] flex items-center space-x-2 animate-fadeIn">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* 2. Standardized Operational Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8] uppercase">
            <span>Volume Ingested</span>
            <span className="material-symbols-outlined text-base text-[#ff9933]">storage</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#f8fafc]">
              21.8 <span className="text-xs font-normal text-[#94a3b8]">GB</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#22c55e] flex items-center space-x-1">
            <span className="material-symbols-outlined text-xs">arrow_upward</span>
            <span>+3.2 GB in last 2h</span>
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8] uppercase">
            <span>Extracted Entities</span>
            <span className="material-symbols-outlined text-base text-[#4edea3]">group_work</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#4edea3]">{totalEntities}</div>
          </div>
          <div className="text-[10px] font-mono text-[#94a3b8]">
            Structured records identified
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8] uppercase">
            <span>Discovered Links</span>
            <span className="material-symbols-outlined text-base text-[#ffb366]">schema</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-[#ffb366]">{totalRelations}</div>
          </div>
          <div className="text-[10px] font-mono text-[#94a3b8]">
            Correlated entity &amp; transaction links
          </div>
        </div>
      </div>

      {/* 3. Operational Dropzone with Full Native File Browser & Drag-and-Drop */}
      <div
        id="dropzone-area"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#ff9933] bg-[#ff9933]/15 scale-[1.005]'
            : 'border-[#ff9933]/50 hover:border-[#ff9933] bg-[#0e1938]/50 hover:bg-[#0e1938]/80'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3 max-w-xl mx-auto">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
              isDragging
                ? 'bg-[#ff9933] text-[#070d1e] border-[#ff9933]'
                : 'bg-[#ff9933]/15 border-[#ff9933]/40 text-[#ff9933]'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {isDragging ? 'download' : 'cloud_upload'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm sm:text-base font-semibold text-[#f8fafc]">
              {isDragging
                ? 'Drop data files here to ingest into pipeline'
                : 'Click anywhere to browse data files or drag & drop them here'}
            </div>
            <p className="text-xs text-[#94a3b8]">
              Supports Telco CDRs, financial transaction ledgers, UFED mobile extractions, and intelligence files
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-lg bg-[#ff9933] hover:bg-[#ffb366] text-[#070d1e] font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(255,153,51,0.25)] cursor-pointer flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-sm">folder_open</span>
              <span>Browse Local Files</span>
            </button>
            <span className="text-[11px] font-mono text-[#94a3b8]">
              Supported: .csv, .xlsx, .json, .bin, .pdf, .txt
            </span>
          </div>
        </div>
      </div>

      {/* 4. Multi-Source Ingestion Queue & Table with Expandable Detail Rows */}
      <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#1e305e]">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#ff9933] text-base">tune</span>
            <h3 className="text-xs font-bold font-mono text-[#f8fafc] uppercase tracking-wider">
              Ingestion Queue ({filteredFiles.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['ALL', 'FORENSIC', 'FINANCIAL', 'SURVEILLANCE', 'TELECOM', 'GOV_INTEL'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFilter === cat
                    ? 'bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933]/60 font-semibold'
                    : 'bg-[#14234b] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e305e]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-[#94a3b8] border-b border-[#1e305e] bg-[#070d1e]/50 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-4 w-28">Status</th>
                <th className="py-2.5 px-4">Source Package</th>
                <th className="py-2.5 px-4">Agency / Type</th>
                <th className="py-2.5 px-4">Size</th>
                <th className="py-2.5 px-4">Entities / Links</th>
                <th className="py-2.5 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e305e]/50">
              {filteredFiles.map(file => {
                const isExpanded = expandedRowId === file.id;
                return (
                  <React.Fragment key={file.id}>
                    <tr
                      onClick={() => toggleRowExpand(file.id)}
                      className={`hover:bg-[#14234b]/50 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[#14234b]/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        {file.status === 'EXTRACTED' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-[#138808]/20 text-[#4edea3] border border-[#138808]/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                            <span>EXTRACTED</span>
                          </span>
                        )}
                        {file.status === 'PARSING' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933]/40 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9933]"></span>
                            <span>{file.progress}%</span>
                          </span>
                        )}
                        {file.status === 'QUEUED' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-[#94a3b8]/20 text-[#cbd5e1] border border-[#94a3b8]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]"></span>
                            <span>QUEUED</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#f8fafc] max-w-sm truncate">{file.name}</div>
                        <div className="text-[10px] text-[#94a3b8] flex items-center space-x-2 mt-0.5">
                          <span>{file.id}</span>
                          <span>•</span>
                          <span>{file.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[#cbd5e1]">{file.sourceAgency || 'Data Provider'}</div>
                        <div className="text-[10px] text-[#94a3b8]">{file.type}</div>
                      </td>
                      <td className="py-3 px-4 text-[#94a3b8]">{file.size}</td>
                      <td className="py-3 px-4">
                        <span className="text-[#4edea3] font-semibold">{file.extractedEntities} Ent</span>
                        <span className="text-[#64748b] mx-1">/</span>
                        <span className="text-[#ffb366]">{file.extractedRelations} Rel</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFileForModal(file);
                            }}
                            className="px-2 py-1 text-[10px] rounded bg-[#14234b] hover:bg-[#1a2e63] text-[#f8fafc] border border-[#1e305e] transition-colors cursor-pointer"
                          >
                            Inspect
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
                            <div>
                              <span className="text-[#94a3b8] uppercase text-[10px] block">Pipeline Identifier</span>
                              <span className="text-[#f8fafc] font-bold block mt-0.5">
                                {file.id}
                              </span>
                              <div className="text-[10px] text-[#94a3b8] mt-1">
                                Ingested: <span className="text-[#cbd5e1]">{file.timestamp}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-[#94a3b8] uppercase text-[10px] block">Extraction Results</span>
                              <div className="text-[#f8fafc] flex items-center space-x-2 mt-0.5">
                                <span className="text-[#4edea3] font-bold">{file.extractedEntities} Entities</span>
                                <span className="text-[#64748b]">•</span>
                                <span className="text-[#ffb366] font-bold">{file.extractedRelations} Relationships</span>
                              </div>
                              <div className="text-[10px] text-[#94a3b8] mt-1">
                                Status: <span className="text-[#38bdf8] font-semibold">{file.status}</span> ({file.progress}%)
                              </div>
                            </div>
                            <div>
                              <span className="text-[#94a3b8] uppercase text-[10px] block">Source Stream Metadata</span>
                              <div className="text-[#f8fafc] mt-0.5">
                                Category: <span className="text-[#ff9933]">{file.sourceCategory}</span>
                              </div>
                              <div className="text-[10px] text-[#94a3b8] mt-1">
                                Provider: <span className="text-[#cbd5e1]">{file.sourceAgency || 'Data Provider'}</span>
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

      {/* Inspect Modal */}
      {selectedFileForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0e1938] border border-[#ff9933]/50 rounded-2xl max-w-xl w-full p-5 shadow-2xl relative font-mono">
            <button
              onClick={() => setSelectedFileForModal(null)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center space-x-2 text-xs text-[#ff9933] font-bold mb-1">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>INGESTION FILE DETAILS</span>
            </div>
            <h3 className="text-base font-bold text-[#f8fafc] truncate">{selectedFileForModal.name}</h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e]">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Ingestion ID</span>
                  <span className="text-[#f8fafc] font-bold mt-0.5 block">{selectedFileForModal.id}</span>
                </div>
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e]">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">File Size</span>
                  <span className="text-[#f8fafc] font-bold mt-0.5 block">{selectedFileForModal.size}</span>
                </div>
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e]">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Source Agency / Provider</span>
                  <span className="text-[#f8fafc] font-bold mt-0.5 block">{selectedFileForModal.sourceAgency || 'Data Provider'}</span>
                </div>
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e]">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Capture Timestamp</span>
                  <span className="text-[#f8fafc] font-bold mt-0.5 block">{selectedFileForModal.timestamp}</span>
                </div>
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e]">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Format &amp; Type</span>
                  <span className="text-[#cbd5e1] mt-0.5 block">{selectedFileForModal.type}</span>
                </div>
                <div className="p-2.5 rounded bg-[#070d1e] border border-[#1e305e]">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Category</span>
                  <span className="text-[#ff9933] font-bold mt-0.5 block">{selectedFileForModal.sourceCategory}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#070d1e] border border-[#1e305e] space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#94a3b8] uppercase text-[10px]">Processing Pipeline Status</span>
                  <span className="text-[#22c55e] font-bold">{selectedFileForModal.status} ({selectedFileForModal.progress}%)</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] pt-1 border-t border-[#1e305e]/50">
                  <div>Extracted Entities: <span className="text-[#4edea3] font-bold">{selectedFileForModal.extractedEntities}</span></div>
                  <span className="text-[#64748b]">|</span>
                  <div>Discovered Links: <span className="text-[#ffb366] font-bold">{selectedFileForModal.extractedRelations}</span></div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedFileForModal(null)}
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
