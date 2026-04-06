'use client';

import React, { useState, useMemo } from 'react';
import { PlayerProjection, Platform } from '@/types/dfs';

interface ParlayBuilderProps {
  projections: PlayerProjection[];
  platforms: Platform[];
}

type Strategy = 'aiScore' | 'l5Avg' | 'diff';

export default function ParlayBuilder({ projections, platforms }: ParlayBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>('Mixed');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Prizepicks');
  const [strategy, setStrategy] = useState<Strategy>('aiScore');
  const [selectedMatchup, setSelectedMatchup] = useState<string>('All Games');
  const [legs, setLegs] = useState<number>(2);
  const [generatedParlay, setGeneratedParlay] = useState<any[]>([]);

  const sports = useMemo(() => {
    const s = new Set(projections.map(p => p.sport));
    return ['Mixed', ...Array.from(s).sort()];
  }, [projections]);

  const matchups = useMemo(() => {
    const pool = selectedSport === 'Mixed' ? projections : projections.filter(p => p.sport === selectedSport);
    // Use the new matchup field for grouping
    const m = new Set(pool.map(p => (p as any).matchup).filter(Boolean));
    return ['All Games', ...Array.from(m).sort()];
  }, [projections, selectedSport]);

  const generateParlay = () => {
    let pool = projections.filter(p => {
      const sportMatch = selectedSport === 'Mixed' || p.sport === selectedSport;
      const platformMatch = p.lines.some(l => l.platform === selectedPlatform);
      const matchupMatch = selectedMatchup === 'All Games' || (p as any).matchup === selectedMatchup;
      return sportMatch && platformMatch && matchupMatch;
    });

    const sortedPool = pool.sort((a, b) => {
      if (strategy === 'aiScore') return (b.aiScore || 0) - (a.aiScore || 0);
      if (strategy === 'diff') return Math.abs(b.diff || 0) - Math.abs(a.diff || 0);
      if (strategy === 'l5Avg') return (b.l5Avg || 0) - (a.l5Avg || 0);
      return 0;
    });

    const uniquePicks: any[] = [];
    const seenPlayers = new Set();

    for (const pick of sortedPool) {
      if (uniquePicks.length >= legs) break;
      if (!seenPlayers.has(pick.name)) {
        seenPlayers.add(pick.name);
        uniquePicks.push(pick);
      }
    }

    const mappedPicks = uniquePicks.map(p => {
      const line = p.lines.find((l: any) => l.platform === selectedPlatform);
      if (!line) return null;
      const recommendation = (p.diff || 0) > 0 ? 'OVER' : 'UNDER';
      return { ...p, recommendation, platformValue: line.value, statType: line.type };
    }).filter(Boolean);

    setGeneratedParlay(mappedPicks);
  };

  const dropdownBaseClass = "w-full bg-indigo-700/50 border-2 border-indigo-400/30 rounded-2xl px-4 py-3 font-bold text-white outline-none focus:border-white/50 transition-all appearance-none cursor-pointer hover:bg-indigo-700 hover:border-indigo-400/50 text-xs shadow-inner";

  return (
    <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-200 border border-indigo-500/30">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">AI Slip <span className="text-indigo-200">Optimizer</span></h2>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-0.5">High Probability Engine</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-black transition-all text-xs uppercase tracking-widest border border-white/5 shadow-xl">
          {isOpen ? 'Close Builder' : 'Open Optimizer'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Sport Select */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 ml-1">1. Market</label>
              <div className="relative group">
                <select value={selectedSport} onChange={(e) => { setSelectedSport(e.target.value); setSelectedMatchup('All Games'); }} className={dropdownBaseClass}>
                  {sports.map(s => <option key={s} value={s} className="bg-indigo-900 text-white font-bold">{s}</option>)}
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none text-indigo-300 group-hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            </div>

            {/* Matchup Select */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 ml-1">2. Matchup</label>
              <div className="relative group">
                <select disabled={selectedSport === 'Mixed'} value={selectedMatchup} onChange={(e) => setSelectedMatchup(e.target.value)} className={`${dropdownBaseClass} ${selectedSport === 'Mixed' ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}>
                  {matchups.map(m => <option key={m} value={m} className="bg-indigo-900 text-white font-bold">{m}</option>)}
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none text-indigo-300 group-hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            </div>

            {/* Strategy Select */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 ml-1">3. Strategy</label>
              <div className="relative group">
                <select value={strategy} onChange={(e) => setStrategy(e.target.value as Strategy)} className={dropdownBaseClass}>
                  <option value="aiScore" className="bg-indigo-900 text-white font-bold">AI Confidence</option>
                  <option value="diff" className="bg-indigo-900 text-white font-bold">High Differential</option>
                  <option value="l5Avg" className="bg-indigo-900 text-white font-bold">L5 Trend</option>
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none text-indigo-300 group-hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            </div>

            {/* Platform Select */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 ml-1">4. App</label>
              <div className="relative group">
                <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value as Platform)} className={dropdownBaseClass}>
                  {platforms.map(p => <option key={p} value={p} className="bg-indigo-900 text-white font-bold">{p}</option>)}
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none text-indigo-300 group-hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            </div>

            {/* Legs Select */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 ml-1">5. Legs</label>
              <div className="flex gap-1.5 p-1.5 bg-indigo-700/50 rounded-2xl border-2 border-indigo-400/30 shadow-inner">
                {[2, 3, 4, 5, 6].map(n => (
                  <button key={n} onClick={() => setLegs(n)} className={`flex-1 py-2 rounded-xl font-black transition-all text-xs ${legs === n ? 'bg-white text-indigo-600 shadow-lg' : 'text-indigo-200 hover:bg-indigo-500/50'}`}>{n}</button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={generateParlay} className="w-full py-5 bg-white text-indigo-600 font-black rounded-3xl shadow-2xl hover:scale-[1.01] hover:shadow-white/10 transition-all active:scale-95 uppercase tracking-[0.2em] text-sm">
            Generate Optimized Slip
          </button>

          {generatedParlay.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-indigo-400/30">
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Recommended Selection</h3>
                <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-1 rounded-lg shadow-lg uppercase tracking-widest">EV+ Optimized</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedParlay.map((pick, i) => (
                  <div key={i} className="bg-indigo-800/40 border border-indigo-400/20 p-5 rounded-[32px] flex items-center gap-5 group hover:bg-indigo-800 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                      {pick.imageUrl ? <img src={pick.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-sm uppercase">{pick.name[0]}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm truncate uppercase leading-tight text-white">{pick.name}</div>
                      <div className="text-[9px] font-bold text-indigo-300 mt-1 uppercase tracking-tight truncate">{pick.statType} • {pick.team} vs {pick.opponent}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-lg inline-block border-2 border-white/10 ${pick.recommendation === 'OVER' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {pick.recommendation} {pick.platformValue}
                      </div>
                      <div className="text-[9px] font-black text-emerald-400 mt-2 uppercase tracking-tighter">AI: {pick.aiScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
