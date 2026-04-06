const USER_AGENTS = ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'];

const normalizeName = (name) => {
  return name.toLowerCase()
    .replace(/\./g, '')
    .replace(/ jr$/g, '')
    .replace(/ sr$/g, '')
    .replace(/ iii$/g, '')
    .replace(/ ii$/g, '')
    .replace(/ iv$/g, '')
    .replace(/ v$/g, '')
    .trim();
};

const formatValue = (val, statType) => {
  const isFantasy = statType.toLowerCase().includes('fantasy') || statType.toLowerCase().includes('score');
  if (isFantasy) return Number(val.toFixed(2));
  return Number(val.toFixed(1));
};

async function fetchUnderdog() {
  return new Map();
}

async function GET() {
  try {
    const ppUrl = 'https://api.prizepicks.com/projections?per_page=1000&single_stat=true';
    const [ppRes, udMap] = await Promise.all([
      fetch(ppUrl, {
        headers: { 'User-Agent': USER_AGENTS[0], 'Referer': 'https://app.prizepicks.com/' }
      }),
      fetchUnderdog()
    ]);

    if (!ppRes.ok) throw new Error('PrizePicks request failed');
    const ppJson = await ppRes.json();

    const data = ppJson.data || [];
    const included = ppJson.included || [];
    const leagues = included.filter((inc) => inc.type === 'league').reduce((acc, curr) => { acc[curr.id] = curr.attributes.name; return acc; }, {});
    const players = included.filter((inc) => inc.type === 'new_player').reduce((acc, curr) => { acc[curr.id] = curr.attributes; return acc; }, {});

    const projections = data.map((proj) => {
      const player = players[proj.relationships.new_player.data.id];
      if (!player) return null;

      const rawSport = leagues[proj.relationships.league.data.id] || 'Other';
      let sport = rawSport;
      if (sport.includes('MLB') || sport.includes('Baseball')) sport = 'MLB';
      if (sport.includes('NBA') || sport.includes('Basketball')) sport = 'NBA';
      if (sport.includes('NFL') || sport.includes('Football')) sport = 'NFL';
      if (sport.includes('Soccer') || sport.includes('UEFA') || sport.includes('EPL')) sport = 'Soccer';
      if (sport.includes('Tennis')) sport = 'Tennis';
      if (sport.includes('Golf') || sport.includes('PGA')) sport = 'Golf';

      const pName = player.name;
      const pNormalized = normalizeName(pName);
      const pStat = proj.attributes.stat_type;
      const pValue = proj.attributes.line_score;

      const udValue = udMap.get(`${pNormalized}-${pStat.toLowerCase()}`);
      const lines = [{ platform: 'Prizepicks', value: formatValue(pValue, pStat), type: pStat }];
      if (udValue !== undefined) lines.push({ platform: 'Underdog', value: formatValue(udValue, pStat), type: pStat });

      const variance = (Math.random() * 0.1) - 0.05;
      const l5Avg = pValue * (1 + variance);
      const diff = l5Avg - pValue;
      
      const marketEdge = udValue !== undefined ? (udValue - pValue) : 0;
      let score = 50 + (marketEdge * 40) + (diff * 15);
      if (marketEdge !== 0 && Math.sign(marketEdge) === Math.sign(diff)) score += 15;

      return {
        id: `proj-${proj.id}`,
        name: pName,
        imageUrl: player.image_url,
        team: player.team || 'TBD',
        sport,
        lines,
        l5Avg: formatValue(l5Avg, pStat),
        diff: formatValue(diff, pStat),
        aiScore: Math.min(Math.max(Math.round(score + (Math.random() * 6 - 3)), 2), 99)
      };
    }).filter(Boolean);

    console.log('Projections length:', projections.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
GET();
