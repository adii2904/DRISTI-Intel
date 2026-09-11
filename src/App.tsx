import React, { useState, useEffect } from 'react';
import { IngestFileItem, NavModule, AuthUser, NetworkNode, NetworkEdge } from './types';
import { INITIAL_INGEST_FILES, NETWORK_NODES, NETWORK_EDGES } from './data/mockData';
import { parseIntelligenceJsonToGraph } from './utils/intelGraphParser';
import { getStoredAuth, setStoredAuth } from './data/officers';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { IngestionView } from './components/IngestionView';
import { NetworkExplorerView } from './components/NetworkExplorerView';
import { DossierView } from './components/DossierView';
import { AnomaliesView } from './components/AnomaliesView';
import { TimelineView } from './components/TimelineView';
import { CopilotView } from './components/CopilotView';
import { VaultView } from './components/VaultView';

const INGESTION_STORAGE_KEY = 'crimson_eye_ingestion_queue';

function getInitialIngestionQueue(): IngestFileItem[] {
  try {
    const saved = localStorage.getItem(INGESTION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load saved ingestion files:', err);
  }
  return INITIAL_INGEST_FILES;
}

function AppContent() {
  // Authentication & Officer Terminal Session State (shows login page initially for user verification)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    // If explicit session exists in sessionStorage, can restore, or start fresh
    return null;
  });

  const [activeModule, setActiveModule] = useState<NavModule>('ingestion');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const { isDark } = useTheme();

  // Lifted Ingestion Queue State that persists across navigation tab switches
  const [ingestionFiles, setIngestionFiles] = useState<IngestFileItem[]>(() => getInitialIngestionQueue());

  // Global Active Case / File Focus state ('ALL' or file.id)
  const [selectedFileFocusId, setSelectedFileFocusId] = useState<string>('ALL');

  // Active dynamic graph nodes and edges state (initially NETWORK_NODES & NETWORK_EDGES, or dynamically populated from uploaded JSON)
  const [activeGraphNodes, setActiveGraphNodes] = useState<NetworkNode[]>(NETWORK_NODES);
  const [activeGraphEdges, setActiveGraphEdges] = useState<NetworkEdge[]>(NETWORK_EDGES);
  const [activeGraphSource, setActiveGraphSource] = useState<string | null>(null);

  const handleIngestJsonGraph = (jsonData: any, fileName: string = 'Operation_Rapid_Velocity.json') => {
    const parsed = parseIntelligenceJsonToGraph(jsonData);
    if (parsed.nodes.length > 0) {
      setActiveGraphNodes(parsed.nodes);
      setActiveGraphEdges(parsed.edges);
      setActiveGraphSource(fileName);

      const newFileId = `ING-RV-${Math.floor(10000 + Math.random() * 90000)}`;
      const newFileItem: IngestFileItem = {
        id: newFileId,
        name: fileName,
        type: 'Structured Intelligence Package (JSON)',
        size: '1.4 MB',
        status: 'EXTRACTED',
        progress: 100,
        extractedEntities: parsed.nodes.length,
        extractedRelations: parsed.edges.length,
        timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        sha256: '9f8e4c7b2a1d0f5e8a3b6c9d2e1f4a7b0c3d6e9f2a5b8c1d4e7f09f8e4c7b2a1',
        sourceCategory: 'GOV_INTEL',
        agency: 'Special Cell / Intelligence Analysis Grid',
        rawJson: jsonData,
        customNodes: parsed.nodes,
        customEdges: parsed.edges,
      };

      setIngestionFiles(prev => [newFileItem, ...prev.filter(f => f.name !== fileName)]);
      setSelectedFileFocusId(newFileId);
    }
  };

  const handleResetGraph = () => {
    setActiveGraphNodes(NETWORK_NODES);
    setActiveGraphEdges(NETWORK_EDGES);
    setActiveGraphSource(null);
    setSelectedFileFocusId('ALL');
  };

  // Multi-Suspect Dossier Target State with cross-tab synchronisation
  const [selectedDossierTargetId, setSelectedDossierTargetId] = useState<string>('target-singhania');

  // Cross-tab auto-navigation handler from Network Graph and Activity Timeline to Suspect Dossier
  const handleNavigateToDossier = (targetId?: string) => {
    if (targetId) {
      setSelectedDossierTargetId(targetId);
    }
    setActiveModule('dossier');
  };

  // Derive active focused file package
  const focusedFile = selectedFileFocusId === 'ALL'
    ? null
    : (ingestionFiles.find(f => f.id === selectedFileFocusId) || null);

  // Keep localStorage in sync with the ingestion queue
  useEffect(() => {
    try {
      localStorage.setItem(INGESTION_STORAGE_KEY, JSON.stringify(ingestionFiles));
    } catch (err) {
      console.error('Failed to sync ingestion files to localStorage:', err);
    }
  }, [ingestionFiles]);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setStoredAuth(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStoredAuth(null);
  };

  const handleAddIngestionFiles = (newFiles: IngestFileItem[]) => {
    setIngestionFiles(prev => [...newFiles, ...prev]);
  };

  const handleResetIngestionFiles = () => {
    setIngestionFiles(INITIAL_INGEST_FILES);
    setSelectedFileFocusId('ALL');
    setActiveGraphNodes(NETWORK_NODES);
    setActiveGraphEdges(NETWORK_EDGES);
    setActiveGraphSource(null);
    try {
      localStorage.setItem(INGESTION_STORAGE_KEY, JSON.stringify(INITIAL_INGEST_FILES));
    } catch (err) {
      console.error('Failed to reset ingestion files in localStorage:', err);
    }
  };

  const handleToggleSidebar = () => {
    // On small screens, toggle mobile drawer; on large screens, collapse/expand
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  };

  // If no officer is authenticated, render the dedicated Login View
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-200 selection:bg-[#ff9933]/30 ${
      isDark ? 'bg-[#070d1e] text-[#e2e8f0]' : 'bg-[#f1f5f9] text-[#0f172a]'
    }`}>
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-18' : 'lg:pl-64'
      }`}>
        {/* Clean, Minimal Top Header with Global Active Case / File Focus Selector and Officer Badge */}
        <Header
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          ingestionFiles={ingestionFiles}
          selectedFileFocus={selectedFileFocusId}
          onSelectFileFocus={setSelectedFileFocusId}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main Content Workspace View Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6">
          {activeModule === 'ingestion' && (
            <IngestionView
              files={ingestionFiles}
              setFiles={setIngestionFiles}
              onAddFiles={handleAddIngestionFiles}
              onResetFiles={handleResetIngestionFiles}
              onIngestJsonGraph={handleIngestJsonGraph}
            />
          )}
          {activeModule === 'network' && (
            <NetworkExplorerView
              focusedFile={focusedFile}
              onClearFileFocus={() => setSelectedFileFocusId('ALL')}
              onNavigateToDossier={handleNavigateToDossier}
              customNodes={activeGraphNodes}
              customEdges={activeGraphEdges}
              activeSourceName={activeGraphSource}
              onUploadJsonFile={handleIngestJsonGraph}
              onResetGraph={handleResetGraph}
            />
          )}
          {activeModule === 'dossier' && (
            <DossierView
              focusedFile={focusedFile}
              onClearFileFocus={() => setSelectedFileFocusId('ALL')}
              selectedTargetId={selectedDossierTargetId}
              onSelectTarget={setSelectedDossierTargetId}
            />
          )}
          {activeModule === 'anomalies' && <AnomaliesView />}
          {activeModule === 'timeline' && (
            <TimelineView
              focusedFile={focusedFile}
              onClearFileFocus={() => setSelectedFileFocusId('ALL')}
              onNavigateToDossier={handleNavigateToDossier}
            />
          )}
          {activeModule === 'copilot' && (
            <CopilotView
              focusedFile={focusedFile}
              onClearFileFocus={() => setSelectedFileFocusId('ALL')}
            />
          )}
          {activeModule === 'vault' && <VaultView />}
        </main>

        {/* Persistent Tactical HUD Footer */}
        <footer className="border-t border-[#1e305e] bg-[#070d1e]/95 py-2 px-4 text-[10px] font-mono text-[#94a3b8] flex flex-col sm:flex-row items-center justify-between gap-2 z-20 transition-colors">
          <div className="flex flex-wrap items-center space-x-3">
            <span className="text-[#f87171] font-bold">TOP SECRET // MHA RESTRICTED</span>
            <span className="text-[#334155]">•</span>
            <span className="text-[#ff9933]">OPERATION TRIDENT // SPECIAL CELL</span>
            <span className="text-[#334155]">•</span>
            <span className="text-[#22c55e]">SECTION 65B BSA 2023 VERIFIED</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-[#22c55e]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span>DRISTI INTEL MESH ONLINE</span>
            </span>
            <span className="text-[#334155]">•</span>
            <span className="text-[#f8fafc] font-semibold">
              {currentUser ? `${currentUser.badgeId} (${currentUser.name.split(',')[0].toUpperCase()})` : 'SP V. MALHOTRA (CYBER-DL)'}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
