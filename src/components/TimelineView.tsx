import React, { useState, useEffect } from 'react';
import { TimelineEvent, IngestFileItem } from '../types';
import { TIMELINE_EVENTS } from '../data/mockData';
import { filterTimelineEventsByFile } from '../utils/fileFocus';
import { DOSSIER_TARGETS, getTargetById, findTargetByQuery } from '../data/dossierTargets';

export interface TimelineViewProps {
  focusedFile?: IngestFileItem | null;
  onClearFileFocus?: () => void;
  onNavigateToDossier?: (targetId?: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  focusedFile = null,
  onClearFileFocus,
  onNavigateToDossier
}) => {
  const scopedEvents = filterTimelineEventsByFile(TIMELINE_EVENTS, focusedFile);
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedTargetFilter, setSelectedTargetFilter] = useState<string>('ALL');
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [modalImage, setModalImage] = useState<{ url: string; title: string; location: string } | null>(null);

  const getTargetForEvent = (evt: TimelineEvent) => {
    if (evt.targetId) {
      const found = getTargetById(evt.targetId);
      if (found) return found;
    }
    return findTargetByQuery(evt.target) || null;
  };

  useEffect(() => {
    setActiveEventIndex(0);
    setIsPlaying(false);
  }, [focusedFile?.id]);

  // Playback timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveEventIndex(prev => {
          if (prev >= scopedEvents.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2400 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, scopedEvents.length]);

  const filteredEvents = scopedEvents.filter(e => {
    const channelMatch = selectedChannel === 'ALL' || e.channel === selectedChannel;
    if (!channelMatch) return false;
    if (selectedTargetFilter === 'ALL') return true;
    const mapped = getTargetForEvent(e);
    return mapped?.id === selectedTargetFilter;
  });

  // Simulated 24-hour surge buckets in IST
  const hourlySurge = [
    { hour: '00', count: 2 }, { hour: '02', count: 1 }, { hour: '04', count: 0 },
    { hour: '06', count: 3 }, { hour: '08', count: 7 }, { hour: '10', count: 9 },
    { hour: '12', count: 14 }, { hour: '14', count: 22 }, { hour: '16', count: 31 },
    { hour: '18', count: 38 }, { hour: '20', count: 19 }, { hour: '22', count: 6 }
  ];

  const getChannelBadge = (ch: TimelineEvent['channel']) => {
    switch (ch) {
      case 'ATM': return { label: 'ATM / CASH', color: '#fbbf24', icon: 'local_atm' };
      case 'CELL_TOWER': return { label: 'TELCO CDR', color: '#ff9933', icon: 'cell_tower' };
      case 'VOIP': return { label: 'SIGNAL / WIRETAP', color: '#38bdf8', icon: 'call' };
      case 'CCTV': return { label: 'CCTV OPTICAL', color: '#f87171', icon: 'videocam' };
      case 'FLIGHT': return { label: 'AIRLINE PNR', color: '#34d399', icon: 'flight' };
      case 'FASTAG': return { label: 'FASTAG TOLL', color: '#a78bfa', icon: 'toll' };
      default: return { label: 'SENSOR', color: '#ff9933', icon: 'sensors' };
    }
  };

  const avgConfidence = scopedEvents.length > 0
    ? Math.round(scopedEvents.reduce((acc, e) => acc + e.confidence, 0) / scopedEvents.length)
    : 0;

  return (
    <div className="space-y-5">
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
                Displaying only {scopedEvents.length} events correlated with this ingested package.
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

      {/* 1. Unified Clean Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ff9933] uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">timeline</span>
            <span>ACTIVITY TIMELINE // MULTI-SENSOR PLAYBACK</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] font-['Space_Grotesk',sans-serif] tracking-wide">
            Activity Timeline &amp; Geolocation Playback
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5 max-w-2xl">
            Synchronized event stream fusing Indian Telco CDR towers, FASTag toll crossings, UPI transactions, wiretaps, and CCTV optical logs.
          </p>
        </div>

        {/* Playback Simulator Controls */}
        <div className="flex items-center space-x-1.5 p-1.5 bg-[#070d1e] rounded-lg border border-[#ff9933]/40 font-mono text-xs shadow-sm shrink-0">
          <button
            onClick={() => setActiveEventIndex(prev => Math.max(0, prev - 1))}
            className="p-1.5 rounded hover:bg-[#14234b] text-[#94a3b8] hover:text-[#f8fafc] transition-colors cursor-pointer"
            title="Step backward"
          >
            <span className="material-symbols-outlined text-base">skip_previous</span>
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded bg-[#ff9933] text-[#070d1e] font-bold hover:bg-[#ffb366] transition-all flex items-center space-x-1 cursor-pointer text-xs"
          >
            <span className="material-symbols-outlined text-sm">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
          <button
            onClick={() => setActiveEventIndex(prev => Math.min(scopedEvents.length - 1, prev + 1))}
            className="p-1.5 rounded hover:bg-[#14234b] text-[#94a3b8] hover:text-[#f8fafc] transition-colors cursor-pointer"
            title="Step forward"
          >
            <span className="material-symbols-outlined text-base">skip_next</span>
          </button>

          <span className="text-[#334155] mx-1">|</span>

          {/* Speed Toggle */}
          {[1, 2, 5].map(spd => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                playbackSpeed === spd
                  ? 'bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933]/50 font-bold'
                  : 'text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* 2. Standardized Single-Row Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Logged Events</span>
            <span className="material-symbols-outlined text-base text-[#ff9933]">event_note</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#f8fafc]">{scopedEvents.length} Events</div>
          </div>
          <div className="text-[10px] text-[#94a3b8]">
            IST Chronology
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Active Playhead</span>
            <span className="material-symbols-outlined text-base text-[#4edea3]">play_circle</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#4edea3]">
              #{scopedEvents.length > 0 ? activeEventIndex + 1 : 0} <span className="text-xs font-normal text-[#94a3b8]">/ {scopedEvents.length}</span>
            </div>
          </div>
          <div className="text-[10px] text-[#22c55e]">
            {scopedEvents[activeEventIndex]?.timeDisplay || '00:00 IST'}
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Peak Activity</span>
            <span className="material-symbols-outlined text-base text-[#ef4444]">local_fire_department</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#ef4444]">16:00 - 18:30</div>
          </div>
          <div className="text-[10px] text-[#ffb366]">
            38 Events Clustered
          </div>
        </div>

        <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] uppercase">
            <span>Corroboration</span>
            <span className="material-symbols-outlined text-base text-[#38bdf8]">verified</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#38bdf8]">{avgConfidence}%</div>
          </div>
          <div className="text-[10px] text-[#22c55e] flex items-center space-x-1">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            <span>Sensor Corroborated</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Telemetry Surge Heatmap */}
      <div className="bg-[#0e1938] border border-[#1e305e] rounded-xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-[#ff9933]">
            <span className="material-symbols-outlined text-sm">query_stats</span>
            <span className="uppercase font-bold text-[11px]">24-Hour Telemetry Surge Heatmap</span>
          </div>
          <span className="text-[11px] text-[#94a3b8]">Active: Event {scopedEvents.length > 0 ? activeEventIndex + 1 : 0} of {scopedEvents.length}</span>
        </div>

        <div className="grid grid-cols-12 gap-1.5 pt-1">
          {hourlySurge.map(bucket => {
            const intensity = Math.min(100, (bucket.count / 40) * 100);
            return (
              <div key={bucket.hour} className="text-center group">
                <div className="h-10 bg-[#070d1e] rounded flex flex-col justify-end p-0.5 relative overflow-hidden border border-[#1e305e]">
                  <div
                    style={{ height: `${intensity}%` }}
                    className={`w-full rounded-xs transition-all duration-300 ${
                      intensity > 60
                        ? 'bg-[#ef4444]'
                        : intensity > 30
                        ? 'bg-[#ff9933]'
                        : 'bg-[#38bdf8]'
                    }`}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-[#f8fafc] opacity-0 group-hover:opacity-100 bg-black/80 font-bold">
                    {bucket.count}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#94a3b8] block mt-0.5">{bucket.hour}h</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Channel Filters & Syndicate Target Filter */}
      <div className="space-y-2 border-b border-[#1e305e] pb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase mr-1">CHANNELS:</span>
            {(['ALL', 'CCTV', 'FLIGHT', 'VOIP', 'CELL_TOWER', 'ATM'] as const).map(ch => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedChannel === ch
                    ? 'bg-[#ff9933]/20 text-[#ff9933] border border-[#ff9933] font-semibold'
                    : 'bg-[#0e1938] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e305e]'
                }`}
              >
                {ch.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-[#94a3b8]">
            Showing <span className="text-[#ff9933] font-bold">{filteredEvents.length}</span> / {scopedEvents.length} telemetry events
          </div>
        </div>

        {/* Syndicate Targets Quick Filter & Auto-Navigate */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pt-1">
          <span className="text-[10px] font-mono text-[#94a3b8] uppercase mr-1 flex items-center space-x-1">
            <span className="material-symbols-outlined text-xs text-[#ff9933]">manage_accounts</span>
            <span>TARGET FILTER:</span>
          </span>
          <button
            onClick={() => setSelectedTargetFilter('ALL')}
            className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap border ${
              selectedTargetFilter === 'ALL'
                ? 'bg-[#ff9933]/20 text-[#ff9933] border-[#ff9933] font-bold'
                : 'bg-[#070d1e] text-[#94a3b8] border-[#1e305e] hover:text-[#f8fafc]'
            }`}
          >
            ALL TARGETS
          </button>
          {DOSSIER_TARGETS.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTargetFilter(t.id)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap border flex items-center space-x-1 ${
                selectedTargetFilter === t.id
                  ? 'bg-[#ff9933] text-[#070d1e] border-[#ff9933] font-bold'
                  : 'bg-[#070d1e] text-[#cbd5e1] hover:text-[#ff9933] border-[#1e305e] hover:border-[#ff9933]/50'
              }`}
            >
              <span>{t.name.split(' ')[0]}</span>
              <span className="opacity-80">({t.threatScore})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Event Stream with Synchronized Playhead */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#1e305e]">
        {filteredEvents.map((evt, idx) => {
          const isCurrentActive = idx === activeEventIndex;
          const badge = getChannelBadge(evt.channel);
          const mappedTarget = getTargetForEvent(evt);

          return (
            <div
              key={evt.id}
              onClick={() => setActiveEventIndex(idx)}
              className="relative flex items-start space-x-3 pl-10 transition-all cursor-pointer group"
            >
              {/* Timeline Marker Pin */}
              <div
                className={`absolute left-3.5 top-3.5 w-3.5 h-3.5 rounded-full border-2 transform -translate-x-1/2 transition-all ${
                  isCurrentActive
                    ? 'bg-[#ff9933] border-white ring-4 ring-[#ff9933]/40 scale-125'
                    : 'bg-[#0e1938] border-[#1e305e] group-hover:border-[#ff9933]'
                }`}
              ></div>

              {/* Event Card */}
              <div
                className={`w-full bg-[#0e1938] border rounded-xl p-4 shadow-sm transition-all ${
                  isCurrentActive
                    ? 'border-[#ff9933] shadow-[0_0_15px_rgba(255,153,51,0.2)] bg-[#0e1938]'
                    : 'border-[#1e305e] hover:border-[#ff9933]/50 opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#1e305e] pb-2.5">
                  <div className="flex items-center space-x-2 font-mono">
                    <span
                      style={{ color: badge.color, borderColor: `${badge.color}40`, backgroundColor: `${badge.color}20` }}
                      className="text-[10px] px-2 py-0.5 rounded border font-bold uppercase flex items-center space-x-1"
                    >
                      <span className="material-symbols-outlined text-xs">{badge.icon}</span>
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-xs text-[#f8fafc] font-bold">{evt.timeDisplay}</span>
                    <span className="text-[10px] text-[#94a3b8]">({evt.id})</span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#94a3b8]">
                    <span>CONFIDENCE:</span>
                    <span className="text-[#22c55e] font-bold">{evt.confidence}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-2.5">
                  <div className={evt.imageUrl ? 'lg:col-span-8' : 'lg:col-span-12'}>
                    <h4 className="text-sm sm:text-base font-bold text-[#f8fafc] font-['Space_Grotesk',sans-serif]">{evt.title}</h4>
                    <p className="text-xs text-[#cbd5e1] mt-1 leading-relaxed font-sans">{evt.details}</p>

                    <div className="flex flex-wrap items-center gap-2.5 mt-2.5 font-mono text-[11px] text-[#94a3b8]">
                      <span className="flex items-center space-x-1.5 text-[#ffb366]">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span>{evt.location} ({evt.coordinates})</span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.location + ' ' + evt.coordinates)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-[#38bdf8]/15 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-[#070d1e] border border-[#38bdf8]/40 transition-colors inline-flex items-center space-x-0.5"
                          title="Open in Google Maps"
                        >
                          <span>MAPS</span>
                          <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                        </a>
                      </span>
                      <span>•</span>
                      {mappedTarget ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToDossier?.(mappedTarget.id);
                          }}
                          className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#ff9933]/20 hover:bg-[#ff9933] text-[#ff9933] hover:text-[#070d1e] border border-[#ff9933]/50 transition-all font-bold cursor-pointer"
                          title={`Auto-navigate to ${mappedTarget.name} Dossier`}
                        >
                          <span className="material-symbols-outlined text-xs">assignment_ind</span>
                          <span>Target: {mappedTarget.name}</span>
                          <span className="text-[9px] px-1 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 font-mono">
                            {mappedTarget.threatScore}
                          </span>
                          <span className="text-[9px] font-sans font-normal underline">➔ OPEN DOSSIER</span>
                        </button>
                      ) : (
                        <span className="text-[#38bdf8]">Target: {evt.target}</span>
                      )}
                    </div>
                  </div>

                  {evt.imageUrl && (
                    <div className="lg:col-span-4">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImage({ url: evt.imageUrl!, title: evt.title, location: evt.location });
                        }}
                        className="relative rounded-lg overflow-hidden border border-[#ff9933]/50 aspect-video group cursor-zoom-in bg-black"
                      >
                        <img
                          src={evt.imageUrl}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                          <span className="text-[9px] font-mono text-[#ff9933] bg-black/80 px-2 py-0.5 rounded border border-[#ff9933]/50 font-bold">
                            ENLARGE RECON
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#0e1938] border border-[#ff9933]/60 rounded-2xl max-w-3xl w-full p-5 shadow-2xl relative font-mono">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xs font-bold text-[#ff9933] uppercase tracking-wider mb-1">
              SURVEILLANCE OPTICAL RECON STILL // SECTION 65B BSA COMPLIANT
            </h3>
            <div className="text-xs text-[#94a3b8] mb-3">{modalImage.title} • {modalImage.location}</div>
            <div className="rounded-lg overflow-hidden border border-[#1e305e] max-h-[70vh] bg-black">
              <img src={modalImage.url} alt={modalImage.title} className="w-full h-auto object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="mt-3 flex justify-between items-center text-[10px] text-[#94a3b8]">
              <span className="text-[#22c55e]">AUTHENTICATED CCTNS / AIRPORT OPTICAL RECORD // HASH VERIFIED</span>
              <button
                onClick={() => setModalImage(null)}
                className="px-3 py-1 bg-[#14234b] text-[#f8fafc] rounded-md hover:bg-[#1a2e63] cursor-pointer"
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
