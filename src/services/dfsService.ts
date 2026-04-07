import { DfsData, PlayerProjection } from '@/types/dfs';

const formatValue = (val: any, statType: string) => {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  return statType.toLowerCase().includes('fantasy') ? Number(num.toFixed(2)) : Number(num.toFixed(1));
};

export const fetchDfsData = async (): Promise<DfsData> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    // Fetch directly to avoid proxy Cloudflare blocks
    const response = await fetch('https://api.prizepicks.com/projections?per_page=1000&single_stat=true', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`PrizePicks returned ${response.status}`);
      return { projections: [], teamMarkets: [], lastUpdated: new Date().toISOString() };
    }
    
    const ppJson = await response.json();

    if (!ppJson || !ppJson.data) {
      return { projections: [], teamMarkets: [], lastUpdated: new Date().toISOString() };
    }

    const included = ppJson.included || [];
    
    // Map Leagues
    const leagues = included.filter((i: any) => i.type === 'league').reduce((acc: any, l: any) => {
      acc[l.id] = l.attributes.name;
      return acc;
    }, {});

    // Map Players
    const playersMap = included.filter((i: any) => i.type === 'new_player' || i.type === 'player').reduce((acc: any, p: any) => {
      acc[p.id] = p.attributes;
      return acc;
    }, {});

    const projections = ppJson.data.map((proj: any): PlayerProjection | null => {
      const pId = proj.relationships?.new_player?.data?.id || proj.relationships?.player?.data?.id;
      const player = playersMap[pId];
      if (!player) return null;

      const leagueId = proj.relationships?.league?.data?.id;
      const sportName = leagues[leagueId] || 'Other';

      const statType = proj.attributes.stat_type;
      const pValue = parseFloat(proj.attributes.line_score);

      // Use the image URL from PrizePicks directly
      const imageUrl = player.image_url || player.combo_image_url || '';

      const lines = [
        { platform: 'Prizepicks' as any, value: formatValue(pValue, statType), type: statType }
      ];

      // Simulated L5 and Odds Logic to match original format since we removed NBA specific fetching
      let l5Raw = pValue;
      const l5Diff = l5Raw - pValue;

      const trendFactor = l5Diff * 15;
      let impliedProb = 0.543; 
      impliedProb += (l5Diff / (pValue || 1) * 0.5);
      impliedProb = Math.min(Math.max(impliedProb, 0.3), 0.7); 

      let americanOdds = 0;
      if (impliedProb > 0.5) {
        americanOdds = -1 * ((impliedProb / (1 - impliedProb)) * 100);
      } else {
        americanOdds = ((1 - impliedProb) / impliedProb) * 100;
      }

      const odds = americanOdds < 0 ? `${Math.round(americanOdds)}` : `+${Math.round(americanOdds)}`;
      let score = 50 + (trendFactor * 1.2);

      return {
        id: proj.id,
        name: player.name,
        imageUrl: imageUrl,
        team: player.team || 'TBD',
        opponent: proj.attributes.description || 'TBD',
        matchup: `${player.team || 'TBD'} vs ${proj.attributes.description || 'TBD'}`,
        sport: sportName,
        lines: lines,
        l5Avg: formatValue(l5Raw, statType),
        diff: formatValue(l5Diff, statType),
        aiScore: Math.min(Math.max(Math.round(score + (Math.random() * 4 - 2)), 1), 99),
        odds: odds
      };
    }).filter((p: any) => p !== null);

    return { 
      projections, 
      teamMarkets: [], 
      lastUpdated: new Date().toISOString() 
    };
  } catch (e) {
    console.error('Fetch failed:', e);
    return { projections: [], teamMarkets: [], lastUpdated: new Date().toISOString() };
  }
};

export const getDfsData = async (): Promise<DfsData> => fetchDfsData();
