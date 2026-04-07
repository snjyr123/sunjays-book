import { DfsData, PlayerProjection } from '@/types/dfs';

// Reliable CORS Proxies
const PROXY_URLS = [
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`
];

const normalizeName = (name: string) => {
  if (!name) return '';
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300._\-\/]/g, "")
    .replace(/\./g, '').replace(/ jr$/g, '').replace(/ sr$/g, '')
    .trim().replace(/\s+/g, '');
};

const formatValue = (val: any, statType: string) => {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  return statType.toLowerCase().includes('fantasy') ? Number(num.toFixed(2)) : Number(num.toFixed(1));
};

// Fallback data if the API is blocked - expanded to 20+ players
const getFallbackProjections = (): PlayerProjection[] => {
  const players = [
    { name: 'LeBron James', team: 'LAL', sport: 'NBA', stat: 'Points', val: 24.5, img: 'https://static.prizepicks.com/images/players/nba/lebron_james.png' },
    { name: 'Luka Doncic', team: 'DAL', sport: 'NBA', stat: 'Pts+Rebs+Asts', val: 52.5, img: 'https://static.prizepicks.com/images/players/nba/luka_doncic.png' },
    { name: 'Shohei Ohtani', team: 'LAD', sport: 'MLB', stat: 'Total Bases', val: 1.5, img: 'https://static.prizepicks.com/images/players/mlb/shohei_ohtani.png' },
    { name: 'Lionel Messi', team: 'MIA', sport: 'Soccer', stat: 'Shots', val: 3.5, img: 'https://static.prizepicks.com/images/players/soccer/lionel_messi.png' },
    { name: 'Connor McDavid', team: 'EDM', sport: 'NHL', stat: 'Points', val: 1.5, img: 'https://static.prizepicks.com/images/players/nhl/connor_mcdavid.png' },
    { name: 'Stephen Curry', team: 'GSW', sport: 'NBA', stat: '3-PT Made', val: 4.5, img: 'https://static.prizepicks.com/images/players/nba/stephen_curry.png' },
    { name: 'Kevin Durant', team: 'PHX', sport: 'NBA', stat: 'Rebounds', val: 6.5, img: 'https://static.prizepicks.com/images/players/nba/kevin_durant.png' },
    { name: 'Aaron Judge', team: 'NYY', sport: 'MLB', stat: 'Hits+Runs+RBIs', val: 2.5, img: 'https://static.prizepicks.com/images/players/mlb/aaron_judge.png' },
    { name: 'Patrick Mahomes', team: 'KC', sport: 'NFL', stat: 'Passing Yards', val: 285.5, img: 'https://static.prizepicks.com/images/players/nfl/patrick_mahomes.png' },
    { name: 'Giannis Antetokounmpo', team: 'MIL', sport: 'NBA', stat: 'Points', val: 28.5, img: 'https://static.prizepicks.com/images/players/nba/giannis_antetokounmpo.png' },
    { name: 'Jayson Tatum', team: 'BOS', sport: 'NBA', stat: 'Pts+Rebs+Asts', val: 42.5, img: 'https://static.prizepicks.com/images/players/nba/jayson_tatum.png' },
    { name: 'Mookie Betts', team: 'LAD', sport: 'MLB', stat: 'Hits+Runs+RBIs', val: 2.5, img: 'https://static.prizepicks.com/images/players/mlb/mookie_betts.png' },
    { name: 'Auston Matthews', team: 'TOR', sport: 'NHL', stat: 'Shots on Goal', val: 4.5, img: 'https://static.prizepicks.com/images/players/nhl/auston_matthews.png' },
    { name: 'Nikola Jokic', team: 'DEN', sport: 'NBA', stat: 'Rebounds', val: 12.5, img: 'https://static.prizepicks.com/images/players/nba/nikola_jokic.png' },
    { name: 'Anthony Edwards', team: 'MIN', sport: 'NBA', stat: 'Points', val: 26.5, img: 'https://static.prizepicks.com/images/players/nba/anthony_edwards.png' },
    { name: 'Erling Haaland', team: 'MCI', sport: 'Soccer', stat: 'Goals', val: 0.5, img: 'https://static.prizepicks.com/images/players/soccer/erling_haaland.png' },
    { name: 'Justin Jefferson', team: 'MIN', sport: 'NFL', stat: 'Receiving Yards', val: 95.5, img: 'https://static.prizepicks.com/images/players/nfl/justin_jefferson.png' },
    { name: 'Shai Gilgeous-Alexander', team: 'OKC', sport: 'NBA', stat: 'Assists', val: 6.5, img: 'https://static.prizepicks.com/images/players/nba/shai_gilgeous-alexander.png' },
    { name: 'Juan Soto', team: 'NYY', sport: 'MLB', stat: 'Hits+Runs+RBIs', val: 1.5, img: 'https://static.prizepicks.com/images/players/mlb/juan_soto.png' },
    { name: 'Joel Embiid', team: 'PHI', sport: 'NBA', stat: 'Points+Rebounds', val: 40.5, img: 'https://static.prizepicks.com/images/players/nba/joel_embiid.png' }
  ];

  return players.map((p, i) => {
    const l5Var = (Math.random() * 4 - 2);
    return {
      id: `fallback-${i}`,
      name: p.name,
      imageUrl: p.img,
      team: p.team,
      opponent: 'Opponent',
      matchup: `${p.team} vs Opponent`,
      sport: p.sport,
      lines: [{ platform: 'Prizepicks' as any, value: p.val, type: p.stat }],
      l5Avg: formatValue(p.val + l5Var, p.stat),
      diff: formatValue(l5Var, p.stat),
      aiScore: 70 + Math.floor(Math.random() * 25),
      odds: '-119'
    };
  });
};

export const fetchDfsData = async (proxyIdx = 0): Promise<DfsData> => {
  try {
    if (proxyIdx >= PROXY_URLS.length) {
      console.warn('All proxies failed or returned no data, using fallback data');
      return { projections: getFallbackProjections(), teamMarkets: [], lastUpdated: new Date().toISOString() };
    }

    const apiUrl = 'https://api.prizepicks.com/projections?per_page=1000&single_stat=true';
    const proxyUrl = PROXY_URLS[proxyIdx](apiUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(proxyUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Status ${response.status}`);

    const data = await response.json();
    let ppJson: any = data;
    
    // AllOrigins returns stringified body in .contents
    if (data.contents && typeof data.contents === 'string') {
      try {
        ppJson = JSON.parse(data.contents);
      } catch (e) {
        throw new Error('Failed to parse proxy response');
      }
    }

    if (!ppJson || !ppJson.data || !Array.isArray(ppJson.data)) {
      throw new Error('Invalid PrizePicks data format');
    }

    const included = ppJson.included || [];
    const leagues = included.filter((i: any) => i.type === 'league').reduce((acc: any, l: any) => {
      acc[l.id] = l.attributes.name;
      return acc;
    }, {});

    const playersMap = included.filter((i: any) => i.type === 'new_player' || i.type === 'player').reduce((acc: any, p: any) => {
      acc[p.id] = p.attributes;
      return acc;
    }, {});

    const projections = ppJson.data.map((proj: any): PlayerProjection | null => {
      const pRel = proj.relationships?.new_player?.data || proj.relationships?.player?.data;
      if (!pRel) return null;
      
      const player = playersMap[pRel.id];
      if (!player) return null;

      const leagueId = proj.relationships?.league?.data?.id;
      const rawSport = leagues[leagueId] || 'Other';
      
      // Clean Sport Name
      let sport = rawSport;
      if (sport.includes('MLB')) sport = 'MLB';
      else if (sport.includes('NBA')) sport = 'NBA';
      else if (sport.includes('NFL')) sport = 'NFL';
      else if (sport.includes('NHL')) sport = 'NHL';
      else if (sport.includes('Soccer') || sport.includes('UEFA')) sport = 'Soccer';

      const statType = proj.attributes.stat_type;
      const lineValue = parseFloat(proj.attributes.line_score);
      const imageUrl = player.image_url || player.combo_image_url || '';

      // Randomly simulate L5 and AI Score for flavor since we don't have secondary API
      const l5Avg = lineValue + (Math.random() * 2 - 1);
      const diff = l5Avg - lineValue;
      const aiScore = 50 + (Math.floor(Math.random() * 40) - 10);

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
        diff: formatValue(diff, statType),
        aiScore: Math.min(Math.max(aiScore, 1), 99),
        odds: '-119'
      };
    }).filter((p: any) => p !== null);

    if (projections.length === 0) throw new Error('Empty projections list');

    return { projections, teamMarkets: [], lastUpdated: new Date().toISOString() };
  } catch (e) {
    console.error(`Proxy ${proxyIdx} failed:`, e);
    // Recursive call to next proxy
    return fetchDfsData(proxyIdx + 1);
  }
};

export const getDfsData = async (): Promise<DfsData> => fetchDfsData();
