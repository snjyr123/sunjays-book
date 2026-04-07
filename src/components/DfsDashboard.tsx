'use client';

import React, { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { PlayerProjection, Platform, TeamMarket } from '@/types/dfs';
import { getDfsData } from '@/services/dfsService';
import ParlayBuilder from './ParlayBuilder';
import PlayerStatsModal from './PlayerStatsModal';

const PLATFORMS: Platform[] = ['Prizepicks'];

type MarketType = 'Players' | 'Teams';
type TabType = 'All' | 'NBA' | 'MLB' | 'NFL' | 'Soccer' | 'Tennis' | 'Golf' | 'NCAAB' | 'Value' | string;
type TeamTabType = 'NBA' | 'MLB' | 'NFL' | 'Soccer' | 'CBB';

const SPORT_ICONS: Record<string, string> = {
  All: '📊', NBA: '🏀', MLB: '⚾', NFL: '🏈', Soccer: '⚽', Tennis: '🎾', NCAAB: '🏫', CBB: '🏫', Golf: '⛳', Value: '🔥'
};

const FUNNY_PHRASES = [
  "Bribing the referees...",
  "Consulting the sports almanac from 2015...",
  "Applying hair gel to the players...",
  "Over-inflating the footballs...",
  "Checking LeBron's age again...",
  "Polishing the golf clubs...",
  "Recalculating Shohei's massive contract...",
  "Telling the AI to be less stupid...",
  "Finding the 'Sweet Spot' (it was behind the sofa)...",
  "Checking if the MLB balls are still juiced...",
  "Analyzing water breaks in Soccer...",
  "Syncing with the matrix...",
];

const getConfidenceColor = (score: number) => {
  if (score >= 90) return 'text-[#064e3b]';
  if (score >= 80) return 'text-[#059669]';
  if (score >= 70) return 'text-[#10b981]';
  if (score >= 60) return 'text-[#84cc16]';
  if (score >= 50) return 'text-[#eab308]';
  if (score >= 40) return 'text-[#f59e0b]';
  if (score >= 30) return 'text-[#f97316]';
  if (score >= 20) return 'text-[#ef4444]';
  if (score >= 10) return 'text-[#dc2626]';
  return 'text-[#7f1d1d]';
};

const ConfidenceCircle = memo(({ score }: { score: number }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  const colorClass = getConfidenceColor(score);

  return (
    <div className="inline-flex items-center justify-center relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-100" />
        <circle
          cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-in-out ${colorClass}`}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center font-black text-xs ${colorClass}`}>{score}%</span>
    </div>
  );
});
ConfidenceCircle.displayName = 'ConfidenceCircle';

const PlayerRow = memo(({ player, onClick }: { player: any, onClick: () => void }) => {
  const isFantasy = player?.lines?.[0]?.type?.toLowerCase().includes('fantasy') || false;
  const diff = player?.diff || 0;
  
  if (!player) return null;
  
  return (
    <tr onClick={onClick} className="hover:bg-indigo-50/10 transition-all group cursor-pointer border-b border-gray-50 last:border-0">
      <td className="px-10 py-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[20px] bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
            {player.imageUrl ? <img src={player.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-lg bg-gray-50 uppercase text-gray-300">{player.name ? player.name[0] : '?'}</div>}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-gray-900 leading-tight text-lg group-hover:text-indigo-600 transition-colors">{player.name || 'Unknown Player'}</span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase border border-indigo-100">{player.lines?.[0]?.type || 'Stat'}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">{player.team || 'TBD'} vs {player.opponent || 'TBD'} • {player.sport || 'Other'}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-6 text-center"><span className="font-mono font-black text-sm text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl">{player.odds || '-110'}</span></td>
      <td className="px-4 py-6 text-center"><span className="text-base font-black text-gray-900">{player.l5Avg !== null && player.l5Avg !== undefined ? player.l5Avg.toFixed(isFantasy ? 2 : 1) : '-'}</span></td>
      <td className="px-4 py-6 text-center"><span className={`text-base font-black ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-rose-600' : 'text-gray-400'}`}>{diff > 0 ? `+${diff.toFixed(isFantasy ? 2 : 1)}` : diff.toFixed(isFantasy ? 2 : 1)}</span></td>
      <td className="px-4 py-6 text-center"><ConfidenceCircle score={player.aiScore || 50} /></td>
      {PLATFORMS.map(platform => {
        const line = player.lines?.find((l: any) => l.platform === platform);
        return (
          <td key={platform} className="px-4 py-6 text-center">
            <div className="inline-flex flex-col items-center justify-center min-w-[85px] p-3 rounded-2xl border-2 border-transparent bg-white shadow-md font-black text-base text-gray-900 group-hover:shadow-indigo-100 group-hover:border-indigo-50 transition-all">
              {line ? line.value.toFixed(isFantasy ? 2 : 1) : '-'}
            </div>
          </td>
        );
      })}
    </tr>
  );
});
PlayerRow.displayName = 'PlayerRow';

export default function DfsDashboard() {
  const [marketType, setMarketType] = useState<MarketType>('Players');
  const [projections, setProjections] = useState<PlayerProjection[]>([]);
  const [teamMarkets, setTeamMarkets] = useState<TeamMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [activeTeamTab, setActiveTeamTab] = useState<TeamTabType>('NBA');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [sortBy, setSortBy] = useState<'aiScore' | 'name' | 'diff'>('aiScore');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProjection | null>(null);
  const [displayCount, setDisplayCount] = useState(50);
  const [loadingPhrase, setLoadingPhrase] = useState(FUNNY_PHRASES[0]);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else {
      setLoading(true);
      setLoadingPhrase(FUNNY_PHRASES[Math.floor(Math.random() * FUNNY_PHRASES.length)]);
    }
    try {
      const data = await getDfsData();
      if (!data || !Array.isArray(data.projections)) {
        throw new Error('Invalid data format');
      }
      setProjections(data.projections);
      setTeamMarkets(data.teamMarkets || []);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
    } catch (error) {
      console.error('Failed to fetch DFS data:', error);
      // Data service should handle fallbacks, but we add an extra layer here
      setProjections([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setDisplayCount(50);
  };

  const sports = useMemo(() => {
    const s = new Set(projections.map(p => p.sport));
    const priorityOrder = ['NBA', 'MLB', 'NFL', 'Soccer', 'Tennis', 'Golf', 'NCAAB'];
    const foundPriority = priorityOrder.filter(p => s.has(p));
    const others = Array.from(s).filter(p => !priorityOrder.includes(p)).sort();
    return ['All', ...foundPriority, ...others, 'Value'] as TabType[];
  }, [projections]);

  const allFiltered = useMemo(() => {
    if (!Array.isArray(projections)) return [];
    
    return projections
      .filter(p => {
        if (!p || !p.name) return false;
        const name = (p.name || '').toLowerCase();
        const team = (p.team || '').toLowerCase();
        const search = (searchTerm || '').toLowerCase();
        
        const matchesSearch = name.includes(search) || team.includes(search);
        if (activeTab === 'Value') return matchesSearch && (p.aiScore || 0) > 75;
        if (activeTab === 'All') return matchesSearch;
        return matchesSearch && p.sport === activeTab;
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        if (sortBy === 'aiScore') return (b.aiScore || 0) - (a.aiScore || 0);
        if (sortBy === 'diff') return Math.abs(b.diff || 0) - Math.abs(a.diff || 0);
        return (a.name || '').localeCompare(b.name || '');
      });
  }, [projections, searchTerm, activeTab, sortBy]);

  const displayedProjections = useMemo(() => allFiltered.slice(0, displayCount), [allFiltered, displayCount]);

  const filteredTeamMarkets = useMemo(() => {
    if (!Array.isArray(teamMarkets)) return [];
    return teamMarkets.filter(m => m && m.sport === activeTeamTab);
  }, [teamMarkets, activeTeamTab]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 text-center">
        <div className="w-16 h-16 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin shadow-lg"></div>
        <p className="mt-8 text-gray-900 font-black uppercase tracking-[0.2em] text-sm">{loadingPhrase}</p>
        <div className="mt-12 p-8 bg-gray-900 rounded-[32px] border border-gray-800 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-700">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System taking too long?</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            Emergency App Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <ParlayBuilder projections={projections} platforms={PLATFORMS} />
      {selectedPlayer && <PlayerStatsModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}

      <div className="flex bg-gray-100 p-1.5 rounded-[28px] w-fit mx-auto shadow-inner border border-gray-200">
        {(['Players', 'Teams'] as MarketType[]).map(type => (
          <button key={type} onClick={() => setMarketType(type)} className={`px-10 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${marketType === type ? 'bg-white text-indigo-600 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}>{type}</button>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-xl shadow-indigo-100/20 border border-gray-100 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Sunjay's <span className="text-indigo-600">Book</span></h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Live Sync: {new Date(lastUpdated).toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex flex-1 max-w-2xl gap-3">
          <input type="text" placeholder={`Search ${marketType}...`} className="w-full pl-6 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-gray-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={() => fetchData(true)} className="p-4 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><svg className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
        {marketType === 'Players' ? (
          <>
            <div className="flex overflow-x-auto scrollbar-hide px-4 pt-4 border-b border-gray-50">
              {sports.map(tab => (
                <button key={tab} onClick={() => handleTabChange(tab)} className={`flex items-center gap-2 px-6 py-5 text-sm font-black transition-all border-b-4 whitespace-nowrap ${activeTab === tab ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <span className="text-xl">{SPORT_ICONS[tab] || '🏅'}</span>{tab}
                </button>
              ))}
            </div>
            <div className="px-10 py-4 bg-gray-50/50 flex items-center justify-between border-b border-gray-100 text-gray-400">
              <span className="text-[10px] font-black uppercase tracking-widest">{allFiltered.length} Verified Lines</span>
              <div className="flex gap-6">
                <button onClick={() => setSortBy('aiScore')} className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'aiScore' ? 'text-indigo-600' : 'text-gray-400'}`}>Sort by AI</button>
                <button onClick={() => setSortBy('diff')} className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'diff' ? 'text-indigo-600' : 'text-gray-400'}`}>Sort by Diff</button>
                <button onClick={() => setSortBy('name')} className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'name' ? 'text-indigo-600' : 'text-gray-400'}`}>Sort by Name</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest"><th className="px-10 py-6">Athlete / Matchup</th><th className="px-4 py-6 text-center">Market Odds</th><th className="px-4 py-6 text-center">L5 Avg</th><th className="px-4 py-6 text-center">Diff</th><th className="px-4 py-6 text-center">AI Confidence</th>{PLATFORMS.map(platform => <th key={platform} className="px-4 py-6 text-center">{platform}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayedProjections.map((player) => (
                    <PlayerRow key={player.id} player={player} onClick={() => setSelectedPlayer(player as any)} />
                  ))}
                </tbody>
              </table>
              {allFiltered.length > displayCount && (
                <div className="p-10 text-center bg-gray-50/30 border-t border-gray-100">
                  <button onClick={() => setDisplayCount(prev => prev + 50)} className="px-12 py-4 bg-white border-2 border-indigo-100 hover:border-indigo-600 rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100/20 transition-all active:scale-95 text-indigo-600">
                    Load More Markets ({allFiltered.length - displayCount} Remaining)
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex overflow-x-auto scrollbar-hide px-4 pt-4 border-b border-gray-50">
              {(['NBA', 'MLB', 'NFL', 'Soccer', 'CBB'] as TeamTabType[]).map(tab => (
                <button key={tab} onClick={() => setActiveTeamTab(tab)} className={`flex items-center gap-2 px-8 py-5 text-sm font-black transition-all border-b-4 whitespace-nowrap ${activeTeamTab === tab ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <span className="text-xl">{SPORT_ICONS[tab] || ''}</span>{tab}
                </button>
              ))}
            </div>
            <div className="p-10">
              {filteredTeamMarkets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTeamMarkets.map(market => (
                    <div key={market.id} className="bg-gray-50 rounded-[40px] p-8 border-2 border-transparent hover:border-indigo-100 transition-all group shadow-sm">
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{market.status || new Date(market.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <div className="flex items-center gap-2"><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live ML</span><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span></div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-5 rounded-[24px] shadow-sm border border-gray-50 group-hover:border-indigo-50 transition-all">
                          <div className="flex flex-col">
                            <span className="font-black text-gray-900 text-xl uppercase tracking-tighter">{market.awayTeam}</span>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Odds: {market.awayMoneyline}</span>
                          </div>
                          <span className="font-black text-3xl text-gray-900">{market.awayScore || '0'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-5 rounded-[24px] shadow-sm border border-gray-50 group-hover:border-indigo-50 transition-all">
                          <div className="flex flex-col">
                            <span className="font-black text-gray-900 text-xl uppercase tracking-tighter">{market.homeTeam}</span>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Odds: {market.homeMoneyline}</span>
                          </div>
                          <span className="font-black text-3xl text-gray-900">{market.homeScore || '0'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center"><span className="text-6xl mb-6 grayscale">🏟️</span><p className="text-gray-400 font-black uppercase text-xs tracking-[0.3em]">No active {activeTeamTab} moneylines found</p></div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
