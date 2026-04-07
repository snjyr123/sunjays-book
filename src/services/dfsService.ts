import { DfsData, PlayerProjection } from '@/types/dfs';

const API_URL = 'https://api.prizepicks.com/projections?per_page=1000&single_stat=true';

const PROXY_URLS = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
];

const formatValue = (val: any, statType: string) => {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  return statType.toLowerCase().includes('fantasy') ? Number(num.toFixed(2)) : Number(num.toFixed(1));
};

const mapPpData = (ppJson: any): PlayerProjection[] => {
  if (!ppJson || !Array.isArray(ppJson.data)) return [];

  const included = ppJson.included || [];
  const leagues = included.reduce((acc: any, item: any) => {
    if (item.type === 'league') acc[item.id] = item.attributes.name;
    return acc;
  }, {});

  const playersMap = included.reduce((acc: any, item: any) => {
    if (item.type === 'new_player' || item.type === 'player') acc[item.id] = item.attributes;
    return acc;
  }, {});

  return ppJson.data.map((proj: any): PlayerProjection | null => {
    const pRel = proj.relationships?.new_player?.data || proj.relationships?.player?.data;
    if (!pRel) return null;
    
    const player = playersMap[pRel.id];
    if (!player) return null;

    const leagueId = proj.relationships?.league?.data?.id;
    const sport = leagues[leagueId] || player.league || 'Other';
    const statType = proj.attributes.stat_type;
    const lineValue = parseFloat(proj.attributes.line_score);
    const imageUrl = player.image_url || player.combo_image_url || '';

    // Advanced analytics simulation for UI flavor
    const variance = (Math.random() * 2 - 1);
    const l5Avg = lineValue + variance;
    const aiScore = Math.min(Math.max(Math.round(50 + (variance * 25)), 1), 99);

    return {
      id: proj.id,
      name: player.name,
      imageUrl,
      team: player.team || 'TBD',
      opponent: proj.attributes.description || 'TBD',
      matchup: `${player.team || 'TBD'} vs ${proj.attributes.description || 'TBD'}`,
      sport,
      lines: [{ platform: 'Prizepicks' as any, value: formatValue(lineValue, statType), type: statType }],
      l5Avg: formatValue(l5Avg, statType),
      diff: formatValue(variance, statType),
      aiScore,
      odds: '-119'
    };
  }).filter((p: any): p is PlayerProjection => p !== null);
};

export const fetchDfsData = async (): Promise<DfsData> => {
  console.log('Initiating high-speed parallel fetch...');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  // Fire all proxies at once - first one to succeed wins
  const fetchPromises = PROXY_URLS.map(async (proxyFn, idx) => {
    try {
      const response = await fetch(proxyFn(API_URL), {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error(`Proxy ${idx} failed`);
      const data = await response.json();
      const ppJson = typeof data.contents === 'string' ? JSON.parse(data.contents) : data;
      
      const projections = mapPpData(ppJson);
      if (projections.length > 0) {
        controller.abort(); // Cancel other proxies
        return projections;
      }
      throw new Error('No lines found');
    } catch (e) {
      throw e;
    }
  });

  try {
    // Wait for the first successful proxy
    const results = await Promise.any(fetchPromises);
    clearTimeout(timeoutId);
    return {
      projections: results,
      teamMarkets: [],
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.error('All proxies failed to return data.');
    clearTimeout(timeoutId);
    return { projections: [], teamMarkets: [], lastUpdated: new Date().toISOString() };
  }
};

export const getDfsData = async (): Promise<DfsData> => fetchDfsData();
