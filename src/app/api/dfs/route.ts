import { NextResponse } from 'next/server';

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

const NBA_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.nba.com/',
  'Origin': 'https://www.nba.com',
  'Accept': 'application/json, text/plain, */*',
};

const ACTIVE_NBA_SEASON = '2025-26';

const normalizeName = (name: string) => {
  if (!name) return '';
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300._\-\/]/g, "")
    .replace(/\./g, '')
    .replace(/ jr$/g, '')
    .replace(/ sr$/g, '')
    .replace(/ iii$/g, '')
    .replace(/ ii$/g, '')
    .replace(/ iv$/g, '')
    .replace(/ v$/g, '')
    .trim()
    .replace(/\s+/g, '');
};

const formatValue = (val: number, statType: string) => {
  const isFantasy = statType.toLowerCase().includes('fantasy') || statType.toLowerCase().includes('score');
  if (isFantasy) return Number(val.toFixed(2));
  return Number(val.toFixed(1));
};

async function fetchNbaBatchL5() {
  try {
    const url = `https://stats.nba.com/stats/leaguedashplayerstats?Season=${ACTIVE_NBA_SEASON}&SeasonType=Regular+Season&LastNGames=5&MeasureType=Base&PerMode=PerGame&LeagueID=00`;
    const res = await fetch(url, { headers: NBA_HEADERS, next: { revalidate: 3600 } } as any);
    if (!res.ok) return new Map();
    const json = await res.json();
    const rows = json.resultSets?.[0]?.rowSet || [];
    const h = json.resultSets?.[0]?.headers || [];
    const avgMap = new Map();
    rows.forEach((row: any) => {
      const name = normalizeName(`${row[h.indexOf('PLAYER_NAME')]}`);
      avgMap.set(name, {
        points: row[h.indexOf('PTS')],
        rebounds: row[h.indexOf('REB')],
        assists: row[h.indexOf('AST')],
        pra: row[h.indexOf('PTS')] + row[h.indexOf('REB')] + row[h.indexOf('AST')],
      });
    });
    return avgMap;
  } catch (e) { return new Map(); }
}

async function fetchUnderdog() {
  try {
    const url = 'https://api.underdogfantasy.com/view_api/v2/projections';
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENTS[0], 'Referer': 'https://underdogfantasy.com/' },
      next: { revalidate: 60 }
    } as any);
    if (!res.ok) return new Map();
    const json = await res.json();
    const playersMap = new Map();
    (json.players || []).forEach((p: any) => playersMap.set(p.id, p));
    const udMap = new Map();
    (json.projections || []).forEach((proj: any) => {
      const player = playersMap.get(proj.player_id);
      if (player) {
        const key = `${normalizeName(`${player.first_name} ${player.last_name}`)}-${proj.stat_display_name.toLowerCase()}`;
        udMap.set(key, parseFloat(proj.stat_value));
      }
    });
    return udMap;
  } catch (e) { return new Map(); }
}

export async function GET() {
  try {
    const [ppRes, udMap, nbaStatsMap] = await Promise.all([
      fetch('https://api.prizepicks.com/projections?per_page=1000&single_stat=true', {
        headers: { 'User-Agent': USER_AGENTS[0] },
        next: { revalidate: 60 }
      } as any),
      fetchUnderdog(),
      fetchNbaBatchL5()
    ]);

    if (!ppRes.ok) throw new Error('PrizePicks request failed');
    const ppJson = await ppRes.json();

    const data = ppJson.data || [];
    const included = ppJson.included || [];
    const leagues = included.filter((inc: any) => inc.type === 'league').reduce((acc: any, curr: any) => { acc[curr.id] = curr.attributes.name; return acc; }, {});
    const players = included.filter((inc: any) => inc.type === 'new_player').reduce((acc: any, curr: any) => { acc[curr.id] = curr.attributes; return acc; }, {});

    const projections = data.map((proj: any) => {
      const playerRel = proj.relationships?.new_player?.data;
      if (!playerRel) return null;
      
      const player = players[playerRel.id];
      if (!player) return null;

      const leagueId = proj.relationships?.league?.data?.id;
      const rawSport = leagues[leagueId] || 'Other';
      
      let sport = rawSport;
      if (sport.includes('MLB') || sport.includes('Baseball')) sport = 'MLB';
      else if (sport.includes('NBA') || sport.includes('Basketball')) sport = 'NBA';
      else if (sport.includes('NFL') || sport.includes('Football')) sport = 'NFL';
      else if (sport.includes('Soccer') || sport.includes('UEFA')) sport = 'Soccer';

      const pName = player.name;
      const pNormalized = normalizeName(pName);
      const pStat = proj.attributes.stat_type;
      const pValue = proj.attributes.line_score;

      const udValue = udMap.get(`${pNormalized}-${pStat.toLowerCase()}`);
      const lines = [{ platform: 'Prizepicks', value: formatValue(pValue, pStat), type: pStat }];
      if (udValue !== undefined) lines.push({ platform: 'Underdog', value: formatValue(udValue, pStat), type: pStat });

      // GET REAL L5 AVG
      let l5Raw = 0;
      let hasReal = false;
      
      if (sport === 'NBA') {
        const nbaStats = nbaStatsMap.get(pNormalized);
        if (nbaStats) {
          const sType = pStat.toLowerCase();
          if (sType.includes('points')) { l5Raw = nbaStats.points; hasReal = true; }
          else if (sType.includes('rebounds')) { l5Raw = nbaStats.rebounds; hasReal = true; }
          else if (sType.includes('assists')) { l5Raw = nbaStats.assists; hasReal = true; }
          else if (sType.includes('pra')) { l5Raw = nbaStats.pra; hasReal = true; }
        }
      }

      // If no real data, fallback but without random variance for consistency
      if (!hasReal) {
        l5Raw = pValue; // Default to line value if unknown
      }

      const l5Diff = l5Raw - pValue;
      const marketDiff = udValue !== undefined ? (udValue - pValue) : 0;
      
      const marketFactor = udValue !== undefined ? (udValue - pValue) * 50 : 0;
      const trendFactor = l5Diff * 15;
      
      let impliedProb = 0.543; 
      impliedProb += (marketDiff * 0.1); 
      impliedProb += (l5Diff / (pValue || 1) * 0.5);
      impliedProb = Math.min(Math.max(impliedProb, 0.3), 0.7); 
      
      let americanOdds = 0;
      if (impliedProb > 0.5) {
        americanOdds = -1 * ((impliedProb / (1 - impliedProb)) * 100);
      } else {
        americanOdds = ((1 - impliedProb) / impliedProb) * 100;
      }
      
      const odds = americanOdds < 0 ? `${Math.round(americanOdds)}` : `+${Math.round(americanOdds)}`;

      let score = 50 + (marketFactor * 0.8) + (trendFactor * 1.2);
      if (marketDiff !== 0 && Math.sign(marketDiff) === Math.sign(l5Diff)) score += 10;

      return {
        id: `proj-${proj.id}`,
        name: pName,
        imageUrl: player.image_url,
        team: player.team || 'TBD',
        opponent: proj.attributes.description || 'TBD',
        matchup: `${player.team || 'TBD'} vs ${proj.attributes.description || 'TBD'}`,
        sport,
        lines,
        l5Avg: formatValue(l5Raw, pStat),
        diff: formatValue(l5Diff, pStat),
        aiScore: Math.min(Math.max(Math.round(score + (Math.random() * 4 - 2)), 1), 99),
        odds
      };
    }).filter(Boolean);

    const response = NextResponse.json({ 
      projections, 
      teamMarkets: [], 
      lastUpdated: new Date().toISOString() 
    });

    // ADD THESE HEADERS FOR IOS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: any) {
    return NextResponse.json({ projections: [], teamMarkets: [], error: error.message }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
