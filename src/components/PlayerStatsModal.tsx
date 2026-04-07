'use client';

import React, { useEffect, useState } from 'react';
import { PlayerProjection } from '@/types/dfs';

interface PlayerStatsModalProps {
  player: PlayerProjection | null;
  onClose: () => void;
}

const formatValue = (val: number, statType: string) => {
  const isFantasy = statType.toLowerCase().includes('fantasy') || statType.toLowerCase().includes('score');
  if (isFantasy) return val.toFixed(2);
  return val.toFixed(1);
};

export default function PlayerStatsModal({ player, onClose }: PlayerStatsModalProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!player) return;
    setStats([]);
    setLoading(true);

    async function fetchStats() {
      if (!player) return;
      try {
        const res = await fetch(`/api/stats?name=${encodeURIComponent(player.name)}&sport=${player.sport}`);
        const data = await res.json();
        
        const statType = player.lines[0]?.type.toLowerCase() || '';
        const sport = player.sport;

        const mappedStats = (data.stats || []).map((s: any) => {
          let val = 0;
          if (sport === 'NBA') {
            val = statType.includes('points') ? s.pts_nba : 
                  statType.includes('rebounds') ? s.reb : 
                  statType.includes('assists') ? s.ast : 
                  statType.includes('pra') ? (s.pts_nba + s.reb + s.ast) : s.pts_nba;
          } else if (sport === 'MLB') {
            val = statType.includes('strikeouts') ? s.strikeouts : 
                  statType.includes('bases') ? s.totalBases : 
                  statType.includes('hits') ? s.hits : 
                  statType.includes('runs') ? s.runs : s.pts;
          } else if (sport === 'NFL') {
            val = statType.includes('passing') ? s.passingYards : 
                  statType.includes('receiving') ? s.receivingYards : 
                  statType.includes('rushing') ? s.rushingYards : s.pts;
          } else {
            val = s.goals || s.pts || 0;
          }
          return { date: s.date, value: val, opponent: s.opponent };
        });
        
        // Show chronological order in the graph (oldest to newest)
        setStats(mappedStats.reverse());
      } catch (e) {
        console.error('Failed to load stats:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [player]);

  if (!player) return null;

  const currentStatType = player.lines?.[0]?.type || 'Stat';
  const currentLine = player.lines?.[0]?.value || 0;
  
  const avgNum = stats.length > 0 ? stats.reduce((a, b) => a + b.value, 0) / stats.length : 0;
  const avgDisplay = formatValue(avgNum, currentStatType);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-[#F7F7F2] w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#3b59df] p-10 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="flex gap-8 items-center relative z-10">
            <div className="w-24 h-24 rounded-[32px] bg-white/20 overflow-hidden border-4 border-white/30 shadow-2xl">
              {player.imageUrl ? (
                <img src={player.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-3xl bg-[#3b59df]">{player.name[0]}</div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{player.name}</h2>
              <p className="text-white/60 text-xs font-black mt-3 uppercase tracking-[0.3em]">{player.team} vs {player.opponent} • {player.sport}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/10 hover:bg-white/20 rounded-[24px] transition-all border border-white/10"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="p-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-72 gap-6">
              <div className="w-12 h-12 border-8 border-indigo-50 border-t-[#3b59df] rounded-full animate-spin"></div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Official Game Logs...</span>
            </div>
          ) : stats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 text-center bg-white rounded-[40px] border-4 border-dashed border-gray-100">
              <span className="text-5xl mb-4 text-gray-200">📊</span>
              <p className="text-gray-900 font-black uppercase text-sm">Historical Data Syncing</p>
              <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest">Verifying latest results from league sources</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Line</span>
                  <div className="text-4xl font-black text-gray-900 mt-1">{formatValue(currentLine, currentStatType)} <span className="text-sm text-[#3b59df] font-bold uppercase">{currentStatType}</span></div>
                </div>
                <div className="bg-indigo-50 p-6 rounded-[32px] border-2 border-indigo-100">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">L5 Average</span>
                  <div className="text-4xl font-black text-[#3b59df] mt-1">{avgDisplay}</div>
                </div>
              </div>

              {/* BAR GRAPH VISUALIZATION */}
              <div className="relative h-64 bg-white rounded-[40px] p-10 flex items-end justify-between gap-4 border-2 border-gray-100 shadow-inner">
                {/* Horizontal L5 Average Line */}
                <div 
                  className="absolute left-6 right-6 border-t-4 border-dashed border-indigo-200/60 z-20 pointer-events-none transition-all duration-1000"
                  style={{ bottom: `${(avgNum / Math.max(...stats.map(s => s.value), currentLine, 1)) * 100}%` }}
                >
                  <span className="absolute -top-6 right-0 text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-white px-2">L5 Avg: {avgDisplay}</span>
                </div>
                
                {stats.map((game, i) => {
                  const isOver = game.value > currentLine;
                  const isPush = game.value === currentLine;
                  const maxVal = Math.max(...stats.map(s => s.value), currentLine, 1);
                  const h = (game.value / maxVal) * 100;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end z-10">
                      <div className="relative w-full flex flex-col justify-end items-center h-full">
                        <div className="absolute -top-10 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl z-30 whitespace-nowrap">
                          {game.value} vs {game.opponent}
                        </div>
                        <div 
                          className={`w-full rounded-2xl transition-all duration-1000 ease-out shadow-lg
                            ${isOver ? 'bg-emerald-500 shadow-emerald-100' : 
                              isPush ? 'bg-gray-400' : 
                              'bg-rose-500 shadow-rose-100'}`}
                          style={{ height: `${Math.max(h, 8)}%`, minWidth: '35px' }}
                        ></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter truncate max-w-[50px]">{game.opponent}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{game.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={onClose} className="w-full mt-10 py-6 bg-gray-900 text-white font-black rounded-[32px] shadow-2xl hover:bg-black transition-all active:scale-95 uppercase tracking-[0.3em] text-xs">
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
